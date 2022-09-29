import styles from '../styles/Home.module.css';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';

export default function Header() {
  const { account, activateBrowserWallet, deactivate, chainId } = useEthers();

  console.log(chainId, '<<<');

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
        {!account && (
          <button
            onClick={async () => {
              activateBrowserWallet();
              if (typeof window !== 'undefined') {
                window.localStorage.setItem('connected', 'injected');
              }
            }}
            className={styles.selectWalletBtn}
          >
            Connect Metamask
          </button>
        )}
        {account && (
          <div
            className={styles.metamaskIconContainer}
            onClick={async () => {
              deactivate();
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem('connected');
              }
            }}
          >
            <Icon icon="logos:metamask-icon" />
          </div>
        )}
        {account && (
          <div className={styles.accountContainer}>
            {account.slice(0, 6)}...
            {account.slice(account.length - 4)}
          </div>
        )}
      </div>
    </div>
  );
}
