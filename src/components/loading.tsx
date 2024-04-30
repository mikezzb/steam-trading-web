import { CircularProgress, CircularProgressProps } from "@mui/material";
import { FC } from "react";

type Props = CircularProgressProps;

const Loading: FC<Props> = (props) => {
  return <CircularProgress {...props} />;
};

export default Loading;
