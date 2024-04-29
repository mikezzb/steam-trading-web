"use client";
import { makeObservable, action } from "mobx";
import { Storage } from "../utils/storage";

class PersistedStore {
  onLoadKeys?: string[];
  onResetKeys?: string[];
  defaultValues: Record<string, any>;

  constructor(
    onLoadKeys?: string[],
    onResetKeys?: string[],
    defaultValues?: Record<string, any>
  ) {
    this.onLoadKeys = onLoadKeys;
    this.onResetKeys = onResetKeys;
    this.defaultValues = defaultValues || {};
    makeObservable(this, {
      update: action,
      set: action,
      remove: action,
      load: action,
      reset: action,
      init: action,
    });
  }
  /** Non persistent update */
  update(k: string, v: any) {
    (this as any)[k] = v;
  }
  /** Persistent update */
  set(k: string, v: any) {
    this.update(k, v);
    Storage.setItem(k, v);
  }
  remove(k: string) {
    this.update(k, undefined);
    Storage.removeItem(k);
  }
  load() {
    const defaultValues = { ...this.defaultValues };
    if (this.onLoadKeys) {
      this.onLoadKeys.forEach((key) => {
        const retrieved = Storage.getItem(key);
        this.update(
          key,
          retrieved === null ? this.defaultValues[key] : retrieved
        );
        delete defaultValues[key];
      });
    }
    // If there are some unloaded keys in default values, load it
    this.init(defaultValues);
  }
  reset() {
    const defaultValues = { ...this.defaultValues };
    if (this.onResetKeys) {
      this.onResetKeys.forEach((key) => {
        Storage.removeItem(key);
        this.update(key, this.defaultValues[key] || null);
        delete defaultValues[key];
      });
    }
    this.init(defaultValues);
  }
  init(defaultValues?: Record<string, any>) {
    Object.entries(defaultValues || this.defaultValues).forEach(([k, v]) => {
      this.update(k, v);
    });
  }
}

export default PersistedStore;
