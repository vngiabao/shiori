"""Pinned reference refresh must neither select a newer release nor trust bad bytes."""
import hashlib
import importlib.util
import json
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('kanji_sources', Path(__file__).with_name('fetch-sources.py'))
sources = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sources)


class CachedKanjiTests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.root = Path(self.folder.name)
        self.archive = self.root / 'kanjidic2-en-1+test.json.zip'
        with zipfile.ZipFile(self.archive, 'w') as archive:
            archive.writestr('dictionary.json', json.dumps({'characters': [
                {'literal': '本', 'readingMeaning': {'groups': []}},
                {'literal': '木', 'readingMeaning': {'groups': []}}
            ]}))
        self.pin = {'release': '1+test', 'url': 'https://example.invalid/kanjidic2-en-1%2Btest.json.zip',
                    'sha256': hashlib.sha256(self.archive.read_bytes()).hexdigest()}
        self.write_pin()

    def write_pin(self):
        (self.root / 'kanjidic2-provenance.json').write_text(json.dumps(self.pin), encoding='utf-8')

    def refresh(self):
        with patch.object(sources, 'out', self.root), patch.object(sources, 'cache', self.root), \
                patch.object(sources, 'pack', {'words': [{'text': '本'}]}), \
                patch.object(sources.urllib.request, 'urlopen', side_effect=AssertionError('No release lookup')):
            sources.kanjidic(cached=True)

    def test_cached_refresh_uses_pinned_archive_and_required_subset(self):
        self.refresh()
        data = json.loads((self.root / 'kanjidic2.json').read_text(encoding='utf-8'))
        self.assertEqual([item['literal'] for item in data['characters']], ['本'])
        self.assertEqual(data['source'], self.pin['url'])
        self.assertEqual(json.loads((self.root / 'kanjidic2-provenance.json').read_text())['sha256'], self.pin['sha256'])

    def test_corrupt_cache_does_not_replace_existing_subset(self):
        previous = self.root / 'kanjidic2.json'
        previous.write_text('previous verified subset')
        self.archive.write_bytes(b'corrupt')
        with self.assertRaises(RuntimeError):
            self.refresh()
        self.assertEqual(previous.read_text(), 'previous verified subset')

    def test_missing_archive_requires_explicit_refresh(self):
        self.archive.unlink()
        with self.assertRaises(RuntimeError):
            self.refresh()


if __name__ == '__main__':
    unittest.main()
