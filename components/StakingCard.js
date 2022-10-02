import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTokenBalance, useEthers, useNotifications } from '@usedapp/core';
import { formatUnits } from '@ethersproject/units';
import { constants, utils } from 'ethers';
import {
  useStakeTokens,
  useStakedBalance,
  useUnstakeTokens,
  useGetTokenValue,
  useWithdrawReward,
  useStakingReward,
} from '../hooks';
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

export default function StakingCard({
  imgUrl,
  stakeTitle,
  token,
  tokenAddress,
  dappTokenValue,
}) {
  const { chainId, error, account } = useEthers();
  const { notifications } = useNotifications();
  const [amount, setAmount] = useState(0);
  const [stakedValue, setStakedValue] = useState(0);

  const [valueInUsd, setValueInUsd] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isWithdrawReward, setIsWithdrawReward] = useState(false);
  const [rewardValue, setRewardValue] = useState(0);

  const tokenBalance = useTokenBalance(
    tokenAddress,
    account ? account : constants.AddressZero,
    { chainId }
  );
  const formattedTokenBalance = !account
    ? 0
    : tokenBalance
    ? Math.floor(formatUnits(tokenBalance, 18) * 10000) / 10000
    : 0;

  const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(
    tokenAddress,
    setIsStaking
  );

  const { send: unstakeTokens, state: unstakeState } =
    useUnstakeTokens(tokenAddress);

  const { send: withdrawReward, state: withdrawRewardState } =
    useWithdrawReward();

  const isMining = approveAndStakeErc20State.status === 'Mining';
  const isUnstakeMining = unstakeState.status === 'Mining';
  const isWithdrawRewardMining = withdrawRewardState.status === 'Mining';

  const tokenValueResult = useGetTokenValue(tokenAddress);
  const stakingRewardResult = useStakingReward(tokenAddress);

  const handleInputChange = (event) => {
    const newAmount =
      event.target.value === '' ? '' : parseInt(event.target.value);
    setAmount(newAmount);
  };

  const handleStakeSubmit = async () => {
    setIsStaking(true);
    const amountAsWei = utils.parseEther('1');
    await approveAndStake(amountAsWei.toString());
    setIsStaking(false);
  };

  const handleUnstakeSubmit = async () => {
    setIsUnstaking(true);
    await unstakeTokens();
    setIsUnstaking(false);
  };

  const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] =
    useState(false);
  const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false);
  const [showUnstakeTokenSuccess, setShowUnstakeTokenSuccess] = useState(false);
  const [showWithdrawRewardSuccess, setShowWithdrawRewardSuccess] =
    useState(false);

  const handleCloseSnack = () => {
    setShowErc20ApprovalSuccess(false);
    setShowStakeTokenSuccess(false);
    setShowUnstakeTokenSuccess(false);
    setShowDepositETHSuccess(false);
    setShowWithdrawRewardSuccess(false);
  };

  const result = useStakedBalance(tokenAddress);
  const formattedStakedBalance = !account
    ? 0
    : stakedValue
    ? Math.floor(formatUnits(stakedValue, 18) * 10000) / 10000
    : 0;

  useEffect(() => {
    if (result) {
      if (result.value) {
        if (result.value.length > 0) {
          setStakedValue(result.value[0].toString());
        } else {
          setStakedValue(0);
        }
      } else {
        setStakedValue(0);
      }
    } else {
      setStakedValue(0);
    }
  }, [result]);

  useEffect(() => {
    if (tokenValueResult) {
      if (tokenValueResult.value) {
        if (tokenValueResult.value.length > 0) {
          const price = parseFloat(
            tokenValueResult.value[0].toString()
          ).toFixed(2);
          const decimals = parseFloat(
            tokenValueResult.value[1].toString()
          ).toFixed(2);
          const thePrice = price / 10 ** decimals;
          setValueInUsd(thePrice);
        } else {
          setValueInUsd(0);
        }
      } else {
        setValueInUsd(0);
      }
    } else {
      setValueInUsd(0);
    }
  }, [tokenValueResult]);

  useEffect(() => {
    if (stakingRewardResult) {
      if (stakingRewardResult.value) {
        if (stakingRewardResult.value.length > 0) {
          const reward =
            Math.floor(
              formatUnits(stakingRewardResult.value[0].toString(), 18) * 10000
            ) / 10000;
          setRewardValue(reward);
        } else {
          setRewardValue(0);
        }
      } else {
        setRewardValue(0);
      }
    } else {
      setRewardValue(0);
    }
  }, [stakingRewardResult]);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Approve ERC20 transfer'
      ).length > 0
    ) {
      Toast.fire({
        icon: 'success',
        title: 'Approved successfully! Now on to the 2nd tx!',
      });
      setShowErc20ApprovalSuccess(true);
      setShowStakeTokenSuccess(false);
    }

    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Stake Tokens'
      ).length > 0
    ) {
      Toast.fire({
        icon: 'success',
        title: 'Tokens staked successfully!',
      });
      setShowErc20ApprovalSuccess(false);
      setShowStakeTokenSuccess(true);
    }
  }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess]);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Unstake Tokens'
      ).length > 0
    ) {
      Toast.fire({
        icon: 'success',
        title: 'Unstake success!',
      });
    }
  }, [notifications, showUnstakeTokenSuccess]);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Withdraw Reward'
      ).length > 0
    ) {
      Toast.fire({
        icon: 'success',
        title: 'Withdraw reward success!',
      });
    }
  }, [notifications, showWithdrawRewardSuccess]);

  return (
    <div className={styles.stakingCard}>
      <div className={styles.stakingHeader}>
        <div className={styles.stakingImgContainer}>
          <Image
            loader={() => imgUrl}
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
            <p className={styles.stakeValue}>
              {formattedTokenBalance.toFixed(4)} {token}
            </p>
            <p className={styles.stakeValue}>
              ${(valueInUsd * formattedTokenBalance).toFixed(4)} US
            </p>
          </div>
          <div className={styles.stakingDescription}>
            <p className={styles.stakeSubtitle}>STAKED</p>
            <p className={styles.stakeValue}>
              {formattedStakedBalance.toFixed(4)} {token}
            </p>
            <p className={styles.stakeValue}>
              ${(valueInUsd * formattedStakedBalance).toFixed(4)} US
            </p>
          </div>
        </div>
        <div className={styles.stakeBtnContainer}>
          <button
            onClick={() => {
              if (!account) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'No account connected!',
                  scrollbarPadding: 0,
                });
                return;
              }
              if (chainId !== 5) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Please connect to Goerli network!',
                  scrollbarPadding: 0,
                });
                return;
              }
              Swal.fire({
                title: 'Input stake amount',
                input: 'number',
                inputAttributes: { step: 1 },
                inputLabel: 'Stake amount',
                inputPlaceholder: 'Enter your stake amount',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                scrollbarPadding: 0,
                inputValidator: (value) => {
                  if (value.startsWith('.')) {
                    return 'Invalid input!';
                  }
                  if (value === '' || parseFloat(value) <= 0) {
                    return 'Cannot be empty or zero!';
                  }
                  if (parseFloat(value) > formattedTokenBalance) {
                    return `You don't have that much ${token}`;
                  }
                },
                preConfirm: async (stakeAmount) => {
                  setIsStaking(true);
                  const amountAsWei = utils.parseEther(stakeAmount);
                  return approveAndStake(amountAsWei.toString());
                },
              }).then(async (result) => {
                setIsStaking(false);
                console.log(result);
              });
            }}
            className={styles.stakeBtn}
          >
            {isMining ? (
              <BeatLoader
                className={styles.chainErrorLoading}
                color="#36d7b7"
              />
            ) : isStaking ? (
              <ClipLoader
                color="#36d7b7"
                loading={true}
                // cssOverride={override}
                size={20}
                speedMultiplier={1}
              />
            ) : (
              'Stake'
            )}
          </button>
          <button
            onClick={() => {
              if (!account) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'No account connected!',
                  scrollbarPadding: 0,
                });
                return;
              }
              if (chainId !== 5) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Please connect to Goerli network!',
                  scrollbarPadding: 0,
                });
                return;
              }
              Swal.fire({
                title: 'Input unstake amount',
                input: 'number',
                inputAttributes: { step: 1 },
                inputLabel: 'Unstake amount',
                inputPlaceholder: 'Enter your unstake amount',
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
                  if (parseFloat(value) > parseFloat(formattedStakedBalance)) {
                    return "You don't have that much staked!";
                  }
                },
                preConfirm: async (stakeAmount) => {
                  setIsUnstaking(true);
                  const amountAsWei = utils.parseEther(stakeAmount);
                  return unstakeTokens(tokenAddress, amountAsWei.toString());
                },
              }).then(async (result) => {
                setIsUnstaking(false);
                console.log(result);
              });
            }}
            className={styles.stakeBtn}
          >
            {isUnstakeMining ? (
              <BeatLoader
                className={styles.chainErrorLoading}
                color="#36d7b7"
              />
            ) : isUnstaking ? (
              <ClipLoader
                color="#36d7b7"
                loading={true}
                // cssOverride={override}
                size={20}
                speedMultiplier={1}
              />
            ) : (
              'Unstake'
            )}
          </button>
        </div>
      </div>
      <div className={styles.stakingFooter}>
        <div>
          <div className={styles.stakingFooterDescription}>
            <p className={styles.stakeSubtitle}>Earned</p>
            <p className={styles.earnedValue}>{rewardValue.toFixed(4)} DAPP</p>
            <p className={styles.earnedValue}>
              ${(dappTokenValue * rewardValue).toFixed(4)} US
            </p>
          </div>
        </div>
        <div className={styles.withdrawBtnContainer}>
          <button
            onClick={async () => {
              if (!account) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'No account connected!',
                  scrollbarPadding: 0,
                });
                return;
              }
              if (chainId !== 5) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Please connect to Goerli network!',
                  scrollbarPadding: 0,
                });
                return;
              }
              if (parseFloat(rewardValue) <= 0) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: "You don't have any reward to withdraw!",
                  scrollbarPadding: 0,
                });
                return;
              }
              setIsWithdrawReward(true);
              await withdrawReward(tokenAddress);
              setIsWithdrawReward(false);
            }}
            className={styles.withdrawBtn}
          >
            {isWithdrawRewardMining ? (
              <BeatLoader
                className={styles.chainErrorLoading}
                color="#36d7b7"
              />
            ) : isWithdrawReward ? (
              <ClipLoader
                color="#36d7b7"
                loading={true}
                // cssOverride={override}
                size={20}
                speedMultiplier={1}
              />
            ) : (
              'Withdraw'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
