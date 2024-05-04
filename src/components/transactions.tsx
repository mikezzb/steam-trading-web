import {
  Avatar,
  Button,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
} from "@mui/material";
import clsx from "clsx";
import { FC, useState } from "react";
import styles from "@/styles/components/transactions.module.scss";
import Currency from "@/utils/currency";
import { Item, Transaction } from "@/types/transformed";
import { useQuery } from "@tanstack/react-query";
import {
  ApiRoutes,
  getItemListingsByPage,
  getItemTransactionsByDays,
  getItemTransactionsByPage,
} from "@/apis";
import { LineChart, chartsGridClasses } from "@mui/x-charts";
import {
  ApiConfig,
  TransactionConfig,
  TransactionQueryDays,
  TransactionQueryDaysLabel,
} from "@/config";
import { formatWear, openLink } from "@/utils/ui";
import { getItemPreviewUrl } from "@/utils/routes";
import { getItemId } from "@/utils/data";
import { PropsWithItem } from "@/types/ui";
import Image from "next/image";
import { MdOpenInNew } from "react-icons/md";
import { getListingUrl } from "@/utils/cs";

type MedianPrice = {
  x: Date;
  y: number;
};

const getTransactionStats = (
  transactions: Transaction[]
): { x: Date[]; y: number[] } => {
  const dailyPrices: Record<string, number[]> = {};
  for (const transaction of transactions) {
    const date = new Date(transaction.createdAt);
    // get the day with YYYY-MM-DD format
    const day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (!dailyPrices[day]) {
      dailyPrices[day] = [];
    }
    dailyPrices[day].push(+transaction.price);
  }
  const dailyMedians: Record<string, number> = {};
  for (const day in dailyPrices) {
    const prices = dailyPrices[day];
    prices.sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    dailyMedians[day] = median;
  }

  const medianPrices: MedianPrice[] = Object.keys(dailyMedians).map(
    (day, i) => {
      // extract year, month, day from the date string
      const [year, month, date] = day.split("-");
      return {
        x: new Date(+year, +month, +date),
        y: new Currency(dailyMedians[day]).to().value,
      };
    }
  );

  // sort the median prices by date
  medianPrices.sort((a, b) => a.x.getTime() - b.x.getTime());

  const timeData = medianPrices.map((price) => price.x);
  const priceData = medianPrices.map((price) => price.y);

  return { x: timeData, y: priceData };
};

type SalesChartProps = {
  x: Date[];
  y: number[];
  dataDays: number;
};

const currencyValueFormatter = (v: number | null) =>
  `${Currency.targetSymbol}${v?.toFixed(2) || 0}`;

const dateValueFormatter = (date: Date) =>
  date.getHours() === 0
    ? date.toLocaleDateString("us-US", {
        month: "2-digit",
        day: "2-digit",
      })
    : date.toLocaleTimeString("us-US", {
        hour: "2-digit",
      });

const SalesChart: FC<SalesChartProps> = ({ x, y, dataDays }) => {
  return (
    <LineChart
      grid={{ horizontal: true }}
      xAxis={[
        {
          tickMinStep: Math.max(
            3600 * 1000 * 24,
            (3600 * 1000 * 24 * dataDays) / 10
          ),
          data: x,
          scaleType: "time",
          valueFormatter: dateValueFormatter,
        },
      ]}
      sx={{
        [`& .${chartsGridClasses.line}`]: {
          strokeDasharray: "5 3",
          strokeWidth: 2,
        },
      }}
      series={[
        {
          type: "line",
          data: y,
          valueFormatter: currencyValueFormatter,
        },
      ]}
      yAxis={[
        {
          valueFormatter: currencyValueFormatter,
        },
      ]}
      margin={{ right: 50, left: 80 }}
      height={320}
    />
  );
};

const ItemTransactionStats: FC<PropsWithItem> = ({ item: { name } }) => {
  const [days, setDays] = useState(TransactionConfig.statDays);
  // get item transaction history
  const { data, isPending, isError } = useQuery({
    queryKey: [ApiRoutes.transactions, name, days],
    queryFn: () => getItemTransactionsByDays(name, days),
  });

  const { x, y } = getTransactionStats(data?.transactions || []);

  return (
    <>
      <SalesChart x={x} y={y} dataDays={days} />
      <div className={clsx(styles["tran-days-tabs"], "row")}>
        {TransactionQueryDays.map((d, i) => (
          <span
            className={clsx(
              styles["tran-days-tab"],
              d === days && styles["active"]
            )}
            key={d}
            onClick={() => setDays(d)}
          >
            {TransactionQueryDaysLabel[i]}
          </span>
        ))}
      </div>
    </>
  );
};

export const ItemListingsCard: FC<PropsWithItem> = ({ item }) => {
  const { data, isPending, isError } = useQuery({
    queryKey: [ApiRoutes.listings, item.name, 1],
    queryFn: () => getItemListingsByPage(item.name, 1),
  });

  return (
    <Paper className={clsx(styles["item-listings-card"], "column")}>
      <TableContainer>
        <Table
          // hide the borders
          sx={{
            "td, th": {
              border: "none",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Wear</TableCell>
              <TableCell>Paintseed</TableCell>
              <TableCell>Market</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.listings.map((listing) => (
              <TableRow key={listing._id}>
                <TableCell
                  className={clsx(styles["icon-cell"])}
                  component="th"
                  scope="row"
                >
                  <div
                    className={clsx(
                      styles["item-icon-preview"],
                      "image-container"
                    )}
                  >
                    <Image
                      src={getItemPreviewUrl(item._id)}
                      alt={listing.name}
                      width={36}
                      height={36}
                    />
                  </div>
                </TableCell>
                <TableCell>{formatWear(listing.paintWear)}</TableCell>
                <TableCell>{listing.paintSeed}</TableCell>
                <TableCell>{listing.market}</TableCell>
                <TableCell>{new Currency(listing.price).toString()}</TableCell>
                <TableCell className={clsx(styles["btn-cell"])}>
                  <IconButton
                    color="secondary"
                    onClick={() => openLink(getListingUrl(listing))}
                  >
                    <MdOpenInNew />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={data?.total || 0}
        rowsPerPage={ApiConfig.listingPageSize}
        page={0}
        onPageChange={() => {}}
      />
    </Paper>
  );
};

const ItemTransactionRecent: FC<PropsWithItem> = ({ item }) => {
  const { data, isPending, isError } = useQuery({
    queryKey: [ApiRoutes.transactions, item.name, 1],
    queryFn: () => getItemTransactionsByPage(item.name, 1),
  });

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Wear</TableCell>
            <TableCell align="right">Paintseed</TableCell>
            <TableCell align="right">Market</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell component="th" scope="row">
                <div
                  className={clsx(
                    styles["item-icon-preview"],
                    "image-container"
                  )}
                >
                  <Image
                    src={getItemPreviewUrl(item._id)}
                    alt={transaction.name}
                    width={40}
                    height={40}
                  />
                </div>
              </TableCell>
              <TableCell align="right">
                {new Currency(transaction.price).toString()}
              </TableCell>
              <TableCell align="right">
                {formatWear(transaction.paintWear)}
              </TableCell>
              <TableCell align="right">{transaction.paintSeed}</TableCell>
              <TableCell align="right">{transaction.metadata.market}</TableCell>
              <TableCell align="right">
                {/* Date: YYYY-MM-DD */}
                {new Date(transaction.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

enum TransactionTab {
  STATS = "Sales Chart",
  RECENT = "Recent Sales",
}

export const ItemTransactionCard: FC<PropsWithItem> = ({ item }) => {
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
        <ItemTransactionStats item={item} />
      )}
      {tabValue === TransactionTab.RECENT && (
        <ItemTransactionRecent item={item} />
      )}
    </Paper>
  );
};
