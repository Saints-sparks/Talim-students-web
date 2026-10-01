/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  /**
   * Addresses of the pre-redesign screens, kept working for bookmarks, old
   * push notifications and onboarding links: Resources became Files,
   * Notifications became Updates, Profile moved into Settings, and the
   * curriculum list is part of each subject's page.
   *
   * @returns The redirects.
   */
  async redirects() {
    return [
      { source: "/resources", destination: "/files", permanent: false },
      { source: "/notifications", destination: "/updates", permanent: false },
      { source: "/profile", destination: "/settings", permanent: false },
      { source: "/subjects/curriculum", destination: "/subjects", permanent: false },
    ];
  },
};

module.exports = nextConfig;
