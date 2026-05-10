/**
 * TabBar
 *
 * Philosophical:
 * A dividing line between two paths. The lobby offers a fork: create or join.
 * But unlike a passive sign, this fork glows — the chosen path radiates with
 * the brand's blood-red presence, while the unchosen path waits in shadow,
 * ready to respond the moment you reconsider. It is navigation as tension:
 * every choice forecloses another.
 *
 * Technical:
 * A horizontal tab navigation bar following the WAI-ARIA Tabs Pattern.
 * Manages visual active state via the `activeTab` prop. Supports full
 * keyboard navigation (Arrow keys, Home, End) and optional leading icons
 * via the design system's `<Icon>` atom.
 *
 * Props:
 * - tabs: Array of { id: string; label: string; icon?: IconName } tab definitions.
 * - activeTab: The id of the currently active tab.
 * - onTabChange: Called with the new tab id when a tab is selected.
 * - id: Optional id attribute for the tablist container.
 */

import React, { useRef, useCallback } from 'react';
import { tabBarRoot, tabRecipe, tabIcon } from './TabBar.css';
import { Icon } from '../../atoms/Icon/Icon';
import type { IconName } from '../../atoms/Icon/Icon';

export interface Tab {
  id: string;
  label: string;
  /** Optional icon from the design system's Icon atom */
  icon?: IconName;
}

export interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  id?: string;
}

export function TabBar({ tabs, activeTab, onTabChange, id }: TabBarProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
          nextIndex = (index + 1) % tabs.length;
          break;
        case 'ArrowLeft':
          nextIndex = (index - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      const nextTab = tabs[nextIndex];
      tabRefs.current[nextIndex]?.focus();
      onTabChange(nextTab.id);
    },
    [tabs, onTabChange],
  );

  return (
    <div id={id} className={tabBarRoot} role="tablist">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={tabRecipe({ active: isActive })}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.icon && (
              <span className={tabIcon}>
                <Icon name={tab.icon} size={18} />
              </span>
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
