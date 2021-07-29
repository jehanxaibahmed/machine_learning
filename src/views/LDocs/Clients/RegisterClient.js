/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "actions";
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
import { setIsTokenExpired } from "actions/index.js";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function RegisterClient(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const userDetails = jwt.decode(Token);
  const dispatch = useDispatch();
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [currencyLookups, setCurrencyLookups] = React.useState([]);
  const [formState, setFormState] = useState({
    isRegistering: false,
    message: "",
    orgs: [],
    values: {
      vendorName: "",
      currency: "",
      licenseNumber: "",
      email: "",
      loginname: "",
      cellnumber: "",
      referenceTicket: "",
      organizationName:"",
      supplierSite:""
    },
    errors: {
      vendorName: "",
      currency: "",
      licenseNumber: "",
      email: "",
      loginname: "",
      cellnumber: "",
      referenceTicket: "",
      organizationName: "",
      supplierSite:""
    },
  });
    useEffect(() => {
      getLookUp();
      getOrganizations();
    }, []);

  const getOrganizations = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/getAllOrgBytenant`,
      headers: { cooljwt:Token},
    })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          orgs: userDetails.isTenant ? response.data :  response.data.filter(org => org._id == userDetails.orgDetail.organizationId),
        }));
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setFormState((formState) => ({
          ...formState,
          isError: true,
          message:
            "Unable to get Departments please contact Admin", //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };


  const getLookUp = () => {
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/GetAllCurrencies`,
      headers: {
        cooljwt: Token,
      },
    }).then(res=>{
      if(typeof res.data == 'object' ){
        setCurrencyLookups(res.data);
      };
    }).catch(err=>{
      console.log(err);
    })
  }
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
        [event.target.name]: event.target.name == 'currency' ? event.target.value :  event.target.value.toUpperCase(),
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
 
  const handleOrgFilter = (event) => {
    setOrganizationFilter(event.target.value);
    var orgDetail = organizations.find(item => item.organizationName == event.target.value);
    event.target.value == 'SHOW ALL' ? getCompanies(undefined) : getCompanies(orgDetail._id);
  }

  const handleRegister = () => {
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
    let vendorName;
    let currency;
    let licenseNumber;
    let email;
    let loginname;
    let cellnumber;
    let referenceTicket;
    let organizationName;
    let supplierSite;

    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

  
    if (!Check(formState.values.vendorName)) {
      vendorName = "success";
    } else {
      vendorName = "error";
      error = true;
    }
    if (!Check(formState.values.currency)) {
      currency = "success";
    } else {
      currency = "error";
      error = true;
    }
    // if (!Check(formState.values.licenseNumber)) {
    //   licenseNumber = "success";
    // } else {
    //   licenseNumber = "error";
    //   error = true;
    // }
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
    if (!Check(formState.values.supplierSite)) {
      supplierSite = "success";
    } else {
      supplierSite = "error";
      error = true;
    }
    // if (!Check(formState.values.referenceTicket)) {
    //   referenceTicket = "success";
    // } else {
    //   referenceTicket = "error";
    //   error = true;
    // }
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
        vendorName: vendorName, 
        currency: currency,
        licenseNumber: licenseNumber,
        email: email,
        loginname: loginname,
        cellnumber: cellnumber,
        referenceTicket: referenceTicket,
        organizationName: organizationName,
        supplierSite: supplierSite
      },
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
        tenantId:formState.orgs.find(org=>org.organizationName == formState.values.organizationName).tenantId,
        name:formState.values.vendorName,
        email:formState.values.email,
        licenseNumber:formState.values.licenseNumber,
        displayName:formState.values.loginname,
        contactNumber:formState.values.cellnumber,
        ref:formState.values.referenceTicket,
        currency:formState.values.currency,
        site:formState.values.supplierSite,
        organizations:{
          tenantId:formState.orgs.find(org=>org.organizationName == formState.values.organizationName).tenantId,
          currency:formState.orgs.find(org=>org.organizationName == formState.values.organizationName).Currency_Base,
          organizationId:formState.orgs.find(org=>org.organizationName == formState.values.organizationName)._id,
          organizationName:formState.values.organizationName
          }
        };
      let msg = "";
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorRegistration`,
        data: bodyFormData,
        headers: { cooljwt:Token},
      })
        .then((response) => {
          //dispatch(getCompanies());
          props.getVendors(formState.orgs.find(org=>org.organizationName == formState.values.organizationName)._id);
          props.setFilters(formState.orgs.find(org=>org.organizationName == formState.values.organizationName))
          setFormState((formState) => ({
            ...formState,
            message: "Client has been successfully registered! Check Mail and Activate Client Account.",
            isRegistering: false,
          }));
          msg = "Client Registered Successfully!  Check Mail and Activate Client Account.";
          successAlert(msg);
        })
        .catch((error) => {
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
          console.log(error);
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
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        vendorName: "",
        currency: "",
        licenseNumber: "",
        email: "",
        loginname: "",
        cellnumber: "",
        referenceTicket: "",
      },
      errors: {
        ...formState.errors,
        vendorName: "",
        currency: "",
        licenseNumber: "",
        email: "",
        loginname: "",
        cellnumber: "",
        referenceTicket: "",
      },
    }));
    props.closeModal();
  };
  const classes = useStyles();
    const removeImages = () => {
      if (document.getElementById("removeLogoImage") != null) {
        document.getElementById("removeLogoImage").click();
      }
    };
  return (
    <GridContainer>
       
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>Client On Boarding</h4>
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
                      let selectedOrg = formState.orgs.find(item=> item.organizationName.toUpperCase() === event.target.value);
                      setFormState((formState) => ({
                        ...formState,
                       selectedOrg:selectedOrg
                      }));
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
                    {formState.orgs.map((org, index) => {
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
                    fullWidth={true}
                    error={formState.errors.vendorName === "error"}
                    helperText={
                      formState.errors.vendorName === "error"
                        ? "Valid Client name is required"
                        : null
                    }
                    label="Client Name"
                    id="vendorName"
                    name="vendorName"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.vendorName || ""}
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
                    className={classes.textField}
                    error={formState.errors.licenseNumber === "error"}
                    fullWidth={true}
                    helperText={
                      formState.errors.licenseNumber === "error"
                        ? "LicenseNumber is required"
                        : null
                    }
                    label="License Number"
                    name="licenseNumber"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.licenseNumber || ""}
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
                    error={formState.errors.email === "error"}
                    helperText={
                      formState.errors.email === "error"
                        ? "Valid Email is required"
                        : null
                    }
                    label=" Email"
                    id="email"
                    name="email"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="email"
                    value={formState.values.email || ""}
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
                    error={formState.errors.loginname === "error"}
                    helperText={
                      formState.errors.loginname === "error"
                        ? "Valid Contact Name is required"
                        : null
                    }
                    label="Contact Person"
                    id="loginname"
                    name="loginname"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.loginname || ""}
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
                    error={formState.errors.cellnumber === "error"}
                    helperText={
                      formState.errors.cellnumber === "error"
                        ? "Valid Contact Number is required"
                        : null
                    }
                    label="Contact Number"
                    id="cellnumber"
                    name="cellnumber"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.cellnumber || ""}
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
                     error={formState.errors.currency === "error"}
                     helperText={
                       formState.errors.currency === "error"
                         ? "Valid Currency Base is required"
                         : null
                     }
                     label="Currency Base"
                     id="currency"
                     name="currency"
                     onChange={(event) => {
                       handleChange(event);
                     }}
                     type="text"
                     value={formState.values.currency || ""}
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
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.supplierSite === "error"}
                    helperText={
                      formState.errors.supplierSite === "error"
                        ? "Valid Client Site is required"
                        : null
                    }
                    label="Client Site"
                    id="supplierSite"
                    name="supplierSite"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.supplierSite || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
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
                    multiline
                    rows="3"
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
                </GridItem> */}
                {/* <GridItem xs={12} sm={12} md={6} lg={6}>
                  <legend>Picture / Logo</legend>
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
                onClick={handleRegister}
              >
                Register Client
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
