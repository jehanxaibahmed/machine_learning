import React, { useState, useEffect } from "react";
import Datetime from "react-datetime";
// @material-ui/icons
import {
  Button,
  MenuItem,
  makeStyles,
  CircularProgress,
  TextField,
} from "@material-ui/core";
// @material-ui/core components
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import dateFormat from "dateformat";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { Animated } from "react-animated-css";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";


const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Step2(props) {
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);
  var row = props.userData.level2;
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');

  const [formState, setFormState] = useState({
    orgs: [],
    comp: [],
    depts: [],
    titles: [],
    isLoading: false,
    values: {
      employeeId: typeof row.employeeId != "undefined" ? row.employeeId : "",
      organization:
        typeof row.organization != "undefined"
          ? row.organization.toUpperCase()
          : "",
      companyName:
        typeof row.companyName != "undefined"
          ? row.companyName.toUpperCase()
          : "",
      department:
        typeof row.department != "undefined"
          ? row.department.toUpperCase()
          : "",
      title: typeof row.title != "undefined" ? row.title.toUpperCase() : "",
      reportingTo:
        typeof row.reportingTo != "undefined"
          ? row.reportingTo.toUpperCase()
          : "",
      joiningDate: typeof row.joiningDate != "undefined" ? row.joiningDate : "",
      lastWorkingDate:
        typeof row.lastWorkingDate != "undefined" ? row.lastWorkingDate : "",
    },
    errors: {},
  });
  const getOrganizations = (user) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/getAllOrgBytenant`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        if (response.data.length > 0) {
          if (user.isTenant) {
            const orgs = response.data;
            setFormState((formState) => ({
              ...formState,
              orgs: orgs
            }));       
          } else {
            const orgs = response.data.filter(org => org._id == user.orgDetail.organizationId);
            setFormState((formState) => ({
              ...formState,
              orgs: orgs
            }));
          }
        } 
        else {
          setFormState((formState) => ({
            ...formState,
            orgs: []
          }));  
        }
      }, 500)
      
      .catch(error=>{
        console.log(typeof error.response != "undefined"  ? error.response.data : error.message,
        "Unable to get Orgs please contact at contact@MateSol.io"
      );
      });
}
 
const getCompanies = (org) => {
  axios({
    method: "get",
    url: `${process.env.REACT_APP_LDOCS_API_URL}/company/getCompaniesUnderOrg/${org}`,
    headers: { cooljwt: Token },
  })
    .then((response) => {
      setFormState((formState) => ({
        ...formState,
        comp: response.data,
      }));
    })
    .catch((error) => {
      console.log(`Unable to get Companies please contact at ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`)
    });
};
  
const getDepartments = (compId) => {
  let url = `${process.env.REACT_APP_LDOCS_API_URL}/department/depList/${compId}`;
  axios({
    method: "get",
    url: url,
    headers: { cooljwt: Token },
  })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          depts: response.data,
        }));
      })
      .catch((error) => {
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message,
          "Unable to get Departments please contact at contact@avantas.io"
        );
      });
  };
  
   const getTitles = (compId) => {
      let url = `${process.env.REACT_APP_LDOCS_API_URL}/title/getTitleUnderCompany/${compId}`
      axios({
        method: "get",
        url: url,
        headers: { cooljwt: Token },
      })
       .then((response) => {
         setFormState((formState) => ({
           ...formState,
           titles: response.data,
           refreshing: false,
         }));
       })
       .catch((error) => {
         console.log(
           typeof error.response != "undefined"
             ? error.response.data
             : error.message
         );
         setFormState((formState) => ({
           ...formState,
           isError: true,
           refreshing: true,
           message: "Unable to get Titles please contact at contact@avantas.io", //typeof error.response != "undefined"  ? error.response.data : error.message
         }));
       });
   };
  useEffect(() => {
      const user = jwt.decode(Token); 
      getOrganizations(user);
      if(props.userData.level2 !== undefined){
        getCompanies(props.userData.level2.organizationId);
        getDepartments(props.userData.level2.companyId);
        getTitles(props.userData.level2.companyId);
      }
  }, []);
const handleChange = (event) => {
  event.persist();
  if (event.target.name == "organization") {
    var orgDetails = formState.orgs.find(item => item.organizationName == event.target.value);
    getCompanies(orgDetails._id)
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        companyName: "",
        department: "",
        title: "",
        reportingTo: ""
      },
    }));
  } else if (event.target.name == "companyName") {
    var compDetails = formState.comp.find(item => item.companyName == event.target.value);
    getDepartments(compDetails._id);
    getTitles(compDetails._id);
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        department: "",
        title: "",
        reportingTo: ""
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
  const handleDateChange = (moment, name) => {
    let selectedDate = "";
    if(typeof moment._d != "undefined"){
      selectedDate = dateFormat(moment._d, "dd/mm/yyyy, h:MM:ss TT");
    }
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [name]: selectedDate,
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
         onConfirm={() => hideAlert()}
         onCancel={() => hideAlert()}
         confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
       >
         {msg}
         <br />
         Unable To Update Level 2 Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
       </SweetAlert>
     );
   };
   const hideAlert = () => {
     setAlert(null);
  };
  const saveUserLevelTwo = () => {
    
    setFormState((formState) => ({
      ...formState,
      isLoading: true,
    }));
    let employeeId;
    let organization;
    let companyName;
    let department;
    let title;
    let reportingTo;
    let joiningDate;

    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.employeeId)) {
      employeeId = "success";
    } else {
      employeeId = "error";
      error = true;
    }
    if (!Check(formState.values.organization)) {
      organization = "success";
    } else {
      organization = "error";
      error = true;
    }
    if (!Check(formState.values.companyName)) {
      companyName = "success";
    } else {
      companyName = "error";
      error = true;
    }
    if (!Check(formState.values.department)) {
      department = "success";
    } else {
      department = "error";
      error = true;
    }
    if (!Check(formState.values.title)) {
      title = "success";
    } else {
      title = "error";
      error = true;
    }
    if (!Check(formState.values.reportingTo)) {
      reportingTo = "success";
    } else {
      reportingTo = "error";
      error = true;
    }
    if (!Check(formState.values.joiningDate)) {
      joiningDate = "success";
    } else {
      errorAlert("Please Select Joining Date");
      error = true;
    }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        employeeId: employeeId,
        organization: organization,
        companyName: companyName,
        department: department,
        title: title,
        reportingTo: reportingTo,
        joiningDate: joiningDate,
      },
    }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isLoading: false,
      }));
      return false;
    } else {
      var data = {
        employeeId: formState.values.employeeId,
        organizationName: formState.values.organization,
        organizationId: formState.orgs.find(org=>org.organizationName == formState.values.organization)._id,
        companyName: formState.values.companyName,
        companyId: formState.comp.find(com=>com.companyName == formState.values.companyName)._id,
        departmentName: formState.values.department,
        departmentId: formState.depts.find(dep=>dep.departmentName == formState.values.department).id,
        titleName: formState.values.title,
        titleId: formState.titles.find(tit=>tit.titleName == formState.values.title)._id,
        reportingTo: formState.values.reportingTo,
        joiningDate: formState.values.joiningDate,
        lastWorkingDate: formState.values.lastWorkingDate,
        email:props.userData.level3.email
      };
      let msg = "";
      
      axios({
        method: "put",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/user/level2Update`,
        data: data,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          props.userData.level2.employeeId = data.employeeId;
          props.userData.level2.organization = data.organization;
          props.userData.level2.companyName = data.company;
          props.userData.level2.department = data.department;
          props.userData.level2.title = data.title;
          props.userData.level2.reportingTo = data.reportingTo;
          props.userData.level2.joiningDate = data.joiningDate;
          props.userData.level2.lastWorkingDate = data.lastWorkingDate;
          props.updateUserData(props.userData);
          setFormState((formState) => ({
            ...formState,
            isLoading: false,
          }));
          msg = "Level 2 Info Updated Successfully!";
          successAlert(msg);
        })
        .catch((error) => {
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
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.employeeId === "error"}
            helperText={
              formState.errors.employeeId === "error"
                ? "Valid Employee ID is required"
                : null
            }
            label="Employee ID"
            id="employeeId"
            name="employeeId"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            disabled={props.disabledCheck}
            value={formState.values.employeeId || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            className={classes.textField}
            error={formState.errors.organization === "error"}
            fullWidth={true}
            helperText={
              formState.errors.organization === "error"
                ? "Organization is required"
                : null
            }
            label="Organization"
            name="organization"
            onChange={(event) => {
              handleChange(event);
            }}
            select
            disabled={props.disabledCheck}
            value={formState.values.organization}
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
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            className={classes.textField}
            error={formState.errors.companyName === "error"}
            fullWidth={true}
            helperText={
              formState.errors.companyName === "error"
                ? "Company Name is required"
                : null
            }
            label="Company Name"
            name="companyName"
            onChange={(event) => {
              handleChange(event);
            }}
            select
            disabled={props.disabledCheck}
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
              return formState.values.organization == com.organizationName ? (
                <MenuItem key={index} value={com.companyName.toUpperCase()}>
                  {com.companyName.toUpperCase()}
                </MenuItem>
              ) : (
                ""
              );
            })}
          </TextField>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            className={classes.textField}
            error={formState.errors.department === "error"}
            fullWidth={true}
            helperText={
              formState.errors.department === "error"
                ? "Department is required"
                : null
            }
            label="Department"
            name="department"
            onChange={(event) => {
              handleChange(event);
            }}
            select
            disabled={props.disabledCheck}
            value={formState.values.department || ""}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Choose Department
            </MenuItem>
            {formState.depts.map((dep, index) => {
              return formState.values.organization == dep.organizationName &&
                formState.values.companyName == dep.companyName ? (
                <MenuItem key={index} value={dep.departmentName.toUpperCase()}>
                  {dep.departmentName.toUpperCase()}
                </MenuItem>
              ) : (
                ""
              );
            })}
          </TextField>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            className={classes.textField}
            error={formState.errors.title === "error"}
            fullWidth={true}
            helperText={
              formState.errors.title === "error" ? "Designation is required" : null
            }
            label="Designation"
            name="title"
            onChange={(event) => {
              handleChange(event);
            }}
            select
            disabled={props.disabledCheck}
            value={formState.values.title || ""}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Choose Designation
            </MenuItem>
            {formState.titles.map((tit, index) => {
              return formState.values.companyName == tit.companyName ? (
                <MenuItem key={index} value={tit.titleName.toUpperCase()}>
                  {tit.titleName.toUpperCase()}
                </MenuItem>
              ) : (
                ""
              );
            })}
          </TextField>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <TextField
            className={classes.textField}
            error={formState.errors.reportingTo === "error"}
            fullWidth={true}
            helperText={
              formState.errors.reportingTo === "error"
                ? "Task Deligation is required"
                : null
            }
            label="Task Deligation"
            name="reportingTo"
            onChange={(event) => {
              handleChange(event);
            }}
            select
            disabled={props.disabledCheck}
            value={formState.values.reportingTo || ""}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Choose Task Deligation To
            </MenuItem>
            {formState.titles.map((tit, index) => {
              return formState.values.companyName == tit.companyName ? (
                <MenuItem key={index} value={tit.titleName.toUpperCase()}>
                  {tit.titleName.toUpperCase()}
                </MenuItem>
              ) : (
                ""
              );
            })}
          </TextField>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <InputLabel className={classes.label}>Joining Date</InputLabel>
          <br />
          <FormControl fullWidth={true}>
            <Datetime
              onChange={(event) => {
                handleDateChange(event, "joiningDate");
              }}
              value={formState.values.joiningDate}
            />
          </FormControl>
        </GridItem>

        <GridItem
          xs={12}
          sm={12}
          md={4}
          lg={4}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <InputLabel className={classes.label}>Last Working Date</InputLabel>
          <br />
          <FormControl fullWidth={true}>
            <Datetime
              onChange={(event) => {
                handleDateChange(event, "lastWorkingDate");
              }}
              value={formState.values.lastWorkingDate}
            />
          </FormControl>
        </GridItem>
        {props.disabledCheck ? (
          ""
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
              backgroundColor: "#007f5e",
              color: "white",
            }}
              className={classes.registerButton}
              round
              onClick={saveUserLevelTwo}
            >
              Save Level 2 Info
            </Button>
            {formState.isLoading ? <CircularProgress disableShrink /> : ""}
          </GridItem>
        )}
      </GridContainer>
    </Animated>
  );
}
