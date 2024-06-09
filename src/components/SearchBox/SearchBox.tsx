import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import DropBox from "components/DropBox";
import style from './SearchBox.module.css'
import {MagnifyingGlass, Star} from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "components/Button";
import coins from 'const/coins.json';
import {SelectedElement} from "type/SelectedElement";
import ButtonSelected from "components/ButtonSelected";
import InputField from "components/InputField";
import VirtualizedList from "components/VirtualizedList";

function SearchBox() {
  const [text, setText] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [elements, setElements] =
    useState<SelectedElement<string>[]>([]);

  const instance = useRef(null);

  const [elementsSelected, setElementsSelected] =
    useState<SelectedElement<string>[]>([]);

  function initCoins() {
    const coinsList = coins.map(value => ({
      text: value,
      value,
      isSelected: false,
    }));
    setElements(coinsList);
  }

  useEffect(() => {
    initCoins();
  }, []);

  function setVisible(state: boolean) {
    initCoins();
    setIsVisible(state);
  }

  const handleButtonClick = useCallback(() => {
    setVisible(!isVisible)
  }, [isVisible])

  function setFavorite(state: boolean) {
    return function () {
      setIsFavorite(state);
    }
  }

  function selectedItem(item: SelectedElement<string>) {
    return () => {
      setElementsSelected(p => [...p, item]);
    }
  }

  function removeItem(item: SelectedElement<string>) {
    return () => {
      setElementsSelected(p => p.filter(element => element !== item));
    }
  }

  const filterCoins = useMemo(() => {
    let sorted = elements;

    if (isFavorite)
      sorted = sorted.filter(value => value.isSelected);

    return sorted.filter(value => value.value.toLowerCase().includes(text.toLowerCase()));
  }, [elements, text, isFavorite])

  return (
    <div className={style.root} ref={instance}>
      <Button onClick={handleButtonClick} className={clsx(style.button, isVisible ? style.buttonActive : '')}>
        <MagnifyingGlass size={16} color={'#fff'}/>
        <p>Search</p>
      </Button>

      <DropBox parentContainer={instance} setIsVisible={setVisible} isVisible={isVisible} maxWidth={220}>
        <InputField startNode={<MagnifyingGlass size={20} color={'#fff'}/>}
                    placeholder={'Search...'}
                    value={text}
                    className={clsx(style.input)}
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

          <VirtualizedList
            // maxHeight={300}
            render={(item, index) => (
              <ButtonSelected key={item.value} selected={item}
                              onSelected={selectedItem}
                              onRemove={removeItem}
              />
            )} list={filterCoins}/>

          {/*<ScrollBox className={style.listCoins} maxHeight={300}>*/}
          {/*  /!*{*!/*/}
          {/*  /!*  filterCoins.map(value => (*!/*/}
          {/*  /!*    <ButtonSelected key={value.value} selected={value}*!/*/}
          {/*  /!*                    onSelected={CoinService.add}*!/*/}
          {/*  /!*                    onRemove={CoinService.remove}*!/*/}
          {/*  /!*    />*!/*/}
          {/*  /!*  ))*!/*/}
          {/*  /!*}*!/*/}
          {/*</ScrollBox>*/}

        </div>
      </DropBox>

    </div>
  );
}

export default SearchBox;
