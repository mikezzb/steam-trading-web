"use client";
import Image from "next/image";
import styles from "@/styles/pages/home.module.scss";
import { useUIContext } from "@/stores";
import { Button } from "@mui/material";
import { FC } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ApiRoutes, getItems } from "@/apis";
import Loading from "@/components/loading";
import ErrorCard from "@/components/error-card";
import clsx from "clsx";
import { getNextPageParam } from "@/apis/utils";

const ItemCard: FC<{ item: Item }> = ({ item }) => {
  return (
    <div>
      <Image
        src={`/images/previews/${item._id}.png`}
        alt={item.name}
        width={72}
        height={72}
      />
      <div>{item.name}</div>
    </div>
  );
};

const ItemList: FC = () => {
  const { isPending, isFetching, isError, data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<ItemsData, Error>({
      queryKey: [ApiRoutes.items],
      queryFn: ({ pageParam = 1 }) => getItems({ page: pageParam }),
      getNextPageParam: getNextPageParam,
      initialPageParam: 1,
    });

  if (isPending) return <Loading />;

  if (isError) return <ErrorCard />;

  const pageItems = data.pages.flatMap((page) => page.items);

  return (
    <div>
      {pageItems.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetching}
      >
        {isFetching ? "Loading more..." : hasNextPage ? "Load More" : "No more"}
      </Button>
    </div>
  );
};

const Home: FC = () => {
  const uiStore = useUIContext();
  return (
    <main className={clsx(styles["home"], "column center")}>
      <ItemList />
    </main>
  );
};

export default observer(Home);
