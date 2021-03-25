import React, {useState } from "react";
import { Link, Redirect } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logoutUserAction, getNotification, getTasks } from "actions";

// @material-ui/core components
import { Dialog, Slide, Tooltip, DialogContent, Typography, Grid, ListItem, ListItemAvatar, ListItemText, List, Avatar, Button as MaterialButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import Popper from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";

// @material-ui/icons
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import DeleteIcon from '@material-ui/icons/Delete';
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import FlagSharpIcon from '@material-ui/icons/FlagSharp';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HighlightOffSharpIcon from '@material-ui/icons/HighlightOffSharp';
import CheckCircleOutlineSharpIcon from '@material-ui/icons/CheckCircleOutlineSharp';
import ListIcon from '@material-ui/icons/List';
import CheckIcon from '@material-ui/icons/Check';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import Button from "components/CustomButtons/Button.js";
import UserGuide from "views/LDocs/UserGuide/UserGuide";
import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";
import DeleteRecord from "../../views/LDocs/DeleteRecords/DeleteRecord";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDateTime } from "../../views/LDocs/Functions/Functions";
import jwt from "jsonwebtoken";
import { setToken } from "actions";
const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HeaderLinks(props) {
  let Token = localStorage.getItem("cooljwt");
  const userData = jwt.decode(Token);

  
  const [openNotification, setOpenNotification] = useState(null);
  const [loaded, setisLoaded] = useState(false);
  const [openTask, setOpenTask] = useState(null);
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleClickTask = event => {
    if (openTask && openTask.contains(event.target)) {
      setOpenTask(null);
    } else {
      setOpenTask(event.currentTarget);
    }
  };
  const dispatch = useDispatch();

  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
 




  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleCloseTask = () => {
    setOpenTask(null);
  };
  const [logoutCheck, setLogoutCheck] = useState(false);
  const [openProfile, setOpenProfile] = useState(null);
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const handleLogoutUser = () => {
    localStorage.clear();
    dispatch(setToken(null));
    dispatch(logoutUserAction());
    setLogoutCheck(true);
  };
  const classes = useStyles();
  const { rtlActive } = props;
  const searchButton =
    classes.top +
    " " +
    classes.searchButton +
    " " +
    classNames({
      [classes.searchRTL]: rtlActive
    });
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    [classes.dropdownItemRTL]: rtlActive
  });
  const wrapper = classNames({
    [classes.wrapperRTL]: rtlActive
  });
  const managerClasses = classNames({
    [classes.managerClasses]: true
  });
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [DeleteModal, setDeleteModal] = useState(false);

  const handleDelete = () => {
    setDeleteModal(true);
  }
  const closeDeleteModal = () => {
    setDeleteModal(false);
  }
  const handleMarkNotificationRead = (notification_id, status) =>{
    axios({
      method: "put",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/updateSysNotify`,
      data: {
        "_id":notification_id,
        "status":status
      },
      headers: { "Content-Type": "application/json",
      cooljwt: Token 
    },
    })
      .then((response) => {
          fetchData();
      });
  }

  const handleMarkTaskRead = (task_id, status) =>{
    let Token = localStorage.getItem("cooljwt");
    axios({
      method: "put",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/updateUserTask`,
      data: {
        "_id":task_id,
        "taskStatus":status
      },
      headers: { "Content-Type": "application/json",
      cooljwt: Token 
    },
    })
      .then((response) => {
        fetchData();
      });
    //setNotifications(notifications);
    //handleCloseNotification();
  }


  const notifications = useSelector(state => state.userReducer.notifications);
  const tasks = useSelector(state => state.userReducer.tasks);
  const unreadedNotifications = useSelector(state => state.userReducer.unreadedNotifications);
  const unreadedTasks = useSelector(state => state.userReducer.unreadedTasks);

  const notify = (msg) => toast(msg);

  function fetchData(){
    dispatch(getNotification());
    dispatch(getTasks());
  }
 

  

  return (
    <div style={{color:props.isDarkmode ? 'white': 'black'}} className={wrapper}>
      {logoutCheck ? <Redirect exact from="/" to="/auth/login" /> : ""}
      <ToastContainer position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover/>
      {DeleteModal ?
        <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
            fullWidth={true}
            maxWidth={"md"}
            open={DeleteModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeDeleteModal}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
          >
            <DialogContent
              id="classic-modal-slide-description"
              className={classes.modalBody}
            >
               <DeleteRecord closeModal={closeDeleteModal}/>
               </DialogContent>
          </Dialog>
        : ""}
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <UserGuide handleClose={handleClose} />
      </Dialog>
      {/* <CustomInput
        rtlActive={rtlActive}
        formControlProps={{
          className: classes.top + " " + classes.search,
        }}
        inputProps={{
          placeholder: rtlActive ? "بحث" : "Search",
          inputProps: {
            "aria-label": rtlActive ? "بحث" : "Search",
            className: classes.searchInput,
          },
        }}
      /> */}
      {/* <Tooltip title="Search User Guide" aria-label="search">
        <Button 
          color="white"
          aria-label="edit"
          justIcon
          round
          className={searchButton}
          onClick={handleClickOpen}
        >
          <LiveHelpIcon className={classes.headerLinksSvg + " " + classes.searchIcon} />
        </Button>
      </Tooltip> */}
      
      {/* <Tooltip title="Delete Record" aria-label="deleteRecord">
          <Button
            color="transparent"
            simple
            aria-label="deleteRecord"
            justIcon
            className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : "",
            }}
            onClick={handleDelete}
          >
            <DeleteIcon
              className={
                classes.headerLinksSvg +
                " " +
                (rtlActive ? classes.links + " " + classes.linksRTL : classes.links)
              }
            />
          </Button>
      </Tooltip> */}
      {!userData.isVendor ?
      <Tooltip   title="Verifier" aria-label="verify">
        <Link to="verifier" style={{color: props.isDarkmode?'#fff':"#555555"}}>
          <Button
            color="transparent"
            simple
            aria-label="Verifier"
            justIcon
            className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : "",
            }}
          >
            <VerifiedUserIcon
              className={
                classes.headerLinksSvg +
                " " +
                (rtlActive ? classes.links + " " + classes.linksRTL : classes.links)
              }
            />
          </Button>
        </Link>
      </Tooltip>:''}
      <Tooltip title="Dashboard" aria-label="dashboard">
      <Link to="dashboard" style={{color: props.isDarkmode?'#fff':"#555555"}}>
      <Button
        color="transparent"
        simple
        aria-label="Dashboard"
        justIcon
        className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
        muiClasses={{
          label: rtlActive ? classes.labelRTL : "",
        }}
      >
        <Dashboard
        
          className={
            classes.headerLinksSvg +
            " " +
            (rtlActive ? classes.links + " " + classes.linksRTL : classes.links)
          }
        />
        <Hidden mdUp implementation="css">
          <span className={classes.linkText}>
            {rtlActive ? "لوحة القيادة" : "Dashboard"}
          </span>
        </Hidden>
      </Button>
      </Link>
      </Tooltip>
      <Tooltip title="Notifications" aria-label="notifications">
      <div className={managerClasses}>
        <Button
          color="transparent"
          justIcon
          aria-label="Notifications"
          aria-owns={openNotification ? "notification-menu-list" : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : "",
          }}
        >
          <Notifications
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
          <span className={classes.notifications}>{unreadedNotifications}</span>
          <Hidden mdUp implementation="css">
            <span
              onClick={handleClickNotification}
              className={classes.linkText}
            >
              {rtlActive ? "إعلام" : "Notification"}
            </span>
          </Hidden>
        </Button>
        <Popper
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openNotification,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list"
              style={{ transformOrigin: "0 0 0" }}
            >
              <Paper style={{ maxWidth: '400px',width: '400px',background:props.isDarkmode?"#000000":"#fff",color:props.isDarkmode?'#fff':'#000000'}}  className={classes.dropdown}>
              <Grid style={{
                  padding:10
                }} container wrap="nowrap" spacing={1}>
                      <Grid item xs={12}>
                      <p style={{textAlign:'left', fontWeight:600}}>Alerts / Notifications</p>
                      </Grid>
                </Grid>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                <List>
               {
               notifications
                    .slice(0,5)
                    .map((notification)=>{
                     return ( 
                  <ListItem 
                  key={notification._id}
                  button
                  onClick={()=>{handleMarkNotificationRead(notification._id, 'seen')}}
                  alignItems="flex-start"
                  >
                      <ListItemAvatar> 
                        <Avatar>
                        {notification.status == 'un-seen' ? 
                           <NotificationsIcon/> :
                           <NotificationsNoneIcon />
                        }
                        </Avatar> 
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body1"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {notification.notificationAction}
                            </Typography>
                            <br />
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {notification.notifyMessage}
                              <br />
                              {formatDateTime(notification.notificationDate)} 
                            </Typography>
                          </React.Fragment>
                        }
                        secondary={
                            <Typography
                             align="right"
                            >
                                          {notification.status == 'un-seen' ? 
                                            <CheckIcon fontSize="small" /> :
                                            <DoneAllIcon color="primary" fontSize="small" />
                                          }

                            </Typography>
                        }
                      />
                      </ListItem>
                      )}
                    )}
                  </List>
                 </ClickAwayListener>
                <Grid style={{
                  padding:10
                }} container wrap="nowrap" spacing={1}>
                      <Grid item xs={6}>
                      <Link to="./notifications" size="small">Show All</Link>
                      </Grid>
                </Grid>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      </Tooltip>
      <Tooltip title="Tasks" aria-label="tasks">
      <div className={managerClasses}>
        <Button
          color="transparent"
          justIcon
          aria-label="Tasks"
          aria-owns={openTask ? "tasks-menu-list" : null}
          aria-haspopup="true"
          onClick={handleClickTask}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : "",
          }}
        >
          <ListIcon
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
          <span className={classes.notifications}>{unreadedTasks}</span>
          <Hidden mdUp implementation="css">
            <span
              onClick={handleClickTask}
              className={classes.linkText}
            >
              {rtlActive ? "إعلام" : "Notification"}
            </span>
          </Hidden>
        </Button>
        <Popper
          open={Boolean(openTask)}
          anchorEl={openTask}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openTask,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="tasks-menu-list"
              style={{ transformOrigin: "0 0 0" }}
            >
              <Paper style={{ maxWidth: '400px',width: '400px',background:props.isDarkmode?"#000000":"#fff",color:props.isDarkmode?'#fff':'#000000'}}  className={classes.dropdown}>
              <Grid style={{
                  padding:10
                }} container wrap="nowrap" spacing={1}>
                      <Grid item xs={12}>
                      <p style={{textAlign:'left', fontWeight:600}}>Task List</p>
                      </Grid>
                </Grid>
                <ClickAwayListener onClickAway={handleCloseTask}>
                <List>
               {
               tasks
                    .slice(0,5)
                    .map((task)=>{
                     return ( 
                  <ListItem 
                  key={task._id}
                  button
                  alignItems="flex-start"
                  >
                      <ListItemAvatar> 
                        <Avatar
                        style={{
                          background:"white"
                        }}
                        >
                        {task.taskStatus == 'to-do' ? 
                           <FlagSharpIcon style={{color:'orange'}}   /> :
                           <FlagSharpIcon color="error"  />
                        }
                        </Avatar> 
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {task.taskDescription}
                              <br />
                              {formatDateTime(task.taskReminderDate)} 
                              <hr />
                              Invoice ID : {task.invoiceId}
                             
                            </Typography>
                          </React.Fragment>
                        }
                        secondary={
                        <Typography
                        align="right">      
                                <CheckCircleOutlineSharpIcon onClick={()=>{handleMarkTaskRead(task._id, 'completed')}} color="primary" />
                                <HighlightOffSharpIcon onClick={()=>{handleMarkTaskRead(task._id, 'deleted')}} color="error" />
                        </Typography>          
                        }
                      />
                      </ListItem>
                      )}
                    )}
                  </List>
                 </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      </Tooltip>
      <Tooltip title="Profile" aria-label="profile">
      <div className={managerClasses}>
        <Button
          color="transparent"
          aria-label="Person"
          justIcon
          aria-owns={openProfile ? "profile-menu-list" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : "",
          }}
        >
          <Person
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
          <Hidden mdUp implementation="css">
            <span onClick={handleClickProfile} className={classes.linkText}>
              {rtlActive ? "الملف الشخصي" : "Profile"}
            </span>
          </Hidden>
        </Button>
        <Popper
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openProfile,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list"
              style={{ transformOrigin: "0 0 0" }}
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <Link to="user-profile" activeClassName="active">
                      <MenuItem
                        onClick={handleCloseProfile}
                        className={dropdownItem}
                      >
                        {rtlActive ? "الملف الشخصي" : "My Profile"}
                      </MenuItem>
                    </Link>
                    <Divider light />
                    <Link to="/auth/login" activeClassName="active">
                      <MenuItem
                        onClick={handleLogoutUser}
                        className={dropdownItem}
                      >
                        {rtlActive ? "الخروج" : "Log out"}
                      </MenuItem>
                    </Link>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      </Tooltip>
    </div>
  );
}

HeaderLinks.propTypes = {
  rtlActive: PropTypes.bool
};
