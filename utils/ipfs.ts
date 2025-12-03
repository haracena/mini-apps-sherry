/**
 * IPFS Gateway utilities with fallback support
 */

// List of IPFS gateways to try in order
const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://dweb.link/ipfs/",
];

/**
 * Convert ipfs:// URI to HTTP gateway URL
 */
export function ipfsToHttp(ipfsUri: string, gatewayIndex: number = 0): string {
  if (!ipfsUri.startsWith("ipfs://")) {
    return ipfsUri;
  }

  const hash = ipfsUri.replace("ipfs://", "");
  return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
}

/**
 * Fetch from IPFS with automatic gateway fallback
 * Tries each gateway in sequence until one succeeds
 */
export async function fetchFromIPFS<T = any>(
  ipfsUri: string,
  options?: RequestInit
): Promise<T> {
  const hash = ipfsUri.replace("ipfs://", "");
  let lastError: Error | null = null;

  // Try each gateway in sequence
  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    const gatewayUrl = `${IPFS_GATEWAYS[i]}${hash}`;

    try {
      console.log(`Attempting to fetch from gateway ${i + 1}/${IPFS_GATEWAYS.length}: ${IPFS_GATEWAYS[i]}`);

      const response = await fetch(gatewayUrl, {
        ...options,
        // Add timeout to avoid hanging on slow gateways
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Gateway returned ${response.status}`);
      }

      const data = await response.json();
      console.log(`Successfully fetched from gateway: ${IPFS_GATEWAYS[i]}`);
      return data;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Gateway ${IPFS_GATEWAYS[i]} failed:`, error);

      // If not the last gateway, continue to next
      if (i < IPFS_GATEWAYS.length - 1) {
        console.log(`Trying next gateway...`);
        continue;
      }
    }
  }

  // All gateways failed
  throw new Error(
    `Failed to fetch from IPFS after trying ${IPFS_GATEWAYS.length} gateways. Last error: ${lastError?.message}`
  );
}

/**
 * Fetch image from IPFS with gateway fallback
 * Returns the successful gateway URL for image src
 */
export async function getIPFSImageUrl(ipfsUri: string): Promise<string> {
  const hash = ipfsUri.replace("ipfs://", "");
  let lastError: Error | null = null;

  // Try each gateway
  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    const gatewayUrl = `${IPFS_GATEWAYS[i]}${hash}`;

    try {
      // Test if image is accessible with a HEAD request
      const response = await fetch(gatewayUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        console.log(`Image accessible from gateway: ${IPFS_GATEWAYS[i]}`);
        return gatewayUrl;
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`Gateway ${IPFS_GATEWAYS[i]} failed for image:`, error);
      continue;
    }
  }

  // All gateways failed, return first gateway URL as fallback
  console.warn("All gateways failed, using default gateway");
  return `${IPFS_GATEWAYS[0]}${hash}`;
}

/**
 * Get all available gateway URLs for an IPFS hash
 */
export function getAllGatewayUrls(ipfsUri: string): string[] {
  const hash = ipfsUri.replace("ipfs://", "");
  return IPFS_GATEWAYS.map(gateway => `${gateway}${hash}`);
}
