export enum ConditionName {
  TX_COUNT = "Transaction Count",
  CONTRACT_INTERACTION = "Contract Interaction",
  TOKEN_HOLDING = "Token Holding",
}

export interface TxCountCondition {
  name: string;
  nonce: number;
}

export interface SCCondition {
  name: string;
  address: string;
  abi: string;
  eventName: string;
  args: { key: string; value: string }[];
}

export interface TokenHoldingCondition {
  name: string;
  ercType: "native" | "erc20" | "erc721" | "erc1155";
  address: string;
}

export type Condition = TxCountCondition | SCCondition | TokenHoldingCondition;

export interface FormValues {
  fromDate: string;
  toDate: string;
  conditions: Condition[];
}

export interface Abi {
  constant: boolean;
  inputs: { name: string; type: string }[];
  name: string;
  outputs: { name: string; type: string }[];
  payable: boolean;
  stateMutability: string;
  type: string;
}
