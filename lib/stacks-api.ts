/**
 * Stacks Blockchain API Client
 *
 * Provides functions to interact with Stacks blockchain via the Stacks API.
 * Documentation: https://docs.hiro.so/api
 */

export interface StacksApiConfig {
  network: "mainnet" | "testnet";
  apiUrl?: string;
}

export interface AccountBalance {
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
    locked: string;
  };
  fungible_tokens: Record<string, any>;
  non_fungible_tokens: Record<string, any>;
}

export interface Transaction {
  tx_id: string;
  tx_status: "success" | "pending" | "failed" | "abort_by_response" | "abort_by_post_condition";
  tx_type: string;
  fee_rate: string;
  sender_address: string;
  nonce: number;
  block_height?: number;
  burn_block_time?: number;
  canonical: boolean;
}

export interface ContractInterface {
  functions: Array<{
    name: string;
    access: string;
    args: Array<{
      name: string;
      type: string;
    }>;
    outputs: {
      type: string;
    };
  }>;
  variables: Array<any>;
  maps: Array<any>;
  fungible_tokens: Array<any>;
  non_fungible_tokens: Array<any>;
}

export class StacksApi {
  private config: StacksApiConfig;
  private baseUrl: string;

  constructor(config: StacksApiConfig) {
    this.config = config;
    this.baseUrl =
      config.apiUrl ||
      (config.network === "mainnet"
        ? "https://stacks-node-api.mainnet.stacks.co"
        : "https://stacks-node-api.testnet.stacks.co");
  }

  /**
   * Fetch account balance
   */
  async getAccountBalance(address: string): Promise<AccountBalance> {
    const response = await fetch(`${this.baseUrl}/extended/v1/address/${address}/balances`);

    if (!response.ok) {
      throw new Error(`Failed to fetch account balance: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch account transactions
   */
  async getAccountTransactions(
    address: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ results: Transaction[] }> {
    const response = await fetch(
      `${this.baseUrl}/extended/v1/address/${address}/transactions?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch transaction by ID
   */
  async getTransaction(txId: string): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/extended/v1/tx/${txId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch contract interface
   */
  async getContractInterface(
    contractAddress: string,
    contractName: string
  ): Promise<ContractInterface> {
    const response = await fetch(
      `${this.baseUrl}/v2/contracts/interface/${contractAddress}/${contractName}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch contract interface: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Call read-only contract function
   */
  async callReadOnlyFunction(
    contractAddress: string,
    contractName: string,
    functionName: string,
    functionArgs: string[],
    sender?: string
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: sender || contractAddress,
          arguments: functionArgs,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to call read-only function: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch blockchain info
   */
  async getBlockchainInfo(): Promise<{
    stacks_tip_height: number;
    stacks_tip: string;
    stacks_tip_consensus_hash: string;
    unanchored_tip: string;
    exit_at_block_height: number | null;
  }> {
    const response = await fetch(`${this.baseUrl}/v2/info`);

    if (!response.ok) {
      throw new Error(`Failed to fetch blockchain info: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch current STX price
   */
  async getStxPrice(): Promise<{ usd: number; btc: number }> {
    try {
      // Using CoinGecko API as an example
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd,btc"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch STX price");
      }

      const data = await response.json();
      return {
        usd: data.blockstack?.usd || 0,
        btc: data.blockstack?.btc || 0,
      };
    } catch (error) {
      console.error("Error fetching STX price:", error);
      return { usd: 0, btc: 0 };
    }
  }

  /**
   * Fetch NFT holdings for an address
   */
  async getNFTHoldings(
    address: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    total: number;
    results: Array<{
      asset_identifier: string;
      value: {
        hex: string;
        repr: string;
      };
      block_height: number;
      tx_id: string;
    }>;
  }> {
    const response = await fetch(
      `${this.baseUrl}/extended/v1/tokens/nft/holdings?principal=${address}&limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch NFT holdings: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Broadcast a transaction
   */
  async broadcastTransaction(txHex: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v2/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: txHex,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to broadcast transaction: ${error}`);
    }

    return response.text();
  }
}

// Export singleton instances for each network
export const stacksMainnetApi = new StacksApi({ network: "mainnet" });
export const stacksTestnetApi = new StacksApi({ network: "testnet" });

/**
 * Get API instance for current network
 */
export function getStacksApi(network: "mainnet" | "testnet" = "testnet"): StacksApi {
  return network === "mainnet" ? stacksMainnetApi : stacksTestnetApi;
}
