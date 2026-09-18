import { checkPassword, firstPasswordProblem } from "@/lib/passwordPolicy";

describe("password policy", () => {
  it("mirrors the API rules: 8 chars, upper, lower, number, symbol", () => {
    expect(firstPasswordProblem("Str0ng!pass")).toBeNull();
    expect(firstPasswordProblem("Sh0rt!")).toMatch(/8 characters/);
    expect(firstPasswordProblem("nouppercase1!")).toMatch(/upper-case/);
    expect(firstPasswordProblem("NOLOWERCASE1!")).toMatch(/lower-case/);
    expect(firstPasswordProblem("NoNumbers!!")).toMatch(/number/);
    expect(firstPasswordProblem("NoSymbols123")).toMatch(/symbol/);
  });

  it("reports each rule separately for the checklist", () => {
    const results = checkPassword("abc");
    expect(results).toHaveLength(5);
    expect(results.filter((r) => r.passed).map((r) => r.label)).toEqual(["A lower-case letter"]);
  });
});
