import { decodeItemName, getBuffUrl, getSteamMarketUrl } from "@/utils/cs";
import { Button, Link, Paper } from "@mui/material";
import clsx from "clsx";
import { FC } from "react";
import styles from "@/styles/components/item.module.scss";
import Image from "next/image";
import Currency from "@/utils/currency";
import { Item } from "@/types/transformed";
import { getItemPreviewUrl } from "@/utils/routes";
import { MdOpenInNew, MdOutlineArrowOutward } from "react-icons/md";

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
    <div className={clsx(styles["item-banner"], "row")}>
      <Paper className={clsx(styles["item-banner-left"], "column")}>
        <div className={clsx(styles["preview-wrapper"], "column center")}>
          <div className={clsx(styles["image-container"])}>
            <Image src={getItemPreviewUrl(item._id)} alt={item.name} fill />
          </div>
          <div className={clsx(styles["preview-actions"], "row")}>
            <Link
              className={clsx(styles["preview-link"], "row center")}
              href={getBuffUrl(item._id)}
              target="_blank"
              color={"inherit"}
              underline="none"
            >
              View at Buff <MdOutlineArrowOutward />
            </Link>
            <Link
              className={clsx(styles["preview-link"], "row center")}
              href={getSteamMarketUrl(item.name)}
              target="_blank"
              color={"inherit"}
              underline="none"
            >
              Check on Steam Market <MdOutlineArrowOutward />
            </Link>
            <Link
              className={clsx(styles["preview-link"], "row center")}
              href={getItemPreviewUrl(item._id)}
              target="_blank"
              color={"inherit"}
              underline="none"
            >
              Screenshot <MdOutlineArrowOutward />
            </Link>
          </div>
        </div>
      </Paper>
      <Paper className={clsx(styles["item-banner-right"], "column")}>
        <div className={styles["item-category"]}>{item.category}</div>
        <div className={styles["item-skin"]}>{item.skin}</div>
        <div className={styles["item-exterior"]}>{item.exterior}</div>

        <div className={styles["item-price"]}>
          {item.lowestPrice?.price?.toString() || "No Listing"}
        </div>

        <div className={clsx(styles["item-actions"], "column")}>
          <Button className={styles["sub-btn"]} variant="contained">
            Subscribe
          </Button>
        </div>
      </Paper>
    </div>
  );
};
