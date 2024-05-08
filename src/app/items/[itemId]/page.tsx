import { ApiRoutes, getItem } from "@/apis";
import { fetchServerData } from "@/apis/server";
import { ApiConfig, AppConfig } from "@/config";
import { getTotalPages } from "@/utils";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";
import ItemPage from "./item-page";
import { Item } from "@/types/transformed";
import { ItemsData, ItemsDataDTO } from "@/types/apis";
import { ItemDTO } from "@/types/dtos";

type Props = {
  params: {
    itemId: string;
  };
};

const Page: FC<Props> = (props) => <ItemPage params={props.params} />;

const fetchAllItems = async () => {
  const items: ItemDTO[] = [];
  let totalPages = 1;
  let page = 1;
  while (page <= totalPages) {
    // format query string
    const query = new URLSearchParams({ page: page.toString() });
    const endpoint = `items?${query}`;
    const { items: pageItems, total } = await fetchServerData<ItemsDataDTO>(
      endpoint
    );
    items.push(...pageItems);
    totalPages = getTotalPages(total, ApiConfig.itemPageSize);
    page++;
  }
  return items;
};

export async function generateStaticParams() {
  const items = await fetchAllItems();
  console.log(`Fetched ${items.length} items`);

  return items.map((item) => ({
    itemId: item._id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const itemId = params.itemId;
  const endpoint = `${ApiRoutes.items}/${itemId}`;
  const { item } = await fetchServerData<{ item: Item }>(endpoint);

  return {
    title: `${item.name} - ${AppConfig.name}`,
    description: `${item.name}, ${AppConfig.description}`,
  };
}

export const dynamic = "force-static";
export const dynamicParams = false;

export default Page;
