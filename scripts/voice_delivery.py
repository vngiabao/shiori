"""Native speaking pace: a scene's difficulty scales each character's cadence.

Pitch centre and lexical accent are independent of pace. No WAV resampling.
"""
def scene_delivery(speaker, scene):
    setting = dict(speaker)
    setting['speed'] = round(min(1.25, max(.96, speaker['speed'] * scene.get('speed', 1.0))), 4)
    return setting
