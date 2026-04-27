import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Night of the Thirteenth',
    brandUrl: '/',
    appBg: '#0a0a0a',
    appContentBg: '#141414',
    appBorderColor: '#2a2a2a',
    barBg: '#0a0a0a',
    colorPrimary: '#8a0000',
    colorSecondary: '#dc2626',
    textColor: '#e8e8e8',
    textMutedColor: '#6a6a6a',
    inputBg: '#1a1a1a',
    inputBorderColor: '#2a2a2a',
    inputTextColor: '#e8e8e8',
    fontBase: "'Inter', system-ui, sans-serif",
    fontCode: 'monospace',
  }),
});
