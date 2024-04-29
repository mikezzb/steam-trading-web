"use client";
import { CurrencyConfig } from "@/config";
import PersistedStore from "./PersistedStore";
import { action, makeObservable, observable } from "mobx";

const onLoadKeys = ["currency"];
const onResetKeys = onLoadKeys;
const defaultValues = {
  currency: CurrencyConfig.defaultCurrency,
};

class ConfigStore extends PersistedStore {
  public currency: string = CurrencyConfig.defaultCurrency;
  constructor() {
    super(onLoadKeys, onResetKeys, defaultValues);
    makeObservable(this, {
      currency: observable,
      setCurrency: action,
    });
  }

  setCurrency(currency: string) {
    this.set("currency", currency);
  }
}

export default ConfigStore;
