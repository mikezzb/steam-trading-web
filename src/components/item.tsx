import { decodeItemName } from "@/utils/cs";
import { Button, Paper } from "@mui/material";
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
      elevation={1}
      onClick={onClick}
    >
      <div className={styles["item-price"]}>
        {item.lowestPrice?.price?.toString() || "No Listing"}
      </div>
      <div className={styles["item-img"]}>
        <Image src={getItemPreviewUrl(item._id)} alt={item.name} fill />
      </div>
      <div className={styles["item-category"]}>{item.category}</div>
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
    <Paper className={clsx(styles["item-banner"], "row center")}>
      <div className={clsx(styles["image-container"])}>
        <Image src={getItemPreviewUrl(item._id)} alt={item.name} fill />
      </div>
      <div className={clsx(styles["item-detail"], "column")}>
        <div className={styles["item-category"]}>{item.category}</div>
        <div className={styles["item-skin"]}>{item.skin}</div>
        <div className={styles["item-exterior"]}>{item.exterior}</div>

        <div className={styles["item-price"]}>
          {item.lowestPrice?.price?.toString() || "No Listing"}
        </div>

        <div className={clsx(styles["item-actions"], "column")}>
          <Button variant="contained">Subscribe</Button>
        </div>
      </div>
    </Paper>
  );
};
