/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  CircularProgress,
  MenuItem,
  Tooltip,
  IconButton
} from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
import jwt from "jsonwebtoken";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useDispatch, useSelector } from "react-redux";
import { setIsTokenExpired } from "actions";
import Refresh from "@material-ui/icons/Refresh";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Register(props) {
  // register form
  const dispatch = useDispatch();
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const [formState, setFormState] = useState({
    isRegistering: false,
    message: "",
    orgs: [],
    selectedOrg: {},
    values: {
      organizationName: "",
      companyName: "",
      pbr: "",
      pbrEmail: "",
      pbrloginname: "",
      pbrcellnumber: "",
      sbremail: "",
      sbrcellnumber: "",
      referenceTicket: "",
    },
    errors: {
      organizationName: "",
      companyName: "",
      pbr: "",
      pbrEmail: "",
      pbrloginname: "",
      pbrcellnumber: "",
      sbremail: "",
      sbrcellnumber: "",
      referenceTicket: "",
    },
  });
  useEffect(() => {
    getOrganizations();
  }, []);
  const userDetails = jwt.decode(Token);
  const getOrganizations = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/getAllOrgBytenant`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          orgs: userDetails.isTenant ? response.data : 
          response.data.filter(org => org._id == userDetails.orgDetail.organizationId)
        }));
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setFormState((formState) => ({
          ...formState,
          isError: true,
          message:
            `Unable to get Organizations please ${process.env.REACT_APP_LDOCS_CONTACT_MAIL} `, //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };
  //Handle Change
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
        {msg}
        <br />
        Unable To Register Company Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
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
  const handleRegister = () => {
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
    let companyName;
    let organizationName;
    let pbr;
    let pbrEmail;
    let pbrloginname;
    let pbrcellnumber;
    let sbremail;
    let sbrcellnumber;
    let referenceTicket;
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
    // if (!Check(formState.values.pbrcellnumber)) {
    //   pbrcellnumber = "success";
    // } else {
    //   pbrcellnumber = "error";
    //   error = true;
    // }
    // if (!Check(formState.values.sbremail)) {
    //   if (verifyEmail(formState.values.sbremail)) {
    //     sbremail = "success";
    //   } else {
    //     sbremail = "error";
    //     error = true;
    //   }
    // } else {
    //   sbremail = "error";
    //   error = true;
    // }
    // if (!Check(formState.values.sbrcellnumber)) {
    //   sbrcellnumber = "success";
    // } else {
    //   sbrcellnumber = "error";
    //   error = true;
    // }
    // if (!Check(formState.values.referenceTicket)) {
    //   referenceTicket = "success";
    // } else {
    //   referenceTicket = "error";
    //   error = true;
    // }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        organizationName: organizationName,
        companyName: companyName,
        pbr: pbr,
        pbrEmail: pbrEmail,
        pbrloginname: pbrloginname,
        pbrcellnumber: pbrcellnumber,
        sbremail: sbremail,
        sbrcellnumber: sbrcellnumber,
        referenceTicket: referenceTicket,
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
      var bodyFormData =
      {
        "tenantID": formState.selectedOrg.tenantId,
        "companyName": formState.values.companyName,
        "organizationId": formState.selectedOrg._id,
        "organizationName": formState.values.organizationName,
        "primaryBusinessRepresentative": formState.values.pbr,
        "primaryBusinessRepresentativeEmail": formState.values.pbrEmail,
        "primaryBusinessRepresentativeLoginName": formState.values.pbrloginname,
        "primaryBusinessRepresentativeCellNumber": formState.values.pbrcellnumber,
        "secondaryBusinessRepresentativeEmail": formState.values.sbremail,
        "secondaryBusinessRepresentativeCellNumber": formState.values.sbrcellnumber,
        "referenceTicket": formState.values.referenceTicket
      };
      let msg = "";
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/company/registercompany`,
        data: bodyFormData,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          props.getCompanies(formState.selectedOrg._id);
          props.setFilters(formState.values.organizationName);
          setFormState((formState) => ({
            ...formState,
            message: "Company has been successfully registered!",
            isRegistering: false,
          }));
          msg = "Company Registered Successfully!";
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
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        companyName: "",
        organizationName: "",
        pbr: "",
        pbrEmail: "",
        pbrloginname: "",
        pbrcellnumber: "",
        sbremail: "",
        sbrcellnumber: "",
        referenceTicket: "",
      },
      errors: {
        ...formState.errors,
        companyName: "",
        organizationName: "",
        pbr: "",
        pbrEmail: "",
        pbrloginname: "",
        pbrcellnumber: "",
        sbremail: "",
        sbrcellnumber: "",
        referenceTicket: "",
      },
    }));
    props.closeModal();
  };
  const classes = useStyles();
  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>Add Company</h4>
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
                    error={formState.errors.companyName === "error"}
                    helperText={
                      formState.errors.companyName === "error"
                        ? "Valid company name is required"
                        : null
                    }
                    label="Company Name"
                    id="companyName"
                    name="companyName"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.companyName || ""}
                  />
                </GridItem>
                <GridItem
                  xs={10}
                  sm={10}
                  md={3}
                  lg={3}
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
                      let selectedOrg = formState.orgs.find(item => item.organizationName.toUpperCase() === event.target.value);
                      setFormState((formState) => ({
                        ...formState,
                        selectedOrg: selectedOrg
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
                 xs={2}
                 sm={2}
                 md={1}
                 lg={1}
                 style={{ marginTop: "20px", marginBottom: "10px" }}
                >
                <Tooltip
                  id="tooltip-top"
                  title="Refresh"
                  style={{ float: "right" }}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                <IconButton onClick={()=>getOrganizations()} simple color="info" justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </IconButton>
                </Tooltip>
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
                    error={formState.errors.pbr === "error"}
                    helperText={
                      formState.errors.pbr === "error"
                        ? "Valid PBR First Name is required"
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
                {/* <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.sbremail === "error"}
                    helperText={
                      formState.errors.sbremail === "error"
                        ? "Valid SBR Email is required"
                        : null
                    }
                    label="SBR Email"
                    id="sbremail"
                    name="sbremail"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="email"
                    value={formState.values.sbremail || ""}
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
                    error={formState.errors.sbrcellnumber === "error"}
                    helperText={
                      formState.errors.sbrcellnumber === "error"
                        ? "Valid SBR Cell Number is required"
                        : null
                    }
                    label="SBR Cell Number"
                    id="sbrcellnumber"
                    name="sbrcellnumber"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.sbrcellnumber || ""}
                  />
                </GridItem> */}
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
                    name="referenceTicket"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.referenceTicket || ""}
                  />
                </GridItem>
              </GridContainer>
              <Button
                color="info"
                className={classes.registerButton}
                round
                type="button"
                onClick={handleRegister}
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
