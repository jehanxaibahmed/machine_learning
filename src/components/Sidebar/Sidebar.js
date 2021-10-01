/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { NavLink, Link, Redirect } from "react-router-dom";
import { logoutUserAction } from "actions";
import cx from "classnames";
// @material-ui/core components
import { CircularProgress, Avatar, Divider } from "@material-ui/core";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";
import FaceIcon from "@material-ui/icons/Face";
import ArImage from "assets/img/icons/ar.png";
import ApImage from "assets/img/icons/ap.png";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import sidebarStyle from "assets/jss/material-dashboard-pro-react/components/sidebarStyle.js";
import avatar from "assets/img/avatar-2.png";
import jwt from "jsonwebtoken";
import { _IsAr } from "views/LDocs/Functions/Functions";
import { checkSelectAll } from "views/LDocs/Functions/Functions";

var ps;

const action = {
  logoutUserAction,
};
// We've created this component so we can have a ref to the wrapper of the links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we didn't have access to
// the links, and couldn't initialize the plugin.
class SidebarWrapper extends React.Component {
  sidebarWrapper = React.createRef();
  constructor(props) {
    super(props); 
    this.state = {
      isApEnable : props.isApEnable,
      isArEnable : props.isArEnable,
    }
  }

  componentDidMount() {
    ps = new PerfectScrollbar(this.sidebarWrapper.current, {
      suppressScrollX: true,
      suppressScrollY: false,
    });
  }
  componentWillUnmount() {
    ps.destroy();
  }

  render() {
    const {
      className,
      user,
      headerLinks,
      links,
      userData,
      tabValue,
      handleTabChange,
      isTabs,
      isApEnable,
      isArEnable,
    } = this.props;

    // console.log("AP", isApEnable ? isApEnable :);


    


    const a11yProps = (index) => {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    };
    return (
      <div className={className} ref={this.sidebarWrapper}>
        {userData ? user : <CircularProgress disableShrink />}
        {headerLinks}
        {isTabs ? (
          <Tabs
            style={{
              zIndex: 999999999,
              width: "calc(100% - 30px)",
              margin: 15,
            }}
            value={tabValue}
            onChange={handleTabChange}
            aria-label="simple tabs example"
          >
            {isApEnable ? 
            <Tab
              style={{ minWidth: !isArEnable ? "100%": "50%" }}
              disabled={!isArEnable}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    alt="ap icon"
                    src={ApImage}
                    variant="square"
                    style={{
                      verticalAlign: "middle",
                      width: 30,
                      marginRight: 20,
                    }}
                  />{" "}
                  AP{" "}
                </div>
              }
              {...a11yProps(0)}
            />:""}
            {isArEnable ?
            <Tab
              style={{ minWidth: !isApEnable ? "100%": "50%" }}
              disabled={!isApEnable}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    alt="ap icon"
                    src={ArImage}
                    variant="square"
                    style={{
                      verticalAlign: "middle",
                      width: 30,
                      marginRight: 20,
                    }}
                  />{" "}
                  AR{" "}
                </div>
              }
              {...a11yProps(1)}
            />
            :""}
          </Tabs>
        ) : (
          ""
        )}
        <Divider
          style={{
            background: "hsla(0,0%,100%,.3)",
            width: "calc(100% - 30px)",
            bottom: 0,
            height: 1,
            margin: 15,
          }}
        />
        {links}
      </div>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      miniActive: true,
      level1: "",
      isAr: props?.isAr,
      LogoutCheck: false,
      tabValue: props.isApEnable && props.isArEnable ? _IsAr() ? 1 : 0 : props.isArEnable ? 1 : 0,
      isApEnable: props.isApEnable,
      isArEnable: props.isArEnable,
      ...this.getCollapseStates(props.routes ? props.routes : []),
      ...this.getCollapseStates(props.aproutes ? props.aproutes : []),
      ...this.getCollapseStates(props.arroutes ? props.arroutes : []),
    };


  }

 

  handleTabChange = (event, newValue) => {
    // this.props.handleTabVal(newValue);
    this.setState({ tabValue: newValue });
    let routes = this.props.aproutes;
    // this.createLinks(this.props.routes ? this.props.routes : newValue === 0 ? this.props.aproutes : routes)
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userData != this.props.userData) {
      this.setState({
        level1: this.props.userData.level1,
      });
    }
  }
  mainPanel = React.createRef();
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = (routes) => {
    let initialState = {};
    routes
      .filter((route) => route.name !== undefined)
      .map((prop) => {
        if (prop.collapse) {
          initialState = {
            [prop.state]: this.getCollapseInitialState(prop.views),
            ...this.getCollapseStates(prop.views),
            ...initialState,
          };
        }
        return null;
      });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute = (routeName) => {
    return window.location.href.indexOf(routeName) > -1 ? "active" : "";
  };
  openCollapse(collapse) {
    var st = {};
    st[collapse] = !this.state[collapse];
    let routes =
      this.props.aproutes && this.props.arroutes
        ? this.props.aproutes.concat(this.props.arroutes)
        : this.props.routes;
    routes
      .filter((route) => route.name !== undefined)
      .map((prop, key) => {
        if (
          typeof prop["state"] !== "undefined" &&
          prop["state"] !== collapse
        ) {
          st[prop["state"]] = false;
        }
      });
    this.setState(st);
  }
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = (routes) => {
    const { classes, color, rtlActive } = this.props;

    return routes
      .filter((route) => route.name !== undefined)
      .map((prop, key) => {
        if (prop.redirect) {
          return null;
        }
        if (prop.collapse) {
          var st = {};
          st[prop["state"]] = !this.state[prop.state];
          const navLinkClasses =
            classes.itemLink +
            " " +
            cx({
              [" " + classes.collapseActive]: this.getCollapseInitialState(
                prop.views
              ),
            });
          const itemText =
            classes.itemText +
            " " +
            cx({
              [classes.itemTextMini]:
                this.props.miniActive && this.state.miniActive,
              [classes.itemTextMiniRTL]:
                rtlActive && this.props.miniActive && this.state.miniActive,
              [classes.itemTextRTL]: rtlActive,
            });
          const collapseItemText =
            classes.collapseItemText +
            " " +
            cx({
              [classes.collapseItemTextMini]:
                this.props.miniActive && this.state.miniActive,
              [classes.collapseItemTextMiniRTL]:
                rtlActive && this.props.miniActive && this.state.miniActive,
              [classes.collapseItemTextRTL]: rtlActive,
            });
          const itemIcon =
            classes.itemIcon +
            " " +
            cx({
              [classes.itemIconRTL]: rtlActive,
            });
          const caret =
            classes.caret +
            " " +
            cx({
              [classes.caretRTL]: rtlActive,
            });
          const collapseItemMini =
            classes.collapseItemMini +
            " " +
            cx({
              [classes.collapseItemMiniRTL]: rtlActive,
            });
          return (
            <ListItem
              key={key}
              className={cx(
                { [classes.item]: prop.icon !== undefined },
                { [classes.collapseItem]: prop.icon === undefined }
              )}
            >
              <NavLink
                to={"#"}
                className={navLinkClasses}
                onClick={(e) => {
                  e.preventDefault();
                  this.openCollapse(prop["state"]);
                }}
              >
                {prop.icon !== undefined ? (
                  typeof prop.icon === "string" ? (
                    <Icon className={itemIcon}>{prop.icon}</Icon>
                  ) : (
                    <prop.icon className={itemIcon} />
                  )
                ) : (
                  <span className={collapseItemMini}>
                    {rtlActive ? prop.rtlMini : prop.mini}
                  </span>
                )}
                <ListItemText
                  primary={rtlActive ? prop.rtlName : prop.name}
                  style={{
                    color: this.state.tabValue == 0 ? "white" : "#D8AABB",
                  }}
                  secondary={
                    <b
                      className={
                        caret +
                        " " +
                        (this.state[prop.state] ? classes.caretActive : "")
                      }
                    />
                  }
                  disableTypography={true}
                  className={cx(
                    { [itemText]: prop.icon !== undefined },
                    { [collapseItemText]: prop.icon === undefined }
                  )}
                />
              </NavLink>
              <Collapse in={this.state[prop.state]} unmountOnExit>
                <List
                  className={
                    this.props.miniActive
                      ? classes.list + " " + classes.collapseListMini
                      : classes.list + " " + classes.collapseList
                  }
                >
                  {this.createLinks(prop.views)}
                </List>
              </Collapse>
            </ListItem>
          );
        }
        const innerNavLinkClasses =
          classes.collapseItemLink +
          " " +
          cx({
            [" " + classes[color]]: this.activeRoute(prop.path),
          });
        const collapseItemMini =
          classes.collapseItemMini +
          " " +
          cx({
            [classes.collapseItemMiniRTL]: rtlActive,
          });
        const navLinkClasses =
          classes.itemLink +
          " " +
          cx({
            [" " + classes[color]]: this.activeRoute(prop.path),
          });
        const itemText =
          classes.itemText +
          " " +
          cx({
            [classes.itemTextMini]:
              this.props.miniActive && this.state.miniActive,
            [classes.itemTextMiniRTL]:
              rtlActive && this.props.miniActive && this.state.miniActive,
            [classes.itemTextRTL]: rtlActive,
          });
        const collapseItemText =
          classes.collapseItemText +
          " " +
          cx({
            [classes.collapseItemTextMini]:
              this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextMiniRTL]:
              rtlActive && this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextRTL]: rtlActive,
          });
        const itemIcon =
          classes.itemIcon +
          " " +
          cx({
            [classes.itemIconRTL]: rtlActive,
          });
        return (
          <ListItem
            key={key}
            className={cx(
              { [classes.item]: prop.icon !== undefined },
              { [classes.collapseItem]: prop.icon === undefined }
            )}
          >
            <NavLink
              to={prop.layout + prop.path}
              className={cx(
                { [navLinkClasses]: prop.icon !== undefined },
                { [innerNavLinkClasses]: prop.icon === undefined }
              )}
            >
              {prop.icon !== undefined ? (
                typeof prop.icon === "string" ? (
                  <Icon className={itemIcon}>{prop.icon}</Icon>
                ) : (
                  <prop.icon className={itemIcon} />
                )
              ) : (
                <span className={collapseItemMini}>
                  {rtlActive ? prop.rtlMini : prop.mini}
                </span>
              )}
              <ListItemText
                primary={rtlActive ? prop.rtlName : prop.name}
                disableTypography={true}
                style={{
                  color: this.state.tabValue == 0 ? "white" : "#D8AABB",
                }}
                className={cx(
                  { [itemText]: prop.icon !== undefined },
                  { [collapseItemText]: prop.icon === undefined }
                )}
              />
            </NavLink>
          </ListItem>
        );
      });
  };
  handleLogoutUser = () => {
    localStorage.clear();
    this.props.logoutUserAction();
    this.setState({
      LogoutCheck: true,
    });
  };
  render() {
    const Token = localStorage.getItem("cooljwt");
    const loginName = jwt.decode(Token).loginName || jwt.decode(Token).name;
    const displayName = jwt.decode(Token).displayName || jwt.decode(Token).name;
    const {
      classes,
      logo,
      image,
      aproutes,
      arroutes,
      routes,
      bgColor,
      rtlActive,
    } = this.props;
    const itemText =
      classes.itemText +
      " " +
      cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
        [classes.itemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.itemTextRTL]: rtlActive,
      });
    const collapseItemText =
      classes.collapseItemText +
      " " +
      cx({
        [classes.collapseItemTextMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextRTL]: rtlActive,
      });
    const userWrapperClass =
      classes.user +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white",
      });
    const caret =
      classes.caret +
      " " +
      cx({
        [classes.caretRTL]: rtlActive,
      });
    const collapseItemMini =
      classes.collapseItemMini +
      " " +
      cx({
        [classes.collapseItemMiniRTL]: rtlActive,
      });
    const photo =
      classes.photo +
      " " +
      cx({
        [classes.photoRTL]: rtlActive,
      });
    var user = (
      <div className={userWrapperClass}>
        <div className={photo}>
          <img
            src={`${this.state?.level1?.profileImg}`}
            className={classes.avatarImg}
            alt="..."
          />
        </div>
        <List className={classes.list}>
          <ListItem className={classes.item + " " + classes.userItem}>
            <NavLink
              to={"#"}
              className={classes.itemLink + " " + classes.userCollapseButton}
              onClick={() => this.openCollapse("openAvatar")}
            >
              <ListItemText
                primary={displayName || loginName}
                // secondary={
                //   <b
                //     className={
                //       caret +
                //       " " +
                //       classes.userCaret +
                //       " " +
                //       (this.state.openAvatar ? classes.caretActive : "")
                //     }
                //   />
                // }
                disableTypography={true}
                className={itemText + " " + classes.userItemText}
              />
            </NavLink>
            {/* <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={this.props.miniActive ? classes.list + " " + classes.collapseListMini:classes.list + " " + classes.collapseList }>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="/user-profile"
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      {rtlActive ? "مع" : <FaceIcon />}
                    </span>
                    <ListItemText
                      primary={rtlActive ? "ملفي" : "My Profile"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="/auth/login"
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                    onClick={this.handleLogoutUser}
                  >
                    <span className={collapseItemMini}>
                      {rtlActive ? "هوع" : <ExitToAppIcon />}
                    </span>
                    <ListItemText
                      primary={rtlActive ? "الخروج" : "Log out"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
              </List>
            </Collapse> */}
          </ListItem>
        </List>
      </div>
    );
    var links = (
      <List style={{ zIndex: 99999999999999 }} className={classes.list}>
        {this.createLinks(
          routes ? routes : this.state.tabValue == 0 ? aproutes : arroutes
        )}
      </List>
    );

    const logoNormal =
      classes.logoNormal +
      " " +
      cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.logoNormalSidebarMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.logoNormalRTL]: rtlActive,
      });
    const logoMini =
      classes.logoMini +
      " " +
      cx({
        [classes.logoMiniRTL]: rtlActive,
      });
    const logoClasses =
      classes.logo +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white",
      });
    var brand = (
      <div style={{ height: 200 }} className={logoClasses}>
        <a
          href="#"
          className={logoMini}
          style={{ width: "100%", marginLeft: "0px" }}
        >
          <img
            src={logo}
            style={{ width: 200 }}
            alt="logo"
            className={classes.img}
          />
        </a>
        {/* <a
          href="https://www.creative-tim.com?ref=mdpr-sidebar"
          target="_blank"
          className={logoNormal}
        >
          {'logoText'}
        </a> */}
      </div>
    );
    const drawerPaper =
      classes.drawerPaper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.drawerPaperRTL]: rtlActive,
      });
    const sidebarWrapper =
      classes.sidebarWrapper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]: true,
      });
    return (
      <div ref={this.mainPanel}>
        {this.state.LogoutCheck ? (
          <Redirect exact from="/" to="/auth/login" />
        ) : (
          ""
        )}
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={rtlActive ? "left" : "right"}
            open={this.props.open}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"],
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              userData={this.props.userData}
              headerLinks={<AdminNavbarLinks rtlActive={rtlActive} />}
              links={links}
              isAr={this.state.isAr}
              isTabs={arroutes && aproutes ? true : false}
              tabValue={this.state.tabValue}
              handleTabChange={this.handleTabChange}
              permissions={this.props.permissions}
              isApEnable={this.state.isApEnable ?  this.state.isApEnable : false}
              isArEnable={this.state.isArEnable ? this.state.isArEnable : false }
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? "right" : "left"}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"],
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              userData={this.state.level1 || this.props.userData}
              links={links}
              isTabs={arroutes && aproutes ? true : false}
              tabValue={this.state.tabValue}
              handleTabChange={this.handleTabChange}
              permissions={this.props.permissions}
              isApEnable={this.state.isApEnable ?  this.state.isApEnable : false}
              isArEnable={this.state.isArEnable ? this.state.isArEnable : false }
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: "blue",
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(["white", "black", "blue"]),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose",
  ]),
  logo: PropTypes.string,
  logoText: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  miniActive: PropTypes.bool,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

SidebarWrapper.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  headerLinks: PropTypes.object,
  links: PropTypes.object,
};
function mapStateToProps(state) {
  return {
    userData: state.userReducer.userListData,
    isAr: state.userReducer.isAr,
    tabVal: state.userReducer.tabVal,
  };
}
export default connect(
  mapStateToProps,
  action
)(withStyles(sidebarStyle)(Sidebar));
