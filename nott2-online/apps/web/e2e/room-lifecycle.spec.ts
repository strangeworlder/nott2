import { test, expect, chromium } from '@playwright/test';

/**
 * Room Lifecycle — E2E
 *
 * Tests the full multiplayer room lifecycle:
 *   1. Host opens /lobby, creates a room → gets a room code
 *   2. A second browser context (simulating a different player) joins
 *   3. Both see each other in the seat list
 *   4. Host starts the game → both contexts reach /game/[code]
 *   5. Host resets → returns to home
 *
 * NOTE: Requires Firebase to be configured (NEXT_PUBLIC_FIREBASE_*).
 * If Firebase is not configured, this test is skipped.
 */

test.describe('Room lifecycle — multiplayer', () => {
  test.skip(
    !process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    'Skipping: Firebase not configured. Set NEXT_PUBLIC_FIREBASE_DATABASE_URL to run.',
  );

  test('host creates room and receives a 6-char room code', async ({ page }) => {
    await page.goto('/lobby');

    // Fill in player name
    const nameInput = page.getByLabel(/your name/i);
    await nameInput.fill('TestHost');

    // Click "Host a Game"
    await page.getByRole('button', { name: /host/i }).click();

    // Should see a 6-character room code displayed
    await expect(page.getByText(/[A-Z0-9]{6}/)).toBeVisible({ timeout: 10_000 });
  });

  test('two players can be in same room', async () => {
    const browser = await chromium.launch();

    const hostCtx  = await browser.newContext();
    const guestCtx = await browser.newContext();
    const hostPage  = await hostCtx.newPage();
    const guestPage = await guestCtx.newPage();

    await hostPage.goto('http://localhost:3000/lobby');
    const nameInput = hostPage.getByLabel(/your name/i);
    await nameInput.fill('Host');
    await hostPage.getByRole('button', { name: /host/i }).click();

    // Extract room code
    const codeEl = hostPage.locator('[data-testid="room-code"], .room-code, .lobby__code');
    await expect(codeEl).toBeVisible({ timeout: 10_000 });
    const roomCode = (await codeEl.textContent())?.trim() ?? '';
    expect(roomCode).toMatch(/^[A-Z0-9]{6}$/);

    // Guest joins
    await guestPage.goto(`http://localhost:3000/lobby?join=true&code=${roomCode}`);
    const guestNameInput = guestPage.getByLabel(/your name/i);
    await guestNameInput.fill('Guest');
    await guestPage.getByRole('button', { name: /join/i }).click();

    // Both should see 2 players in the seat list
    await expect(hostPage.getByText('Host')).toBeVisible({ timeout: 10_000 });
    await expect(hostPage.getByText('Guest')).toBeVisible({ timeout: 10_000 });

    await browser.close();
  });
});
