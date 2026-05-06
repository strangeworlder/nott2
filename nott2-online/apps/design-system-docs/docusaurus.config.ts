import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Night of the Thirteenth — Design System',
  tagline: 'The visual language of survival horror',
  favicon: 'img/favicon.ico',

  url: 'https://nott2.dev',
  baseUrl: '/design-system/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    function vanillaExtractPlugin() {
      return {
        name: 'vanilla-extract-plugin',
        configureWebpack() {
          const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
          return {
            plugins: [new VanillaExtractPlugin()],
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'NotT2 Design System',
      style: 'dark',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'http://localhost:6006',
          label: 'Storybook ↗',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Night of the Thirteenth 2 — Design System v0.0.0`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
