"use client";
import { FC, useState } from "react";
import styles from "@/styles/components/header.module.scss";
import clsx from "clsx";
import Image from "next/image";
import { useConfigContext, useUserContext } from "@/stores";
import {
  Autocomplete,
  Avatar,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import Currency from "@/utils/currency";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { AuthState } from "@/types/ui";
import { protectedRoutes } from "@/config";
import { MdKeyboardArrowDown, MdLogout, MdOutlineSearch } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes, getItemFilters } from "@/apis";
import { applyQueryParams } from "@/utils/ui";
import { getItemUrlByName } from "@/utils/routes";

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
      <Button
        onClick={handleClick}
        color="inherit"
        endIcon={<MdKeyboardArrowDown />}
      >
        {configStore.currency}
      </Button>
      <Menu
        id="price-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
      >
        {Currency.currencies.map((currency) => (
          <MenuItem key={currency} onClick={() => handleItemClick(currency)}>
            {currency}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

type AccountMenuProps = {};

const AccountMenu: FC<AccountMenuProps> = () => {
  const userStore = useUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    userStore.logout();
    onClose();
  };

  return (
    <>
      <IconButton onClick={onClick}>
        <Avatar className={styles["avatar"]}>
          {userStore.user?.username[0]}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        onClick={onClose}
        id="account-menu"
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <MdLogout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

type LoginButtonProps = {
  onClick?: () => void;
};
const LoginButton: FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <Button variant="contained" onClick={onClick}>
      Login
    </Button>
  );
};

const ItemSearchBar: FC = () => {
  const router = useRouter();
  const { data, isPending, isError } = useQuery({
    queryKey: [ApiRoutes.items, "filters"],
    queryFn: getItemFilters,
  });

  const names = data?.filters?.name || ["Loading..."];
  const nameSet = new Set(names);

  const applySearch = async (value: string) => {
    if (value === "") {
      applyQueryParams(null);
    } else {
      // redirect to the specific item page
      router.push(await getItemUrlByName(value));
    }
  };

  const onChange = (e: React.SyntheticEvent, value: string | null) => {
    if (value && nameSet.has(value)) {
      applySearch(value);
    } else if (value === "" || value === null) {
      applySearch("");
    }
  };

  return (
    <Autocomplete
      id="header-item-search"
      options={names}
      className="autocomplete"
      popupIcon={<MdOutlineSearch />}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          className="autocomplete-input"
          variant="outlined"
          placeholder="Search for items..."
          InputLabelProps={{ shrink: false }}
          size="small"
        />
      )}
    />
  );
};

const Header: FC = () => {
  const router = useRouter();
  const userStore = useUserContext();

  if (userStore.loading) return null;

  const renderUserSection = () => {
    if (userStore.loggedIn) {
      return <AccountMenu />;
    } else {
      return <LoginButton onClick={() => router.push("/login")} />;
    }
  };

  return (
    <header className={clsx(styles["header"], "row")}>
      <Logo onClick={() => router.push("/")} />
      <ItemSearchBar />
      <div className={clsx(styles["left-row"], "row center")}>
        <PriceMenu />
        {userStore.loading ? null : renderUserSection()}
      </div>
    </header>
  );
};

export default observer(Header);
