/*eslint-disable*/
import React, { useState } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  CircularProgress,
  Slide,
  Dialog
} from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
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
import { Animated } from "react-animated-css";
import { useDispatch, useSelector } from "react-redux";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import jwt from "jsonwebtoken";
import OtpCheck from "../Authorization/OtpCheck";
import { setIsTokenExpired } from "actions";
const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ViewComp(props) {
  // register form
  const dispatch = useDispatch();
  const [animateTable, setAnimateTable] = React.useState(true);
  const [otpModal, setotpModal] = React.useState(false);
  const [OTP, setOTP] = React.useState("");
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const [formState, setFormState] = useState({
    isLoading: true,
    isRegistering: false,
    orgs: [],
    values: {
      name: props.compDetail.companyName,
      companyId: props.compDetail._id,
      organizationName: props.compDetail.organizationName,
      pbr: props.compDetail.primaryBusinessRepresentative,
      pbrEmail:
        props.compDetail.primaryBusinessRepresentativeEmail,
      pbrloginname:
        props.compDetail.primaryBusinessRepresentativeLoginName,
      pbrcellnumber:
        props.compDetail.primaryBusinessRepresentativeCellNumber,
      sbremail:
        props.compDetail.secondaryBusinessRepresentativeEmail,
      sbrcellnumber:
        props.compDetail
          .secondaryBusinessRepresentativeCellNumber,
      referenceTicket: props.compDetail.referenceTicket,
      created: props.compDetail.created,
      displayLogo: "",
      tradeLicenseImage: "",
    },
    errors: {
      name: "",
      organizationName: "",
      countryOfOrigin: "",
      tradeLicenseNumber: "",
      pbr: "",
      pbrEmail: "",
      pbrloginname: "",
      pbrcellnumber: "",
      pbrothernumber: "",
      sbremail: "",
      sbrcellnumber: "",
      sbrothernumber: "",
      referenceTicket: "",
    },
  });
  const getOrganizations = () => {
    const userDetails = jwt.decode(Token);
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
        error.response.status == 401 && dispatch(setIsTokenExpired(true));
        setFormState((formState) => ({
          ...formState,
          message:
            `Unable to get Departments please contact at ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`, //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };
  React.useEffect(() => {
    if (props.Updating) {
      getOrganizations();
    }
  }, []);
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        name: "",
        pbr: "",
        pbrEmail: "",
        pbrloginname: "",
        pbrcellnumber: "",
        sbremail: "",
        sbrcellnumber: "",
        referenceTicket: "",
      },
      errors: {
        name: "",
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
        onConfirm={() => hideErrorAlert()}
        onCancel={() => hideErrorAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg ? msg : `Unable To Update Company Please Contact ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`}

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
  const handleUpdate = () => {

    let name;
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
    if (!Check(formState.values.name)) {
      name = "success";
    } else {
      name = "error";
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
    if (!Check(formState.values.pbrcellnumber)) {
      pbrcellnumber = "success";
    } else {
      pbrcellnumber = "error";
      error = true;
    }
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
        name: name,
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
      }));
      errorAlert("Invalid Details!");
      return false;
    } else {
      if (!OTP) {
        setotpModal(true);
        return false;
      }
      setFormState((formState) => ({
        ...formState,
        isRegistering: true,
      }));
      var bodyFormData =
      {
        "companyName": formState.values.name,
        "companyId": formState.values.companyId,
        "organizationName": formState.values.organizationName,
        "primaryBusinessRepresentative": formState.values.pbr,
        "primaryBusinessRepresentativeEmail": formState.values.pbrEmail,
        "primaryBusinessRepresentativeLoginName": formState.values.pbrloginname,
        "primaryBusinessRepresentativeCellNumber": formState.values.pbrcellnumber,
        "secondaryBusinessRepresentativeEmail": formState.values.sbremail,
        "secondaryBusinessRepresentativeCellNumber": formState.values.sbrcellnumber,
        "referenceTicket": formState.values.referenceTicket,
        "otp": OTP
      };
      let msg = "";
      axios({
        method: "put",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/company/updateCompany`,
        data: bodyFormData,
        headers: { "cooljwt": Token },
      })
        .then((response) => {
          dispatch(getCompanies());
          setOTP("");
          props.getCompanies();
          setFormState((formState) => ({
            ...formState,
            isRegistering: false,
          }));
          msg = "Company Updated Successfully!";
          successAlert(msg);
        })
        .catch((error) => {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
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
      {alert}
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
                  Company Details
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
                    label="Company Name"
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
                    label="Organization Name"
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    disabled={true}
                    value={
                      formState.values.organizationName || ""
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
                    disabled={props.Updating ? false : true}
                    value={formState.values.pbrEmail || ""}
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
                    disabled={props.Updating ? false : true}
                    value={formState.values.pbr || ""}
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
                    error={formState.errors.pbrloginname === "error"}
                    helperText={
                      formState.errors.pbrloginname === "error"
                        ? "Valid PBR Login Name is required"
                        : null
                    }
                    label="PBR Last Name"
                    id="pbrloginname"
                    name="pbrloginname"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    disabled={props.Updating ? false : true}
                    value={formState.values.pbrloginname || ""}
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
                    disabled={props.Updating ? false : true}
                    value={formState.values.pbrcellnumber || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
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
                    : ""}
                </>
                : ""}
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
