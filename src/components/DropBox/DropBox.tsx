import React, {memo, ReactNode, RefObject, useCallback, useEffect, useRef, useState} from 'react';
import style from './DropBox.module.css'
import clsx from "clsx";
import {createPortal} from "react-dom";

export interface DropBoxProps {
  children?: ReactNode,
  isVisible: boolean,
  setIsVisible: (val: boolean) => void,
  maxWidth?: number | string;
  maxHeight?: number | string;
  parentContainer: RefObject<Element | DocumentFragment>;
}

type stateYSide = "top" | "bottom";
type stateXSide = "left" | "right";

function DropBox({children, isVisible, setIsVisible, maxWidth, maxHeight, parentContainer}: DropBoxProps) {
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

      let yState: stateYSide;
      if (spaceAbove >= rect.height) {
        yState = 'top';
      } else if (spaceBelow >= rect.height) {
        yState = 'bottom';
      } else {
        yState = spaceBelow > spaceAbove ? "bottom" : "top";
      }
      setFreeYSide(yState);

      let xState: stateXSide;
      if (spaceLeft >= rect.width) {
        xState = "left";
      } else if (spaceRight >= rect.width) {
        xState = "right";
      } else {
        xState = spaceLeft > spaceRight ? "left" : 'right';
      }
      setFreeXSide(xState);
    }

    calculateFreeSide();
    window.addEventListener("resize", calculateFreeSide);

    return () => {
      window.removeEventListener("resize", calculateFreeSide);
    };
  }, [isVisible]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropBoxRef.current && !dropBoxRef.current.contains(event.target as Node) &&
      !(parentContainer.current && parentContainer.current.contains(event.target as Node))) {
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

  if (!parentContainer.current) {
    return null;
  }

  return (
    <>
      {isVisible && createPortal(
        <div
          ref={dropBoxRef}
          className={clsx(style.root, style[freeYSide + "-free"], style[freeXSide + "-free"])}
          style={{maxWidth, maxHeight}}
        >
          {children}
        </div>, parentContainer.current!
      )}
    </>
  );
}

export default memo(DropBox);
