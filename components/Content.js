import styles from '../styles/Home.module.css';
import Header from './Header';
import StakingCard from './StakingCard';
import { constants } from 'ethers';
import networkMapping from '../networkMapping.json';
import networkConfig from '../networkConfig.json';
import { useEthers } from '@usedapp/core';

export default function Content() {
  const { chainId } = useEthers();

  // const chainString = chainId ? parseInt(chainId, 16).toString() : '31337';
  const chainString = chainId ? chainId.toString() : '31337';
  const dappTokenAddress = chainId
    ? networkMapping[chainString]['DappToken'][
        networkMapping[chainString]['DappToken'].length - 1
      ]
    : constants.AddressZero;
  const wethTokenAddress = chainId
    ? networkConfig[chainString]['weth']
    : constants.AddressZero;
  const daiTokenAddress = chainId
    ? networkConfig[chainString]['weth']
    : constants.AddressZero;

  return (
    <div className={styles.contentContainer}>
      <Header />
      <div className={styles.stakingContainer}>
        <StakingCard
          imgUrl="/dapp.png"
          stakeTitle="DAPP Staking"
          token="DAPP"
          tokenAddress={dappTokenAddress}
        />
        <StakingCard
          imgUrl="/eth.png"
          stakeTitle="ETH Staking"
          token="ETH"
          tokenAddress={wethTokenAddress}
        />
        <StakingCard
          imgUrl="/dai.png"
          stakeTitle="DAI Staking"
          token="DAI"
          tokenAddress={daiTokenAddress}
        />
      </div>
    </div>
  );
}
