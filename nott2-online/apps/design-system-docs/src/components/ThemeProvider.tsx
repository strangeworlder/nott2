/**
 * ThemeProvider
 *
 * Wraps children in the NotT2 darkTheme class so vanilla-extract
 * token values resolve correctly when rendering live DS components
 * inside Docusaurus MDX pages.
 */

import React from 'react';
import { darkTheme } from '@nott2/design-system';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <div className={darkTheme}>{children}</div>;
}
