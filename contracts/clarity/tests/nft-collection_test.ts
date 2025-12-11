/**
 * NFT Collection Contract Tests
 *
 * Test suite for nft-collection.clar using Clarinet
 */

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: 'Ensure that NFT can be minted with payment',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    const block = chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'mint',
        [
          types.utf8('Test NFT'),
          types.ascii('ipfs://QmTest123'),
        ],
        wallet1.address
      ),
    ]);

    // Mint should succeed
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: 'Check that token ID increments correctly',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    const block = chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'mint',
        [types.utf8('NFT 1'), types.ascii('ipfs://test1')],
        wallet1.address
      ),
      Tx.contractCall(
        'nft-collection',
        'mint',
        [types.utf8('NFT 2'), types.ascii('ipfs://test2')],
        wallet2.address
      ),
    ]);

    // First mint should get ID 1
    block.receipts[0].result.expectOk().expectUint(1);

    // Second mint should get ID 2
    block.receipts[1].result.expectOk().expectUint(2);
  },
});

Clarinet.test({
  name: 'Verify that get-last-token-id returns correct value',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Check initial value
    let lastId = chain.callReadOnlyFn(
      'nft-collection',
      'get-last-token-id',
      [],
      wallet1.address
    );

    lastId.result.expectOk().expectUint(0);

    // Mint one NFT
    chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'mint',
        [types.utf8('Test'), types.ascii('ipfs://test')],
        wallet1.address
      ),
    ]);

    // Check updated value
    lastId = chain.callReadOnlyFn(
      'nft-collection',
      'get-last-token-id',
      [],
      wallet1.address
    );

    lastId.result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: 'Verify SIP-009 get-token-uri function',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const testUri = 'ipfs://QmTestURI123';

    // Mint NFT
    chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'mint',
        [types.utf8('Test NFT'), types.ascii(testUri)],
        wallet1.address
      ),
    ]);

    // Get token URI
    const uri = chain.callReadOnlyFn(
      'nft-collection',
      'get-token-uri',
      [types.uint(1)],
      wallet1.address
    );

    // Should return the URI
    uri.result.expectOk().expectSome().expectAscii(testUri);
  },
});

Clarinet.test({
  name: 'Verify SIP-009 get-owner function',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Mint NFT
    chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'mint',
        [types.utf8('Test'), types.ascii('ipfs://test')],
        wallet1.address
      ),
    ]);

    // Get owner
    const owner = chain.callReadOnlyFn(
      'nft-collection',
      'get-owner',
      [types.uint(1)],
      wallet1.address
    );

    // Should return wallet1 as owner
    owner.result.expectOk().expectSome().expectPrincipal(wallet1.address);
  },
});

Clarinet.test({
  name: 'Verify SIP-009 transfer function',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    // Mint NFT to wallet1
    chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'mint',
        [types.utf8('Test'), types.ascii('ipfs://test')],
        wallet1.address
      ),
    ]);

    // Transfer to wallet2
    const block = chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'transfer',
        [
          types.uint(1),
          types.principal(wallet1.address),
          types.principal(wallet2.address),
        ],
        wallet1.address
      ),
    ]);

    // Transfer should succeed
    block.receipts[0].result.expectOk();

    // Verify new owner
    const owner = chain.callReadOnlyFn(
      'nft-collection',
      'get-owner',
      [types.uint(1)],
      wallet2.address
    );

    owner.result.expectOk().expectSome().expectPrincipal(wallet2.address);
  },
});

Clarinet.test({
  name: 'Verify that only owner can transfer',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    // Mint NFT to wallet1
    chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'mint',
        [types.utf8('Test'), types.ascii('ipfs://test')],
        wallet1.address
      ),
    ]);

    // Try to transfer from wallet2 (not owner)
    const block = chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'transfer',
        [
          types.uint(1),
          types.principal(wallet1.address),
          types.principal(wallet2.address),
        ],
        wallet2.address // Wrong sender
      ),
    ]);

    // Should fail with err u101 (not token owner)
    block.receipts[0].result.expectErr().expectUint(101);
  },
});

Clarinet.test({
  name: 'Verify Clarity 4 get-token-id-string function',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Call uint-to-string function
    const idString = chain.callReadOnlyFn(
      'nft-collection',
      'get-token-id-string',
      [types.uint(42)],
      wallet1.address
    );

    // Should return "42" as string
    idString.result.expectAscii('42');
  },
});

Clarinet.test({
  name: 'Verify get-mint-price-string (Clarity 4)',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    // Call get-mint-price-string
    const priceString = chain.callReadOnlyFn(
      'nft-collection',
      'get-mint-price-string',
      [],
      wallet1.address
    );

    // Should return price as string
    priceString.result.expectAscii('1000000');
  },
});

Clarinet.test({
  name: 'Verify that owner can update mint price',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const newPrice = 2000000; // 2 STX

    const block = chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'set-mint-price',
        [types.uint(newPrice)],
        deployer.address
      ),
    ]);

    // Should succeed
    block.receipts[0].result.expectOk().expectBool(true);

    // Verify new price
    const priceString = chain.callReadOnlyFn(
      'nft-collection',
      'get-mint-price-string',
      [],
      deployer.address
    );

    priceString.result.expectAscii(newPrice.toString());
  },
});

Clarinet.test({
  name: 'Verify that non-owner cannot update mint price',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    const block = chain.mineBlock([
      Tx.contractCall(
        'nft-collection',
        'set-mint-price',
        [types.uint(2000000)],
        wallet1.address // Not owner
      ),
    ]);

    // Should fail with err u100 (owner only)
    block.receipts[0].result.expectErr().expectUint(100);
  },
});
