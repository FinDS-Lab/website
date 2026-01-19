import clsx from 'clsx'
import {memo, ReactNode} from "react";
import { ChevronDown } from 'lucide-react';

type props = {
  name?: string;
  index?: number;
  className?: string;
  title?: ReactNode;
  children?: ReactNode;
}

export const Collapse = ({name, className, index, title, children}: props) => {
  return (
    <div className={clsx(className, "w-full flex flex-col items-center justify-center gap-10 group")}>
      <input type="checkbox" id={`${name}${index}`} className="peer hidden"/>
      <label htmlFor={`${name}${index}`} className="w-full flex justify-between items-center cursor-pointer select-none pb-10 relative">
        <span>{title}</span>
        <ChevronDown className="w-20 h-20 transition-transform duration-200 peer-checked:rotate-180" />
      </label>

      <div className="w-full hidden flex-col animate-fadeIn peer-checked:flex px-10 pb-10">
        {children}
      </div>
    </div>
  )
}

export default memo(Collapse);
