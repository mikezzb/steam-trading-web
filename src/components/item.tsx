import { getBuffUrl, getSteamMarketUrl } from "@/utils/cs";
import {
  Badge,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { FC, useEffect, useReducer, useState } from "react";
import styles from "@/styles/components/item.module.scss";
import Image from "next/image";
import { Item, Subscription } from "@/types/transformed";
import { getItemPreviewUrl } from "@/utils/routes";
import {
  MdOutlineArrowOutward,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineNotifications,
} from "react-icons/md";
import NextLink from "next/link";
import { MarketNames, SubNotiTypes } from "@/constants";
import { FCC, PropsWithItem } from "@/types/ui";
import { useUIContext, useUserContext } from "@/stores";
import TextField from "./textfield";
import {
  ApiRoutes,
  deleteSubscription,
  editSubscription,
  getSubscriptions,
  subscribeItem,
} from "@/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
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

type PassiveModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (val: any) => void;
  loading?: boolean;
};

type ItemSubscribeModalProps = PropsWithItem<
  PassiveModalProps & {
    initialState: Subscription | null;
  }
>;

const parsePaintSeeds = (paintSeeds: string) =>
  (paintSeeds ?? "")
    .split(",")
    .map((s: string) => parseInt(s.trim()))
    .filter((v) => !isNaN(v));

const ItemSubscribeModal: FC<ItemSubscribeModalProps> = ({
  item,
  open,
  onClose,
  onSubmit,
  loading,
  initialState,
}) => {
  const userStore = useUserContext();
  const uiStore = useUIContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  useEffect(() => {
    if (initialState) {
      setForm(initialState);
    }
  }, [initialState]);

  const handleChange = (e: any, label: string) => {
    setForm({ [label]: e.target.value });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.paintSeeds) {
      newErrors.paintSeeds = "Paint Seeds Required";
    }
    const parsedPaintSeeds = parsePaintSeeds(form.paintSeeds);
    if (
      parsedPaintSeeds.some((s: any) => isNaN(s)) ||
      !parsedPaintSeeds.length
    ) {
      newErrors.paintSeeds =
        "Paint Seeds Must be Numbers, Separated by Comma (e.g. 123, 456)";
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
      paintSeeds: parsePaintSeeds(form.paintSeeds),
      rarities: form.rarities,
      maxPremium: `${form.maxPremium}%`,
    };

    // await subscribeMutation.mutateAsync(sub);
    // onClose();
    // uiStore.success("Subscribed Successfully");
    onSubmit && onSubmit(sub);
  };

  return (
    <Modal
      disableScrollLock
      open={open}
      onClose={onClose}
      aria-labelledby="subscribe-modal"
      keepMounted={false}
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
            disabled={loading}
          >
            {loading ? <Loading /> : "Submit"}
          </Button>
        </form>
      </Paper>
    </Modal>
  );
};

type LabelRowProps = {
  label: string;
  className?: string;
  contentClassName?: string;
};

const LabelRow: FCC<LabelRowProps> = ({
  label,
  children,
  className,
  contentClassName,
}) => (
  <div className={clsx(styles["label-row"], "row", className)}>
    <div
      className={clsx(styles["label-row-label"], "label")}
    >{`${label}:`}</div>
    <div className={clsx(styles["label-row-content"], contentClassName)}>
      {children}
    </div>
  </div>
);

type ItemSubscribeListModalProps = {
  subscriptions: Subscription[];
  onDelete: (sub: Subscription) => void;
  onEdit: (sub: Subscription) => void;
} & PassiveModalProps;

const ItemSubscribeListModal: FC<ItemSubscribeListModalProps> = ({
  subscriptions,
  open,
  onClose,
  onDelete,
  onEdit,
}) => {
  return (
    <Modal disableScrollLock open={open} onClose={onClose}>
      <Paper
        className={clsx(
          styles["sub-modal"],
          "column",
          styles["sub-list-modal"]
        )}
      >
        <Typography variant="h6">Subscriptions</Typography>
        {subscriptions.map((sub: Subscription, i) => (
          <>
            <div className={clsx(styles["sub-item"], "row")}>
              <div
                className={clsx(styles["sub-list-item"], "column")}
                key={sub._id}
              >
                <LabelRow
                  label="Paint Seeds"
                  contentClassName={clsx(styles["sub-item-seeds"], "row")}
                >
                  {sub.paintSeeds?.map((seed) => (
                    <Chip
                      key={seed}
                      label={seed}
                      color="primary"
                      size="small"
                    />
                  ))}
                </LabelRow>
                <LabelRow label="Max Premium">
                  <div>{sub.maxPremium}</div>
                </LabelRow>
                <LabelRow label={sub.notiType}>
                  <div>{sub.notiId}</div>
                </LabelRow>
              </div>
              <div className={clsx(styles["sub-actions"], "row")}>
                <IconButton onClick={() => onDelete(sub)}>
                  <MdOutlineDelete />
                </IconButton>
                <IconButton onClick={() => onEdit(sub)}>
                  <MdOutlineEdit />
                </IconButton>
              </div>
            </div>
            {i !== subscriptions.length - 1 && <Divider />}
          </>
        ))}
      </Paper>
    </Modal>
  );
};

enum SubModal {
  None,
  SubscribeForm,
  Subscribes,
}

const ItemSubRow: FC<PropsWithItem> = ({ item }) => {
  const [modal, setModal] = useState(SubModal.Subscribes);
  const [editForm, setEditForm] = useState<Subscription | null>(null);
  const uiStore = useUIContext();

  const { isPending, refetch, data } = useQuery({
    queryKey: [ApiRoutes.subscriptions, item.name],
    queryFn: () => getSubscriptions(item.name),
  });

  const deleteSubMutation = useMutation({
    mutationFn: deleteSubscription,
  });

  const editSubMutation = useMutation({
    mutationFn: editSubscription,
  });

  const addSubMutation = useMutation({
    mutationFn: subscribeItem,
  });

  const subCount = data?.subscriptions?.length || 0;

  // refetch on modal close
  // useEffect(() => {
  //   if (modal === SubModal.None && !isPending) {
  //     console.log("Refetching");
  //     refetch();
  //   }
  // }, [modal, isPending, refetch]);

  const onSubFormSubmit = async (sub: Subscription) => {
    const isEdit = !!editForm;
    if (isEdit) {
      await editSubMutation.mutateAsync({
        id: editForm._id,
        subscription: sub,
      });
      // clear edit form
      setEditForm(null);
    } else {
      await addSubMutation.mutateAsync(sub);
    }

    // refetch on submit
    refetch();

    setModal(SubModal.None);
    uiStore.success(isEdit ? "Subscription Updated" : "Subscription Added");
  };

  const onSubFormClose = () => {
    setModal(SubModal.None);
    setEditForm(null);
  };

  const onEditClick = (sub: Subscription) => {
    setEditForm({
      ...sub,
      maxPremium: sub?.maxPremium?.replace("%", "") || "5",
      paintSeeds: (sub?.paintSeeds ?? []).join(", ") as any,
    });
    setModal(SubModal.SubscribeForm);
  };

  const onDeleteClick = async (sub: Subscription) => {
    await deleteSubMutation.mutateAsync(sub._id);
    // refetch on delete
    refetch();
    uiStore.success("Subscription Deleted");
  };

  return (
    <>
      <div className={clsx(styles["item-actions"], "row")}>
        <Button
          className={styles["sub-btn"]}
          variant="contained"
          onClick={() => setModal(SubModal.SubscribeForm)}
        >
          Subscribe
        </Button>
        {data?.subscriptions?.length && (
          <IconButton
            className={clsx(styles["sub-count"])}
            onClick={() => setModal(SubModal.Subscribes)}
          >
            <Badge badgeContent={subCount} color="primary">
              <MdOutlineNotifications />
            </Badge>
          </IconButton>
        )}
      </div>
      <ItemSubscribeModal
        item={item}
        open={modal === SubModal.SubscribeForm}
        onClose={onSubFormClose}
        // refetch on submit
        onSubmit={onSubFormSubmit}
        initialState={editForm}
      />
      <ItemSubscribeListModal
        open={modal === SubModal.Subscribes}
        onClose={() => setModal(SubModal.None)}
        subscriptions={data?.subscriptions || []}
        onEdit={onEditClick}
        onDelete={onDeleteClick}
      />
    </>
  );
};

export const ItemBannerCard: FC<PropsWithItem> = ({ item }) => {
  return (
    <>
      <Paper className={clsx(styles["item-banner-card"], "column")}>
        <div className={styles["item-category"]}>{item.category}</div>
        <div className={styles["item-skin"]}>{item.skin}</div>
        <div className={styles["item-exterior"]}>{item.exterior}</div>

        <div className={styles["item-price"]}>
          {item.lowestPrice?.price?.toString() || "No Listing"}
        </div>
        <ItemSubRow item={item} />
      </Paper>
    </>
  );
};
