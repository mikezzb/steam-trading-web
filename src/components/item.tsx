import { getBuffUrl, getSteamMarketUrl } from "@/utils/cs";
import { Breadcrumbs, Button, Link, Paper, Typography } from "@mui/material";
import clsx from "clsx";
import { FC } from "react";
import styles from "@/styles/components/item.module.scss";
import Image from "next/image";
import { Item } from "@/types/transformed";
import { getItemPreviewUrl } from "@/utils/routes";
import { MdOutlineArrowOutward } from "react-icons/md";
import NextLink from "next/link";
import { MarketNames } from "@/constants";
import { PropsWithItem } from "@/types/ui";

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

const ItemBreadcrumb: FC<PropsWithItem> = ({ item }) => {
  return (
    <Breadcrumbs className={styles["item-breadcrumb"]} aria-label="breadcrumb">
      <Link
        underline="hover"
        color="inherit"
        href="/items"
        component={NextLink}
      >
        {MarketNames.CS}
      </Link>
      <Link
        underline="hover"
        color="inherit"
        href={`/items?category=${item.category}`}
      >
        {item.category}
      </Link>
      <Typography color="text.primary">{item.skin}</Typography>
    </Breadcrumbs>
  );
};

export const ItemPreviewCard: FC<PropsWithItem> = ({ item }) => (
  <Paper className={clsx(styles["preview-wrapper"], "column")}>
    <ItemBreadcrumb item={item} />
    <div className={clsx(styles["image-container"])}>
      <Image src={getItemPreviewUrl(item._id)} alt={item.name} fill />
    </div>
    <div className={clsx(styles["preview-actions"], "row")}>
      <Link
        className={clsx(styles["preview-link"], "row center")}
        href={getBuffUrl(item._id)}
        target="_blank"
        color={"inherit"}
        underline="hover"
      >
        View at Buff <MdOutlineArrowOutward />
      </Link>
      <Link
        className={clsx(styles["preview-link"], "row center")}
        href={getSteamMarketUrl(item.name)}
        target="_blank"
        color={"inherit"}
        underline="hover"
      >
        Check on Steam Market <MdOutlineArrowOutward />
      </Link>
      <Link
        className={clsx(styles["preview-link"], "row center")}
        href={getItemPreviewUrl(item._id)}
        target="_blank"
        color={"inherit"}
        underline="hover"
      >
        Screenshot <MdOutlineArrowOutward />
      </Link>
    </div>
  </Paper>
);

export const ItemBannerCard: FC<PropsWithItem> = ({ item }) => (
  <Paper className={clsx(styles["item-banner-card"], "column")}>
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
);
