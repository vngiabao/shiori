"""A documented tail does not relax size or source-row checks for other decks."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('deck_builder', Path(__file__).with_name('build-vocabulary-deck.py'))
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class DeckBatchTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.root = Path(folder.name)
        self.draft = self.root / 'draft.txt'
        self.policy = self.root / 'tail-batches.json'

    def rows(self, count):
        self.draft.write_text('\n'.join(f'{i}|{{本|ほん}}|hon|book|{{本|ほん}}です。|It is a book.' for i in range(count)), encoding='utf-8')

    def read(self, deck='n5-vocab-05'):
        return builder.read_authored_rows(self.draft, deck, self.policy)

    def test_ordinary_deck_still_requires_one_hundred_rows(self):
        self.rows(100)
        rows, tail = self.read()
        self.assertEqual(len(rows), 100)
        self.assertIsNone(tail)
        self.rows(55)
        with self.assertRaisesRegex(AssertionError, '100 authored rows'):
            self.read()

    def test_tail_is_exact_and_only_applies_to_named_deck(self):
        self.policy.write_text(json.dumps({'n5-vocab-05': {'count': 55, 'reason': 'Remaining reviewed rows'}}), encoding='utf-8')
        self.rows(55)
        rows, tail = self.read()
        self.assertEqual(len(rows), 55)
        self.assertTrue(tail['reason'])
        self.assertEqual(rows[0][1], '{本|ほん}')
        with self.assertRaisesRegex(AssertionError, '100 authored rows'):
            self.read('n4-vocab-05')
        self.rows(54)
        with self.assertRaisesRegex(AssertionError, '55 authored rows'):
            self.read()

    def test_tail_cannot_allow_zero_boolean_or_oversized_count(self):
        for count in (0, True, 101):
            with self.subTest(count=count):
                self.policy.write_text(json.dumps({'n5-vocab-05': {'count': count, 'reason': 'Tail'}}), encoding='utf-8')
                self.rows(1)
                with self.assertRaisesRegex(AssertionError, 'Invalid deck size policy'):
                    self.read()

    def test_tail_needs_reason_and_unique_rows(self):
        self.rows(2)
        self.policy.write_text(json.dumps({'n5-vocab-05': {'count': 2}}), encoding='utf-8')
        with self.assertRaisesRegex(AssertionError, 'editorial reason'):
            self.read()
        self.policy.write_text(json.dumps({'n5-vocab-05': {'count': 2, 'reason': 'Tail'}}), encoding='utf-8')
        self.draft.write_text(self.draft.read_text(encoding='utf-8').replace('1|', '0|'), encoding='utf-8')
        with self.assertRaisesRegex(AssertionError, 'Duplicate source row'):
            self.read()

    def test_source_correction_requires_exact_original_and_selected_pair(self):
        original = {'expression': '運動', 'reading': 'うんどうする'}
        correction = {'original': original, 'selected': {'text': '運動', 'kana': 'うんどう'},
                      'reason': 'Reviewed source noun is paired with a suru verb reading; teach the dictionary-checked noun.'}
        with self.assertRaisesRegex(AssertionError, 'Source reading differs'):
            builder.verify_source_pair(original, '運動', 'うんどう')
        builder.verify_source_pair(original, '運動', 'うんどう', correction)
        with self.assertRaisesRegex(AssertionError, 'does not approve this pair'):
            builder.verify_source_pair(original, '運動', 'うんてん', correction)
        with self.assertRaisesRegex(AssertionError, 'stale'):
            builder.verify_source_pair({'expression':'運動','reading':'changed'}, '運動', 'うんどう', correction)

    def test_alias_review_requires_selected_reading_and_exact_candidate_ids(self):
        decision = {'selected':{'text':'空','kana':'そら'}, 'courseAliases':['empty'],
                    'reason':'Teach the sky sense with its distinct reading, rather than the earlier empty-container meaning.'}
        self.assertIsNone(builder.verify_course_aliases('空','そら',[],[]))
        self.assertEqual(builder.verify_course_aliases('空','そら',['empty'],[decision]),decision)
        with self.assertRaisesRegex(AssertionError, 'review explicitly'):
            builder.verify_course_aliases('空','そら',['empty'],[])
        with self.assertRaisesRegex(AssertionError, 'review explicitly'):
            builder.verify_course_aliases('空','から',['empty'],[decision])
        with self.assertRaisesRegex(AssertionError, 'stale'):
            builder.verify_course_aliases('空','そら',['empty','new-alias'],[decision])

    def test_combined_source_row_only_approves_its_reviewed_split_pairs(self):
        original = {'expression':'回る、回す','reading':'まわる、まわす'}
        correction = {'original':original,
                      'selections':[{'text':'回る','kana':'まわる'},{'text':'回す','kana':'まわす'}],
                      'reason':'Split the combined row into separately checked intransitive and transitive forms.'}
        builder.verify_source_pair(original,'回る','まわる',correction)
        builder.verify_source_pair(original,'回す','まわす',correction)
        with self.assertRaisesRegex(AssertionError,'does not approve this pair'):
            builder.verify_source_pair(original,'回る','まわす',correction)


if __name__ == '__main__':
    unittest.main()
