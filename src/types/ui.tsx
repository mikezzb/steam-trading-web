import Currency from "@/utils/currency";
import { AlertProps, SnackbarProps } from "@mui/material";
import { Item } from "./transformed";

// FC with children
export type FCC<T = {}> = React.FC<
  T & {
    children: React.ReactNode;
  }
>;

export interface SnackbarConfig extends SnackbarProps {}

export enum AuthState {
  INIT,
  PENDING,
  LOGGED_IN,
  LOGGED_OUT,
}

export type PropsWithItem<T = {}> = {
  item: Item;
} & T;
