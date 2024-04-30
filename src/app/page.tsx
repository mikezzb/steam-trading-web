"use client";
import Image from "next/image";
import styles from "@/styles/pages/home.module.scss";
import { useUIContext } from "@/stores";
import { Button, Paper } from "@mui/material";
import { FC } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ApiRoutes, getItems } from "@/apis";
import Loading from "@/components/loading";
import ErrorCard from "@/components/error-card";
import clsx from "clsx";
import { getNextPageParam } from "@/apis/utils";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeGrid, FixedSizeList } from "react-window";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { getItemGridConfigs } from "@/utils/ui";
import { ItemGridConfig, UiConfig } from "@/config";
import AutoSizer from "react-virtualized-auto-sizer";

type ItemCardProps = {
  item: Item;
  width: number;
  height: number;
};

const ItemCard: FC<ItemCardProps> = ({ item, width, height }) => {
  return (
    <Paper
      className={clsx(styles["item-card"], "column center")}
      style={{
        width: width,
        height: height,
      }}
    >
      <Image
        src={`/images/previews/${item._id}.png`}
        alt={item.name}
        width={72}
        height={72}
      />
      <div>{item.name}</div>
    </Paper>
  );
};

type ItemRowProps = {
  items: Item[];
  style: any;
  itemWidth: number;
  itemHeight: number;
};

const ItemRow: FC<ItemRowProps> = ({
  items,
  style,
  itemWidth,
  itemHeight: itemHeightWithGap,
}) => {
  const itemHeight = itemHeightWithGap - UiConfig.itemGap;
  return (
    <div className={clsx(styles["item-row"], "row")} style={style}>
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          width={itemWidth}
          height={itemHeight}
        />
      ))}
    </div>
  );
};

const ItemList: FC = () => {
  const {
    isPending,
    isLoading,
    isFetching,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<ItemsData, Error>({
    queryKey: [ApiRoutes.items],
    queryFn: ({ pageParam }) => getItems({ page: pageParam }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 1,
  });

  const { width, height } = useWindowDimensions();

  if (isError) return <ErrorCard />;

  // initial loading
  if (isLoading || !data) return <Loading grow />;

  const loadMoreItems = async (): Promise<void> => {
    console.log(`load more items`);
    if (isPending || !hasNextPage) {
      return;
    }

    await fetchNextPage();
  };

  const pageItems = data.pages.flatMap((page) => page.items);
  const totalItems = data.pages[0].total;
  const gridConfigs = getItemGridConfigs(totalItems, width, height);

  const isRowLoaded = (index: number) => {
    if (!hasNextPage) {
      return true;
    }
    const loadedRows = Math.ceil(pageItems.length / gridConfigs.cols);
    return index < loadedRows;
  };

  const renderItemRow = ({ index, style }: any) => {
    // check if item is loaded
    if (!pageItems[index]) {
      return;
    }
    // get items based on row index
    const start = index * gridConfigs.cols;
    const end = Math.min(start + gridConfigs.cols, pageItems.length);
    const items = pageItems.slice(start, end);
    return (
      <ItemRow
        items={items}
        style={style}
        itemWidth={gridConfigs.itemWidth}
        itemHeight={gridConfigs.itemHeight}
      />
    );
  };

  const loadedRows = Math.ceil(pageItems.length / gridConfigs.cols);
  const rowCount = hasNextPage ? loadedRows + 1 : loadedRows;

  return (
    <div className={clsx(styles["item-list"])}>
      {isPending && <Loading fixed />}
      <AutoSizer>
        {({ width, height }) => (
          <InfiniteLoader
            isItemLoaded={isRowLoaded}
            itemCount={rowCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                ref={ref}
                height={height}
                width={width}
                itemCount={rowCount}
                onItemsRendered={onItemsRendered}
                itemSize={gridConfigs.itemHeight}
              >
                {renderItemRow}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
};

const ItemFilterBar: FC = () => {
  return (
    <div
      className={clsx(styles["filter-bar"], "row center")}
      style={{
        width: UiConfig.sideBarWidth,
      }}
    >
      Filter Bar
    </div>
  );
};

const Home: FC = () => {
  const uiStore = useUIContext();
  return (
    <main className={clsx(styles["home"], "row center")}>
      <ItemFilterBar />
      <ItemList />
    </main>
  );
};

export default observer(Home);
