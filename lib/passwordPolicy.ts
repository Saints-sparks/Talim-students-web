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

/**
 * The rules a password policy from `GET /auth/password-policy` asks for, in
 * the order the checklist shows them. Without a policy (still loading, or the
 * call failed) the built-in {@link PASSWORD_RULES} apply.
 *
 * @param policy - The server's policy, or null.
 * @param policy.minLength - Shortest allowed length.
 * @param policy.maxLength - Longest allowed length, when the server caps it.
 * @param policy.requireUppercase - Needs an upper-case letter.
 * @param policy.requireLowercase - Needs a lower-case letter.
 * @param policy.requireNumber - Needs a digit.
 * @param policy.requireSymbol - Needs a symbol.
 * @param policy.symbols - The characters the symbol rule accepts.
 * @returns The rules.
 */
export function rulesFromPolicy(
  policy: {
    minLength: number;
    maxLength?: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumber: boolean;
    requireSymbol: boolean;
    symbols?: string;
  } | null | undefined
): PasswordRule[] {
  if (!policy) return PASSWORD_RULES;
  const rules: PasswordRule[] = [{ label: `At least ${policy.minLength} characters`, test: (v) => v.length >= policy.minLength }];
  if (policy.maxLength) {
    const max = policy.maxLength;
    rules.push({ label: `At most ${max} characters`, test: (v) => v.length <= max });
  }
  if (policy.requireUppercase) rules.push({ label: "An upper-case letter", test: (v) => /[A-Z]/.test(v) });
  if (policy.requireLowercase) rules.push({ label: "A lower-case letter", test: (v) => /[a-z]/.test(v) });
  if (policy.requireNumber) rules.push({ label: "A number", test: (v) => /\d/.test(v) });
  if (policy.requireSymbol) {
    const symbols = policy.symbols ? new Set(policy.symbols.split("")) : null;
    rules.push({
      label: "A symbol",
      test: (v) => (symbols ? v.split("").some((ch) => symbols.has(ch)) : /[^A-Za-z0-9]/.test(v)),
    });
  }
  return rules;
}
