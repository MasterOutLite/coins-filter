import React, {useCallback, useEffect, useMemo, useState} from 'react';
import DropBox from "components/DropBox";
import style from './SearchBox.module.css'
import {MagnifyingGlass, Star} from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "components/Button";
import coins from 'const/coins.json';
import {SelectedElement} from "type/SelectedElement";
import ButtonSelected from "components/ButtonSelected";
import InputField from "components/InputField";
import ScrollBox from "components/ScrollBox";
import CoinService from "service/CoinService";


function SearchBox() {
  const [text, setText] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [elements, setElements] =
    useState<SelectedElement<string>[]>([]);

  useEffect(() => {
    const coinsList = coins.map(value => ({
      text: value,
      value,
      isSelected: false,
    }));
    const unionCoins = CoinService.uniteCoin(coinsList);
    setElements(unionCoins);
  }, []);

  const handleButtonClick = useCallback(() => {
    setIsVisible(p => !p)
  }, [])

  function setFavorite(state: boolean) {
    return function () {
      setIsFavorite(state);
    }
  }

  const filterCoins = useMemo(() => {
    let sorted = elements;

    if (isFavorite)
      sorted = sorted.filter(value => value.isSelected);

    return sorted.filter(value => value.value.toLowerCase().includes(text.toLowerCase()));
  }, [elements, text, isFavorite])

  return (
    <div className={style.root}>
      <Button onClick={handleButtonClick} className={clsx(style.button, isVisible ? style.buttonActive : '')}>
        <MagnifyingGlass color={'#fff'}/>
        <p>Search</p>
      </Button>

      <DropBox setIsVisible={setIsVisible} isVisible={isVisible} maxWidth={300}>
        <InputField startNode={<MagnifyingGlass size={20} color={'#fff'}/>}
                    placeholder={'Search...'}
                    value={text}
                    className={clsx(style.contentBox, style.input)}
                    setValue={setText}/>

        <div className={style.divider}/>


        <div className={style.contentBox}>
          <div className={style.buttonGroup}>
            <Button onClick={setFavorite(true)} className={!isFavorite ? style.notSelected : style.selected}>
              <Star weight="fill"/> <span>Favorites</span>
            </Button>
            <Button className={isFavorite ? style.notSelected : style.selected} onClick={setFavorite(false)}>
              All coins
            </Button>
          </div>

          <ScrollBox className={style.listCoins} maxHeight={300}>
            {
              filterCoins.map(value => (
                <ButtonSelected key={value.value} selected={value}
                                onSelected={CoinService.add}
                                onRemove={CoinService.remove}
                />
              ))
            }
          </ScrollBox>

        </div>
      </DropBox>
    </div>
  );
}

export default SearchBox;
