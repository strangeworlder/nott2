/**
 * TabBar
 *
 * Philosophical:
 * A dividing line between two paths. The lobby offers a fork: create or join.
 * The TabBar is a simple two-road sign — understated, almost bureaucratic,
 * which makes it feel diegetically appropriate for a waiting room. It does
 * not try to be exciting. It just asks: which way?
 *
 * Technical:
 * A horizontal tab navigation bar. Manages its own visual active state via
 * the `activeTab` prop. Consumers provide tab definitions and an onChange handler.
 * Supports keyboard navigation (Enter/Space).
 *
 * Props:
 * - tabs: Array of { id: string; label: string } tab definitions.
 * - activeTab: The id of the currently active tab.
 * - onTabChange: Called with the new tab id when a tab is selected.
 * - id: Optional id attribute.
 */

import React from 'react';
import { tabBarRoot, tabRecipe } from './TabBar.css';

interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  id?: string;
}

export function TabBar({ tabs, activeTab, onTabChange, id }: TabBarProps) {
  return (
    <div id={id} className={tabBarRoot} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={tabRecipe({ active: activeTab === tab.id })}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
