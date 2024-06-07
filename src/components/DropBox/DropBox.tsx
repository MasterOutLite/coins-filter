import React, {memo, ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import style from './DropBox.module.css'
import clsx from "clsx";

export interface DropBoxProps {
  children?: ReactNode,
  isVisible: boolean,
  setIsVisible: (val: boolean) => void,
  maxWidth?: number | string;
  maxHeight?: number | string;
}

type stateYSide = "top" | "bottom";
type stateXSide = "left" | "right";

function DropBox({children, isVisible, setIsVisible, maxWidth, maxHeight}: DropBoxProps) {
  const [freeXSide, setFreeXSide] =
    useState<stateXSide>("left");

  const [freeYSide, setFreeYSide] =
    useState<stateYSide>("bottom"); // Початково визначаємо, що місце вільне знизу

  const dropBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function calculateFreeSide() {
      if (!dropBoxRef.current) return;

      const rect = dropBoxRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = viewportWidth - rect.right;

      const state: { yStata: string, xState: string } = {xState: '', yStata: ''};

      let yState: stateYSide = 'bottom';
      if (spaceAbove >= rect.height) {
        yState = 'top';
      } else if (spaceBelow >= rect.height) {
        yState = 'bottom';
      } else {
        yState = spaceBelow > spaceAbove ? "bottom" : "top";
        state.yStata = yState
      }

      setFreeYSide(yState);

      let xState: stateXSide = 'left';
      if (spaceLeft >= rect.width) {
        xState = "left";
      } else if (spaceRight >= rect.width) {
        xState = "right";
      } else {
        xState = spaceLeft > spaceRight ? "left" : 'right';
      }
      state.xState = xState;
      setFreeXSide(xState);

      // console.log({spaceAbove, spaceBelow, spaceLeft, spaceRight})
      // console.log({height: rect.height, rect})
      // console.log({freeYSide: style[freeYSide + "-free"], freeXSide: style[freeXSide + "-free"]})
      // console.log(state)
    }

    calculateFreeSide();
    window.addEventListener("resize", calculateFreeSide);

    return () => {
      window.removeEventListener("resize", calculateFreeSide);
    };
  }, [isVisible]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropBoxRef.current && !dropBoxRef.current.contains(event.target as Node)) {
      setIsVisible(false);
    }
  }, [setIsVisible]);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, handleClickOutside]);

  const hideModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <>
      {isVisible && (
        <div
          ref={dropBoxRef}
          className={clsx(style.root, style[freeYSide + "-free"], style[freeXSide + "-free"])}
          style={{maxWidth, maxHeight}}
        >
          {children}
        </div>
      )}
    </>
  );
}

export default memo(DropBox);
