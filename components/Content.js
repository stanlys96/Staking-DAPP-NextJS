import styles from '../styles/Home.module.css';
import Header from './Header';
import StakingCard from './StakingCard';
import { constants, utils } from 'ethers';
import networkMapping from '../networkMapping.json';
import networkConfig from '../networkConfig.json';
import { useEthers, useNotifications } from '@usedapp/core';
import { useDepositETH, useWithdrawETH } from '../hooks';
import { useEffect, useState } from 'react';
import { ClipLoader, BeatLoader } from 'react-spinners';
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

export default function Content() {
  const { chainId, account } = useEthers();
  const [showDepositETHSuccess, setShowDepositETHSuccess] = useState(false);
  const [showWithdrawETHSuccess, setShowWithdrawETHSuccess] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { notifications } = useNotifications();

  // const chainString = chainId ? parseInt(chainId, 16).toString() : '31337';
  const chainString = chainId ? chainId.toString() : '31337';
  const dappTokenAddress = chainId
    ? networkMapping['5']['DappToken'][
        networkMapping['5']['DappToken'].length - 1
      ]
    : constants.AddressZero;
  const wethTokenAddress = chainId
    ? networkConfig['5']['weth']
    : constants.AddressZero;
  const daiTokenAddress = chainId
    ? networkConfig['5']['dai']
    : constants.AddressZero;

  const { send: depositETH, state: depositETHState } = useDepositETH();
  const { send: withdrawETH, state: withdrawETHState } = useWithdrawETH();

  const isDepositETHMining = depositETHState.status === 'Mining';
  const isWithdrawETHMining = withdrawETHState.status === 'Mining';

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Deposit ETH'
      ).length > 0
    ) {
      Toast.fire({
        icon: 'success',
        title: 'ETH deposited!',
      });
    }
  }, [notifications, showDepositETHSuccess]);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Withdraw ETH'
      ).length > 0
    ) {
      Toast.fire({
        icon: 'success',
        title: 'ETH withdrawn!',
      });
    }
  }, [notifications, showWithdrawETHSuccess]);

  return (
    <div className={styles.contentContainer}>
      <Header />
      <div className={styles.depositWithdrawContainer}>
        <button
          onClick={() => {
            if (!account) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No account connected!',
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
            Swal.fire({
              title: 'Input deposit amount',
              input: 'number',
              inputAttributes: { step: 1 },
              inputLabel: 'Deposit amount',
              inputPlaceholder: 'Enter your deposit amount',
              showCancelButton: true,
              showLoaderOnConfirm: true,
              allowOutsideClick: false,
              scrollbarPadding: 0,
              inputValidator: (value) => {
                if (value.startsWith('.')) {
                  return 'Invalid input!';
                }
                if (value === '' || parseFloat(value) === 0) {
                  return 'Cannot be empty or zero!';
                }
              },
              preConfirm: async (depositAmount) => {
                setIsDepositing(true);
                const amountAsWei = utils.parseEther(depositAmount);
                return depositETH({ value: amountAsWei.toString() });
              },
            }).then(async (result) => {
              setIsDepositing(false);
              console.log(result);
            });
          }}
          className={styles.depositEthBtn}
        >
          {isDepositETHMining ? (
            <BeatLoader className={styles.chainErrorLoading} color="#36d7b7" />
          ) : isDepositing ? (
            <ClipLoader
              color="#36d7b7"
              loading={true}
              // cssOverride={override}
              size={20}
              speedMultiplier={1}
            />
          ) : (
            'Deposit ETH for WETH'
          )}
        </button>
        <button
          onClick={() => {
            if (!account) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No account connected!',
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
            Swal.fire({
              title: 'Input withdraw amount',
              input: 'number',
              inputAttributes: { step: 1 },
              inputLabel: 'Withdraw amount',
              inputPlaceholder: 'Enter your withdraw amount',
              showCancelButton: true,
              showLoaderOnConfirm: true,
              allowOutsideClick: false,
              scrollbarPadding: 0,
              inputValidator: (value) => {
                if (value.startsWith('.')) {
                  return 'Invalid input!';
                }
                if (value === '' || parseFloat(value) === 0) {
                  return 'Cannot be empty or zero!';
                }
              },
              preConfirm: async (withdrawAmount) => {
                setIsWithdrawing(true);
                const amountAsWei = utils.parseEther(withdrawAmount);
                return withdrawETH(amountAsWei);
              },
            }).then(async (result) => {
              setIsWithdrawing(false);
              console.log(result);
            });
          }}
          className={styles.withdrawEthBtn}
        >
          {isWithdrawETHMining ? (
            <BeatLoader className={styles.chainErrorLoading} color="#36d7b7" />
          ) : isWithdrawing ? (
            <ClipLoader
              color="#36d7b7"
              loading={true}
              // cssOverride={override}
              size={20}
              speedMultiplier={1}
            />
          ) : (
            'Withdraw ETH'
          )}
        </button>
      </div>
      <div className={styles.stakingContainer}>
        <StakingCard
          imgUrl="/dapp.png"
          stakeTitle="DAPP Staking"
          token="DAPP"
          tokenAddress={dappTokenAddress}
        />
        <StakingCard
          imgUrl="/eth.png"
          stakeTitle="WETH Staking"
          token="WETH"
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
