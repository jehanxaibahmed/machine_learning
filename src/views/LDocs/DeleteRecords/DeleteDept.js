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
// core components
import { getDepartments } from "actions";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
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

export default function DeleteDept(props) {
  // Delete form
  const [isLoading, setisLoading] = useState(true);
  const [otpModal, setotpModal] = React.useState(false);
  const [OTP, setOTP] = React.useState("");

  const dispatch = useDispatch();
  const organizations = useSelector((state) => state.userReducer.organizations);
  const companies = useSelector((state) => state.userReducer.companies);
  const departments = useSelector((state) => state.userReducer.departments);

  const [formState, setFormState] = useState({
    isRegistering: false,
    values: {
        organizationName: "",
        companyName: "",
        departmentName: ""
    },
    errors: {
        organizationName: "",
        companyName: "",
        departmentName: ""
    },
  });
  const handleChange = (event) => {
    event.persist();
    if (event.target.name == "organizationName") {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          companyName: "",
          departmentName: "",
        },
      }));
    } else if (event.target.name == "companyName") {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          departmentName: "",
        },
      }));
    } 
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    }));
    
  };
  const classes = useStyles();

  const handleDelete = () => {

    let organizationName;
    let companyName;
    let departmentName;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;
       if (!Check(formState.values.organizationName)) {
        organizationName = "success";
      } else {
        organizationName = "error";
        error = true;
      }
       if (!Check(formState.values.companyName)) {
        companyName = "success";
      } else {
        companyName = "error";
        error = true;
      }
       if (!Check(formState.values.departmentName)) {
        departmentName = "success";
      } else {
        departmentName = "error";
        error = true;
      }
      setFormState((formState) => ({
        ...formState,
        errors: {
          ...formState.errors,
          organizationName: organizationName,
          companyName: companyName,
          departmentName: departmentName
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
        url: `${process.env.REACT_APP_LDOCS_API_URL}/del/dept/${formState.values.organizationName}/${formState.values.companyName}/${formState.values.departmentName}/${OTP}`,
        headers: { "cooljwt": Token },
      })
        .then((response) => {
          setFormState((formState) => ({
            ...formState,
            values: {
              ...formState.values,
              organizationName: "",
              companyName: "",
              departmentName: ""
            },
          }));
          dispatch(getDepartments());
            setOTP("")
          setFormState((formState) => ({
            ...formState,
            isRegistering: false,
          }));
          msg = "Department Deleted Successfully!";
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
        <GridContainer style={{ marginTop: "10px", marginBottom: "20px" }}>
        <GridItem
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ marginTop: "10px", marginBottom: "10px" }}
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
            <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    error={formState.errors.companyName === "error"}
                    fullWidth={true}
                    helperText={
                      formState.errors.companyName === "error"
                        ? "Company name is required"
                        : null
                    }
                    label="Company Name"
                    name="companyName"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    select
                    value={formState.values.companyName || ""}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose Company
                    </MenuItem>
                    {companies.map((com, index) => {
                      return (
                        formState.values.organizationName == com.organizationName ? 
                        <MenuItem
                          key={index}
                          value={com.companyName.toUpperCase()}
                        >
                          {com.companyName.toUpperCase()}
                          </MenuItem>
                          : ""
                      );
                    })}
                  </TextField>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    error={formState.errors.departmentName === "error"}
                    fullWidth={true}
                    helperText={
                      formState.errors.departmentName === "error"
                        ? "Department name is required"
                        : null
                    }
                    label="Department Name"
                    name="departmentName"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    select
                    value={formState.values.departmentName || ""}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose Department
                    </MenuItem>
                    {departments.map((dep, index) => {
                      return formState.values.organizationName ==
                        dep.organizationName &&
                        formState.values.companyName == dep.companyName ? (
                        <MenuItem
                          key={index}
                          value={dep.departmentName.toUpperCase()}
                        >
                          {dep.departmentName.toUpperCase()}
                        </MenuItem>
                      ) : (
                        ""
                      );
                    })}
                  </TextField>
                </GridItem>
                </GridContainer>  
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
