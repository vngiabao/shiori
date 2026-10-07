"""Source corrections must not silently certify unlearned or invalid readings."""
import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("advanced_ledger", Path(__file__).with_name("build-advanced-vocabulary-ledger.py"))
ledger = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ledger)


class SourceCorrections(unittest.TestCase):
    def setUp(self):
        self.row = {"expression": "唯", "reading": "たった"}
        self.decision = {"original": self.row.copy(), "selected": {"text": "たった", "kana": "たった"}, "reason": "Wrong raw written form; teach the dictionary-matched kana expression."}
        self.words = [{"id": "only", "text": "たった", "kana": "たった"}]

    def test_valid_corrected_pair_links_the_actual_course_word(self):
        self.assertEqual(ledger.corrected_ids(self.row, self.decision, self.words, {"たった": ["たった"]}), ["only"])

    def test_changed_raw_source_cannot_reuse_an_old_decision(self):
        with self.assertRaisesRegex(AssertionError, "Stale source"):
            ledger.corrected_ids({"expression": "唯", "reading": "ただ"}, self.decision, self.words, {"たった": ["たった"]})

    def test_correct_spelling_with_unsupported_reading_is_rejected(self):
        with self.assertRaisesRegex(AssertionError, "Unsupported corrected reading"):
            ledger.corrected_ids(self.row, self.decision, self.words, {"たった": ["ただ"]})

    def test_dictionary_match_alone_cannot_claim_course_coverage(self):
        with self.assertRaisesRegex(AssertionError, "has not been taught"):
            ledger.corrected_ids(self.row, self.decision, [], {"たった": ["たった"]})


if __name__ == "__main__":
    unittest.main()
