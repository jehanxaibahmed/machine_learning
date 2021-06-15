import React, {useState, useEffect} from "react";
// @material-ui/icons
import {
    Button, 
  makeStyles,
  CircularProgress,
  TextField,
  useForkRef,
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
import defaultAvatar from "assets/img/placeholder.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setIsTokenExpired } from "actions";


const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Step1(props) {
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  var row = props.userData;
    const [formState, setFormState] = useState({
      isLoading: false,
      values: {
        displayName:
          typeof row.level1 != "undefined" ? row.level1.displayName : "",
        lastName: typeof row.level1 != "undefined" ? row.level1.lastName : "",
        firstName:
          typeof row.level1 != "undefined" ? row.level1.firstName : "",
        PCNP:
          typeof row.level1 != "undefined"
            ? row.level1.personalCellNumberPrimary
            : "",
        personalEmail:
          typeof row.level1 != "undefined" ? row.level1.personalEmail : "",
        PSN:
          typeof row.level1 != "undefined"
            ? row.level1.personalSecondaryNumber
            : "",
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
         {msg}<br />
         Unable To Update Level 1 Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
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
    let firstName;
    let PCNP;
    let personalEmail;
    let PSN;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.displayName)) {
      displayName = "success";
    } else {
      displayName = "error";
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
    if (!Check(formState.values.firstName)) {
      firstName = "success";
    } else {
      firstName = "error";
      error = true;
    }
    if (!Check(formState.values.PCNP)) {
      PCNP = "success";
    } else {
      PCNP = "error";
      error = true;
    }
    if (!Check(formState.values.PSN)) {
      PSN = "success";
    } else {
      PSN = "error";
      error = true;
    }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        displayName: displayName,
        lastName: lastName,
        firstname: firstName,
        PCNP: PCNP,
        personalEmail: personalEmail,
        PSN: PSN
      }
    }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isLoading: false,
      }));
      return false;
    } else {
      var data = {
        firstName: formState.values.firstName,
        lastName: formState.values.lastName,
        displayName: formState.values.displayName,
        personalEmail: formState.values.personalEmail,
        personalCellNumberPrimary: formState.values.PCNP,
        personalSecondaryNumber: formState.values.PSN,
        email:props.userData.level3.email
      };
      let msg = '';
      axios({
        method: "put",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/user/level1Update`,
        data: data,
        headers: { cooljwt: Token },
      }).then((response) => {
          if (row.level1 != "undefined") {
            props.userData.level1.displayName = data.displayName;
            props.userData.level1.lastName = data.lastName;
            props.userData.level1.firstName = data.firstName;
            props.userData.level1.personalCellNumberPrimary = data.personalCellNumberPrimary;
            props.userData.level1.personalEmail = data.personalEmail;
            props.userData.level1.personalSecondaryNumber = data.personalSecondaryNumber;
            props.updateUserData(props.userData);
          }
          setFormState((formState) => ({
            ...formState,
            isLoading: false,
          }));
          msg = "Level 1 Info Updated Successfully!";
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
   useEffect(() => {
     getUserImage();
   }, []);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userImage, setUserImage] = React.useState();
   const getUserImage = () => {

         if (typeof row.level1.profileImgT != "undefined") {
           var base64Flag = `data:${row.level1.profileImgT};base64,`;
           let profileImage = base64Flag + row.level1.profileImg;
           setUserImage(profileImage);
           setIsLoading(false);
         } else {
           setUserImage(defaultAvatar);
           setIsLoading(false);
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
            disabled={props.disabledCheck}
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
            disabled={props.disabledCheck}
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
            disabled={props.disabledCheck}
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
            disabled={props.disabledCheck}
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
            disabled={props.disabledCheck}
            value={formState.values.personalEmail || ""}
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
            error={formState.errors.PSN === "error"}
            helperText={
              formState.errors.PSN === "error"
                ? "Valid Secondary Number is required"
                : null
            }
            label="Personal Secondary Number"
            id="PSN"
            name="PSN"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            disabled={props.disabledCheck}
            value={formState.values.PSN || ""}
          />
        </GridItem>

        {props.disabledCheck ? (
          isLoading ? (
            ""
          ) : (
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <legend>User Image</legend>
              <div className="fileinput text-center">
                <div className="thumbnail">
                  <img src={userImage} alt="..." />
                </div>
              </div>
            </GridItem>
          )
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
                backgroundColor: "#9E2654",
                color: "white",
              }}
              className={classes.registerButton}
              round
              onClick={saveUserLevelOne}
            >
              Save Level 1 Info
            </Button>
            {formState.isLoading ? <CircularProgress disableShrink /> : ""}
          </GridItem>
        )}
      </GridContainer>
    </Animated>
  );
  }


