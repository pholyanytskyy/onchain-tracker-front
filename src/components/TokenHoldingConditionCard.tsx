import { Field, useFormikContext } from "formik";
import { FormValues, TokenHoldingCondition } from "../types";

export interface TokenHoldingConditionCardProps {
  condition: TokenHoldingCondition;
  idx: number;
}

const TokenHoldingConditionCard = ({
  condition,
  idx,
}: TokenHoldingConditionCardProps) => {
  const { values } = useFormikContext<FormValues>();
  return (
    <div className="p-6 space-y-4 card bg-neutral text-neutral-content">
      <h2 className="text-lg card-title">{condition.name}</h2>
      <div className="p-0 card-body">
        <label className="w-full form-control">
          <div className="label">
            <span className="label-text">Hold token:</span>
          </div>
          <Field
            as="select"
            name={`conditions[${idx}].ercType`}
            placeholder="Type here"
            className="w-full select select-bordered"
          >
            {["native", "erc20", "erc721", "erc1155"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Field>
        </label>

        {(values.conditions[idx] as TokenHoldingCondition).ercType !==
          "native" && (
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Address:</span>
            </div>
            <Field
              type="text"
              placeholder="Address"
              className="w-full input input-bordered"
              name={`conditions[${idx}].address`}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default TokenHoldingConditionCard;
