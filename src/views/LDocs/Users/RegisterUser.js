/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  MenuItem,
  makeStyles,
  CircularProgress,
  TextField,
} from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";

// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { setIsTokenExpired } from "actions";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Register(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const userDetails = jwt.decode(Token);
  const dispatch = useDispatch();
    const [formState, setFormState] = useState({
      orgs: [],
      comp: [],
      roles:[],
      depts: [],
      titles: [],
      isRegistered: false,
      isLoading: false,
      refreshing: false,
      isRegistering: false,
      message: "",
      values: {
        email: "",
        organization: "",
        company: "",
        department: "",
        titleNew: "",
        reportingToNew: "",
        phone: "971-",
        extension: "1234",
        direct: "0971",
        dataUrl: `${process.env.REACT_APP_LDOCS_API_URL}`,
        displayName: "",
        role:""
      },
      errors: {},
    });


    const getRoles = async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/user/getRoles`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          setFormState((state) => ({
            ...state,
            roles: response?.data
          }));
        }).catch((error) => {
          if (error.response) { error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
          errorAlert('Error in Fetching Roles');
        })
    }

  const getOrganizations = () => {
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
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setFormState((formState) => ({
          ...formState,
          isError: true,
          message:
            "Unable to get Organizations please contact at contact@avantas.io", //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };

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
  const getDepartments = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/department/getAlldeparmentUnderTenant`,
      // ${process.env.REACT_APP_LDOCS_API_URL}/department/depList/${compId}
      headers: { cooljwt:Token},
      })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          depts: response.data,
        }));
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setFormState((formState) => ({
          ...formState,
          isError: true,
          message:
            "Unable to get Departments please contact at contact@avantas.io", //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };

  const getTitles = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/title/getTitleUnderTenant`,
      headers: { cooljwt:Token},
      })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          titles: response.data,
          refreshing: false,
        }));
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setFormState((formState) => ({
          ...formState,
          isError: true,
          refreshing: true,
          message:
            "Unable to get Titles please contact at contact@takhlqe.io", //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };
  useEffect(() => {
    refresh(1);
  }, []);
     const handleChange = (event) => {
      event.persist();
  if (event.target.name == "organization") {
    getCompanies(formState.orgs.find(org=>org.organizationName == event.target.value)._id);
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
        company: "",
        department: "",
        titleNew: "",
        reportingToNew: ""
      },
    }));
  } else if (event.target.name == "company") {
    getDepartments(formState.comp.find(com=>com.companyName == event.target.value)._id);
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
        department: "",
        titleNew: "",
        reportingToNew: ""
      },
    }));
  } else if (event.target.name == "department") {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    }));
  } else if (event.target.name == "name") {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
  }
  else if (event.target.name == "role") {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
  }
  else {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          [event.target.name]: event.target.value.toUpperCase(),
        },
      }));
    }
  };
  // function that returns true if value is email, false otherwise
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
   
  function closeModal() {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        email: "",
        organization: "",
        company: "",
        department: "",
        titleNew: "",
        reportingToNew: "",
        phone: "971-",
        extension: "1234",
        direct: "0971",
        dataUrl: `${process.env.REACT_APP_LDOCS_API_URL}`,
        displayName: "",
      },
      errors: {
        ...formState.errors,
        email: "",
        phone: "",
        extension: "",
        direct: "",
        dataUrl: "",
        titleNew: "",
        reportingToNew: "",
        organization: "",
        company: "",
        department: "",
        reportingToNew: "",
        displayName: "",
      },
    }));
    props.closeModal();
  }
  function refresh(status) {
    setFormState((formState) => ({
      ...formState,
      refreshing: true
    }));
    if (status == 1) {
      getOrganizations();
      getDepartments();
      getCompanies();
      getTitles();
      getRoles();
    }
    
    setFormState((formState) => ({
      ...formState,
      refreshing: false,
      values: {
        ...formState.values,
        email: "",
        organization: "",
        company: "",
        department: "",
        titleNew: "",
        reportingToNew: "",
        phone: "971-",
        extension: "1234",
        direct: "0971",
        dataUrl: "http://localstorage",
        displayName: "",
      },
      errors: {
        ...formState.errors,
        email: "",
        phone: "",
        extension: "",
        direct: "",
        dataUrl: "",
        organization: "",
        company: "",
        department: "",
        displayName: "",
        titleNew: "",
        reportingToNew: "",
      },
    }));
    
  }
  const registerUser = () => {
    setFormState((formState) => ({
        ...formState,
        isRegistering: true
      }));
    let email;
    let phone;
    let extension;
    let direct;
    let dataUrl;
    let titleNew;
    let organization;
    let company;
    let department;
    let reportingToNew;
    let displayName;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

  
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
    if (!Check(formState.values.phone)) {
      phone = "success";
    } else {
      phone = "error";
      error = true;
    }
    if (!Check(formState.values.direct)) {
      direct = "success";
    } else {
      direct = "error";
      error = true;
    }
    // if (!Check(formState.values.reportingToNew)) {
    //   reportingToNew = "success";
    // } else {
    //   reportingToNew = "error";
    //   error = true;
    // }
    if (!Check(formState.values.organization)) {
      organization = "success";
    } else {
      organization = "error";
      error = true;
    }
    if (!Check(formState.values.company)) {
      company = "success";
    } else {
      company = "error";
      error = true;
    }
    if (!Check(formState.values.department)) {
      department = "success";
    } else {
      department = "error";
      error = true;
    }
    if (!Check(formState.values.titleNew)) {
      titleNew = "success";
    } else {
      titleNew = "error";
      error = true;
    }
    if (!Check(formState.values.displayName)) {
      displayName = "success";
    } else {
      displayName = "error";
      error = true;
    }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        name: name,
        email: email,
        phone: phone,
        extension: extension,
        direct: direct,
        dataUrl: dataUrl,
        displayName: displayName,
        reportingTo: reportingToNew,
        organization: organization,
        company: company,
        department: department,
        title: titleNew,
      },
      isLoading: true,
    }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isRegistered: true,
        isLoading: false,
        isRegistering: false,
        message: "Invalid User Details!",
      }));
      return false;
    } else {
       let decoded = jwt.decode(Token);
      var data = {
        tenantId:formState.orgs.find(item=>item.organizationName==formState.values.organization).tenantId,
        email: formState.values.email,
        organization: formState.values.organization,
        organizationId:formState.orgs.find(item=>item.organizationName==formState.values.organization)._id,
        companyName: formState.values.company,
        companyId:formState.comp.find(item=>item.companyName==formState.values.company)._id,
        department: formState.values.department,
        departmentId:formState.depts.find(item=>item.departmentName==formState.values.department)._id,
        displayName: formState.values.displayName,
        title: formState.values.titleNew,
        titleId: formState.titles.find(item=>item.titleName==formState.values.titleNew)._id,
        activation : "yes",
        createdBy: decoded.email,
        role: formState.values.role,
      };
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/user/registerUser`,
        data: data,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          refresh(0);
          props.setFilters(formState.orgs.find(item=>item.organizationName==formState.values.organization),formState.comp.find(item=>item.companyName==formState.values.company));
          setFormState((formState) => ({
            ...formState,
            isRegistered: true,
            message: "User has been successfully registered!",
            QRCode: response.data,
            isLoading: false,
            isRegistering: false,
          }));
          props.getUser(formState.comp.find(item=>item.companyName==formState.values.company)._id);
          successAlert();
        })
        .catch((error) => {
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
          setFormState((formState) => ({
            ...formState,
            isError: true,
            message:
              typeof error.response != "undefined"
                ? error.response.data
                : error.message,
            isLoading: false,
            isRegistering: false,
          }));
          errorAlert();
        });
    }
  };
  const classes = useStyles();

  return (
    <GridContainer>
       
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>Register User</h4>
            </CardIcon>
            <span style={{ float: "right" }}>
              <Button
                color="danger"
                round
                className={classes.marginRight}
                onClick={refresh}
              >
                Refresh
              </Button>
              {formState.refreshing ? <CircularProgress disableShrink /> : ""}
            </span>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={4}
                lg={4}
                style={{ marginBottom: "10px" }}
              >
                <TextField
                  fullWidth={true}
                  error={formState.errors.email === "error"}
                  helperText={
                    formState.errors.email === "error"
                      ? "Valid email is required"
                      : null
                  }
                  label="Email Address"
                  id="email"
                  name="email"
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  type="text"
                  value={formState.values.email || ""}
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
                  error={formState.errors.direct === "error"}
                  helperText={
                    formState.errors.direct === "error"
                      ? "Valid Contact Number is required"
                      : null
                  }
                  label="Contact Number"
                  id="direct"
                  name="direct"
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  type="text"
                  value={formState.values.direct || ""}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4} lg={4}>
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
                  value={formState.values.organization || ""}
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
              <GridItem xs={12} sm={12} md={4} lg={4}>
                <TextField
                  className={classes.textField}
                  error={formState.errors.company === "error"}
                  fullWidth={true}
                  helperText={
                    formState.errors.company === "error"
                      ? "Company is required"
                      : null
                  }
                  label="Company"
                  name="company"
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  select
                  value={formState.values.company || ""}
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
                    return formState.values.organization ==
                      com.organizationName ? (
                      <MenuItem
                        key={index}
                        value={com.companyName.toUpperCase()}
                      >
                        {com.companyName.toUpperCase()}
                      </MenuItem>
                    ) : (
                      ""
                    );
                  })}
                </TextField>
              </GridItem>
              <GridItem xs={12} sm={12} md={4} lg={4}>
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
                    return formState.values.organization ==
                      dep.organizationName &&
                      formState.values.company == dep.companyName ? (
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
              <GridItem
                xs={12}
                sm={12}
                md={4}
                lg={4}
                style={{ marginBottom: "10px" }}
              >
                <TextField
                  className={classes.textField}
                  error={formState.errors.titleNew === "error"}
                  fullWidth={true}
                  helperText={
                    formState.errors.titleNew === "error"
                      ? "Designation is required"
                      : null
                  }
                  label="Designation"
                  name="titleNew"
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  select
                  value={formState.values.titleNew || ""}
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
                    return formState.values.company == tit.companyName ? (
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
          style={{ marginBottom: "10px"}}
        >
          <TextField
            className={classes.textField}
            error={formState.errors.role === "error"}
            fullWidth={true}
            // helperText={
            //   formState.errors.workflow === "error"
            //     ? "Workflow is required"
            //     : null
            // }
            label="Role"
            name="role"
            onChange={(event) => {
              handleChange(event);
            }}
            select
            value={formState.values.role || ""}
            disabled={props.disabledCheck}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Choose User Role
            </MenuItem>
            {formState.roles.map((role, index) => {
              return (
                <MenuItem key={index} value={role._id}>
                  {role.roleName}
                </MenuItem>
              );
            })}
          </TextField>
        </GridItem>
              {/* <GridItem
                xs={12}
                sm={12}
                md={4}
                lg={4}
                style={{ marginBottom: "10px" }}
              >
                <TextField
                  className={classes.textField}
                  error={formState.errors.reportingToNew === "error"}
                  fullWidth={true}
                  helperText={
                    formState.errors.reportingToNew === "error"
                      ? "Reporting To is required"
                      : null
                  }
                  label="Reporting To"
                  name="reportingToNew"
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  select
                  value={formState.values.reportingToNew || ""}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    Choose Reporting To
                  </MenuItem>
                  {formState.titles.map((tit, index) => {
                    return formState.values.company == tit.companyName ? (
                      <MenuItem key={index} value={tit.titleName.toUpperCase()}>
                        {tit.titleName.toUpperCase()}
                      </MenuItem>
                    ) : (
                      ""
                    );
                  })}
                </TextField>
              </GridItem> */}
            </GridContainer>

            <Button
              color="info"
              className={classes.registerButton}
              round
              type="button"
              onClick={registerUser}
            >
              Register
            </Button>
            {formState.isRegistering ? <CircularProgress disableShrink /> : ""}
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
  );
}
