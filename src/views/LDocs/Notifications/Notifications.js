import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles, LinearProgress, Typography, Box, List, ListItem, ListItemAvatar, Divider, Grid, Avatar, ListItemText } from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
//Redux
import { useSelector, useDispatch } from "react-redux";
//ReduxActions
import { getNotification } from "actions";
//Axios
import axios from 'axios';
//ICONS
import DoneAllIcon from '@material-ui/icons/DoneAll';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CheckIcon from '@material-ui/icons/Check';
import { Animated } from "react-animated-css";
import { formatDateTime } from "../Functions/Functions";


const useStyles = makeStyles();

 

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [animateTable, setAnimateTable] = React.useState(true);

  const dispatch = useDispatch();


  const classes = useStyles();
  const getNotifications = useSelector(state => state.userReducer.notifications);

  const handleMarkNotificationRead = (notification_id, status) =>{
    let Token = localStorage.getItem("cooljwt");
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
        dispatch(getNotification());
      });
    //setNotifications(notifications);
    //handleCloseNotification();
  }
  useEffect(()=>{
    setNotifications(getNotifications);
   },[getNotifications])
  return (
     <div>
         <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={animateTable}
      >
        <GridContainer >
        <GridItem xs={12} sm={12} md={12}>
        <Card profile>
                  <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitle}>
                            Notifications
                          </h4>
                        </CardIcon>
                      </CardHeader>
                <CardBody profile>
        <List>
               {
               notifications
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
                           <NotificationsIcon color="yellow" /> :
                           <NotificationsNoneIcon />
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
                              {notification.notificationAction}
                            </Typography>
                          </React.Fragment>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              <Grid style={{
                                }} container wrap="nowrap" spacing={1}>
                                      
                                      <Grid item xs={11}>
                                      {notification.notifyMessage}
                                      <br />
                                      {formatDateTime(notification.notificationDate)}
                                      </Grid>
                                      <Grid item xs={1}>
                                          {notification.status == 'un-seen' ? 
                                            <CheckIcon fontSize="small" /> :
                                            <DoneAllIcon color="primary" fontSize="small" />
                                          }
                                      </Grid>
                                </Grid>
                            </Typography>
                            <Divider />
                          </React.Fragment>
                        }
                      />
                      </ListItem>
                      )}
                    )}
                  </List>
                  </CardBody>
                  </Card>
        </GridItem>
    </GridContainer>
    </Animated>
     </div>
  );
}
