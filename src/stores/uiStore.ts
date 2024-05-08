"use client";
import { SnackbarConfig } from "@/types/ui";
import { makeAutoObservable } from "mobx";

class UIStore {
  snackbarQueue: SnackbarConfig[] = [];

  constructor() {
    makeAutoObservable(this);
    this.enqueueSnackbar = this.enqueueSnackbar.bind(this);
    this.dequeueSnackbar = this.dequeueSnackbar.bind(this);
  }

  clear() {
    this.snackbarQueue = [];
  }

  enqueueSnackbar(snackbar: SnackbarConfig) {
    this.snackbarQueue.push(snackbar);
  }

  dequeueSnackbar() {
    this.snackbarQueue.shift();
  }

  enqueueError(message: string) {
    this.enqueueSnackbar({ message });
  }

  success(message: string) {
    this.enqueueSnackbar({ message });
  }
}

export default UIStore;
