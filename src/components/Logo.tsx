import { Fragment } from "react/jsx-runtime";
import abbie from "../assets/abbie.png";

const Logo = () => {
  return (
    <Fragment>
      <div className="flex flex-col items-center gap-2">
        <img src={abbie} alt="Abbie" className="w-[100px]" />
        <h1 className="text-3xl font-bold">abbie</h1>
      </div>
    </Fragment>
  );
};

export default Logo;
