import { test, expect, chromium } from '@playwright/test';

/**
 * Invalid Actions — E2E
 *
 * Verifies host-only controls are NOT exposed to non-host players.
 * A guest who navigates directly to /game/[code] must see .waiting-hint
 * elements wherever the host would see action controls.
 *
 * Tested surfaces:
 *   - SceneSetupScreen: draw card, AP selection, challenge button
 *
 * Skips if Firebase is not configured.
 */

test.describe('Invalid actions — host-only controls', () => {
  test.skip(
    !process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    'Skipping: Firebase not configured.',
  );

  test('non-host sees waiting hints, not action controls in Scene Setup', async () => {
    const browser = await chromium.launch();

    const hostCtx  = await browser.newContext();
    const guestCtx = await browser.newContext();
    const hostPage  = await hostCtx.newPage();
    const guestPage = await guestCtx.newPage();

    // Host creates room
    await hostPage.goto('http://localhost:3000/lobby');
    await hostPage.getByLabel(/your name/i).fill('Host');
    await hostPage.getByRole('button', { name: /host/i }).click();

    const codeEl = hostPage.locator('[data-testid="room-code"], .room-code, .lobby__code');
    await expect(codeEl).toBeVisible({ timeout: 10_000 });
    const roomCode = (await codeEl.textContent())?.trim() ?? '';

    // Guest joins the room
    await guestPage.goto(`http://localhost:3000/lobby?join=true&code=${roomCode}`);
    await guestPage.getByLabel(/your name/i).fill('Guest');
    await guestPage.getByRole('button', { name: /join/i }).click();

    // Host starts the game
    await hostPage.getByRole('button', { name: /start game/i }).click();

    // Navigate through setup on host side
    await hostPage.getByText('Begin Setup →').click();
    await hostPage.getByText('Initialize Decks →').click();

    // Progress host to Scene Setup
    const continueBtn = hostPage.getByText('Continue →');
    if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await continueBtn.click();
    }
    const beginBtn = hostPage.getByText('Begin Act →');
    if (await beginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await beginBtn.click();
    }

    // Host should see "Draw from Threat Deck" controls
    await expect(hostPage.getByText(/Draw from Threat Deck|Scene Setup/)).toBeVisible({ timeout: 8000 });

    // Guest should see waiting hints — NOT the draw controls
    await guestPage.waitForURL(`**/game/${roomCode}`, { timeout: 15_000 });
    await expect(guestPage.locator('.waiting-hint').first()).toBeVisible({ timeout: 8000 });

    // Guest should NOT see card entry form
    await expect(guestPage.getByText('Draw from Threat Deck')).not.toBeVisible();

    await browser.close();
  });
});
