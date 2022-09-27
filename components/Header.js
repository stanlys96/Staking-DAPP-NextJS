import styles from '../styles/Home.module.css';
import { Icon } from '@iconify/react';

export default function Header() {
  return (
    <div className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <div>
          <span className={styles.portfolio}>Portfolio</span>
        </div>
        <div className={styles.totalBalanceContainer}>
          <span className={styles.totalBalanceText}>Total balance</span>
          <div className={styles.verticalRule}></div>
          <span className={styles.totalBalanceValue}>$0</span>
          <span className={styles.totalBalancePercent}>+0%</span>
        </div>
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.metamaskIconContainer}>
          <Icon icon="logos:metamask-icon" />
        </div>
        <div className={styles.accountContainer}>0x7C28...f995</div>
      </div>
    </div>
  );
}
