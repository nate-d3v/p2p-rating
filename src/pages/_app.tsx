import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import {
	EthereumClient,
	modalConnectors,
	walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const chains = [mainnet];
const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_PROJECT_ID;

const { provider } = configureChains(chains, [
	walletConnectProvider({ projectId: projectId! }),
]);
const wagmiClient = createClient({
	autoConnect: true,
	connectors: modalConnectors({ appName: 'web3Modal', chains }),
	provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<WagmiConfig client={wagmiClient}>
				<Component {...pageProps} />
			</WagmiConfig>
			<Web3Modal
				projectId={projectId}
				ethereumClient={ethereumClient}
				themeColor={'blackWhite'}
			/>
		</>
	);
}
