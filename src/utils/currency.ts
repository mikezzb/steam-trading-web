import { CurrencyConfig, CurrencySymbol } from "@/config";

// Use USD as base 1, and other currencies are calculated based on USD
type ExchangeRate = Record<string, number>;

class Currency {
  private static rates: ExchangeRate = CurrencyConfig.exchangeRate;
  private static targetCurrency: string = CurrencyConfig.defaultCurrency;

  public value: number;
  public currency: string;

  constructor(
    value: number | string,
    currency: string = CurrencyConfig.listPriceCurrency, // the currency of the value
    public readonly label = 2
  ) {
    if (typeof value === "string") {
      value = parseFloat(value);
    }
    this.value = value;

    this.currency = currency;
  }

  public static get targetRate() {
    return Currency.rates[Currency.targetCurrency];
  }

  public static get currencies() {
    return Object.keys(Currency.rates);
  }

  public static setRates(rates: ExchangeRate) {
    this.rates = rates;
  }

  public static setTargetCurrency(currency: string) {
    this.targetCurrency = currency;
  }

  public to(target = Currency.targetCurrency) {
    if (this.currency === target) {
      return this;
    }
    this.value =
      (this.value / Currency.rates[this.currency]) * Currency.rates[target];
    this.currency = target;
    return this;
  }

  private _checkAndConvert() {
    if (this.currency !== Currency.targetCurrency) {
      this.to();
    }
  }

  public toString() {
    this._checkAndConvert();
    return `${CurrencySymbol[this.currency]}${this.value.toFixed(2)}`;
  }

  // overload the valueOf method to return the value
  public valueOf() {
    this._checkAndConvert();
    return this.value;
  }
}

export default Currency;
