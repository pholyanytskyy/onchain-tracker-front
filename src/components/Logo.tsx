import { Fragment } from "react/jsx-runtime";
import abbie from "../assets/abbie.png";

const Logo = () => {
  return (
    <Fragment>
      <div className="flex flex-col items-center gap-2">
        <img src={abbie} alt="Abbie" className="w-[50px] 2xl:w-[100px]" />
        <h1 className="text-lg font-bold 2xl:text-3xl">abbie</h1>
      </div>
    </Fragment>
  );
};

export default Logo;
