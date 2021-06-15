import React, { useState, useEffect } from "react";
// @material-ui/icons
import {
  Button,
  MenuItem,
  makeStyles,
  CircularProgress,
  TextField,
} from "@material-ui/core";
// @material-ui/core components

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { Animated } from "react-animated-css";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import { setIsTokenExpired } from "actions";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Level1Profile(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);

  var row = props.userData;
  const [formState, setFormState] = useState({
    isLoading: false,
    values: {
      firstName: typeof row.level1 == "undefined" ? "" : typeof row.level1.firstName != "undefined" ? row.level1.firstName : "",
      displayName:
        typeof row.level1 != "undefined" ? row.level1.displayName : "",
      lastName: typeof row.level1 != "undefined" ? row.level1.lastName : "",
      middleName: typeof row.level1 != "undefined" ? row.level1.displayName : "",
      PCNP:
        typeof row.level1 != "undefined"
          ? row.level1.personalCellNumberPrimary
          : "",
      personalEmail:
        typeof row.level1 != "undefined" ? row.level1.personalEmail : "",
    },
    errors: {},
  });
  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    }));
  };
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  const sweetClass = sweetAlertStyle();
  const [alert, setAlert] = React.useState(null);
  const successAlert = (msg) => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => hideAlert()}
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
        Unable To Update Profile Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const saveUserLevelOne = () => {
    setFormState((formState) => ({
      ...formState,
      isLoading: true,
    }));
    let displayName;
    let lastName;
    let middleName;
    let PCNP;
    let personalEmail;
    let firstName;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.middleName)) {
      middleName = "success";
    } else {
      middleName = "error";
      error = true;
    }
    if (!Check(formState.values.personalEmail)) {
      if (verifyEmail(formState.values.personalEmail)) {
        personalEmail = "success";
      } else {
        personalEmail = "error";
        error = true;
      }
    } else {
      personalEmail = "error";
      error = true;
    }
    if (!Check(formState.values.lastName)) {
      lastName = "success";
    } else {
      lastName = "error";
      error = true;
    }
    if (!Check(formState.values.PCNP)) {
      PCNP = "success";
    } else {
      PCNP = "error";
      error = true;
    }
    if (!Check(formState.values.firstName)) {
      firstName = "success";
    } else {
      firstName = "error";
      error = true;
    }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        middleName:middleName,
        lastName: lastName,
        firstName: firstName,
        PCNP: PCNP,
        personalEmail: personalEmail,
      },
    }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isLoading: false,
      }));
      return false;
    } else {
      var data = {
        lastName: formState.values.lastName,
        displayName: formState.values.middleName,
        firstName: formState.values.firstName,
        personalEmail: formState.values.personalEmail,
        personalCellNumberPrimary: formState.values.PCNP,
        email:jwt.decode(Token).email
      };
      let msg = "";
      axios({
        method: "put",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/user/level1Update`,
        data: data,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          if (row.level1 != "undefined") {
            props.userData.level1.displayName = data.displayName;
            props.userData.level1.lastName = data.lastName;
            props.userData.level1.firstName =
              typeof data.firstName != "undefined" ? data.firstName : "";
            props.userData.level1.personalCellNumberPrimary =
              data.personalCellNumberPrimary;
            props.userData.level1.personalEmail = data.personalEmail;
            props.updateUserData(props.userData);
          }
          setFormState((formState) => ({
            ...formState,
            isLoading: false,
          }));
          msg = "Profile Updated Successfully!";
          successAlert(msg);
        })
        .catch((error) => {
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
          setFormState((formState) => ({
            ...formState,
            isLoading: false,
          }));
          msg =
            typeof error.response != "undefined"
              ? error.response.data
              : error.message;
          errorAlert(msg);
        });
    }
  };
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateStep}
    >
      {alert}
      <GridContainer justify="center" md={12} md={12} xs={12} sm={12}>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.firstName === "error"}
            helperText={
              formState.errors.firstName === "error"
                ? "Valid First Name is required"
                : null
            }
            label="First Name"
            id="firstName"
            name="firstName"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.firstName || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.middleName === "error"}
            helperText={
              formState.errors.middleName === "error"
                ? "Valid Middle Name is required"
                : null
            }
            label="Middle Name"
            id="middleName"
            name="middleName"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.middleName || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.lastName === "error"}
            helperText={
              formState.errors.lastName === "error"
                ? "Valid Last Name is required"
                : null
            }
            label="Last Name"
            id="lastName"
            name="lastName"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.lastName || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.displayName === "error"}
            helperText={
              formState.errors.displayName === "error"
                ? "Valid Display Name is required"
                : null
            }
            label="Display Name"
            id="displayName"
            name="displayName"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.displayName || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.PCNP === "error"}
            helperText={
              formState.errors.PCNP === "error"
                ? "Valid Cell Number is required"
                : null
            }
            label="Personal Cell Number Primary"
            id="PCNP"
            name="PCNP"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.PCNP || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.personalEmail === "error"}
            helperText={
              formState.errors.personalEmail === "error"
                ? "Valid Email is required"
                : null
            }
            label="Personal Email"
            id="personalEmail"
            name="personalEmail"
            onChange={(event) => {
              handleChange(event);
            }}
            type="email"
            value={formState.values.personalEmail || ""}
          />
        </GridItem>

        <GridItem
          xs={12}
          sm={12}
          md={12}
          lg={12}
          style={{
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          <Button
            style={{
              backgroundColor: "#9E2654",
              color: "white",
            }}
            className={classes.registerButton}
            round
            onClick={saveUserLevelOne}
          >
            Save Profile
          </Button>
          {formState.isLoading ? <CircularProgress disableShrink /> : ""}
        </GridItem>
      </GridContainer>
    </Animated>
  );
}
