/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  TextField,
  MenuItem,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { getTitles } from "actions";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import jwt from "jsonwebtoken";



const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Register(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const userDetails = jwt.decode(Token);
   const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    orgs: [],
    comp: [],
    depts: [],
    isRegistering: false,
    values: {
      titleName: "",
      referenceTicket: "",
      organizationName: "",
      companyName: "",
    },
    errors: {
      titleName: "",
      referenceTicket: "",
      organizationName: "",
      companyName: "",
    },
  });
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
        console.log(`Unable to get Companies please contact at ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`)
      });
  };
  const getOrganizations = () => {
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
        console.log(`Unable to get Organizations please contact at ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`)
       });
  };
  useEffect(() => {
    getOrganizations();
  }, []);
  const handleChange = (event) => {
    event.persist();
    if (event.target.name == "organizationName") {
      getCompanies(formState.orgs.find(org => org.organizationName == event.target.value)._id);
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          companyName: "",
          departmentName: "",
        },
      }));
    } else if (event.target.name == "companyName") {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          departmentName: "",
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
        Unable To Register Title Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
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
    let titleName;
    let referenceTicket;
    let organizationName;
    let companyName;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.titleName)) {
      titleName = "success";
    } else {
      titleName = "error";
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
        titleName: titleName,
        referenceTicket: referenceTicket,
        organizationName: organizationName,
        companyName: companyName,
      },
    }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isRegistering: false,
        message: "Invalid Title Details!",
      }));
      return false;
    } else {
      let data = {
        tenantId: formState.orgs.find(item => item.organizationName == formState.values.organizationName).tenantId,
        companyId: formState.comp.find(item => item.companyName == formState.values.companyName)._id,
        organizationId: formState.orgs.find(item => item.organizationName == formState.values.organizationName)._id,
        titleName: formState.values.titleName,
        organizationName: formState.values.organizationName,
        companyName: formState.values.companyName,
        referenceTicket: formState.values.referenceTicket,
      };
      let msg = "";
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/title/Addtitle`,
        data: data,
        headers: { cooljwt: Token }
      })
        .then((response) => {
          dispatch(getTitles());
          props.getTitle(formState.comp.find(item => item.companyName == formState.values.companyName)._id);
          props.setFilters(formState.orgs.find(item => item.organizationName == formState.values.organizationName),formState.comp.find(item => item.companyName == formState.values.companyName));
          setFormState((formState) => ({
            ...formState,
            message: "Team has been successfully registered!",
            isRegistering: false,
          }));
          msg = "Title Registered Successfully!";
          successAlert(msg);
        })
        .catch((error) => {
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
        titleName: "",
        referenceTicket: "",
        organizationName: "",
        companyName: "",
      },
      errors: {
        ...formState.errors,
        titleName: "",
        referenceTicket: "",
        organizationName: "",
        companyName: "",
      },
    }));
    props.closeModal();
  };
  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>Add Designation</h4>
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
                    error={formState.errors.titleName === "error"}
                    helperText={
                      formState.errors.titleName === "error"
                        ? "Valid Designation Name is required"
                        : null
                    }
                    label="Designation Name"
                    id="titleName"
                    name="titleName"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.titleName || ""}
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
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
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
                        ? "Company name is required"
                        : null
                    }
                    label="Company Name"
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
                      return formState.values.organizationName ==
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
