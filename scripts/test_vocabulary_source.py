import unittest
from audit_vocabulary_source import alternatives, audit_row, is_pattern


class VocabularySourceTests(unittest.TestCase):
    def test_alternatives_preserve_written_forms_without_duplicate_blanks(self):
        self.assertEqual(alternatives('足; 脚; 足; '), ['足', '脚'])

    def test_restricted_reading_rejects_a_reading_from_another_spelling(self):
        row = {'expression':'今日; 今朝', 'reading':'けさ'}
        result = audit_row(row, {'今日':['きょう'], '今朝':['けさ']}, {'今日':['1'], '今朝':['2']}, [])
        self.assertEqual(result['dictionaryPairs'], [{'text':'今朝', 'kana':'けさ'}])
        self.assertEqual(result['dictionaryEntryIds'], ['2'])

    def test_alias_is_a_candidate_and_not_exact_taught_coverage(self):
        row = {'expression':'会う', 'reading':'あう'}
        result = audit_row(row, {'会う':['あう']}, {'会う':['1'], 'あう':['1']}, [{'id':'meet','text':'あう','kana':'あう'}])
        self.assertEqual(result['exactCourseForms'], [])
        self.assertEqual(result['courseAliasCandidates'], ['meet'])

    def test_pattern_never_becomes_a_matched_ordinary_word(self):
        self.assertTrue(is_pattern('～円'))
        result = audit_row({'expression':'～円','reading':'～えん'}, {}, {}, [])
        self.assertEqual(result['status'], 'pattern')

    def test_editorial_suru_annotation_is_not_a_false_pronunciation_error(self):
        result = audit_row({'expression':'結婚','reading':'けっこん (する)'}, {'結婚':['けっこん']}, {'結婚':['1']}, [])
        self.assertEqual(result['status'], 'matched')
        self.assertEqual(result['reading'], 'けっこん (する)')
        self.assertEqual(result['normalizedReadings'], ['けっこん'])

    def test_suru_suffix_requires_form_review_and_is_not_silently_matched(self):
        result = audit_row({'expression':'運動','reading':'うんどうする'}, {'運動':['うんどう']}, {'運動':['1']}, [])
        self.assertEqual(result['status'], 'suru-form-review')
        self.assertEqual(result['dictionaryPairs'], [])

    def test_swapped_and_missing_reading_cells_are_flagged(self):
        self.assertEqual(audit_row({'expression':'いただく','reading':'頂く'}, {}, {}, [])['status'], 'non-kana-reading')
        self.assertEqual(audit_row({'expression':'ごらんになる','reading':''}, {}, {}, [])['status'], 'missing-reading')


if __name__ == '__main__':
    unittest.main()
