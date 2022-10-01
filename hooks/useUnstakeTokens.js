import { useState, useEffect } from 'react';
import { useEthers, useContractFunction } from '@usedapp/core';
import { constants, utils } from 'ethers';
import TokenFarm from '../chain-info/contracts/TokenFarm.json';
import { Contract } from '@ethersproject/contracts';
import networkMapping from '../networkMapping.json';

export const useUnstakeTokens = () => {
  const { chainId } = useEthers();
  const { abi } = TokenFarm;
  const tokenFarmAddress = chainId
    ? networkMapping['5']['TokenFarm'][
        networkMapping['5']['TokenFarm'].length - 1
      ]
    : constants.AddressZero;
  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface);

  return useContractFunction(tokenFarmContract, 'unstakeTokens', {
    transactionName: 'Unstake Tokens',
  });
};
