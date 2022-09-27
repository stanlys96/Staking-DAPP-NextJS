import styles from '../styles/Home.module.css';
import Image from 'next/image';

export default function StakingCard({ imgUrl, stakeTitle, token }) {
  return (
    <div className={styles.stakingCard}>
      <div className={styles.stakingHeader}>
        <div className={styles.stakingImgContainer}>
          <Image
            // loader={() => imageUrl}
            className={styles.stakingImg}
            src={imgUrl}
            layout="fill"
          />
        </div>
        <p className={styles.stakingTitle}>{stakeTitle}</p>
      </div>
      <div className={styles.stakingBodyContainer}>
        <div>
          <div className={styles.stakingDescription}>
            <p className={styles.stakeSubtitle}>Available to STAKE</p>
            <p className={styles.stakeValue}>1000 {token}</p>
            <p className={styles.stakeValue}>$2500 US</p>
          </div>
          <div className={styles.stakingDescription}>
            <p className={styles.stakeSubtitle}>STAKED</p>
            <p className={styles.stakeValue}>30000 {token}</p>
            <p className={styles.stakeValue}>$4000 US</p>
          </div>
        </div>
        <div className={styles.stakeBtnContainer}>
          <button className={styles.stakeBtn}>Stake</button>
          <button className={styles.stakeBtn}>Unstake</button>
        </div>
      </div>
      <div className={styles.stakingFooter}>
        <div>
          <div className={styles.stakingFooterDescription}>
            <p className={styles.stakeSubtitle}>Earned</p>
            <p className={styles.earnedValue}>100 {token}</p>
            <p className={styles.earnedValue}>$500 US</p>
          </div>
        </div>
        <div className={styles.withdrawBtnContainer}>
          <button className={styles.withdrawBtn}>Withdraw</button>
        </div>
      </div>
    </div>
  );
}

function StakingDescription({ title, value, buttonTitle }) {
  return (
    <div className={styles.stakingDescription}>
      <div>
        <div>
          <p className={styles.stakeSubtitle}>{title}</p>
          <p className={styles.stakeValue}>{value}</p>
        </div>
      </div>
      <div>
        <button className={styles.stakeBtn}>{buttonTitle}</button>
      </div>
    </div>
  );
}
