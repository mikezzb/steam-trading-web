import { CurrencyConfig, CurrencySymbol } from "@/config";

// Use USD as base 1, and other currencies are calculated based on USD
type ExchangeRate = Record<string, number>;

class Currency {
  private static rates: ExchangeRate = CurrencyConfig.exchangeRate;
  private static targetCurrency: string = CurrencyConfig.defaultCurrency;

  public value: number;
  public currency: string;

  constructor(
    value: number,
    currency: string = CurrencyConfig.defaultCurrency
  ) {
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

  public to() {
    if (this.currency === Currency.targetCurrency) {
      return this;
    }
    this.value =
      (this.value / Currency.rates[this.currency]) * Currency.targetRate;
    this.currency = Currency.targetCurrency;
  }

  public toString() {
    if (this.currency !== Currency.targetCurrency) {
      this.to();
    }
    return `${CurrencySymbol[this.currency]}${this.value.toFixed(2)}`;
  }
}

export default Currency;
