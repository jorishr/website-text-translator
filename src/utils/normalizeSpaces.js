/**
 * Adjusts leading and trailing spaces of translated strings to match the original values.
 *
 * @param {string[]} originalStrings - Array of original strings.
 * @param {string[]} translatedStrings - Array of translated strings.
 * @returns {string[]} - Array of translated strings with adjusted spaces.
 */
export function normalizeSpaces(originalStrings, translatedStrings) {
  return translatedStrings.map((translated, index) => {
    const original = originalStrings[index];
    const leadingSpaces = original.match(/^\s*/)[0];
    const trailingSpaces = original.match(/\s*$/)[0];
    return leadingSpaces + translated.trim() + trailingSpaces;
  });
}
