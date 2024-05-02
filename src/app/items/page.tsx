"use client";
import Image from "next/image";
import styles from "@/styles/pages/items.module.scss";
import { useUIContext } from "@/stores";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
} from "@mui/material";
import { FC, useEffect } from "react";
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
import { CsExteriors } from "@/constants";
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

const ItemList: FC<ItemListProps> = ({}) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const validParams = getValidParams(searchParams, ItemsQueryParams);

  // search params
  const category = validParams.get("category");
  const exterior = validParams.get("exterior");
  const skin = validParams.get("skin");

  const {
    isPending,
    isLoading,
    isFetching,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<ItemsData, Error>({
    queryKey: [ApiRoutes.items, category, exterior, skin],
    queryFn: ({ pageParam }) =>
      getItems({ page: pageParam, category, exterior, skin }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 1,
  });

  useEffect(() => {
    refetch();
  }, [category, exterior, skin, refetch]);

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

type FilterProp<T = string | null, P = string> = {
  value?: T;
  values?: P[];
  onValueChange: (value: T) => void;
};

const CategoryFilter: FC<FilterProp> = ({ value, values, onValueChange }) => {
  return (
    <Accordion className="accordion" disableGutters>
      <AccordionSummary expandIcon={<MdExpandMore />} id="category-filter">
        Category
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {values?.map((v) => (
            <FormControlLabel key={v} control={<Checkbox />} label={v} />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

const ExteriorFilter: FC<FilterProp<string[] | null>> = ({
  value,
  values,
  onValueChange,
}) => {
  console.log(value);
  const onCheck = (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const { checked } = e.target;
    if (checked) {
      onValueChange([...(value ?? []), label]);
    } else {
      onValueChange((value ?? []).filter((a) => a !== label));
    }
  };

  return (
    <Accordion className="accordion" disableGutters>
      <AccordionSummary expandIcon={<MdExpandMore />} id="category-filter">
        Exterior
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {CsExteriors.map((v) => (
            <FormControlLabel
              key={v}
              control={
                <Checkbox
                  checked={value?.includes(v) ?? false}
                  onChange={(e) => onCheck(e, v)}
                />
              }
              label={v}
            />
          ))}
        </FormGroup>
      </AccordionDetails>
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

  const updatePathParams = (key: string, value: any) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set(key, value);
    window.history.pushState(null, "", `?${updatedParams.toString()}`);
  };

  const filtersData = data?.filters;

  const onExteriorChange = (value: string) => {};

  return (
    <Paper
      className={clsx(styles["filter-bar"], "column")}
      style={{
        width: UiConfig.sideBarWidth,
      }}
    >
      <ExteriorFilter
        value={searchParams?.get("exterior")?.split(",") ?? []}
        values={filtersData?.exterior ?? CsExteriors}
        onValueChange={(v) => updatePathParams("exterior", v ?? "")}
      />
      <CategoryFilter
        value={searchParams?.get("category")}
        values={filtersData?.category}
        onValueChange={(v) => updatePathParams("category", v ?? "")}
      />
    </Paper>
  );
};

const ItemsPage: FC = () => {
  const uiStore = useUIContext();
  return (
    <main className={clsx(styles["home"], "row page")}>
      <ItemFilterBar />
      <ItemList />
    </main>
  );
};

export default observer(ItemsPage);
