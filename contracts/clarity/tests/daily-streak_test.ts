/**
 * Daily Streak Contract Tests
 *
 * Test suite for daily-streak.clar using Clarinet
 */

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: 'Ensure that users can spin once per day',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    // First spin should succeed
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.expectOk(), true);

    // Try to spin again immediately - should fail
    block = chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    // Second spin should fail with err u101 (already spun today)
    block.receipts[0].result.expectErr().expectUint(101);
  },
});

Clarinet.test({
  name: 'Check that player data is correctly stored',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Spin once
    let block = chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    // Get player info
    const playerInfo = chain.callReadOnlyFn(
      'daily-streak',
      'get-player-info',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    // Verify data structure
    const result = playerInfo.result.expectSome();
    assertEquals(typeof result, 'object');
    // Player should have points, streak, and total-spins
  },
});

Clarinet.test({
  name: 'Verify that streak increments on consecutive days',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Day 1 - First spin
    let block = chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    // Get streak after first spin
    let streak = chain.callReadOnlyFn(
      'daily-streak',
      'get-streak',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    // Streak should be 1
    streak.result.expectOk().expectUint(1);

    // Advance to next day (144 blocks ~= 1 day)
    chain.mineEmptyBlockUntil(chain.blockHeight + 144);

    // Day 2 - Second spin
    block = chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    // Get streak after second spin
    streak = chain.callReadOnlyFn(
      'daily-streak',
      'get-streak',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    // Streak should be 2
    streak.result.expectOk().expectUint(2);
  },
});

Clarinet.test({
  name: 'Verify that streak resets if day is missed',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Day 1 - First spin
    let block = chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    // Skip 2 days (288 blocks)
    chain.mineEmptyBlockUntil(chain.blockHeight + 288);

    // Day 3 - Spin after missing day 2
    block = chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    // Get streak - should be reset to 1
    const streak = chain.callReadOnlyFn(
      'daily-streak',
      'get-streak',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    streak.result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: 'Check that prizes are within valid range',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Spin
    const block = chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    const result = block.receipts[0].result.expectOk().expectTuple();
    const prize = result['prize'];

    // Prize should be between 10 and 150
    const prizeValue = parseInt(prize);
    assertEquals(prizeValue >= 10, true);
    assertEquals(prizeValue <= 150, true);
  },
});

Clarinet.test({
  name: 'Verify read-only function get-points-as-string',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Spin to get points
    chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    // Call get-points-as-string (Clarity 4 function)
    const pointsStr = chain.callReadOnlyFn(
      'daily-streak',
      'get-points-as-string',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    // Should return a string
    pointsStr.result.expectSome();
  },
});

Clarinet.test({
  name: 'Verify can-spin-today function',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Before spinning - should be able to spin
    let canSpin = chain.callReadOnlyFn(
      'daily-streak',
      'can-spin-today',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    assertEquals(canSpin.result, 'true');

    // After spinning - should not be able to spin
    chain.mineBlock([
      Tx.contractCall(
        'daily-streak',
        'spin',
        [],
        wallet1.address
      ),
    ]);

    canSpin = chain.callReadOnlyFn(
      'daily-streak',
      'can-spin-today',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    assertEquals(canSpin.result, 'false');
  },
});
