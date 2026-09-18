/**
 * The password rules the API enforces, mirrored so the student is told what is
 * wrong before the request goes out. Kept in step with
 * `talimBE-V2` `ChangePasswordDto`: at least 8 characters with upper- and
 * lower-case letters, a number and a symbol.
 */
export interface PasswordRule {
  /** Short label shown beside the tick. */
  label: string;
  /** Whether the candidate satisfies it. */
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "An upper-case letter", test: (v) => /[A-Z]/.test(v) },
  { label: "A lower-case letter", test: (v) => /[a-z]/.test(v) },
  { label: "A number", test: (v) => /\d/.test(v) },
  { label: "A symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

/**
 * Checks a candidate password against every rule.
 *
 * @param value - The password the student typed.
 * @returns One entry per rule, with whether it passed.
 */
export function checkPassword(value: string): Array<PasswordRule & { passed: boolean }> {
  return PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(value) }));
}

/**
 * The first rule a candidate password breaks.
 *
 * @param value - The password the student typed.
 * @returns A sentence to show, or `null` when the password is strong enough.
 */
export function firstPasswordProblem(value: string): string | null {
  const broken = PASSWORD_RULES.find((rule) => !rule.test(value));
  return broken ? `Your new password needs: ${broken.label.toLowerCase()}.` : null;
}
