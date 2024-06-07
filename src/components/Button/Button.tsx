import React, {memo, ReactNode} from 'react';
import clsx from "clsx";
import style from './Button.module.css'

export interface ButtonProps {
  children: ReactNode,
  onClick?: () => void,
  className?: string,
}

function Button({onClick, children, className}: ButtonProps) {
  return (
    <button onClick={onClick} className={clsx(style.root, className)}>
      {children}
    </button>
  );
}

export default memo(Button);
