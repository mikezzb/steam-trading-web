"use client";
import { createContext, useContext, useEffect, useState } from "react";
import UIStore from "./uiStore";
import { isServer } from "@/utils";
import { enableStaticRendering } from "mobx-react-lite";
import { FCC } from "@/types/ui";
import ConfigStore from "./configStore";
import Currency from "@/utils/currency";
import { autorun } from "mobx";
import UserStore from "./userStore";

export const configStore = new ConfigStore();
export const uiStore = new UIStore();
export const userStore = new UserStore(uiStore);

const ConfigContext = createContext(configStore);
const UIContext = createContext(uiStore);
const UserContext = createContext(userStore);

enableStaticRendering(isServer);

export const useConfigContext = () => useContext(ConfigContext);
export const useUIContext = () => useContext(UIContext);
export const useUserContext = () => useContext(UserContext);

const getStores = () => {
  return {
    uiStore,
    configStore,
    userStore,
  };
};

// Autoruns
autorun(() => {
  Currency.setTargetCurrency(configStore.currency);
});

const StoreProvider: FCC = ({ children }) => {
  const { uiStore, configStore, userStore } = getStores();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    configStore.init();
    userStore.init();
    setIsHydrated(true);
  }, [configStore, userStore]);

  if (!isHydrated) return null;

  return (
    <ConfigContext.Provider value={configStore}>
      <UserContext.Provider value={userStore}>
        <UIContext.Provider value={uiStore}>{children}</UIContext.Provider>
      </UserContext.Provider>
    </ConfigContext.Provider>
  );
};

export default StoreProvider;
