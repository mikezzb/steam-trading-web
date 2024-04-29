"use client";
import { UIConfig } from "@/config";
import { useUIContext } from "@/stores";
import { Alert, Snackbar, Stack } from "@mui/material";
import { FC } from "react";
import styles from "@/styles/components/snackbars.module.scss";
import { observer } from "mobx-react-lite";

// Notistack
const Snackbars: FC = () => {
  const uiStore = useUIContext();

  return (
    <div className={styles["snackbars"]}>
      {uiStore.snackbarQueue.map((snackbar) => (
        <Snackbar
          key={snackbar.message}
          open={true}
          autoHideDuration={UIConfig.snackbarHideDuration}
          onClose={uiStore.dequeueSnackbar}
          {...snackbar}
        />
      ))}
    </div>
  );
};

export default observer(Snackbars);
