import {
  Condition,
  ConditionName,
  SCCondition,
  TokenHoldingCondition,
  TxCountCondition,
} from "./types";

export const createCondition = (name: ConditionName): Condition => {
  switch (name) {
    case ConditionName.TX_COUNT:
      return {
        name: ConditionName.TX_COUNT,
        address: "",
        nonce: 0,
      } as TxCountCondition;

    case ConditionName.CONTRACT_INTERACTION:
      return {
        name: ConditionName.CONTRACT_INTERACTION,
        address: "",
        abi: "",
        eventName: "",
        args: [],
      } as SCCondition;

    case ConditionName.TOKEN_HOLDING:
      return {
        name: ConditionName.TOKEN_HOLDING,
        ercType: "native",
        address: "",
        balance: 0,
      } as TokenHoldingCondition;
  }
};
