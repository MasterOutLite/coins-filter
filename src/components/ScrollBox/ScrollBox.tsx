import React, {memo, ReactNode} from 'react';
import style from './ScrollBox.module.css'
import clsx from "clsx";

export interface ScrollBoxProps {
  children?: ReactNode,
  className?: string,
  maxHeight?: string | number;
}

function ScrollBox({children, className, maxHeight}: ScrollBoxProps) {
  return (
    <div style={{maxHeight: maxHeight}} className={clsx(style.scrollContent, className)}>
      {children}
    </div>
  );
}

export default memo(ScrollBox);
