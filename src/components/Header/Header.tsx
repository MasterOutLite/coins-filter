import React, {ReactNode} from 'react';
import style from "./Header.module.css"

interface HeaderProps {
  children?: ReactNode,
}

function Header({children}: HeaderProps) {
  return (
    <header className={style.root}>
      {
        children
      }
    </header>
  );
}

export default Header;
