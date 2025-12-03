import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { avalancheFuji } from "wagmi/chains";

export function useNetworkCheck() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isCorrectNetwork = chainId === avalancheFuji.id;
  const needsNetworkSwitch = isConnected && !isCorrectNetwork;

  const switchToAvalanche = () => {
    if (switchChain) {
      switchChain({ chainId: avalancheFuji.id });
    }
  };

  return {
    isCorrectNetwork,
    needsNetworkSwitch,
    currentChainId: chainId,
    targetChainId: avalancheFuji.id,
    targetChainName: avalancheFuji.name,
    switchToAvalanche,
    isSwitching,
  };
}
