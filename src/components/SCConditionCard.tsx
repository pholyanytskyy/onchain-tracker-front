import { Field, useFormikContext } from "formik";
import { Fragment, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { API_BASE } from "../constants";
import { Abi, FormValues, SCCondition } from "../types";

export interface SCConditionCardProps {
  condition: SCCondition;
  idx: number;
}

const fetchAbi = async (address: string): Promise<Abi[]> => {
  const response = await fetch(`${API_BASE}/abi?address=${address}`);
  const data = await response.json();

  return data;
};

const EventArgs = ({ event, idx }: { event?: Abi; idx: number }) => {
  if (!event) {
    return null;
  }

  const { inputs } = event;

  return (
    <Fragment>
      {inputs.map((input, inputIdx) => {
        return (
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">{input.name}:</span>
            </div>
            <Field
              name={`conditions[${idx}].args[${inputIdx}].value`}
              placeholder={input.type}
              className="w-full input input-bordere input-sm xl:input:md"
            />
          </label>
        );
      })}
    </Fragment>
  );
};

const SCConditionCard = ({ condition, idx }: SCConditionCardProps) => {
  const { setFieldValue, values } = useFormikContext<FormValues>();
  const [events, setEvents] = useState<Abi[]>([]);
  const [abi, setAbi] = useState<Abi[]>([]);

  return (
    <div className="p-4 space-y-4 card bg-neutral text-neutral-content">
      <h2 className="text-sm card-title">{condition.name}</h2>
      <div className="p-0 card-body">
        <label className="w-full form-control">
          <div className="label">
            <span className="label-text">Address:</span>
          </div>
          <div className="flex items-center gap-4">
            <Field
              type="text"
              placeholder="Address"
              className="w-full input input-bordered input-sm xl:input:md"
              name={`conditions[${idx}].address`}
            />
            <button
              className="btn btn-square btn-sm xl:btn-md"
              type="button"
              onClick={async () => {
                const abi = await fetchAbi(
                  (values.conditions[idx] as SCCondition).address
                );

                setEvents(abi.filter((abi) => abi.type === "event"));
                setAbi(abi);
              }}
            >
              <BiRefresh size={20} />
            </button>
          </div>
        </label>

        {events.length > 0 && (
          <Fragment>
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">Event:</span>
              </div>
              <Field
                as="select"
                className="select select-bordered select-sm xl:select-md"
                name={`conditions[${idx}].eventName`}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const event = events.find(
                    (event) => event.name === e.target.value
                  )!;
                  setFieldValue(`conditions[${idx}].abi`, abi);
                  setFieldValue(`conditions[${idx}].eventName`, event.name);
                  setFieldValue(
                    `conditions[${idx}].args`,
                    event.inputs.map((input) => ({
                      name: input.name,
                      value: "",
                    }))
                  );
                }}
              >
                <option value="" disabled>
                  Select event
                </option>
                {events.map((event) => (
                  <option key={event.name} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </Field>
            </label>

            <EventArgs
              event={events.find(
                (e) =>
                  e.name === (values.conditions[idx] as SCCondition).eventName
              )}
              idx={idx}
            />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default SCConditionCard;
