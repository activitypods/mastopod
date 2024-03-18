import { forwardRef } from "react";
import {
  UserMenu as RaUserMenu,
  MenuItemLink,
  useGetIdentity,
  useTranslate,
  Logout,
} from "react-admin";
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import useOpenExternalApp from "../hooks/useOpenExternalApp";

const OutsideMenuItemLink = ({ to, primaryText, leftIcon }) => (
  <MenuItem component="a" href={to} sx={{ textDecoration: "none" }}>
    <ListItemIcon sx={{ minWidth: 5 }}>{leftIcon}</ListItemIcon>
    <ListItemText sx={{ color: "text.primary" }}>{primaryText}</ListItemText>
  </MenuItem>
);

const MyProfileMenu = forwardRef(({ onClick, label, to }, ref) => (
  <OutsideMenuItemLink
    ref={ref}
    to={to}
    primaryText={label}
    leftIcon={<PersonIcon />}
    onClick={onClick}
  />
));

const MyAddressMenu = forwardRef(({ onClick, to, label }, ref) => (
  <OutsideMenuItemLink
    ref={ref}
    to={to}
    primaryText={label}
    leftIcon={<HomeIcon />}
    onClick={onClick}
  />
));

const MyNetworkMenu = forwardRef(({ onClick, to, label }, ref) => (
  <OutsideMenuItemLink
    ref={ref}
    to={to}
    primaryText={label}
    leftIcon={<GroupIcon />}
    onClick={onClick}
  />
));

const LoginMenu = forwardRef(({ onClick, label }, ref) => (
  <MenuItemLink ref={ref} to="/login" primaryText={label} onClick={onClick} />
));

const UserMenu = ({ logout, ...otherProps }) => {
  const { identity } = useGetIdentity();
  const openExternalApp = useOpenExternalApp();
  const translate = useTranslate();
  return (
    <RaUserMenu {...otherProps}>
      {identity && identity.id !== "" ? (
        [
          <MyProfileMenu
            key="my-profile"
            label={translate("app.page.profile")}
            to={openExternalApp("as:Profile", identity?.profileData?.id)}
          />,
          <MyAddressMenu
            key="my-address"
            label={translate("app.page.addresses")}
            to={openExternalApp("vcard:Location")}
          />,
          <MyNetworkMenu
            key="my-network"
            label={translate("app.page.network")}
            to={openExternalApp("as:Profile")}
          />,
          <Logout key="logout" />,
        ]
      ) : (
        <LoginMenu label={translate("ra.auth.sign_in")} />
      )}
    </RaUserMenu>
  );
};

export default UserMenu;
