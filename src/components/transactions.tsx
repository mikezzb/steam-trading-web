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
  Typography,
  styled,
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
import { FCC, PropsWithItem } from "@/types/ui";
import Image from "next/image";
import { MdOpenInNew } from "react-icons/md";
import { getListingUrl } from "@/utils/cs";
import Loading from "./loading";

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
      height={480}
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
    <div className={clsx(styles["stats-container"], "column")}>
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
    </div>
  );
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  height: 72,
}));

const IconCell: FCC = ({ children }) => (
  <TableCell className={clsx(styles["icon-cell"])}>
    <div className={clsx(styles["item-icon-preview"], "image-container")}>
      {children}
    </div>
  </TableCell>
);

const StyledTable = styled(Table)(({ theme }) => ({
  "td, th": {
    border: "none",
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.action.focus,
  width: "100%",
}));

export const ItemListingsCard: FC<PropsWithItem> = ({ item }) => {
  // 0-indexed page
  const [page, setPage] = useState(0);
  const { data, isPending, isError } = useQuery({
    queryKey: [ApiRoutes.listings, item.name, page + 1],
    queryFn: () => getItemListingsByPage(item.name, page + 1),
  });

  return (
    <Paper className={clsx(styles["item-listings-card"], "column")}>
      <span className={styles["banner-title"]}>Listings</span>
      {isPending && <Loading fixed />}
      <TableContainer className={clsx(styles["listings-table"])}>
        <StyledTable>
          <StyledTableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Wear</TableCell>
              <TableCell>Paintseed</TableCell>
              <TableCell>Market</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Buy</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {data?.listings.map((listing) => (
              <StyledTableRow key={listing._id}>
                <IconCell>
                  <Image
                    src={getItemPreviewUrl(item._id)}
                    width={36}
                    height={36}
                    alt={item.name}
                  />
                </IconCell>
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
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={data?.total || 0}
        rowsPerPage={ApiConfig.listingPageSize}
        page={page}
        onPageChange={(e, p) => setPage(p)}
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
    <TableContainer className={styles["recent-table"]}>
      <StyledTable>
        <StyledTableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Wear</TableCell>
            <TableCell>Paintseed</TableCell>
            <TableCell>Market</TableCell>
            {/* <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell> */}
            <TableCell>Price</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {data?.transactions.map((transaction) => (
            <StyledTableRow key={transaction._id}>
              <IconCell>
                <Image
                  src={getItemPreviewUrl(item._id)}
                  width={36}
                  height={36}
                  alt={item.name}
                />
              </IconCell>
              <TableCell>
                {new Date(transaction.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{formatWear(transaction.paintWear)}</TableCell>
              <TableCell>{transaction.paintSeed}</TableCell>
              <TableCell>{transaction.metadata.market}</TableCell>
              <TableCell>
                {new Currency(transaction.price).toString()}
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
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
