/*eslint-disable*/
import React, {useEffect} from "react";
// react components used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// dependency plugin for react-big-calendar
import moment from "moment";
// react component used to create alerts
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Heading from "components/Heading/Heading.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";

import { useDispatch, useSelector } from "react-redux";
import { title } from "assets/jss/material-dashboard-pro-react";
import { getTasks } from "../../actions/index";
import axios from "axios";
import jwt from "jsonwebtoken";

//import { events as calendarEvents } from "variables/general.js";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles(styles);


export default function Calendar() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const classes = useStyles();
  const [events, setEvents] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const dispatch = useDispatch();

  const selectedEvent = event => {
    setAlert(
      <SweetAlert
        success
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title={event.title}
        onCancel={() => hideAlert()}
        cancelBtnCssClass={classes.button + " " + classes.danger}
      />
    );
  };
  const addNewEventAlert = slotInfo => {
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={e => addNewEvent(e, slotInfo)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
        cancelBtnCssClass={classes.button + " " + classes.danger}
      />
    );
  };
  const addNewEvent = (e, slotInfo) => {
    const decoded = jwt.decode(Token);
    let data = {
      taskDescription: e,
      email: decoded.email,
      updatedDate: '',
      taskReminderDate: new Date(slotInfo.start),
      invoiceId: 'Self Task',
      taskStatus: 'to-do'
    };
    //Save User Task
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/user/AssignTaskToUser`,
      data: data,
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        dispatch(getTasks());
      })
      .catch((error) => {
        error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));        ;
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
      )})
    setAlert(null);
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const eventColors = event => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
  };

  const tasks = useSelector(state => state.userReducer.tasks);

  useEffect(()=>{
     const taskList = tasks.map(task=>{
       return {
        title: `${task.taskDescription} ${task.linkDocument !== undefined ? task.linkDocument:''}`,
        start: new Date(task.taskReminderDate),
        end: new Date(task.taskReminderDate),
        allDay: false,
        color: task.taskStatus === 'to-do' ? "red" : "green"
       }
     });
     setEvents(taskList);
  },[tasks]);
  return (
    <div>
      {/* <Heading
        textAlign="center"
        title="React Big Calendar"
        category={
          <span>
            A beautiful react component made by{" "}
            <a
              href="https://github.com/intljusticemission?ref=creativetim"
              target="_blank"
            >
              International Justice Mission
            </a>
            . Please checkout their{" "}
            <a
              href="https://github.com/intljusticemission/react-big-calendar?ref=creativetim"
              target="_blank"
            >
              full documentation.
            </a>
          </span>
        }
      /> */}
      {alert}
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
            <CardBody calendar>
              <BigCalendar
                selectable
                localizer={localizer}
                events={events}
                defaultView="month"
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={new Date()}
                // onSelectEvent={event => selectedEvent(event)}
                onSelectSlot={slotInfo => addNewEventAlert(slotInfo)}
                eventPropGetter={eventColors}
              />
            </CardBody>
        </GridItem>
      </GridContainer>
    </div>
  );
}
