import {ReactNode} from "react";
import clsx from "clsx";

type props = {
  children: ReactNode;
  className?: string;
}

export const Danger = ({children, className}: props) => {
  return (
    <small className={clsx("pt-5 pl-5 text-sm font-medium text-red-500 opacity-0 max-md:pt-0 animate-slideY", className)} style={{animationFillMode: 'forwards'}}>
      {children}
    </small>
  );
};
