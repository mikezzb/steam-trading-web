import { AlertProps, SnackbarProps } from "@mui/material";

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
