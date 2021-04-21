/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { TextField, makeStyles, CircularProgress, MenuItem, Slide, Dialog } from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "actions";
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
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import OtpCheck from "../Authorization/OtpCheck";
import MultipleSelect from './MultiSelect';
import jwt from "jsonwebtoken";
import { setIsTokenExpired } from "actions";


const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ViewDept(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  // register form
  const dispatch = useDispatch();
  const [animateTable, setAnimateTable] = React.useState(true);
  const [otpModal, setotpModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [OTP, setOTP] = React.useState("");
  const [formState, setFormState] = useState({
    orgs: [],
    comp: [],
    selectedWorkFlows:props.deptDetail.workFlows || [],
    workFlows:[],
    isRegistering: false,
    values: {
      departmentName: props.deptDetail.departmentName || "",
      referenceTicket: props.deptDetail.referenceTicket || "",
      titleHead: props.deptDetail.titleHead || "",
      organizationName: props.deptDetail.organizationName || "",
      companyName: props.deptDetail.companyName || "",
      workflows :props.deptDetail.workFlows || [],
      tenantId:props.deptDetail.tenantId || ""
    },
    errors: {
      departmentName: "",
      referenceTicket: "",
      titleHead: "",
      organizationName: "",
      companyName: "",
    },
  });
  const setWorkFlows = (x) => {
    var selectedWorkFlows = [];
    x.map((item=>{
      formState.workFlows.find(itm=>itm.workflowName == item) !== undefined ?
      selectedWorkFlows.push({
        id:formState.workFlows.find(itm=>itm.workflowName == item)._id,
        name:item
      }):'';
    }))
    setFormState((formState) => ({
      ...formState,
      selectedWorkFlows: selectedWorkFlows
    }));
    }
  const getWorkFlows = (org) => {
    return new Promise((res, rej)=>{
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getworkflowbyorganization/${org}`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          setFormState((formState) => ({
            ...formState,
            workFlows: response.data,
          }));
        })
    })     
  }
  const getCompanies = (org) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/company/getCompaniesUnderOrg/${org}`,
      headers: { cooljwt:Token},
    })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          comp: response.data,
        }));
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(`Unable to get Companies please contact at ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`)
      });
  };

  const getOrganizations = () => {
    const userDetails = jwt.decode(Token);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/getAllOrgBytenant`,
      headers: { cooljwt:Token},
    })
       .then((response) => {
          const orgs = userDetails.isTenant ? response.data : response.data.filter(org => org._id == userDetails.orgDetail.organizationId);
          setFormState((formState) => ({
            ...formState,
            orgs: orgs,
          }));
        setLoading(false);
       })
       .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(`Unable to get Organizations please contact at ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`);
        setLoading(false);
       });
   };
 
 useEffect(() => {
   if(props.Updating){
    setLoading(true);
    getOrganizations();
    getCompanies(props.deptDetail.organizationId);
    getWorkFlows(props.deptDetail.organizationId);
   }
}, []);
const handleChange = (event) => {
  event.persist();
  if (event.target.name == "organizationName") {
    getCompanies(formState.orgs.find(org=>org.organizationName == event.target.value)._id);
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        companyName: "",
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
      {msg ? msg : "Unable To Update Department Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}"}
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

  let departmentName;
    let referenceTicket;
    let titleHead;
    let organizationName;
    let companyName;
  const Check = require("is-null-empty-or-undefined").Check;
  var error = false;

  if (!Check(formState.values.departmentName)) {
    departmentName = "success";
  } else {
    departmentName = "error";
    error = true;
  }
  if (!Check(formState.values.referenceTicket)) {
    referenceTicket = "success";
  } else {
    referenceTicket = "error";
    error = true;
  }
  if (!Check(formState.values.titleHead)) {
    titleHead = "success";
  } else {
    titleHead = "error";
    error = true;
  }
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
  setFormState((formState) => ({
    ...formState,
    errors: {
      ...formState.errors,
      departmentName:departmentName,
      referenceTicket:referenceTicket,
      titleHead:titleHead,
      organizationName:organizationName,
      companyName:companyName,
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
    let data = {
      companyId:formState.comp.find(item=>item.companyName==formState.values.companyName)._id,
      organizationId:formState.orgs.find(item=>item.organizationName==formState.values.organizationName)._id,
      organizationName: formState.values.organizationName,
      companyName: formState.values.companyName,
      departmentName: formState.values.departmentName,
      titleHead: formState.values.titleHead,
      referenceTicket: formState.values.referenceTicket,
      otp: OTP,
      workFlows:formState.selectedWorkFlows,
      tenantId:formState.values.tenantId
    };
    let msg = "";
    axios({
      method: "put",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/department/updateDepartment`,
      headers: { "cooljwt": Token },
      data: data,
    })
      .then((response) => {
        dispatch(getDepartments());
        setOTP("");
        props.getDepartments(formState.orgs.find(item=>item.organizationName==formState.values.organizationName)._id);
        props.setFilters(formState.orgs.find(item => item.organizationName == formState.values.organizationName),formState.comp.find(item => item.companyName == formState.values.companyName));

        setFormState((formState) => ({
          ...formState,
          isRegistering: false,
        }));
        msg = "Department Updated Successfully!";
        successAlert(msg);
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setFormState((formState) => ({
          ...formState,
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
useEffect(() => {
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
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        departmentName: "",
        referenceTicket: "",
        titleHead: "",
        organizationName: "",
        companyName: "",
      },
      errors: {
        ...formState.errors,
        departmentName: "",
        referenceTicket: "",
        titleHead: "",
        organizationName: "",
        companyName: "",
      },
    }));
    props.closeModal();
  };
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
                <h4 className={classes.cardTitle}>Department Details</h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridContainer>
              <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Department Name"
                    id="departmentName"
                    name="departmentName"
                    type="text"
                    disabled={true}
                    value={formState.values.departmentName || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.titleHead === "error"}
                    helperText={
                      formState.errors.titleHead === "error"
                        ? "Valid PBR (HOD) is required"
                        : null
                    }
                    label="PBR (HOD)"
                    id="titleHead"
                    name="titleHead"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    disabled={props.Updating ? false : true}
                    value={formState.values.titleHead || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
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
                    value={formState.values.organizationName || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Company Name"
                    id="companyName"
                    name="companyName"
                    type="text"
                    disabled={true}
                    value={formState.values.companyName || ""}
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
                    value={formState.values.referenceTicket || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <MultipleSelect disabled={props.Updating ? false : true} existingWorkflows={formState.values.workflows} workFlows={formState.workFlows} onChange={setWorkFlows} />
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
                 : "" } 
                  </>
                  : "" }
                  {loading ? <CircularProgress disableShrink /> : ""}
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
