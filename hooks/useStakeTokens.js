import { useState, useEffect } from 'react';
import { useEthers, useContractFunction } from '@usedapp/core';
import { constants, utils } from 'ethers';
import TokenFarm from '../chain-info/contracts/TokenFarm.json';
import ERC20 from '../chain-info/contracts/MockERC20.json';
import { Contract } from '@ethersproject/contracts';
import networkMapping from '../networkMapping.json';

export const useStakeTokens = (tokenAddress, setIsStaking) => {
  const { chainId } = useEthers();
  const { abi } = TokenFarm;
  const tokenFarmAddress = chainId
    ? networkMapping[chainId.toString()]['TokenFarm'][
        networkMapping[chainId.toString()]['TokenFarm'].length - 1
      ]
    : constants.AddressZero;
  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface);

  const erc20ABI = ERC20.abi;
  const erc20Interface = new utils.Interface(erc20ABI);
  const erc20Contract = new Contract(tokenAddress, erc20Interface);

  const [amountToStake, setAmountToStake] = useState('0');

  const { send: approveErc20Send, state: approveAndStakeErc20State } =
    useContractFunction(erc20Contract, 'approve', {
      transactionName: 'Approve ERC20 transfer',
    });

  const { send: stakeSend, state: stakeState } = useContractFunction(
    tokenFarmContract,
    'stakeTokens',
    {
      transactionName: 'Stake Tokens',
    }
  );

  const approveAndStake = async (amount) => {
    setAmountToStake(amount);
    await approveErc20Send(tokenFarmAddress, amount);
    setIsStaking(false);
  };

  const sendingStake = async function (amountToStake, tokenAddress) {
    await stakeSend(amountToStake, tokenAddress);
    setIsStaking(false);
  };

  useEffect(() => {
    if (approveAndStakeErc20State.status === 'Success') {
      setIsStaking(true);
      sendingStake(amountToStake, tokenAddress);
    }
  }, [approveAndStakeErc20State, amountToStake, tokenAddress]);

  const [state, setState] = useState(approveAndStakeErc20State);

  useEffect(() => {
    if (approveAndStakeErc20State.status === 'Success') {
      setState(stakeState);
    } else {
      setState(approveAndStakeErc20State);
    }
  }, [approveAndStakeErc20State, stakeState]);

  return { approveAndStake, state };
};
