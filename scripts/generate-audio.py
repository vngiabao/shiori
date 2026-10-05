"""Stable entry point for the current Japanese renderer."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name('render-japanese-voice.py')),run_name='__main__')
