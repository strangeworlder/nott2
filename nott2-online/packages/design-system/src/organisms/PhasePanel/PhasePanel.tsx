/**
 * PhasePanel (Organism)
 *
 * Philosophical:
 * The director's desk — the operational surface where decisions are made.
 * Where PhaseDisplay is the narrator's voice (cinematic, full-bleed), the
 * PhasePanel is the working space: structured, scrollable, purposeful. Every
 * scene of active play takes place here. Its job is to get out of the way
 * and let the mechanics breathe.
 *
 * Technical:
 * A flex column container that composes PhaseHeader, a scrollable content
 * area, and an optional ActionFooter. Replaces the repeated
 * <div className="phase-panel"><div className="stack"> pattern across all
 * operational screens.
 *
 * Props:
 * - title: Phase title (required).
 * - subtitle: Subtitle text (optional).
 * - step: Optional { current, total } for step indicators.
 * - children: Phase content (Cards, callouts, etc.).
 * - id: Optional id attribute.
 */

import React from 'react';
import { PhaseHeader } from '../../molecules/PhaseHeader/PhaseHeader';
import { panelRoot, panelStack } from './PhasePanel.css';

interface PhasePanelProps {
  title: string;
  subtitle?: string;
  step?: { current: number; total: number };
  children: React.ReactNode;
  id?: string;
}

export function PhasePanel({ title, subtitle, step, children, id }: PhasePanelProps) {
  return (
    <div id={id} className={panelRoot}>
      <PhaseHeader title={title} subtitle={subtitle} step={step} />
      <div className={panelStack}>
        {children}
      </div>
    </div>
  );
}
