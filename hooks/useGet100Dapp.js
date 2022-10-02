import { useContractFunction, useEthers } from '@usedapp/core';
import TokenFarm from '../chain-info/contracts/TokenFarm.json';
import { utils, constants } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import networkMapping from '../networkMapping.json';

export const useGet100Dapp = () => {
  const { chainId } = useEthers();

  const { abi } = TokenFarm;
  const tokenFarmContractAddress = chainId
    ? networkMapping['5']['TokenFarm'][
        networkMapping['5']['TokenFarm'].length - 1
      ]
    : constants.AddressZero;
  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(
    tokenFarmContractAddress,
    tokenFarmInterface
  );

  return useContractFunction(tokenFarmContract, 'get100DappToken', {
    transactionName: 'Get 100 DAPP Token',
  });
};
