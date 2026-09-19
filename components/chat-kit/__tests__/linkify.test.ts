import { linkify } from "../linkify";
import { extractLinks } from "../mediaTypes";

describe("linkify", () => {
  it("splits text around http, https and www links", () => {
    expect(linkify("see https://talim.com/fees and www.talim.com now")).toEqual([
      { type: "text", text: "see " },
      { type: "link", text: "https://talim.com/fees", href: "https://talim.com/fees" },
      { type: "text", text: " and " },
      { type: "link", text: "www.talim.com", href: "https://www.talim.com" },
      { type: "text", text: " now" },
    ]);
  });

  it("keeps trailing punctuation outside the link", () => {
    expect(linkify("(https://a.com/x).")).toEqual([
      { type: "text", text: "(" },
      { type: "link", text: "https://a.com/x", href: "https://a.com/x" },
      { type: "text", text: ")." },
    ]);
  });

  it("returns plain text as one segment and nothing for empty input", () => {
    expect(linkify("no links here\nsecond line")).toEqual([
      { type: "text", text: "no links here\nsecond line" },
    ]);
    expect(linkify("")).toEqual([]);
    expect(linkify(undefined)).toEqual([]);
  });

  it("never links other schemes", () => {
    expect(linkify("javascript:alert(1) ftp://x.com")).toEqual([
      { type: "text", text: "javascript:alert(1) ftp://x.com" },
    ]);
  });

  it("extractLinks still returns each link once", () => {
    expect(extractLinks("https://a.com and https://a.com, www.b.com.")).toEqual([
      "https://a.com",
      "https://www.b.com",
    ]);
  });
});
