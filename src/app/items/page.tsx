"use client";
import Image from "next/image";
import styles from "@/styles/pages/items.module.scss";
import { useUIContext } from "@/stores";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
} from "@mui/material";
import { FC } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ApiRoutes, getItemFilters, getItems } from "@/apis";
import Loading from "@/components/loading";
import ErrorCard from "@/components/error-card";
import clsx from "clsx";
import { getNextPageParam } from "@/apis/utils";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeGrid, FixedSizeList } from "react-window";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { getItemGridConfigs, getValidParams } from "@/utils/ui";
import { ItemGridConfig, ItemsQueryParams, UiConfig } from "@/config";
import AutoSizer from "react-virtualized-auto-sizer";
import { decodeItemName } from "@/utils/cs";
import { ItemCard } from "@/components/item";
import { Item } from "@/types/transformed";
import { ItemsData } from "@/types/apis";
import { useRouter, useSearchParams } from "next/navigation";
import { getItemUrl, getItemsUrl } from "@/utils/routes";
import { MdExpandMore } from "react-icons/md";
type ItemRowProps = {
  items: Item[];
  style: any;
  itemWidth: number;
  itemHeight: number;
  onItemClick: (itemId: string) => void;
};

const ItemRow: FC<ItemRowProps> = ({
  items,
  style,
  itemWidth,
  itemHeight: itemHeightWithGap,
  onItemClick,
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
          onClick={() => onItemClick(item._id)}
        />
      ))}
    </div>
  );
};

type ItemListProps = {
  params?: URLSearchParams;
};

const ItemList: FC<ItemListProps> = ({ params }) => {
  const router = useRouter();

  const {
    isPending,
    isLoading,
    isFetching,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<ItemsData, Error>({
    queryKey: [ApiRoutes.items, params],
    queryFn: ({ pageParam }) => getItems({ page: pageParam, ...params }),
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
        onItemClick={onItemClick}
      />
    );
  };

  const onItemClick = (itemId: string) => {
    router.push(getItemUrl(itemId));
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

type ItemFilterBarProps = {
  params?: URLSearchParams;
};

type FilterProp<T = string | null> = {
  value?: T;
  onValueChange: (value: string) => void;
};

const CategoryFilter: FC<FilterProp> = ({ value, onValueChange }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<MdExpandMore />} id="category-filter">
        Category
      </AccordionSummary>
      <AccordionDetails>EXPANDED</AccordionDetails>
    </Accordion>
  );
};

const ItemFilterBar: FC<ItemFilterBarProps> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isPending, isError } = useQuery({
    queryKey: [ApiRoutes.items, "filters"],
    queryFn: getItemFilters,
  });

  const updatePathParams = (key: string, value: string) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set(key, value);
    window.history.pushState(null, "", `?${updatedParams.toString()}`);
  };

  const filtersData = data?.filters || {};

  return (
    <div
      className={clsx(styles["filter-bar"], "column center")}
      style={{
        width: UiConfig.sideBarWidth,
      }}
    >
      Filter Bar
      {JSON.stringify(params)}
      <CategoryFilter
        value={params?.get("category")}
        onValueChange={(v) => updatePathParams("category", v)}
      />
    </div>
  );
};

const ItemsPage: FC = () => {
  const uiStore = useUIContext();
  const searchParams = useSearchParams();
  const validParams = getValidParams(searchParams, ItemsQueryParams);
  return (
    <main className={clsx(styles["home"], "row page")}>
      <ItemFilterBar />
      <ItemList params={validParams} />
    </main>
  );
};

export default observer(ItemsPage);
