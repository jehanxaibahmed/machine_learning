import React, { useState, useEffect } from "react";
// @material-ui/icons
import {
  Button,
  makeStyles,
  CircularProgress,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
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
import SignatureUpload from "./signatureUpload.js";
import StampUpload from "./stampUpload.js";
import { useDispatch, useSelector } from "react-redux";
import { setIsTokenExpired } from "actions/index.js";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Step3(props) {
  const classes = useStyles();
  var row = props.userData.level3;
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    isLoading: false,
    values: {
      email: typeof row.email != "undefined" ? row.email : "",
      disabledUser:
        typeof row.disabledUser != "undefined" ? row.disabledUser : false,
      role: typeof row.role != "undefined" ? row.role : "",
    },
    errors: {},
  });
  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
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
        Unable To Update Level 3 Please Contact{" "}
        {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  const saveUserLevelThree = () => {
    setFormState((formState) => ({
      ...formState,
      isLoading: true,
    }));
    let email;

    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.email)) {
      if (verifyEmail(formState.values.email)) {
        email = "success";
      } else {
        email = "error";
        error = true;
      }
    } else {
      email = "error";
      error = true;
    }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        email: email,
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
        email: formState.values.email,
        disabledUser: formState.values.disabledUser,
        role: formState.values.role,
      };
      let msg = "";

      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/user/level3Update`,
        data: data,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          props.userData.level3.email = data.email;
          props.userData.level3.disabledUser = data.disabledUser;
          props.updateUserData(props.userData);
          setFormState((formState) => ({
            ...formState,
            isLoading: false,
          }));
          msg = "Level 3 Info Updated Successfully!";
          successAlert(msg);
        })
        .catch((error) => {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
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
  useEffect(() => {}, []);

  const handleToggle = (name) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        disabledUser: !formState.values.disabledUser,
      },
    }));
  };
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={true}
    >
      {alert}
      <GridContainer justify="center" md={12} xs={12} sm={12}>
        <GridItem
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.loginName === "error"}
            helperText={
              formState.errors.loginName === "error"
                ? "Valid User ID is required"
                : null
            }
            label="User ID"
            id="loginName"
            name="loginName"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            disabled={true}
            value={formState.values.email || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            className={classes.textField}
            error={formState.errors.email === "error"}
            fullWidth={true}
            helperText={
              formState.errors.email === "error" ? "Email is required" : null
            }
            label="Email"
            name="email"
            onChange={(event) => {
              handleChange(event);
            }}
            type="email"
            disabled={props.disabledCheck}
            value={formState.values.email || ""}
          ></TextField>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            className={classes.textField}
            error={formState.errors.workflow === "error"}
            fullWidth={true}
            // helperText={
            //   formState.errors.workflow === "error"
            //     ? "Workflow is required"
            //     : null
            // }
            label="Role"
            name="role"
            onChange={(event) => {
              handleChange(event);
            }}
            select
            value={formState.values.role || ""}
            disabled={props.disabledCheck}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Choose User Role
            </MenuItem>
            <MenuItem value={"Admin Desk"}>Admin Desk</MenuItem>
            <MenuItem value={"Invoice Desk"}>Invoice Desk</MenuItem>
            {/* <MenuItem value={"Finance Desk"}>Finance Desk</MenuItem> */}
            <MenuItem value={"Action Desk"}>Action Desk</MenuItem>
            <MenuItem value={"AVP Desk"}>AVP Desk</MenuItem>
          </TextField>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <div
            className={
              classes.checkboxAndRadio +
              " " +
              classes.checkboxAndRadioHorizontal
            }
          >
            <FormControlLabel
              onChange={(event) => {
                handleToggle(event);
              }}
              value={formState.values.disabledUser ? false : true}
              control={<Checkbox name="role" color="info" />}
              label="Disable User"
              name="role"
              checked={formState.values.disabledUser ? true : false}
            />
          </div>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <legend>Signature Upload</legend>
          <SignatureUpload
            addButtonProps={{
              color: "info",
              round: true,
            }}
            changeButtonProps={{
              color: "warning",
              round: true,
            }}
            removeButtonProps={{
              color: "danger",
              round: true,
            }}
            uploadButtonProps={{
              color: "success",
              round: true,
            }}
            signImg={props.userData}
            name="signatureImage"
            avatar
            disabledCheck={props.disabledCheck}
            successAlert={successAlert}
            errorAlert={errorAlert}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <legend>Stamp Upload</legend>
          <StampUpload
            addButtonProps={{
              color: "info",
              round: true,
            }}
            changeButtonProps={{
              color: "warning",
              round: true,
            }}
            removeButtonProps={{
              color: "danger",
              round: true,
            }}
            uploadButtonProps={{
              color: "success",
              round: true,
            }}
            name="signatureImage"
            stampImg={props.userData}
            avatar
            disabledCheck={props.disabledCheck}
            successAlert={successAlert}
            errorAlert={errorAlert}
          />
        </GridItem>
        {/* Commented Code Due to WorkFlow Update */}

        {props.disabledCheck ? (
          ""
        ) : (
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
                backgroundColor: "#007f5e",
                color: "white",
              }}
              className={classes.registerButton}
              round
              onClick={saveUserLevelThree}
            >
              Save Level 3 Info
            </Button>
            {formState.isLoading ? <CircularProgress disableShrink /> : ""}
          </GridItem>
        )}
      </GridContainer>
    </Animated>
  );
}
