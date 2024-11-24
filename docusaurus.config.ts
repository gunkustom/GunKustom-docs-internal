import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "GunKustom",
  tagline: "Internal Docs Server",
  favicon: "img/favicon.ico",

  // Set the production URL of your site here
  url: "https://gunkustom.github.io",
  baseUrl: "/GunKustom-docs-internal/",

  organizationName: "gunkustom",
  projectName: "GunKustom-docs-internal",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/gunkustom/GunKustom-docs-internal/tree/main/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl:
            "https://github.com/gunkustom/GunKustom-docs-internal/tree/main/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "GunKustom",
      logo: {
        alt: "GunKustom Logo",
        src: "img/GunKustom-Logo-2.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Our Docs",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/gunkustom/GunKustom-docs-internal",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        { title: "Docs", items: [{ label: "Docs", to: "/docs/intro" }] },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            { label: "X", href: "https://x.com/docusaurus" },
          ],
        },
        {
          title: "More",
          items: [
            { label: "Blog", to: "/blog" },
            {
              label: "GitHub",
              href: "https://github.com/gunkustom/GunKustom-docs-internal",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} GunKustom. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
