import React, {ChangeEvent, ReactNode, useCallback, useEffect, useState} from 'react';
import clsx from "clsx";
import style from "./InputField.module.css";
import {X} from "@phosphor-icons/react";

export interface InputFieldProps {
  setValue?: (val: string) => void,
  value?: string,
  placeholder?: string,
  startNode?: ReactNode,
  className?: string,
  name?: string,
}

function InputField({setValue, value, placeholder, className, startNode, name}: InputFieldProps) {
  const [isText, setIsText] = useState<boolean>(false)

  const handleClearField = useCallback(() => {
    if (setValue) {
      setValue('')
    }
  }, [])

  function handleChangeText(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (setValue) {
      setValue(value);
    }
  }

  useEffect(() => {
    setIsText(!!value && value.length > 0)
  }, [value, setIsText]);

  return (
    <div className={clsx(className, style.inputGroup)}>
      {startNode}
      <input className={style.input} name={name || 'none'} placeholder={placeholder} value={value}
             onChange={handleChangeText}/>
      <div className={style.clear} style={{display: isText ? 'block' : 'none'}}>
        <X weight="bold" color={'blue'} className={style.clear} onClick={handleClearField}/>
      </div>
    </div>
  );
}

export default InputField;
