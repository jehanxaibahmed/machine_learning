import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import logo2 from "../../assets/img/logo.png";

// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import Fingerprint from "@material-ui/icons/Fingerprint";


import useMediaQuery from '@material-ui/core/useMediaQuery';

// core components
import Button from "components/CustomButtons/Button";

import styles from "assets/jss/material-dashboard-pro-react/components/authNavbarStyle.js";

const useStyles = makeStyles(styles);

export default function AuthNavbar(props) {
  const matches =  useMediaQuery('(min-width:900px)');
  const [open, setOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = routeName => {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  };
  const classes = useStyles();
  const { color, brandText } = props;
  const appBarClasses = cx({
    [" " + classes[color]]: color
  });

  const Path = window.location.pathname.toString();
  var list = (
    <List className={classes.list}>
      {Path !== "/auth/loginVendor" ? (
      <ListItem className={classes.listItem}>
        <NavLink
          to={"/auth/loginVendor"}
          className={cx(classes.navLink, {
            [classes.navLinkActive]: activeRoute("/auth/loginVendor")
          })}
        >
          <Fingerprint className={classes.listItemIcon} />
          <ListItemText
            primary={"S-ZONE"}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>):''}
      {Path !== "/auth/login" ? (
      <ListItem className={classes.listItem}>
        <NavLink
          to={"/auth/login"}
          className={cx(classes.navLink, {
            [classes.navLinkActive]: activeRoute("/auth/login")
          })}
        >
          <Fingerprint className={classes.listItemIcon} />
          <ListItemText
            primary={"O-ZONE"}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>):''}
      {Path !== "/auth/regTenant" ? (
      <ListItem className={classes.listItem}>
        <NavLink
          to={"/auth/regTenant"}
          className={cx(classes.navLink, {
            [classes.navLinkActive]: activeRoute("/auth/regTenant")
          })}
        >
          <Fingerprint className={classes.listItemIcon} />
          <ListItemText
            primary={"Register"}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem>):''}
    </List>
  );
  return (
    <AppBar position="static" className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown>
          <div className={classes.flex} >
            {/** <Button href="#" className={classes.title} color="transparent">
              {brandText}
            </Button>*/}
            {matches?
            <img src={logo2} alt="logo" style={{ width:"35%", marginLeft: "0px" }}/>
            :""}
          </div>
        </Hidden>
        <Hidden mdUp>
          <div className={classes.flex}>
            <img src={logo2} alt="logo" style={{ width:"35%", marginLeft: "0px" }}/>
          </div>
        </Hidden>
        <Hidden smDown>{list}</Hidden>
        <Hidden mdUp>
          <Button
            className={classes.sidebarButton}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
        <Hidden mdUp>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={"right"}
              open={open}
              classes={{
                paper: classes.drawerPaper
              }}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {list}
            </Drawer>
          </Hidden>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

AuthNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string
};
