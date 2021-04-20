import React, {useEffect} from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { getUserDataAction, getNotification, getTasks, setDarkMode, setIsTokenExpired } from "../actions";
import {  Switch, Route, Redirect } from "react-router-dom";
import addNotification from 'react-push-notification';
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import SweetAlert from "react-bootstrap-sweetalert";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
// @material-ui/core components
import { makeStyles , ThemeProvider} from "@material-ui/core/styles";
import {
  createMuiTheme,
  CssBaseline,
} from "@material-ui/core";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import { checkIsActionDesk, checkIsAVPDesk } from "views/LDocs/Authorization/checkAuthority";

import routes from "routes/actionDeskRoutes";
import UserProfile from "views/LDocs/Profile/Profile";
import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";
import Verify from "views/LDocs/Verify/Verify";

// import { Notifications } from 'react-push-notification';
import { ToastContainer, toast } from 'react-toastify';




var ps;

const useStyles = makeStyles(styles);

const checkTimeCompare = (dat) => {
  var taskDate = new Date(dat);
  var nowDate = new Date(Date.now());
  if (
  taskDate.getHours() === nowDate.getHours() && 
  taskDate.getFullYear() === nowDate.getFullYear() && 
  taskDate.getMinutes() === nowDate.getMinutes() && 
  taskDate.getMonth() === nowDate.getMonth() && 
  taskDate.getDate() === nowDate.getDate()
  ) {
    return true;
  }else{
    return false;
  }   
}



export default function Dashboard(props) {
  const notifications = useSelector(state => state.userReducer.notifications);
  const isTokenExpired = useSelector(state => state.userReducer.isTokenExpired);
  const tasks = useSelector(state => state.userReducer.tasks);
  const { ...rest } = props;
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const sweetAlertStyle = makeStyles(styles2);
  const [miniActive, setMiniActive] = React.useState(false);
  const [darkmood, setDarkMood] = React.useState(false);
  const [image, setImage] = React.useState(require("assets/img/sidebar-1.jpg"));
  const [color, setColor] = React.useState("blue");
  const [bgColor, setBgColor] = React.useState("black");
  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo.png"));
  const [darkLogo, setDarkLogo] = React.useState(require("assets/img/logoexxx.png"));
  const dispatch = useDispatch();
  const notify = (msg) => 
  toast(msg, {
    position: "bottom-right",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
  // toast(msg);


  function fetchData(){
    dispatch(getNotification());
    dispatch(getTasks());
  }
    useEffect(() => {
      fetchData();
       notifications.filter(n=>n.status == 'un-seen').map((notif,index)=>{
        notify(`${notif.notificationItem ? notif.notificationItem.invoiceId : notif.invoiceId }-${notif.notifyMessage}`);
      });
      setInterval(() => {
          fetchData();     
      }, 45000);
      if (checkIsActionDesk()) { dispatch(getUserDataAction()); }
      },[]);
  
    useEffect(()=>{
      tasks.filter(t=>checkTimeCompare(t.taskReminderDate) == true).map((task, key)=>{
        notify(`${task.invoiceId}-${task.taskDescription}`);
      });
    },[tasks]);
  
    // useEffect(()=>{
    //   notifications.filter(n=>checkTimeCompare(n.notificationDate) == true).map((notif,index)=>{
    //     notify(`${notif.notificationItem ? notif.notificationItem.invoiceId : '' }-${notif.notifyMessage}`);
    //   })
    // },[notifications]);
    useEffect(()=>{
      if(isTokenExpired){
        msgAlert("Token Has been Expired Please Login Again");
      }
    },[isTokenExpired])

 
  const theme = createMuiTheme({
    palette: {
      type: darkmood ? "dark": "light"
    }
  });


  // styles 
  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1,
    });
  // ref for main panel div
  const mainPanel = React.createRef();
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if(checkIsActionDesk ()){
      if (navigator.platform.indexOf("Win") > -1) {
        ps = new PerfectScrollbar(mainPanel.current, {
          suppressScrollX: true,
          suppressScrollY: false,
        });
        document.body.style.overflow = "hidden";
      }
      window.addEventListener("resize", resizeFunction);

      // Specify how to clean up after this effect:
      return function cleanup() {
        if (navigator.platform.indexOf("Win") > -1) {
          ps.destroy();
        }
        window.removeEventListener("resize", resizeFunction);
      };
    }
  },[]);
  // functions for changeing the states from components
  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleBgColorClick = (bgColor) => {
    switch (bgColor) {
      case "white":
        setLogo(require("assets/img/logo.png"));
        break;
      default:
        setLogo(require("assets/img/logo.png"));
        break;
    }
    setBgColor(bgColor);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
       }
    else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }else {
          let name = window.location.pathname.replace("/action/","");
          if(name == "verifier"){
            return "Verifier";
          }else if(name == "user-profile"){
            return "User Profile"
          }
        }
      }
    }
    return activeRoute;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/action") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const darkMoodStatus = () => {
    setDarkMood(!darkmood);
    dispatch(setDarkMode(!darkmood));
  }
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const sweetClass = sweetAlertStyle();
  const [alert, setAlert] = React.useState(null);
  //Msg Alert
  const msgAlert = (msg) => {
    setAlert(
      <SweetAlert
        alert
        style={{ display: "block", marginTop: "-100px" }}
        title="TOKEN EXPIRED!"
        onConfirm={() => hideErrorAlert()}
        onCancel={() => hideErrorAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.info}
      >
        {msg}
      </SweetAlert>
    );
  };

  const hideErrorAlert = () => {
    localStorage.clear();
    dispatch(setIsTokenExpired(false));
    setAlert(null);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <div className={classes.wrapper}>
    {alert}
      {/* <Notifications /> */}
      {!checkIsActionDesk () ? <Redirect exact from="/" to="/auth/login" /> : 
      <React.Fragment>
      {/* <ToastContainer 
          position="bottom-left"
          //autoClose={5000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          enableMultiContainer
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          /> */}
      <Sidebar
        routes={routes.filter(route=>route.name !== undefined)}
        logoText={process.env.REACT_APP_LDOCS_FOOTER_COPYRIGHT_LEVEL_1}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          isDarkmode={darkmood}
          {...rest}
        />
        {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>
                {getRoutes(routes)}
                <Route
                  path="/action/user-profile"
                  component={UserProfile}
                  name="Profile"
                  layout="/action"
                />
                <Route
                  path="/action/verifier"
                  component={Verify}
                  name="Verifier"
                  layout="/action"
                />
                <Redirect from="/action" to="/action/dashboard" />
              </Switch>
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            <Switch>
              {getRoutes(routes)}
              <Route
                path="/action/user-profile"
                component={UserProfile}
                name="Profile"
                layout="/action"
              />
              <Route
                  path="/profile/verifier"
                  component={Verify}
                  name="Verifier"
                  layout="/profile"
                />
              <Redirect from="/action" to="/action/dashboard" />
            </Switch>
          </div>
        )}
        {getRoute() ? <Footer fluid /> : null}
        <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          handleBgColorClick={handleBgColorClick}
          color={color}
          bgColor={bgColor}
          bgImage={image}
          darkmood={darkmood}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
          sidebarMinimize={sidebarMinimize.bind(this)}
          changeDarkMood={darkMoodStatus.bind(this)}
          miniActive={miniActive}
        />
      </div>
      </React.Fragment>
      }
    </div>
    </ThemeProvider>
  );
}
