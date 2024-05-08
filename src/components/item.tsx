import { getBuffUrl, getSteamMarketUrl } from "@/utils/cs";
import {
  Breadcrumbs,
  Button,
  Chip,
  Link,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { FC, useReducer, useState } from "react";
import styles from "@/styles/components/item.module.scss";
import Image from "next/image";
import { Item, Subscription } from "@/types/transformed";
import { getItemPreviewUrl } from "@/utils/routes";
import { MdOutlineArrowOutward } from "react-icons/md";
import NextLink from "next/link";
import { MarketNames, SubNotiTypes } from "@/constants";
import { PropsWithItem } from "@/types/ui";
import { useUserContext } from "@/stores";
import TextField from "./textfield";
import { subscribeItem } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import Loading from "./loading";

type ItemCardProps = {
  item: Item;
  width: number;
  height: number;
  onClick?: () => void;
};

export const ItemCard: FC<ItemCardProps> = ({
  item,
  width,
  height,
  onClick,
}) => {
  return (
    <Paper
      className={clsx(styles["item-card"], "column center")}
      style={{
        width: width,
        height: height,
      }}
      elevation={1}
      onClick={onClick}
    >
      <div className={styles["item-price"]}>
        {item.lowestPrice?.price?.toString() || "No Listing"}
      </div>
      <div className={styles["item-img"]}>
        <Image src={getItemPreviewUrl(item._id)} alt={item.name} fill />
      </div>
      <div className={styles["item-category"]}>{item.category}</div>
      <div className={styles["item-skin"]}>{item.skin}</div>
      <div className={styles["item-exterior"]}>{item.exterior}</div>
    </Paper>
  );
};

const ItemBreadcrumb: FC<PropsWithItem> = ({ item }) => {
  return (
    <Breadcrumbs className={styles["item-breadcrumb"]} aria-label="breadcrumb">
      <Link
        underline="hover"
        color="inherit"
        href="/items"
        component={NextLink}
      >
        {MarketNames.CS}
      </Link>
      <Link
        underline="hover"
        color="inherit"
        href={`/items?category=${item.category}`}
      >
        {item.category}
      </Link>
      <Typography color="text.primary">{item.skin}</Typography>
    </Breadcrumbs>
  );
};

export const ItemPreviewCard: FC<PropsWithItem> = ({ item }) => (
  <Paper className={clsx(styles["preview-wrapper"], "column")}>
    <ItemBreadcrumb item={item} />
    <div className={clsx(styles["image-container"])}>
      <Image src={getItemPreviewUrl(item._id)} alt={item.name} fill />
    </div>
    <div className={clsx(styles["preview-actions"], "row")}>
      <Link
        className={clsx(styles["preview-link"], "row center")}
        href={getBuffUrl(item._id)}
        target="_blank"
        color={"inherit"}
        underline="hover"
      >
        View at Buff <MdOutlineArrowOutward />
      </Link>
      <Link
        className={clsx(styles["preview-link"], "row center")}
        href={getSteamMarketUrl(item.name)}
        target="_blank"
        color={"inherit"}
        underline="hover"
      >
        Check on Steam Market <MdOutlineArrowOutward />
      </Link>
      <Link
        className={clsx(styles["preview-link"], "row center")}
        href={getItemPreviewUrl(item._id)}
        target="_blank"
        color={"inherit"}
        underline="hover"
      >
        Screenshot <MdOutlineArrowOutward />
      </Link>
    </div>
  </Paper>
);

type ItemSubscribeModalProps = PropsWithItem<{
  open: boolean;
  onClose: () => void;
}>;

const SubTextFields = [
  {
    label: "Notification ID (e.g. Telegram Chat ID)",
    name: "notiId",
  },
  {
    label: "Max Premium (%)",
    name: "maxPremium",
  },
];

// MUI Chips Select
const ChipSelect = ({ label, options, selected, onChange }: any) => {
  return (
    <div className={clsx("column")}>
      <div className={clsx(styles["select-chip-label"], "label")}>{label}</div>
      <div className={clsx(styles["chip-options"], "row")}>
        {options.map((option: any) => (
          <Chip
            key={option}
            label={option}
            onClick={() => onChange(option)}
            variant={selected === option ? "filled" : "outlined"}
            color="primary"
          />
        ))}
      </div>
    </div>
  );
};

const ItemSubscribeModal: FC<ItemSubscribeModalProps> = ({
  item,
  open,
  onClose,
}) => {
  const userStore = useUserContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const subscribeMutation = useMutation({
    mutationFn: subscribeItem,
  });
  const [form, setForm] = useReducer(
    (state: any, newState: any) => ({
      ...state,
      ...newState,
    }),
    {
      name: item.name,
      paintSeeds: "",
      // rarities: [],
      maxPremium: "5",
      notiType: SubNotiTypes.telegram.name,
      notiId: "",
    }
  );

  const handleChange = (e: any, label: string) => {
    setForm({ [label]: e.target.value });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.paintSeeds) {
      newErrors.paintSeeds = "Paint Seeds Required";
    }
    if (!form.maxPremium) {
      newErrors.maxPremium = "Max Premium Required";
    }
    if (!form.notiId) {
      newErrors.notiId = "Notification ID Required";
    }
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Validation
    if (!validateForm()) return;

    const sub: Subscription = {
      ...form,
      paintSeeds: form.paintSeeds
        .split(",")
        .map((s: string) => parseInt(s.trim())),
      rarities: form.rarities,
      maxPremium: `${form.maxPremium}%`,
    };
    await subscribeMutation.mutateAsync(sub);
    onClose();
  };

  return (
    <Modal
      disableScrollLock
      open={open}
      onClose={onClose}
      aria-labelledby="subscribe-modal"
    >
      <Paper className={clsx(styles["sub-modal"], "column")}>
        <Typography variant="h6">Subscribe to {item.name}</Typography>
        <form className={clsx(styles["sub-form"], "column")}>
          <TextField
            label="Paint Seeds (sepetated by comma)"
            value={form["paintSeeds"]}
            onChange={(e) => handleChange(e, "paintSeeds")}
            placeholder="Paint seed 1, paint seed 2"
            error={errors.paintSeeds}
          />
          <TextField
            label="Max Premium % (Notify if listing price <= (1 + X)% of lowest)"
            value={form["maxPremium"]}
            onChange={(e) => handleChange(e, "maxPremium")}
            type="number"
            error={errors.maxPremium}
          />
          <ChipSelect
            label="Notification Type"
            options={Object.keys(SubNotiTypes)}
            selected={form.notiType}
            onChange={(v: string) => setForm({ notiType: v })}
          />
          <TextField
            label={`Notification ID (${SubNotiTypes[form.notiType].idHint})`}
            value={form["notiId"]}
            onChange={(e) => handleChange(e, "notiId")}
            placeholder={SubNotiTypes[form.notiType].idHint}
            error={errors.notiId}
          />

          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            className={styles["sub-submit-btn"]}
            disabled={subscribeMutation.isPending}
          >
            {subscribeMutation.isPending ? <Loading /> : "Submit"}
          </Button>
        </form>
      </Paper>
    </Modal>
  );
};

export const ItemBannerCard: FC<PropsWithItem> = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Paper className={clsx(styles["item-banner-card"], "column")}>
        <div className={styles["item-category"]}>{item.category}</div>
        <div className={styles["item-skin"]}>{item.skin}</div>
        <div className={styles["item-exterior"]}>{item.exterior}</div>

        <div className={styles["item-price"]}>
          {item.lowestPrice?.price?.toString() || "No Listing"}
        </div>

        <div className={clsx(styles["item-actions"], "column")}>
          <Button
            className={styles["sub-btn"]}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Subscribe
          </Button>
        </div>
      </Paper>
      <ItemSubscribeModal
        item={item}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
