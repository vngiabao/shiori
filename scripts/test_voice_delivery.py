import unittest
from voice_delivery import scene_delivery

class SceneCadenceTests(unittest.TestCase):
    def test_difficulty_preserves_two_role_cadences(self):
        yui = {'speed':1.03,'semitones':.5,'mood':'warm'}
        you = {'speed':.97,'semitones':-.5,'mood':'composed'}
        basic_yui = scene_delivery(yui, {})
        basic_you = scene_delivery(you, {})
        fast_yui = scene_delivery(yui, {'speed':1.2})
        fast_you = scene_delivery(you, {'speed':1.2})
        self.assertGreater(fast_yui['speed'], fast_you['speed'])
        self.assertAlmostEqual(fast_yui['speed']/fast_you['speed'], basic_yui['speed']/basic_you['speed'])
        self.assertAlmostEqual(fast_you['speed']/basic_you['speed'],1.2)
        self.assertEqual(fast_you['semitones'],-.5)
        self.assertEqual(yui['speed'],1.03)

    def test_upper_pace_limit_preserves_identity_settings(self):
        speaker = {'speed':1.04,'intonation':1.48,'semitones':.5}
        self.assertEqual(scene_delivery(speaker, {'speed':1.25}), {'speed':1.25,'intonation':1.48,'semitones':.5})

if __name__ == '__main__': unittest.main()
