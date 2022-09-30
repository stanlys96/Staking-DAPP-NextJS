import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  useTokenBalance,
  useEthers,
  ChainId,
  useNotifications,
  useCall,
} from '@usedapp/core';
import { formatUnits } from '@ethersproject/units';
import TokenFarm from '../chain-info/contracts/TokenFarm.json';
import ERC20 from '../chain-info/contracts/MockERC20.json';
import { Contract } from '@ethersproject/contracts';
import networkMapping from '../networkMapping.json';
import { constants, utils } from 'ethers';
import { useStakeTokens, useStakedBalance, useUnstakeTokens } from '../hooks';
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

// const override = {
//   display: 'block',
//   margin: '0 auto',
//   borderColor: '#ffffff',
// };

export default function StakingCard({
  imgUrl,
  stakeTitle,
  token,
  tokenAddress,
}) {
  const { chainId, error, account } = useEthers();
  const { notifications } = useNotifications();
  const [amount, setAmount] = useState(0);
  const [stakedValue, setStakedValue] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const tokenBalance = useTokenBalance(
    tokenAddress,
    account ? account : constants.AddressZero,
    { chainId: 5 }
  );
  const formattedTokenBalance = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;
  const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(
    tokenAddress,
    setIsStaking
  );

  const { unstakeTokens, unstakeState } = useUnstakeTokens(tokenAddress);

  const isMining = approveAndStakeErc20State.status === 'Mining';
  const isUnstakeMining = unstakeState.status === 'Mining';

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
  const handleCloseSnack = () => {
    setShowErc20ApprovalSuccess(false);
    setShowStakeTokenSuccess(false);
  };

  const result = useStakedBalance(tokenAddress);
  const formattedStakedBalance = stakedValue
    ? parseFloat(formatUnits(stakedValue, 18))
    : 0;

  useEffect(() => {
    if (result) {
      if (result.value) {
        if (result.value.length > 0) {
          setStakedValue(result.value[0].toString());
        }
      }
    }
  }, [result]);

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
              {formattedTokenBalance} {token}
            </p>
            {/* <p className={styles.stakeValue}>$2500 US</p> */}
          </div>
          <div className={styles.stakingDescription}>
            <p className={styles.stakeSubtitle}>STAKED</p>
            <p className={styles.stakeValue}>
              {formattedStakedBalance} {token}
            </p>
            {/* <p className={styles.stakeValue}>$0 US</p> */}
          </div>
        </div>
        <div className={styles.stakeBtnContainer}>
          <button
            onClick={() => {
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
                  if (value === '') {
                    return 'Cannot be empty or zero!';
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
          <button onClick={handleUnstakeSubmit} className={styles.stakeBtn}>
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
            <p className={styles.earnedValue}>0 {token}</p>
            {/* <p className={styles.earnedValue}>$0 US</p> */}
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
