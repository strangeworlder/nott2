import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'introduction',
    {
      type: 'category',
      label: 'Foundation',
      collapsed: false,
      items: [
        'foundation/colors',
        'foundation/typography',
        'foundation/spacing',
        'foundation/shadows',
        'foundation/motion',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Atoms',
          collapsed: true,
          items: [
            'components/atoms/text',
            'components/atoms/button',
            'components/atoms/icon',
            'components/atoms/badge',
            'components/atoms/status-callout',
            'components/atoms/toggle',
            'components/atoms/segmented-control',
            'components/atoms/text-field',
            'components/atoms/stack',
            'components/atoms/row',
            'components/atoms/separator',
            'components/atoms/phase-header',
          ],
        },
        {
          type: 'category',
          label: 'Molecules',
          collapsed: true,
          items: [
            'components/molecules/card',
            'components/molecules/action-footer',
            'components/molecules/playing-card',
            'components/molecules/player-avatar',
            'components/molecules/strike-indicator',
            'components/molecules/die-selector',
            'components/molecules/result-banner',
            'components/molecules/effort-band',
            'components/molecules/difficulty-badge',
            'components/molecules/dice-result',
            'components/molecules/weakness-tracker',
            'components/molecules/waiting-indicator',
            'components/molecules/tab-bar',
            'components/molecules/card-matt',
            'components/molecules/deck',
            'components/molecules/doom-clock',
          ],
        },
        {
          type: 'category',
          label: 'Organisms',
          collapsed: true,
          items: [
            'components/organisms/game-board',
            'components/organisms/header',
            'components/organisms/chat-panel',
            'components/organisms/player-panel',
            'components/organisms/phase-display',
            'components/organisms/phase-panel',
            'components/organisms/character-bar',
            'components/organisms/transition-overlay',
            'components/organisms/act-break-overlay',
            'components/organisms/scene-challenge-overlay',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Patterns',
      collapsed: false,
      items: [
        'patterns/theme-contract',
        'patterns/decision-trees',
        'patterns/anti-patterns',
      ],
    },
  ],
};

export default sidebars;
