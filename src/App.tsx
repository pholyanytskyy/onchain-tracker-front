import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { BiLinkExternal } from "react-icons/bi";
import Dmany from "./assets/dmany_neg.png";
import SCConditionCard from "./components/SCConditionCard";
import TokenHoldingConditionCard from "./components/TokenHoldingConditionCard";
import TxCountConditionCard from "./components/TxCountConditionCard";
import { API_BASE } from "./constants";

import Logo from "./components/Logo";
import {
  ConditionName,
  FormValues,
  SCCondition,
  TokenHoldingCondition,
  TxCountCondition,
} from "./types";
import { createCondition } from "./utils";

const filters = {
  CONTRACT_INTERACTION: "Contract Interaction",
  TOKEN_HOLDING: "Token Holding",
  TX_COUNT: "Transaction Count",
};

function App() {
  const [accounts, setAccounts] = useState<string[]>([]);

  const initialValues: FormValues = {
    fromDate: "",
    toDate: "",
    conditions: [],
  };

  const onFormSubmit = async (values: FormValues) => {
    const response = await fetch(`${API_BASE}/condition/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    setAccounts(data.accounts);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onFormSubmit}>
      {({ values, setFieldValue, isSubmitting }) => (
        <div className="flex w-full h-screen">
          <div className="flex flex-col gap-2 p-4 xl:p-6 max-w-[400px] xl:max-w-[500px]">
            <Logo />
            <div className="m-0 divider"></div>
            <Form className="flex flex-col flex-grow gap-4 overflow-hidden xl:gap-6">
              <div className="space-y-4 xl:space-y-6">
                <p className="text-sm xl:text-md">Period of time</p>

                <div className="flex gap-6">
                  <label className="w-full form-control">
                    <div className="label">
                      <span className="text-sm label-text xl:text-md">
                        From:
                      </span>
                    </div>
                    <Field
                      name="fromDate"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      className="w-full text-sm xl:text-md input input-bordered"
                    />
                  </label>
                  <label className="w-full form-control">
                    <div className="label">
                      <span className="text-sm label-text xl:text-md">To:</span>
                    </div>
                    <Field
                      name="toDate"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      className="w-full text-sm xl:text-md input input-bordered"
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm xl:text-md">Filters</p>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="text-sm btn btn-sm xl:text-md"
                  >
                    Add filter
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    {Object.entries(filters).map((e) => {
                      let disabled = false;
                      switch (e[1]) {
                        case ConditionName.TX_COUNT:
                          if (
                            values.conditions.length == 0 ||
                            values.conditions.find((c) => c.name === e[1])
                          ) {
                            disabled = true;
                          }
                          break;
                        case ConditionName.TOKEN_HOLDING:
                          if (values.conditions.length == 0) {
                            disabled = true;
                          }
                          break;
                      }

                      return (
                        <li key={e[0]} className={disabled ? "disabled" : ""}>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              const condition = createCondition(
                                e[1] as ConditionName
                              );

                              setFieldValue("conditions", [
                                ...values.conditions,
                                condition,
                              ]);

                              const elem = document.activeElement;
                              if (elem) {
                                (elem as HTMLElement)?.blur();
                              }
                            }}
                          >
                            {e[1]}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="flex-grow space-y-6 overflow-auto">
                {values.conditions.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    No filters
                  </div>
                ) : (
                  values.conditions.map((condition, index) => {
                    switch (condition.name as ConditionName) {
                      case ConditionName.TX_COUNT:
                        return (
                          <TxCountConditionCard
                            key={index}
                            condition={condition as TxCountCondition}
                            idx={index}
                          />
                        );
                      case ConditionName.CONTRACT_INTERACTION:
                        return (
                          <SCConditionCard
                            key={index}
                            condition={condition as SCCondition}
                            idx={index}
                          />
                        );
                      case ConditionName.TOKEN_HOLDING:
                        return (
                          <TokenHoldingConditionCard
                            key={index}
                            condition={condition as TokenHoldingCondition}
                            idx={index}
                          />
                        );
                    }
                  })
                )}
              </div>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={
                  values.conditions.length === 0 ||
                  values.fromDate === "" ||
                  values.toDate === ""
                }
              >
                Get accounts
              </button>
              <div className="m-0 divider"></div>
              <div className="flex items-center justify-center">
                <a href="https://dmany.io/" target="_blank">
                  <img src={Dmany} className="w-24" />
                </a>
              </div>
            </Form>
          </div>
          <div className="m-0 divider divider-horizontal"></div>
          <div className="w-full overflow-hidden">
            <p className="p-4 text-sm opacity-50 xl:text-md xl:p-6">
              abbie is an on-chain activity filter that helps projects select
              users for airdrops. Set up the required on-chain activities, and
              abbie will provide a list of users who complete all actions within
              the specified period.
            </p>

            <p className="px-4 py-4 text-2xl font-bold xl:px-6">Accounts</p>
            {isSubmitting ? (
              <div className="flex items-center justify-center h-full">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            ) : (
              <div className="h-full p-8 space-y-6 overflow-auto">
                {accounts.map((account) => (
                  <div role="alert" className="alert">
                    <a
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      className="flex items-center gap-2 link"
                    >
                      {account}
                      <BiLinkExternal />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Formik>
  );
}

export default App;
