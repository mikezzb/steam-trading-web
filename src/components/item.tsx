import { decodeItemName } from "@/utils/cs";
import { Paper } from "@mui/material";
import clsx from "clsx";
import { FC } from "react";
import styles from "@/styles/components/item.module.scss";
import Image from "next/image";
import Currency from "@/utils/currency";
import { Item } from "@/types/transformed";
import { getItemPreviewUrl } from "@/utils/routes";

type ItemCardProps = {
  item: Item;
  width: number;
  height: number;
  onClick?: () => void;
};

export const ItemCard: FC<ItemCardProps> = ({
  item,
  width,
  height,
  onClick,
}) => {
  return (
    <Paper
      className={clsx(styles["item-card"], "column center")}
      style={{
        width: width,
        height: height,
      }}
      onClick={onClick}
    >
      <div className={styles["item-price"]}>
        {item.lowestPrice?.price?.toString() || "No Listing"}
      </div>
      <div className={styles["item-img"]}>
        <Image src={getItemPreviewUrl(item._id)} alt={item.fullName} fill />
      </div>
      <div className={styles["item-name"]}>{item.name}</div>
      <div className={styles["item-skin"]}>{item.skin}</div>
      <div className={styles["item-exterior"]}>{item.exterior}</div>
    </Paper>
  );
};

type ItemBannerProps = {
  item: Item;
};

export const ItemBanner: FC<ItemBannerProps> = ({ item }) => {
  return (
    <div className={clsx(styles["item-banner"], "row")}>
      <div className={clsx(styles["image-container"])}>
        <Image src={getItemPreviewUrl(item._id)} alt={item.name} fill />
      </div>
      <div>{item.name}</div>
    </div>
  );
};
