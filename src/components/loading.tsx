import { CircularProgress, CircularProgressProps } from "@mui/material";
import clsx from "clsx";
import { FC } from "react";
import styles from "@/styles/components/loading.module.scss";

type Props = CircularProgressProps & {
  grow?: boolean;
  fixed?: boolean;
};

const Loading: FC<Props> = ({ grow, fixed, ...props }) => {
  return (
    <div
      className={clsx(
        "row center",
        styles["loading"],
        grow && styles["grow"],
        fixed && styles["fixed"],
        props.className
      )}
    >
      <CircularProgress {...props} />
    </div>
  );
};

export default Loading;
