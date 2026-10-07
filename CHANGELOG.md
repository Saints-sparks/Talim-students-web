# Changelog

All notable changes to Talim Students Web (the student portal) are recorded
here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning](https://semver.org/).

## [1.5.0] - 2026-10-06

Platform sync release (`talimBE-V2/docs/v1.5-platform-sync.md`): one support
system across every Talim app, and version 1.5.0 across the platform.

### Added

- **My tickets** under Settings → Help, on the one ticket system (§1):
  - a list of the student's tickets with status chips (Open, In progress,
    Waiting on you, Resolved, Closed), an unread dot when someone has written,
    and when each last changed; "Load more" for older ones;
  - **New ticket**: choose **My school** or **Talim support**, what it is
    about, a subject (3–140 characters), the message (up to 5,000) and up to
    five files;
  - the **thread**: every message with its files, a reply box with
    attachments, **Reopen** within 7 days of a ticket being resolved (with the
    deadline shown), and **Close ticket** after a confirm step;
  - clear words when the API refuses (409): a closed ticket, a reopen after
    the 7-day window, the 500-message cap. The draft is kept and the ticket
    reloaded.
- A support notification (`{ page: 'support', ticketId }`) opens the ticket's
  thread at `/settings?tab=help&ticket=<id>`; its button reads "Open ticket".
- Updates gain a **Support** filter, and support notifications a "Support" tag.
- The Settings page guide points out My tickets.

### Changed

- Settings → About shows "Version 1.5.0", read from `package.json` (it was
  `NEXT_PUBLIC_APP_VERSION`, else "1.0.0").
- The version in `package.json` is now 1.5.0.

### Removed

- "Report a problem" and its `POST /support/tickets` call; tickets replace it.
