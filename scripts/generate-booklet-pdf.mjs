#!/usr/bin/env node
/**
 * Automated Booklet PDF Generator for Night of the Thirteenth 2
 *
 * Renders `pdf-booklet/booklet.html` into an A5 (148mm × 210mm) booklet PDF
 * using headless Chromium (Microsoft Edge or Google Chrome) and outputs:
 *   1. `NotT 2 - Interactive Ashcan.pdf` (Repository Root)
 *   2. `site/public/NotT-2-Interactive-Ashcan.pdf` (Web App Static Asset)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const htmlPath = path.join(repoRoot, 'pdf-booklet', 'booklet.html');
const rootPdfOut = path.join(repoRoot, 'NotT 2 - Interactive Ashcan.pdf');
const publicDir = path.join(repoRoot, 'site', 'public');
const publicPdfOut = path.join(publicDir, 'NotT-2-Interactive-Ashcan.pdf');

function findBrowserExecutable() {
  if (process.env.BROWSER_PATH && fs.existsSync(process.env.BROWSER_PATH)) {
    return process.env.BROWSER_PATH;
  }
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/microsoft-edge',
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    'Could not find Microsoft Edge or Google Chrome executable. Set BROWSER_PATH environment variable.'
  );
}

function generatePdf() {
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Booklet HTML template not found at: ${htmlPath}`);
  }

  const browserExe = findBrowserExecutable();
  const fileUrl = pathToFileURL(htmlPath).href;

  console.log(`Using browser: ${browserExe}`);
  console.log(`Rendering template: ${fileUrl}`);

  execFileSync(
    browserExe,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-pdf-header-footer',
      '--print-to-pdf-no-header',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=5000',
      `--print-to-pdf=${rootPdfOut}`,
      fileUrl,
    ],
    { stdio: 'inherit' }
  );

  if (!fs.existsSync(rootPdfOut)) {
    throw new Error(`Failed to generate PDF at ${rootPdfOut}`);
  }

  fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(rootPdfOut, publicPdfOut);

  const stats = fs.statSync(rootPdfOut);
  console.log(`Successfully generated booklet PDF (${(stats.size / (1024 * 1024)).toFixed(2)} MB):`);
  console.log(`  -> ${rootPdfOut}`);
  console.log(`  -> ${publicPdfOut}`);
}

generatePdf();
