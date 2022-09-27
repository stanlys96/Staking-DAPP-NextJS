import styles from '../styles/Home.module.css';
import Header from './Header';
import StakingCard from './StakingCard';

export default function Content() {
  return (
    <div className={styles.contentContainer}>
      <Header />
      <div className={styles.stakingContainer}>
        <StakingCard
          imgUrl="/dapp.png"
          stakeTitle="DAPP Staking"
          token="DAPP"
        />
        <StakingCard imgUrl="/eth.png" stakeTitle="ETH Staking" token="ETH" />
        <StakingCard imgUrl="/dai.png" stakeTitle="DAI Staking" token="DAI" />
      </div>
    </div>
  );
}
