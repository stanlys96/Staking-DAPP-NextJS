import { useEthers, useContractFunction } from '@usedapp/core';
import { constants, utils } from 'ethers';
import WETHTokenABI from '../chain-info/contracts/WETHTokenABI.json';
import { Contract } from '@ethersproject/contracts';
import networkConfig from '../networkConfig.json';

export const useDepositETH = () => {
  const { chainId } = useEthers();
  const wethTokenAddress = chainId
    ? networkConfig['5']['weth']
    : constants.AddressZero;
  const wethTokenInterface = new utils.Interface(WETHTokenABI);
  const wethTokenContract = new Contract(wethTokenAddress, wethTokenInterface);

  return useContractFunction(wethTokenContract, 'deposit', {
    transactionName: 'Deposit ETH',
  });
};
