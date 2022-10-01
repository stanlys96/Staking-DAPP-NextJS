import styles from '../styles/Home.module.css';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useEthers, useNotifications } from '@usedapp/core';
import { useGet10Dapp } from '../hooks';
import { ClipLoader, BeatLoader } from 'react-spinners';
import { useGetUserTotalValue } from '../hooks';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export default function Header() {
  const { account, activateBrowserWallet, deactivate, chainId } = useEthers();
  const { notifications } = useNotifications();

  const { send: get10DappSend, state: get10DappState } = useGet10Dapp();

  const isGet10DappMining = get10DappState.status === 'Mining';

  const [showGet10DappSuccess, setShowGet10DappSuccess] = useState(false);
  const [isGet10Dapp, setIsGet10Dapp] = useState(false);

  const [userTotalValue, setUserTotalValue] = useState(0);

  const handleGet10DappSubmit = async () => {
    if (!account) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No account connected yet!',
      });
      return;
    }
    if (chainId !== 5) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please connect to Goerli network!',
      });
      return;
    }
    setIsGet10Dapp(true);
    await get10DappSend();
    setIsGet10Dapp(false);
    if (get10DappState.errorMessage === 'execution reverted') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have used your 10 DAPP quota for the day!',
      });
      return;
    }
  };

  const userTotalValueResult = useGetUserTotalValue();

  useEffect(() => {
    if (userTotalValueResult) {
      if (userTotalValueResult.value) {
        if (userTotalValueResult.value.length > 0) {
          setUserTotalValue(userTotalValueResult.value[0].toString());
        } else {
          setUserTotalValue(0);
        }
      } else {
        setUserTotalValue(0);
      }
    } else {
      setUserTotalValue(0);
    }
  }, [userTotalValueResult]);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Get 10 DAPP Token'
      ).length > 0
    ) {
      Toast.fire({
        icon: 'success',
        title: 'Got 10 DAPP!',
      });
    }
  }, [notifications, showGet10DappSuccess]);

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <div>
          <span className={styles.portfolio}>Portfolio</span>
        </div>
        <div className={styles.totalBalanceContainer}>
          <span className={styles.totalBalanceText}>Total balance</span>
          <div className={styles.verticalRule}></div>
          <span className={styles.totalBalanceValue}>
            ${(userTotalValue / 10 ** 18).toFixed(2)}
          </span>
          {/* <span className={styles.totalBalancePercent}>+0%</span> */}
        </div>
      </div>
      <div>
        <button
          onClick={handleGet10DappSubmit}
          className={styles.selectWalletBtn}
        >
          {isGet10DappMining ? (
            <BeatLoader className={styles.chainErrorLoading} color="#36d7b7" />
          ) : isGet10Dapp ? (
            <ClipLoader
              color="#36d7b7"
              loading={true}
              // cssOverride={override}
              size={20}
              speedMultiplier={1}
            />
          ) : (
            'Get 10 DAPP (Once per day)'
          )}
        </button>
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
