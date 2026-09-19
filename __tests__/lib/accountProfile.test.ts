import { buildProfileRows, getProfileInitials } from "@/lib/accountProfile";
import type { User } from "@/types/auth";

const user = {
  firstName: "Ada",
  lastName: "Nwosu",
  email: "ada@talim.test",
  schoolName: "Talim Test School",
  phoneNumber: "0800",
  admissionNumber: "ADM-1",
} as User;

describe("buildProfileRows", () => {
  it("lists the student's details in a fixed order", () => {
    expect(buildProfileRows(user)).toEqual([
      { label: "Full Name", value: "Ada Nwosu" },
      { label: "Role", value: "Student" },
      { label: "Email Address", value: "ada@talim.test" },
      { label: "School", value: "Talim Test School" },
      { label: "Phone Number", value: "0800" },
      { label: "Admission Number", value: "ADM-1" },
    ]);
  });

  it("shows a dash for anything the school has not recorded", () => {
    const rows = buildProfileRows(null);
    expect(rows.find((row) => row.label === "Full Name")?.value).toBe("—");
    expect(rows.find((row) => row.label === "Phone Number")?.value).toBe("—");
    expect(rows.find((row) => row.label === "Role")?.value).toBe("Student");
  });

  it("copes with a first name and no last name", () => {
    expect(buildProfileRows({ firstName: "Ada" } as User)[0].value).toBe("Ada");
  });
});

describe("getProfileInitials", () => {
  it("uses the first letters of both names, capitalised", () => {
    expect(getProfileInitials({ firstName: "ada", lastName: "nwosu" } as User)).toBe("AN");
  });

  it("falls back to ST", () => {
    expect(getProfileInitials(null)).toBe("ST");
    expect(getProfileInitials({} as User)).toBe("ST");
  });
});
