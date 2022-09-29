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
  const tokenBalance = useTokenBalance(
    tokenAddress,
    account ? account : constants.AddressZero,
    { chainId: 5 }
  );
  const formattedTokenBalance = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;
  const { approveAndStake, state: approveAndStakeErc20State } =
    useStakeTokens(tokenAddress);

  const { unstakeTokens, unstakeState } = useUnstakeTokens(tokenAddress);

  const isMining = approveAndStakeErc20State.status === 'Mining';

  const handleInputChange = (event) => {
    const newAmount =
      event.target.value === '' ? '' : parseInt(event.target.value);
    setAmount(newAmount);
  };

  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther('1');
    return approveAndStake(amountAsWei.toString());
  };

  const handleUnstakeSubmit = () => {
    return unstakeTokens();
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
      console.log(result.value[0].toString(), '<<<<');
      setStakedValue(result.value[0].toString());
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
            <p className={styles.stakeValue}>$2500 US</p>
          </div>
          <div className={styles.stakingDescription}>
            <p className={styles.stakeSubtitle}>STAKED</p>
            <p className={styles.stakeValue}>
              {formattedStakedBalance} {token}
            </p>
            <p className={styles.stakeValue}>$0 US</p>
          </div>
        </div>
        <div className={styles.stakeBtnContainer}>
          <button onClick={handleStakeSubmit} className={styles.stakeBtn}>
            {isMining ? (
              <BeatLoader
                className={styles.chainErrorLoading}
                color="#36d7b7"
              />
            ) : (
              'Stake'
            )}
          </button>
          <button onClick={handleUnstakeSubmit} className={styles.stakeBtn}>
            Unstake
          </button>
        </div>
      </div>
      <div className={styles.stakingFooter}>
        <div>
          <div className={styles.stakingFooterDescription}>
            <p className={styles.stakeSubtitle}>Earned</p>
            <p className={styles.earnedValue}>0 {token}</p>
            <p className={styles.earnedValue}>$0 US</p>
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
