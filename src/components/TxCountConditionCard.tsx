import { Field } from "formik";
import { TxCountCondition } from "../types";

export interface TxCountConditionCardProps {
  condition: TxCountCondition;
  idx: number;
}

const TxCountConditionCard = ({
  condition,
  idx,
}: TxCountConditionCardProps) => {
  return (
    <div className="p-4 space-y-4 card bg-neutral text-neutral-content">
      <h2 className="text-sm card-title">{condition.name}</h2>
      <div className="p-0 card-body">
        <label className="w-full max-w-xs form-control">
          <div className="label">
            <span className="label-text">Count of outcome transactions:</span>
          </div>
          <Field
            name={`conditions[${idx}].nonce`}
            type="text"
            placeholder="Type here"
            className="w-full max-w-xs input input-bordered input-sm xl:input:md"
          />
        </label>
      </div>
    </div>
  );
};

export default TxCountConditionCard;
