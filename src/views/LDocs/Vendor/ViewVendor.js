/*eslint-disable*/
import React, { useState } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  CircularProgress,
  MenuItem,
  Slide, 
  Dialog
} from "@material-ui/core";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
import { useDispatch } from "react-redux";
import { getCompanies } from "actions";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
import defaultAvatar from "assets/img/placeholder.jpg";
import { Animated } from "react-animated-css";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import OtpCheck from "../Authorization/OtpCheck";
import ImageUpload from "./ImageUpload.js";
import { setIsTokenExpired } from "actions";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ViewVendor(props) {
  // register form
  const dispatch = useDispatch();
  const [animateTable, setAnimateTable] = React.useState(true);
  const [otpModal, setotpModal] = React.useState(false);
  const [OTP, setOTP] = React.useState("");
  const [formState, setFormState] = useState({
    isLoading: true,
    isRegistering: false,
    orgs: [],
    values: {
      name: props.vendDetail.name,
      licenseNumber: props.vendDetail.licenseNumber,
      email:
        props.vendDetail.email,
      loginname:
        props.vendDetail.displayName,
      cellnumber:
        props.vendDetail.contactNumber,
      referenceTicket: props.vendDetail.referenceTicket,
      created: props.vendDetail.created,
      displayLogo: "",
    },
    errors: {
      name: "",
      licenseNumber: "",
      email: "",
      loginname: "",
      cellnumber: "",
      referenceTicket: "",
    },
  });
  React.useEffect(() => {
  }, []);
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        name: "",
        licenseNumber: "",
        email: "",
        loginname: "",
        cellnumber: "",
        referenceTicket: "",
      },
      errors: {
        name: "",
        licenseNumber: "",
        email: "",
        loginname: "",
        cellnumber: "",
        referenceTicket: "",
      },
    }));
    props.closeModal();
  };
  // const [displayLogo, setDisplayLogo] = useState(null);
  // const handleImageChange = (file, status, imageName) => {
  //   if (status == 1) {
  //     if ("displayLogo") {
  //       setDisplayLogo(file);
  //     }
  //   } else {
  //     if ("displayLogo") {
  //       setDisplayLogo(null);
  //     }
  //   }
  // };
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
  
 const handleUpdate = () => {

  let name;
  let licenseNumber;
  let email;
  let loginname;
  let cellnumber;
  let referenceTicket;
  const Check = require("is-null-empty-or-undefined").Check;
  var error = false;


  if (!Check(formState.values.name)) {
    name = "success";
  } else {
    name = "error";
    error = true;
  }
  if (!Check(formState.values.licenseNumber)) {
    licenseNumber = "success";
  } else {
    licenseNumber = "error";
    error = true;
  }
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
  if (!Check(formState.values.loginname)) {
    loginname = "success";
  } else {
    loginname = "error";
    error = true;
  }
  if (!Check(formState.values.cellnumber)) {
    cellnumber = "success";
  } else {
    cellnumber = "error";
    error = true;
  }
  if (!Check(formState.values.referenceTicket)) {
    referenceTicket = "success";
  } else {
    referenceTicket = "error";
    error = true;
  }
  setFormState((formState) => ({
    ...formState,
    errors: {
      ...formState.errors,
      name: name, 
      licenseNumber: licenseNumber,
      email: email,
      loginname: loginname,
      cellnumber: cellnumber,
      referenceTicket: referenceTicket,
    },
  }));
  if (error) {
    setFormState((formState) => ({
      ...formState,
      isRegistering: false,
    }));
    errorAlert("Invalid Details!");
    return false;
  } else {
    if(!OTP){
      setotpModal(true);
      return false;
    }
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
    var bodyFormData = new FormData();
    bodyFormData.append("vendorName", formState.values.name);
    bodyFormData.append(
      "licenseNumber",
      formState.values.licenseNumber
    );
    bodyFormData.append("displayLogo", displayLogo);
    bodyFormData.append(
      "email",
      formState.values.email
    );
    bodyFormData.append(
      "loginName",
      formState.values.loginname
    );
    bodyFormData.append(
      "cellNumber",
      formState.values.cellnumber
    );
    bodyFormData.append("referenceTicket", formState.values.referenceTicket);
    bodyFormData.append("otp", OTP);
    let msg = "";
    axios({
      method: "patch",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/updcomp`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data", "cooljwt": Token },
    })
      .then((response) => {
        //dispatch(getCompanies());
        setOTP("");
        props.getVendors();
        setFormState((formState) => ({
          ...formState,
          isRegistering: false,
        }));
        // setTradeFile(null);
        // setDisplayLogo(null);
        msg = "Company Updated Successfully!";
        successAlert(msg);
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setFormState((formState) => ({
          ...formState,
          message:
            typeof error.response != "undefined"
              ? error.response.data
              : error.message,
          isRegistering: false,
        }));
        msg =
          typeof error.response != "undefined"
            ? error.response.data
            : error.message;
        errorAlert(msg);
      });
  }
};
React.useEffect(() => {
  if (!otpModal) {
    const Check = require("is-null-empty-or-undefined").Check;
    if (!Check(OTP)) {
      handleUpdate();
    }
  }
}, [otpModal])
const setOtpValue = (value) => {
  setOTP(value);
  setotpModal(false);  
}
  const classes = useStyles();
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateTable}
    >
       
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
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitle}>
                Supplier Details
                </h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridContainer>
              <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Supplier Name"
                    id="name"
                    name="name"
                    type="text"
                    disabled={true}
                    value={formState.values.name || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.licenseNumber === "error"}
                    helperText={
                      formState.errors.licenseNumber === "error"
                        ? "Valid License Number is required"
                        : null
                    }
                    label="License Number"
                    id="licenseNumber"
                    name="licenseNumber"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    disabled={props.Updating ? false : true}
                    value={
                      formState.values.licenseNumber || ""
                    }
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.email === "error"}
                    helperText={
                      formState.errors.email === "error"
                        ? "Valid  Email is required"
                        : null
                    }
                    label="Email"
                    id="email"
                    name="email"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="email"
                    disabled={props.Updating ? false : true}
                    value={formState.values.email || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.loginname === "error"}
                    helperText={
                      formState.errors.loginname === "error"
                        ? "Valid Login Name is required"
                        : null
                    }
                    label="Login Name"
                    id="loginname"
                    name="loginname"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    disabled={props.Updating ? false : true}
                    value={formState.values.loginname || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.cellnumber === "error"}
                    helperText={
                      formState.errors.cellnumber === "error"
                        ? "Valid Cell Number is required"
                        : null
                    }
                    label="Cell Number"
                    id="cellnumber"
                    name="cellnumber"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    disabled={props.Updating ? false : true}
                    value={formState.values.cellnumber || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.referenceTicket === "error"}
                    helperText={
                      formState.errors.referenceTicket === "error"
                        ? "Valid Remarks is required"
                        : null
                    }
                    label="Remarks"
                    id="referenceTicket"
                    name="referenceTicket"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    disabled={props.Updating ? false : true}
                    value={
                      formState.values.referenceTicket || ""
                    }
                  />
                </GridItem>
              </GridContainer>
              {/* <GridContainer>
              {formState.isLoading ? (
                    <React.Fragment>
                      Loading Images...&nbsp;&nbsp;
                      <CircularProgress disableShrink />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <GridItem xs={12} sm={12} md={6} lg={6}>
                        <legend>Display Logo</legend>
                        {props.Updating ? 
                          <ImageUpload
                            addButtonProps={{
                              color: "info",
                              round: true,
                            }}
                            changeButtonProps={{
                              color: "info",
                              round: true,
                            }}
                            removeButtonProps={{
                              color: "danger",
                              round: true,
                            }}
                            oldImage={formState.values.displayLogo}
                            name="displayLogo"
                            buttonId="removeLogoImage"
                            handleImageChange={handleImageChange}
                          /> : <div className="fileinput text-center">
                          <div className="thumbnail">
                            <img src={formState.values.displayLogo} alt="..." />
                          </div>
                        </div>}
                        
                      </GridItem>
                    </React.Fragment>
                  )}
              </GridContainer> */}
              {props.Updating ?
                <>
                <Button
                color="info"
                className={classes.registerButton}
                disabled={formState.isRegistering}
                round
                type="button"
                onClick={handleUpdate}
                >
                  Update
                </Button>
                {formState.isRegistering ? 
                  <CircularProgress disableShrink />
                 : "" } 
                  </>
                  : "" }
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
    </Animated>
  );
}
