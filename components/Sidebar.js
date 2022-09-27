import styles from '../styles/Home.module.css';
import { FiMenu } from 'react-icons/fi';
import { FaMoneyBillAlt } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.stakedLogoContainer}>
        <FiMenu className={styles.hambMenu} />
        <span className={styles.stakedLogo}>STAKED</span>
      </div>
      <div className={styles.menusContainer}>
        <div className={styles.menuOptionContainer}>
          <FaMoneyBillAlt />
          <span className={styles.menuText}>Deposit & Earn</span>
        </div>
      </div>
    </div>
  );
}
