import {
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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
  getItemTransactionsByDays,
  getItemTransactionsByPage,
} from "@/apis";
import { LineChart, chartsGridClasses } from "@mui/x-charts";
import {
  TransactionConfig,
  TransactionQueryDays,
  TransactionQueryDaysLabel,
} from "@/config";
import { formatWear } from "@/utils/ui";

type ItemTransactionCardProps = {
  name: string;
};

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

const ItemTransactionStats: FC<ItemTransactionCardProps> = ({ name }) => {
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

const ItemTransactionRecent: FC<ItemTransactionCardProps> = ({ name }) => {
  const { data, isPending, isError } = useQuery({
    queryKey: [ApiRoutes.transactions, name, 1],
    queryFn: () => getItemTransactionsByPage(name, 1),
  });

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Wear</TableCell>
            <TableCell align="right">Paint Seed</TableCell>
            <TableCell align="right">Market</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell component="th" scope="row">
                {transaction.name}
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

export const ItemTransactionCard: FC<ItemTransactionCardProps> = ({ name }) => {
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
        <ItemTransactionStats name={name} />
      )}
      {tabValue === TransactionTab.RECENT && (
        <ItemTransactionRecent name={name} />
      )}
    </Paper>
  );
};
