import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// The site is published at https://unifiedgsc.github.io/Specification/. The
// publish workflow passes the address GitHub Pages serves from
// (actions/configure-pages); these defaults cover local and PR builds, where
// those values are empty.
const url = process.env.SITE_URL || 'https://unifiedgsc.github.io';
const baseUrl = process.env.BASE_URL || '/Specification/';

const config: Config = {
  title: 'Game Server Config Standard',
  tagline: 'One open format for configuring dedicated game servers, from Quake 3 to Satisfactory.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url,
  baseUrl,
  trailingSlash: false,

  organizationName: 'UnifiedGSC',
  projectName: 'Specification',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  markdown: {
    mermaid: true,
    // .md pages are plain CommonMark: the spec is full of `{value}`-style
    // templates that MDX would try to evaluate. Use .mdx only for pages that
    // need components.
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          id: 'spec',
          path: 'spec',
          routeBasePath: 'spec',
          sidebarPath: './sidebars.spec.ts',
          editUrl: 'https://github.com/UnifiedGSC/Specification/edit/main/',
          versions: {
            current: {label: '0.1 (draft)', banner: 'none'},
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'live-state',
        path: 'live-state',
        routeBasePath: 'live-state',
        sidebarPath: './sidebars.live-state.ts',
        editUrl: 'https://github.com/UnifiedGSC/Specification/edit/main/',
        versions: {
          current: {label: '0.1 (draft)', banner: 'none'},
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        // Generated from examples/definitions by scripts/generate-games.mjs.
        id: 'games',
        path: 'games',
        routeBasePath: 'games',
        sidebarPath: './sidebars.games.ts',
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'UnifiedGSC',
      logo: {
        alt: 'UnifiedGSC',
        src: 'img/logo.svg',
      },
      items: [
        {type: 'docSidebar', docsPluginId: 'spec', sidebarId: 'spec', position: 'left', label: 'Config spec'},
        {type: 'docSidebar', docsPluginId: 'live-state', sidebarId: 'liveState', position: 'left', label: 'Live state'},
        {type: 'docSidebar', docsPluginId: 'games', sidebarId: 'games', position: 'left', label: 'Games'},
        {type: 'docsVersionDropdown', docsPluginId: 'spec', position: 'right'},
        {
          href: 'https://github.com/UnifiedGSC/Specification',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Specifications',
          items: [
            {label: 'Config spec', to: '/spec'},
            {label: 'Live state', to: '/live-state'},
            {label: 'Example games', to: '/games'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/UnifiedGSC'},
            {label: 'Discussions and issues', href: 'https://github.com/UnifiedGSC/Specification/issues'},
          ],
        },
      ],
      copyright: `UnifiedGSC. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'ini', 'lua'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
