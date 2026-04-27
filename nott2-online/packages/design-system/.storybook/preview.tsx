import React from 'react';
import type { Preview } from '@storybook/react';
import { darkTheme } from '../src/tokens/theme.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        className={darkTheme}
        style={{
          backgroundColor: '#0a0a0a',
          padding: '24px',
          fontFamily: "'Inter', system-ui, sans-serif",
          color: '#e8e8e8',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a0a0a' }],
    },
    layout: 'padded',
  },
};

export default preview;
