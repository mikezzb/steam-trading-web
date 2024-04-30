"use client";
import { FC, useState } from "react";
import styles from "@/styles/components/header.module.scss";
import clsx from "clsx";
import Image from "next/image";
import { useConfigContext } from "@/stores";
import { Button, Menu, MenuItem } from "@mui/material";
import Currency from "@/utils/currency";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

type LogoProps = {
  onClick?: () => void;
};

const Logo: FC<LogoProps> = ({ onClick }) => {
  return (
    <div className={styles["logo"]} onClick={onClick}>
      <Image src="/logo.svg" alt="logo" fill />
    </div>
  );
};

const PriceMenu: FC = () => {
  const configStore = useConfigContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (currency: string) => {
    configStore.setCurrency(currency);
    handleClose();
    // TODO: update prices dynamically by making currency observable?
    // refresh
    location.reload();
  };

  return (
    <div className={clsx(styles["price-menu"])}>
      <Button onClick={handleClick} color="inherit">
        {configStore.currency}
        <span>▼</span>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {Currency.currencies.map((currency) => (
          <MenuItem key={currency} onClick={() => handleItemClick(currency)}>
            {currency}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const Header: FC = () => {
  const router = useRouter();
  return (
    <header className={clsx(styles["header"], "row")}>
      <Logo onClick={() => router.push("/")} />
      <div className={clsx(styles["left-row"], "row")}>
        <PriceMenu />
        <Button
          variant="contained"
          onClick={() =>
            router.push(`/login?redirect=${window.location.pathname}`)
          }
        >
          Login
        </Button>
      </div>
    </header>
  );
};

export default observer(Header);
