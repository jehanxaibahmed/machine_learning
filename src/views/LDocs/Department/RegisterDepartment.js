/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  TextField,
  MenuItem,
  makeStyles,
  CircularProgress,
  Tooltip,
  IconButton
} from "@material-ui/core";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
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
import MultipleSelect from './MultiSelect';
import jwt from "jsonwebtoken";


// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { setIsTokenExpired } from "actions";
import Refresh from "@material-ui/icons/Refresh";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Register(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const userDetails = jwt.decode(Token);
  // register form
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    orgs: [],
    comp: [],
    isRegistering: false,
    selectedWorkFlows:[],
    workFlows:[],
    values: {
      departmentName: "",
      referenceTicket: "",
      titleHead: "",
      organizationName: "",
      companyName: "",
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
      selectedWorkFlows.push({
        id:formState.workFlows.find((itm)=>itm.workflowName == item)._id,
        name:item
      });
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
        if (userDetails.isTenant) {
          const orgs = response.data;
          setFormState((formState) => ({
            ...formState,
            orgs: orgs,
          }));
        } else {
          const orgs = response.data.filter(org => org._id == userDetails.orgDetail.organizationId);
          setFormState((formState) => ({
            ...formState,
            orgs: orgs,
          }));
        }
       })
       .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(`Unable to get Organizations please contact at ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`)
       });
   };
    useEffect(() => {
      getOrganizations();
    }, []);
  const handleChange = (event) => {
    event.persist();
    if (event.target.name === "organizationName") {
      getCompanies(formState.orgs.find(org=>org.organizationName == event.target.value)._id);
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          companyName: "",
          selectedWorkFlows:[]
        },
      }));
    }
    if (event.target.name === "companyName") {
      getWorkFlows(formState.orgs.find(org=>org.organizationName==formState.values.organizationName)._id);
      setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            selectedWorkFlows: [],
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
 
  const handleRegister = () => {
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
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
    // if (!Check(formState.values.referenceTicket)) {
    //   referenceTicket = "success";
    // } else {
    //   referenceTicket = "error";
    //   error = true;
    // }
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
        message: "Invalid User Details!",
      }));
      return false;
    } else {
      let data = {
        tenantId:formState.orgs.find(item=>item.organizationName==formState.values.organizationName).tenantId,
        companyId:formState.comp.find(item=>item.companyName==formState.values.companyName)._id,
        organizationId:formState.orgs.find(item=>item.organizationName==formState.values.organizationName)._id,
        organizationName: formState.values.organizationName,
        companyName: formState.values.companyName,
        departmentName: formState.values.departmentName,
        titleHead: formState.values.titleHead,
        referenceTicket: formState.values.referenceTicket,
        workFlows:formState.selectedWorkFlows
      };
      let msg = "";
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/department/registerDepartment`,
        data: data,
        headers:{cooljwt:Token}
      })
        .then((response) => {
          dispatch(getDepartments());
          props.getDepartments(formState.comp.find(item=>item.companyName==formState.values.companyName)._id);
          props.setFilters(formState.orgs.find(item => item.organizationName == formState.values.organizationName),formState.comp.find(item => item.companyName == formState.values.companyName));

          setFormState((formState) => ({
            ...formState,
            message: "Department has been successfully registered!",
            isRegistering: false,
          }));
          msg = "Department Registered Successfully!";
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
      selectedWorkFlows:[],
      workFlows:[],
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
  return (
    <GridContainer>
       
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>Add Department</h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
            <form>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.departmentName === "error"}
                    helperText={
                      formState.errors.departmentName === "error"
                        ? "Valid Department Name is required"
                        : null
                    }
                    label="Department Name"
                    id="departmentName"
                    name="departmentName"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.departmentName || ""}
                  />
                </GridItem>
                
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
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
                    value={formState.values.titleHead || ""}
                  />
                </GridItem>
                <GridItem
                  xs={10}
                  sm={10}
                  md={5}
                  lg={5}
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
                  md={6}
                  lg={6}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    error={formState.errors.companyName === "error"}
                    fullWidth={true}
                    helperText={
                      formState.errors.companyName === "error"
                        ? "Location Name is required"
                        : null
                    }
                    label="Location Name"
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
                    {formState.comp.map((com, index) => {
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
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.referenceTicket === "error"}
                    helperText={
                      formState.errors.referenceTicket === "error"
                        ? "Valid Remarks Ticket is required"
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
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <MultipleSelect  workFlows={formState.workFlows} onChange={setWorkFlows} />
                </GridItem>
                
              </GridContainer>
              <Button
                color="info"
                className={classes.registerButton}
                round
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
