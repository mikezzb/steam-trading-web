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
    <div
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

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < pageItems.length;

  const renderItemCard = ({ index, style }: any) => {
    if (!isItemLoaded(index)) {
      return null;
    }
    return (
      <div style={style}>
        <ItemCard
          item={pageItems[index]}
          width={gridConfigs.itemWidth}
          height={gridConfigs.itemHeight}
        />
      </div>
    );
  };

  const getListSize = () => {
    const horiSpaceLeft = width - UiConfig.sideBarWidth;
    const vertSpaceNeeded = gridConfigs.rows * gridConfigs.itemHeight;

    return {
      width: horiSpaceLeft,
      height: vertSpaceNeeded,
    };
  };

  const listSize = getListSize();
  const itemCount = hasNextPage ? pageItems.length + 1 : pageItems.length;

  return (
    <div className={clsx(styles["item-list"])}>
      {isPending && <Loading fixed />}
      <AutoSizer>
        {({ width, height }) => (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                ref={ref}
                height={height}
                width={width}
                itemCount={itemCount}
                onItemsRendered={onItemsRendered}
                itemSize={gridConfigs.itemHeight}
              >
                {renderItemCard}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
      {/* <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetching}
      >
        {isFetching ? "Loading more..." : hasNextPage ? "Load More" : "No more"}
      </Button> */}
    </div>
  );
};

const ItemFilterBar: FC = () => {
  return <div>Filter Bar</div>;
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
