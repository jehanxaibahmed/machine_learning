/*eslint-disable*/
import React, { useState } from "react";
// @material-ui/core components
import { TextField, makeStyles, CircularProgress, MenuItem } from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
import { getOrganizations } from "actions";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import ImageUpload from "./ImageUpload.js";
import axios from "axios";
import jwt from "jsonwebtoken";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useSelector, useDispatch } from "react-redux";
import { setIsTokenExpired } from "actions/index.js";


const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Register(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const [currencyLookups, setCurrencyLookups] = React.useState([]);
  const [formState, setFormState] = useState({
    isRegistering: false,
    message: "",
    values: {
      name: "",
      countryOfOrigin: "",
      tradeLicenseNumber: "",
      pbr: "",
      pbrEmail: "",
      pbrloginname: "",
      pbrcellnumber: "",
      referenceTicket: "",
      currencyBase:""
    },
    errors: {
      name: "",
      countryOfOrigin: "",
      tradeLicenseNumber: "",
      pbr: "",
      pbrEmail: "",
      pbrloginname: "",
      pbrcellnumber: "",
      referenceTicket: "",
      currencyBase:""
    },
  });
  const [tradeFile, setTradeFile] = useState(null);
  const [displayLogo, setDisplayLogo] = useState(null);
  const handleImageChange = (file, status, imageName) => {

    if (status == 1) {
      if (imageName == "tradeLicenseImage") {
        setTradeFile(file);
      } else if ("displayLogo") {
        setDisplayLogo(file);
      }
      
    } else {
      if (imageName == "tradeLicenseImage") {
        setTradeFile(null);
      } else if ("displayLogo") {
        setDisplayLogo(null);
      }
    }
    };
  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.name == 'currencyBase' ? event.target.value :  event.target.value.toUpperCase(),
      },
    }));
  };
  // function that returns true if value is email, false otherwise
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
            onConfirm={() => hideErrorAlert()}
            onCancel={() => hideErrorAlert()}
            confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
          >
            {msg ? msg : "Unable To Register Organization Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}"}
          </SweetAlert>
        );
      };
  const hideAlert = () => {
        closeModal();
        setAlert(null);
      };
  const hideErrorAlert = () => {
    setAlert(null);
  };
  const handleSignUp = () => {
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
    let name;
    let countryOfOrigin;
    let tradeLicenseNumber;
    let pbr;
    let pbrEmail;
    let pbrloginname;
    let pbrcellnumber;
    let referenceTicket;
    let currencyBase;
      const Check = require("is-null-empty-or-undefined").Check;
      var error = false;

      if (!Check(formState.values.name)) {
        name = "success";
      } else {
        name = "error";
        error = true;
    }
      // if (!Check(formState.values.countryOfOrigin)) {
      //   countryOfOrigin = "success";
      // } else {
      //   countryOfOrigin = "error";
      //   error = true;
      // }
      // if (!Check(formState.values.tradeLicenseNumber)) {
      //   tradeLicenseNumber = "success";
      // } else {
      //   tradeLicenseNumber = "error";
      //   error = true;
      // }
      if (!Check(formState.values.pbr)) {
        pbr = "success";
      } else {
        pbr = "error";
        error = true;
      }
      if (!Check(formState.values.pbrEmail)) {
        if (verifyEmail(formState.values.pbrEmail)) {
          pbrEmail = "success";
        } else {
          pbrEmail = "error";
          error = true;
        }
      } else {
        pbrEmail = "error";
        error = true;
    }
     if (!Check(formState.values.pbrloginname)) {
       pbrloginname = "success";
     } else {
       pbrloginname = "error";
       error = true;
     }
    //  if (!Check(formState.values.pbrcellnumber)) {
    //    pbrcellnumber = "success";
    //  } else {
    //    pbrcellnumber = "error";
    //    error = true;
    //  }
    // if (!Check(formState.values.referenceTicket)) {
    //   referenceTicket = "success";
    // } else {
    //   referenceTicket = "error";
    //   error = true;
    // }
    // if (!Check(formState.values.currencyBase)) {
    //   currencyBase = "success";
    // } else {
    //   currencyBase = "error";
    //   error = true;
    // }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
          name: name,
          countryOfOrigin: countryOfOrigin,
          tradeLicenseNumber: tradeLicenseNumber,
          pbr: pbr,
          pbrEmail: pbrEmail,
          pbrloginname: pbrloginname,
          pbrcellnumber: pbrcellnumber,
          referenceTicket: referenceTicket,
          currencyBase:currencyBase
      }
    }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isRegistering: false,
        message: "Invalid User Details!",
      }));
      return false;
    } else { 
      var bodyFormData = {
        "organizationName": formState.values.name,
        "Address": formState.values.countryOfOrigin,
        "tradeLicenseNumber": formState.values.tradeLicenseNumber,
        "adminLoginName": formState.values.pbrloginname,
        "Currency_Base": formState.values.currencyBase,
        "primaryBusinessRepresentative": formState.values.pbr,
        "primaryBusinessRepresentativeEmail": formState.values.pbrEmail,
        "primaryBusinessRepresentativeLoginName": formState.values.pbrloginname,
        "primaryBusinessRepresentativeCellNumber": formState.values.pbrcellnumber,
        "referenceTicket": formState.values.referenceTicket
      }
      let msg = "";
       axios({
         method: "post",
         url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/orgRegister`,
         data: bodyFormData,
         headers: { cooljwt:Token},
       })
         .then((response) => {
          dispatch(getOrganizations());
           removeImages();
           props.getOrganizations();
           setFormState((formState) => ({
             ...formState,
             message: "Organization has been successfully registered!",
             isRegistering: false,
           }));
           setTradeFile(null);
           setDisplayLogo(null);
           msg = "Organization Registered Successfully! PLease Check your email and Register Organization Admin.. ";
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
  }

  React.useEffect(()=>{
    getLookUp();
  },[])

  const getLookUp = () => {
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/GetAllCurrencies`,
      headers: {
        cooljwt: Token,
      },
    }).then(res=>{
      console.log(res.data);
      if(typeof res.data == 'object' ){
        setCurrencyLookups(res.data);
      };
    }).catch(err=>{
      console.log(err);
    })
  }
   const closeModal = () => {
     setFormState((formState) => ({
       ...formState,
       values: {
         ...formState.values,
         name: "",
         countryOfOrigin: "",
         tradeLicenseNumber: "",
         pbr: "",
         pbrEmail: "",
         pbrloginname: "",
         pbrcellnumber: "",
         currencyBase: "",         
         referenceTicket: "",
       },
       errors: {
         ...formState.errors,
         name: "",
         countryOfOrigin: "",
         tradeLicenseNumber: "",
         pbr: "",
         pbrEmail: "",
         pbrloginname: "",
         pbrcellnumber: "",
         currencyBase:"",
         referenceTicket: "",
       },
     }));
     props.closeModal();
   }
  const classes = useStyles();
  const removeImages = () => {
    if (document.getElementById("removeTradeImage") != null) {
      document.getElementById("removeTradeImage").click();
    }
    if (document.getElementById("removeLogoImage") != null) {
      document.getElementById("removeLogoImage").click();
    }
  }
  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
                Add Organization
              </h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
            <form>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.name === "error"}
                    helperText={
                      formState.errors.name === "error"
                        ? "Valid name is required"
                        : null
                    }
                    label="Organization Name"
                    id="name"
                    name="name"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.name || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.countryOfOrigin === "error"}
                    helperText={
                      formState.errors.countryOfOrigin === "error"
                        ? "Valid country of origin is required"
                        : null
                    }
                    label="Address"
                    id="countryOfOrigin"
                    name="countryOfOrigin"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.countryOfOrigin || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.tradeLicenseNumber === "error"}
                    helperText={
                      formState.errors.tradeLicenseNumber === "error"
                        ? "Valid Trade License Number is required"
                        : null
                    }
                    label="Trade License Number"
                    id="tradeLicenseNumber"
                    name="tradeLicenseNumber"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.tradeLicenseNumber || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.pbr === "error"}
                    helperText={
                      formState.errors.pbr === "error"
                        ? "Valid PBR First Name  is required"
                        : null
                    }
                    label="PBR First Name"
                    id="pbr"
                    name="pbr"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.pbr || ""}
                  />
                </GridItem>
                
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.pbrloginname === "error"}
                    helperText={
                      formState.errors.pbrloginname === "error"
                        ? "Valid PBR Last Name is required"
                        : null
                    }
                    label="PBR Last Name"
                    id="pbrloginname"
                    name="pbrloginname"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.pbrloginname || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.pbrEmail === "error"}
                    helperText={
                      formState.errors.pbrEmail === "error"
                        ? "Valid PBR Email is required"
                        : null
                    }
                    label="PBR Email"
                    id="pbrEmail"
                    name="pbrEmail"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="email"
                    value={formState.values.pbrEmail || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.pbrcellnumber === "error"}
                    helperText={
                      formState.errors.pbrcellnumber === "error"
                        ? "Valid PBR Cell Number is required"
                        : null
                    }
                    label="PBR Cell Number"
                    id="pbrcellnumber"
                    name="pbrcellnumber"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.pbrcellnumber || ""}
                  />
                </GridItem>                       
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                     fullWidth={true}
                     error={formState.errors.currencyBase === "error"}
                     helperText={
                       formState.errors.currencyBase === "error"
                         ? "Valid Currency Base is required"
                         : null
                     }
                     label="Currency Base"
                     id="currencyBase"
                     name="currencyBase"
                     onChange={(event) => {
                       handleChange(event);
                     }}
                     type="text"
                     value={formState.values.currencyBase || ""}
                     select
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose Currency Base
                    </MenuItem>
                    {currencyLookups.map(cu =>  (
                        <MenuItem
                          key={cu._id} 
                          value={cu._id}>
                          {`${cu.Currency.toUpperCase()} (${cu.Symbol})`} 
                        </MenuItem>
                      ))
                     }
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
                    value={formState.values.referenceTicket || ""}
                  />
                </GridItem>
                {/* <GridItem xs={12} sm={12} md={6} lg={6}>
                  <legend>Trade License Image</legend>
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
                    name="tradeLicenseImage"
                    buttonId="removeTradeImage"
                    handleImageChange={handleImageChange}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <legend>Display Logo</legend>
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
                    name="displayLogo"
                    buttonId="removeLogoImage"
                    handleImageChange={handleImageChange}
                  />
                </GridItem> */}
              </GridContainer>
              <Button
                color="info"
                className={classes.registerButton}
                round
                type="button"
                onClick={handleSignUp}
              >
                Save
              </Button>
              {formState.isRegistering ? (
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
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
