import React, {useCallback, useState} from 'react';
import Button from "components/Button/Button";
import {SelectedElement} from "../../type/SelectedElement";
import {Star} from "@phosphor-icons/react";
import style from './ButtonSelected.module.css'
import clsx from "clsx";

export interface ButtonSelectedProps {
  selected: SelectedElement<any>,
  onSelected?: (val: SelectedElement<any>) => void,
  onRemove?: (val: SelectedElement<any>) => void,
  className?: string,
}

function ButtonSelected({selected, className, onSelected, onRemove}: ButtonSelectedProps) {

  const [isSelected, setIsSelected] = useState<boolean>(selected.isSelected);

  const handleOnClick = useCallback(() => {
    const stateSelected = !isSelected;
    setIsSelected(stateSelected);
    selected.isSelected = stateSelected;
    if (onSelected && stateSelected) {
      console.log('Invoke selected item', selected)
      onSelected(selected);
    } else if (!stateSelected && onRemove) {
      onRemove(selected);
    }
  }, [isSelected])

  return (
    <Button onClick={handleOnClick} className={clsx(style.root, className)}>
      <Star weight={isSelected ? "fill" : undefined}/>
      {selected.text}
    </Button>
  );
}

export default ButtonSelected;
