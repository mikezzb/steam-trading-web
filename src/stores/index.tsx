"use client";
import { createContext, useContext, useEffect, useState } from "react";
import UIStore from "./uiStore";
import { isServer } from "@/utils";
import { enableStaticRendering } from "mobx-react-lite";
import { FCC } from "@/types/ui";
import ConfigStore from "./configStore";
import Currency from "@/utils/currency";
import { autorun } from "mobx";

export const configStore = new ConfigStore();
export const uiStore = new UIStore();

const ConfigContext = createContext(configStore);
const UIContext = createContext(uiStore);

enableStaticRendering(isServer);

export const useConfigContext = () => useContext(ConfigContext);
export const useUIContext = () => useContext(UIContext);

const getStores = () => {
  return {
    uiStore,
    configStore,
  };
};

// Autoruns
autorun(() => {
  Currency.setTargetCurrency(configStore.currency);
});

const StoreProvider: FCC = ({ children }) => {
  const { uiStore, configStore } = getStores();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    configStore.load();
    setIsHydrated(true);
  }, [configStore]);

  if (!isHydrated) return null;

  return (
    <ConfigContext.Provider value={configStore}>
      <UIContext.Provider value={uiStore}>{children}</UIContext.Provider>
    </ConfigContext.Provider>
  );
};

export default StoreProvider;
