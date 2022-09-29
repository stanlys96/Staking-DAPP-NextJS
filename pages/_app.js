import {
  Mainnet,
  DAppProvider,
  useEtherBalance,
  useEthers,
  Config,
  Goerli,
  ChainId,
} from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import '../styles/globals.css';

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

function MyApp({ Component, pageProps }) {
  return (
    <DAppProvider
      config={{
        // supportedChains: [ChainId.Goerli, ChainId.Mainnet, ChainId.Kovan],
        // networks: [ChainId.Goerli, ChainId.Mainnet, ChainId.Kovan],
        readOnlyChainId: Mainnet.chainId,
        readOnlyUrls: {
          [Goerli.chainId]:
            'https://goerli.infura.io/v3/a07dbe8633554155950984b799b6aecf',
          [Mainnet.chainId]: getDefaultProvider('mainnet'),
        },
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000,
        },
      }}
    >
      <Component {...pageProps} />
    </DAppProvider>
  );
}

export default MyApp;
