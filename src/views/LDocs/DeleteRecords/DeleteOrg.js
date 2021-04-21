/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// @material-ui/core components
import {
  TextField,
  MenuItem,
  makeStyles,
  CircularProgress,
  Slide, Dialog
} from "@material-ui/core";
import { getOrganizations } from "actions";
// core components
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import axios from "axios";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";

import OtpCheck from "../Authorization/OtpCheck";
import { setIsTokenExpired } from "actions";

var Token = localStorage.getItem("cooljwt");

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

export default function DeleteOrg(props) {
  // Delete form
  const [isLoading, setisLoading] = useState(true);
  const [otpModal, setotpModal] = React.useState(false);
  const [OTP, setOTP] = React.useState("");

  const dispatch = useDispatch();
  const organizations = useSelector((state) => state.userReducer.organizations);

  const [formState, setFormState] = useState({
    isRegistering: false,
    values: {
        organizationName: "",
    },
    errors: {
        organizationName: "",
    },
  });

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
    }));
  };
  const classes = useStyles();

  const handleDelete = () => {
    
    let organizationName;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;
    if (!Check(formState.values.organizationName)) {
        organizationName = "success";
      } else {
        organizationName = "error";
        error = true;
      }
      setFormState((formState) => ({
        ...formState,
        errors: {
          ...formState.errors,
          organizationName:organizationName,
        },
      }));
      if (error) {
        setFormState((formState) => ({
          ...formState,
          isRegistering: false,
        }));
        return false;
      } else {
      if(!OTP){
        setotpModal(true);
        return false
      }
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
    
      let msg = "";
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/del/org/${formState.values.organizationName}/${OTP}`,
        headers: { "cooljwt": Token },
      })
        .then((response) => {
          setFormState((formState) => ({
            ...formState,
            values: {
              ...formState.values,
              organizationName: "",
            },
          }));
          dispatch(getOrganizations());
            setOTP("")
          setFormState((formState) => ({
            ...formState,
            isRegistering: false,
          }));
          msg = "Organization Deleted Successfully!";
          props.successAlert(msg);
        })
        .catch((error) => {
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
            setOTP("")
          setFormState((formState) => ({
            ...formState,
            isRegistering: false,
          }));
          msg =
            typeof error.response != "undefined"
              ? error.response.data
              : error.message;
            props.errorAlert(msg);
        });
    }
  };
  useEffect(() => {
    if (!otpModal) {
      const Check = require("is-null-empty-or-undefined").Check;
      if (!Check(OTP)) {
        handleDelete();
      }
    }
  }, [otpModal])
  const setOtpValue = (value) => {
    setOTP(value);
    setotpModal(false);  
  }
  return (
      <GridItem xs={12} sm={12} md={12}>
          {otpModal ?
        <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
            fullWidth={true}
            maxWidth={"xs"}
            open={otpModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setotpModal(false)}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
          >
               <OtpCheck setOtpValue={setOtpValue} /> 
          </Dialog>
        : ""}
        {alert}        
        <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ marginTop: "10px", marginBottom: "20px" }}
            >
                <TextField
                className={classes.textField}
                error={formState.errors.organizationName === "error"}
                fullWidth={true}
                helperText={
                    formState.errors.organizationName === "error"
                    ? "Organization name is required"
                    : null
                }
                label="Organization Name"
                name="organizationName"
                onChange={(event) => {
                    handleChange(event);
                }}
                select
                value={formState.values.organizationName || ""}
                >
                <MenuItem
                    disabled
                    classes={{
                    root: classes.selectMenuItem,
                    }}
                >
                    Choose Organization
                </MenuItem>
                {organizations.map((org, index) => {
                    return (
                    <MenuItem
                        key={index}
                        value={org.organizationName.toUpperCase()}
                    >
                        {org.organizationName.toUpperCase()}
                    </MenuItem>
                    );
                })}
                </TextField>
            </GridItem>
              <Button
                color="danger"
                className={classes.registerButton}
                round
                onClick={handleDelete}
                disabled={formState.isRegistering}
              >
                Delete
              </Button>
              {formState.isRegistering ? (
                <CircularProgress disableShrink />
              ) : (
                ""
              )}
              <Button
                color="default"
                className={classes.registerButton}
                onClick={props.closeModal}
                round
              >
                Close
              </Button>
      </GridItem>
  );
}
