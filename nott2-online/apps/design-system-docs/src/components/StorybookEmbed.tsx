/**
 * StorybookEmbed
 *
 * Embeds a Storybook story in an iframe within a Docusaurus page.
 * Points to the local Storybook dev server (port 6006).
 *
 * Usage in MDX:
 *   <StorybookEmbed storyId="atoms-button--primary" height={300} />
 */

import React from 'react';

interface StorybookEmbedProps {
  /** The Storybook story ID (e.g. 'atoms-button--primary') */
  storyId: string;
  /** Iframe height in px. Defaults to 400. */
  height?: number;
}

export function StorybookEmbed({ storyId, height = 400 }: StorybookEmbedProps) {
  const src = `http://localhost:6006/iframe.html?id=${storyId}&viewMode=story&panel=false&nav=false`;

  return (
    <div className="ds-storybook-embed">
      <iframe
        src={src}
        title={`Storybook: ${storyId}`}
        style={{ height }}
        loading="lazy"
        allow="clipboard-write"
      />
    </div>
  );
}
