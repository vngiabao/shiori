/** Ruby markup helpers. Lines are written "{漢字|かんじ}" so furigana sits over kanji only. */
const rubyPart = /\{([^|{}]+)\|([^|{}]+)\}/g;
/** The written line, as it appears on the page and keys the audio manifest. */
export const plain = (s: string) => s.replace(rubyPart, "$1");
/** The line with every kanji replaced by its reading. */
export const kanaOf = (s: string) => s.replace(rubyPart, "$2");
/** Braces only ever appear as complete {base|reading} pairs. */
export const rubyIsWellFormed = (s: string) =>
  !/[{}|]/.test(s.replace(rubyPart, ""));
