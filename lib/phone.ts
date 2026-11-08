/**
 * Israeli phone numbers for the lead form (backlog §8.1).
 *
 * One source for both halves of the check: `ISRAELI_PHONE_PATTERN` is the string the `<input
 * pattern>` attribute carries, and `isIsraeliPhone()` runs the very same expression in JS (the
 * form keeps `noValidate`, so the browser never applies the attribute — the JS check is what
 * decides, the attribute documents the shape for assistive tech and autofill).
 *
 * Accepts, with or without dashes or spaces between digits:
 *   - mobiles          05X-XXXXXXX          (10 digits)
 *   - VoIP / 07X lines 07X-XXXXXXX          (10 digits — this business's own number is 072-)
 *   - landlines        02 / 03 / 04 / 08 / 09 -XXXXXXX (9 digits)
 *   - the same three behind +972, 00972 or 972, with the leading 0 dropped
 *
 * Written for the `v` flag browsers compile `pattern` with: `-` is escaped inside the class.
 */
export const ISRAELI_PHONE_PATTERN =
  "(?:\\+972|00972|972|0)[\\s\\-]?(?:[57]\\d|[23489])(?:[\\s\\-]?\\d){7}";

const ISRAELI_PHONE_RE = new RegExp(`^(?:${ISRAELI_PHONE_PATTERN})$`);

/** True when `value` is a plausible Israeli mobile, 07X or landline number. */
export function isIsraeliPhone(value: string): boolean {
  return ISRAELI_PHONE_RE.test(value.trim());
}
