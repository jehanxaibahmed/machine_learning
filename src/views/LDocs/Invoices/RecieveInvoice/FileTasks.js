/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  TextField
} from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import jwt from "jsonwebtoken";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { getTasks, setIsTokenExpired } from "../../../../actions";


const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function FileTasks(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const decoded = jwt.decode(Token);
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [isSavingTask, setIsSavingTask] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [task, setTask] = React.useState(null);
  const [reminder, setReminder] = React.useState(null);
  const dispatch = useDispatch();

  const successAlert = (msg) => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => { hideAlert(); closeModal() }}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.success}
      >
        {msg}
      </SweetAlert>
    );
  };
  const errorAlert = (msg) => {
    setAlert(
      <SweetAlert
        error
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg}
        <br />
        For Details Please Contact
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const saveTask = () => {
    setIsSavingTask(true);
    let file = props.fileData;
    let data = {
      taskDescription: task,
      email: decoded.email,
      updatedDate: '',
      taskReminderDate: new Date(reminder),
      invoiceId: `${file.invoiceId}`,
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
        successAlert('Task Added Successful');
        setIsSavingTask(false);
      })
      .catch((error) => {
        error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        errorAlert(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsSavingTask(false);
      });
  };


  const handleFileTaskHandler = (e) => {
    setTask(e.target.value);
  }
  const handleFileReminderHandler = (e) => {
    setReminder(e.target.value);
  }

  function closeModal() {
    props.closeTaskModal();
  }
  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
                Add Task For:{" "}
                {props.fileData.invoiceId +
                  " Version: " +
                  props.fileData.version}
              </h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                <TextField
                  fullWidth={true}
                  //error={formState.errors.fileUpload === "error"}
                  // helperText={
                  //   formState.errors.fileUpload === "error"
                  //     ? "Valid fileUpload is required"
                  //     : null
                  // }
                  label="Enter a Task"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="fileTask"
                  name="filetask"
                  onChange={(event) => {
                    handleFileTaskHandler(event);
                  }}
                  type="text"
                />
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                <TextField
                  fullWidth={true}
                  id="datetime-local"
                  label="Remind me at"
                  type="datetime-local"
                  defaultValue={Date.now()}
                  className={classes.textField}
                  onChange={(event) => {
                    handleFileReminderHandler(event);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>

            </GridContainer>

            <Button
              color="info"
              className={classes.registerButton}
              round
              onClick={saveTask}
            >
              Add Task
              </Button>
            {isSavingTask ? (
              <CircularProgress disableShrink />
            ) : (
                ""
              )}
            <Button
              color="danger"
              className={classes.registerButton}
              onClick={closeModal}
              round
            >
              Close
              </Button>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
