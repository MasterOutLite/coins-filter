import {SelectedElement} from "../type/SelectedElement";

class CoinService {

  protected COIN_KEY = 'FavoriteCoin';
  public coins: SelectedElement<string>[] = [];

  constructor() {
    this.coins = [];
    this.init();
  }

  add = (item: SelectedElement<string>) => {
    if (!item || this?.coins === undefined) {
      return;
    }
    const stringCoin = JSON.stringify(item.value);

    const findCoin =
      this.coins.find(existCoin => JSON.stringify(existCoin.value) === stringCoin);

    if (findCoin === undefined) {
      this.coins.push(item);
      this.save();
    }
  }

  remove = (item: SelectedElement<string>) => {
    if (!item) {
      return;
    }
    this.coins = this.coins.filter(value => JSON.stringify(value.value) != JSON.stringify(item.value));
    this.save();
  }

  uniteCoin = (coins: SelectedElement<string>[]) => {
    coins.forEach(coin => {
      const stringCoin = JSON.stringify(coin.value);
      const findCoin =
        this.coins.find(existCoin => JSON.stringify(existCoin.value) === stringCoin);
      if (findCoin) {
        coin.isSelected = true
      }
    })

    return coins;
  }

  save = () => {
    const savaJson = JSON.stringify(this.coins);
    localStorage.setItem(this.COIN_KEY, savaJson);
  }

  init = () => {
    const savedCoins = localStorage.getItem(this.COIN_KEY);
    if (!savedCoins) {
      this.coins = [];
      return;
    }

    this.coins = JSON.parse(savedCoins);
    console.log("Init context", this)
  }
}

export default new CoinService();
