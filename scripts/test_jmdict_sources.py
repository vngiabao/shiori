import io
import unittest
from jmdict_sources import extract, classify, reading_key

class DictionaryExtractionTests(unittest.TestCase):
    def parse(self, entries, wanted):
        return extract(io.BytesIO(('<JMdict>'+entries+'</JMdict>').encode()), set(wanted))[0]

    def test_spelling_restrictions_do_not_leak(self):
        data = self.parse('''<entry><ent_seq>1</ent_seq>
          <k_ele><keb>甲</keb></k_ele><k_ele><keb>乙</keb></k_ele>
          <r_ele><reb>こう</reb><re_restr>甲</re_restr></r_ele>
          <r_ele><reb>おつ</reb><re_restr>乙</re_restr></r_ele>
          </entry>''', ['甲','乙','こう'])
        self.assertEqual(data, {'甲':['こう'], '乙':['おつ'], 'こう':['こう']})

    def test_no_kanji_reading_is_not_attached_to_kanji(self):
        data = self.parse('''<entry><ent_seq>2</ent_seq><k_ele><keb>甲</keb></k_ele>
          <r_ele><reb>かな</reb><re_nokanji/></r_ele></entry>''', ['甲','かな'])
        self.assertEqual(data, {'かな':['かな']})

    def test_homographs_union_valid_readings_only(self):
        data = self.parse('''<entry><ent_seq>3</ent_seq><k_ele><keb>今日</keb></k_ele>
          <r_ele><reb>きょう</reb></r_ele></entry>
          <entry><ent_seq>4</ent_seq><k_ele><keb>今日</keb></k_ele>
          <r_ele><reb>こんにち</reb></r_ele></entry>''', ['今日'])
        self.assertEqual(data['今日'], ['きょう','こんにち'])

    def test_unknown_kana_is_not_fabricated(self):
        self.assertEqual(self.parse('', ['あいう']), {})
        self.assertEqual(classify({'text':'あいう','kana':'あいう'}, {}), 'unmatched')

    def test_kana_script_equivalence_preserves_sound_distinctions(self):
        self.assertEqual(reading_key('ｺｰﾋｰ'), reading_key('こーひー'))
        for a,b in [('きや','きゃ'),('お','を'),('は','わ'),('か','が'),('こう','こー')]:
            self.assertNotEqual(reading_key(a), reading_key(b))
        self.assertEqual(classify({'text':'は','kana':'わ'}, {'は':['は']}), 'mismatch')

if __name__ == '__main__':
    unittest.main()

class AuditClassificationTests(unittest.TestCase):
    def test_drills_are_excluded_even_when_dictionary_matches(self):
        self.assertEqual(classify({'id':'h-a','text':'あ','kana':'あ'}, {'あ':['あ']}),'excluded-drill')
    def test_names_not_misrepresented_as_jmdict_validation(self):
        self.assertEqual(classify({'id':'n5-u01-w-sato','text':'佐藤','kana':'さとう'},{}),'name-unverified')
