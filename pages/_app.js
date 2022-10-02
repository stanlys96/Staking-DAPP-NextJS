import { Mainnet, DAppProvider, Goerli } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import '../styles/globals.css';

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const GOERLI_INFURA = process.env.NEXT_PUBLIC_GOERLI_INFURA;

function MyApp({ Component, pageProps }) {
  return (
    <DAppProvider
      config={{
        // supportedChains: [ChainId.Goerli, ChainId.Mainnet, ChainId.Kovan],
        readOnlyChainId: Mainnet.chainId,
        readOnlyUrls: {
          [Mainnet.chainId]: getDefaultProvider('mainnet'),
          [Goerli.chainId]: GOERLI_INFURA,
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
