import { decodeItemName, getBuffUrl, getSteamMarketUrl } from "@/utils/cs";
import {
  Breadcrumbs,
  Button,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { FC, useState } from "react";
import styles from "@/styles/components/item.module.scss";
import Image from "next/image";
import Currency from "@/utils/currency";
import { Item } from "@/types/transformed";
import { getItemPreviewUrl } from "@/utils/routes";
import { MdOpenInNew, MdOutlineArrowOutward } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes, getItemTransactionsByDays } from "@/apis";
import NextLink from "next/link";
import { MarketNames } from "@/constants";

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

type ItemTransactionCardProps = {
  name: string;
};

export const ItemTransactionStats: FC<ItemTransactionCardProps> = ({
  name,
}) => {
  const [days, setDays] = useState(30);
  // get item transaction history
  const { data, isPending, isError } = useQuery({
    queryKey: [ApiRoutes.transactions, name, days],
    queryFn: () => getItemTransactionsByDays(name, days),
  });

  return (
    <Paper className={clsx(styles["item-transaction-card"], "column")}></Paper>
  );
};

enum TransactionTab {
  STATS = "Sales Chart",
  RECENT = "Recent Sales",
}

export const ItemTransactionCard: FC<ItemTransactionCardProps> = ({ name }) => {
  const [tabValue, setTabValue] = useState(TransactionTab.STATS);
  return (
    <Paper className={clsx(styles["item-transaction-card"], "column")}>
      <Tabs
        className="tran-tabs"
        value={tabValue}
        onChange={(e, value) => setTabValue(value)}
      >
        {Object.values(TransactionTab).map((tab) => (
          <Tab key={tab} label={tab} value={tab} />
        ))}
      </Tabs>
      {tabValue === TransactionTab.STATS && (
        <ItemTransactionStats name={name} />
      )}
      {tabValue === TransactionTab.RECENT && <div>Recent Sales</div>}
    </Paper>
  );
};

type PropsWithItem = {
  item: Item;
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

export const ItemBanner: FC<ItemBannerProps> = ({ item }) => {
  return (
    <div className={clsx(styles["item-banner"], "row")}>
      <div className={clsx(styles["item-banner-left"], "column")}>
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
        <ItemTransactionCard name={item.name} />
      </div>
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
