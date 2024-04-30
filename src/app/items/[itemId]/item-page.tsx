"use client";
import { ApiRoutes, getItem } from "@/apis";
import Loading from "@/components/loading";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FC } from "react";
import styles from "@/styles/pages/item-page.module.scss";
import clsx from "clsx";
import guard from "@/components/guardRoute";
import { ItemBanner } from "@/components/item";

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
    <main className={clsx(styles["item-page"], "column")}>
      <ItemBanner item={data.item} />
    </main>
  );
};

export default guard(ItemPage);
