import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { BiLinkExternal } from "react-icons/bi";
import Dmany from "./assets/dmany_neg.png";
import Logo from "./components/Logo";
import SCConditionCard from "./components/SCConditionCard";
import TokenHoldingConditionCard from "./components/TokenHoldingConditionCard";
import TxCountConditionCard from "./components/TxCountConditionCard";
import { API_BASE } from "./constants";

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
    const response = await fetch(`${API_BASE}/condition-receiver`, {
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
          <div className="flex flex-col gap-6 p-8 max-w-[500px]">
            <Logo />
            <p className="opacity-50 ">
              abbie is an on-chain activity filter that helps projects select
              users for airdrops. Set up the required on-chain activities, and
              abbie will provide a list of users who complete all actions within
              the specified period.
            </p>
            <div className="divider"></div>
            <Form className="flex flex-col flex-grow gap-6 overflow-hidden">
              <div className="space-y-6">
                <p>Period of time</p>

                <div className="flex gap-6">
                  <label className="w-full max-w-xs form-control">
                    <div className="label">
                      <span className="label-text">From:</span>
                    </div>
                    <Field
                      name="fromDate"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      className="w-full max-w-xs input input-bordered"
                    />
                  </label>
                  <label className="w-full max-w-xs form-control">
                    <div className="label">
                      <span className="label-text">To:</span>
                    </div>
                    <Field
                      name="toDate"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      className="w-full max-w-xs input input-bordered"
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p>Filters</p>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="m-1 btn">
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
              <div className="divider"></div>
              <div className="flex items-center justify-center">
                <a href="https://dmany.io/" target="_blank">
                  <img src={Dmany} className="w-36" />
                </a>
              </div>
            </Form>
          </div>
          <div className="m-0 divider divider-horizontal"></div>
          <div className="w-full overflow-hidden">
            <p className="px-8 py-4 text-2xl font-bold">Accounts</p>
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
