"use client";
import { ApiRoutes, getItem } from "@/apis";
import Loading from "@/components/loading";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FC } from "react";
import styles from "@/styles/pages/item.module.scss";
import clsx from "clsx";
import guard from "@/components/guardRoute";
import { ItemBannerCard, ItemPreviewCard } from "@/components/item";
import {
  ItemListingsCard,
  ItemTransactionCard,
} from "@/components/transactions";

type ItemProps = {
  params: {
    itemId: string;
  };
};

const ItemPage: FC<ItemProps> = (props) => {
  const { itemId } = props.params;
  const { isPending, error, data } = useQuery({
    queryKey: [ApiRoutes.items, itemId],
    queryFn: () => getItem(itemId),
  });

  if (isPending) return <Loading />;

  if (error) return;

  return (
    <main className={clsx(styles["item-page"], "page column")}>
      <div className={clsx(styles["item-banner"], "column")}>
        <div className={clsx(styles["item-banner-row"], "row")}>
          <ItemPreviewCard item={data.item} />
          <ItemBannerCard item={data.item} />
        </div>
        <div className={clsx(styles["item-banner-row"], "row")}>
          <ItemTransactionCard item={data.item} />
          <ItemListingsCard item={data.item} />
        </div>
      </div>
    </main>
  );
};

export default guard(ItemPage);
