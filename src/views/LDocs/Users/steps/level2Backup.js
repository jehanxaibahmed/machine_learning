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
import axios from "axios";
import dateFormat from "dateformat";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import ImageUpload from "./ImageUpload.js";
import { Animated } from "react-animated-css";

const useStyles = makeStyles(styles);

export default function Step2() {
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);
  const [formState, setFormState] = useState({
    orgs: [],
    comp: [],
    depts: [],
    teams: [],
    isRegistered: false,
    isLoading: false,
    refreshing: false,
    isRegistering: false,
    message: "",
    values: {
      joiningDate: "",
      lastWorkingDate: "",
      name: "",
      email: "",
      organization: "",
      company: "",
      department: "",
      team: "",
      title: "COMPUTER PROGRAMMER",
      reportingTo: "Business Development Head",
      phone: "971-",
      extension: "1234",
      direct: "0971",
      dataUrl: "http://localstorage",
    },
    errors: {},
  });
  const getOrganizations = () => {
    axios
      .get(`${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/orglistwoi`)
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          orgs: response.data,
        }));
      })
      .catch((error) => {
        setFormState((formState) => ({
          ...formState,
          isError: true,
          message:
            "Unable to get Departments please contact at contact@avantas.io", //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };
  const getCompanies = () => {
    axios
      .get(`${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/comlistwoi`)
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          comp: response.data,
        }));
      })
      .catch((error) => {
        setFormState((formState) => ({
          ...formState,
          isError: true,
          message:
            "Unable to get Departments please contact at contact@avantas.io", //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };
  const getDepartments = () => {
    axios
      .get(`${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/deplist`)
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          depts: response.data,
        }));
      })
      .catch((error) => {
        setFormState((formState) => ({
          ...formState,
          isError: true,
          message:
            "Unable to get Departments please contact at contact@avantas.io", //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };
  const getTeams = () => {
    axios
      .get(`${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/tealist`)
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          teams: response.data,
          refreshing: false,
        }));
      })
      .catch((error) => {
        setFormState((formState) => ({
          ...formState,
          isError: true,
          refreshing: true,
          message:
            "Unable to get Departments please contact at contact@avantas.io", //typeof error.response != "undefined"  ? error.response.data : error.message
        }));
      });
  };
  useEffect(() => {
    getOrganizations();
    getCompanies();
    getDepartments();
    getTeams();
  }, []);
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
  const handleDateChange = (moment, name) => {
    let selectedDate = dateFormat(moment._d, "dd/mm/yyyy, h:MM:ss TT");
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [name]: selectedDate,
      },
    }));
  };
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
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateStep}
    >
      <GridContainer justify="center" md={12} md={12} xs={12} sm={12}>
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
                <MenuItem key={index} value={org.organizationName}>
                  {org.organizationName}
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
              return (
                <MenuItem key={index} value={com.companyName}>
                  {com.companyName}
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
              return (
                <MenuItem key={index} value={dep.departmentName}>
                  {dep.departmentName}
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
            error={formState.errors.team === "error"}
            fullWidth={true}
            helperText={
              formState.errors.team === "error" ? "Team is required" : null
            }
            label="Team"
            name="team"
            onChange={(event) => {
              handleChange(event);
            }}
            value={formState.values.team || ""}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Choose Team
            </MenuItem>
            {formState.teams.map((team, index) => {
              return (
                <MenuItem key={index} value={team.teamName}>
                  {team.teamName}
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
            error={formState.errors.titleHead === "error"}
            fullWidth={true}
            helperText={
              formState.errors.titleHead === "error"
                ? "Title is required"
                : null
            }
            label="Title"
            name="titleHead"
            onChange={(event) => {
              handleChange(event);
            }}
            value={formState.values.title || ""}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Choose Title
            </MenuItem>
            {formState.depts.map((dep, index) => {
              return (
                <MenuItem key={index} value={dep.titleHead}>
                  {dep.titleHead}
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
            fullWidth={true}
            error={formState.errors.documentOne === "error"}
            helperText={
              formState.errors.documentOne === "error"
                ? "Valid Document One is required"
                : null
            }
            label="Document One"
            id="documentOne"
            name="documentOne"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.documentOne || ""}
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
            fullWidth={true}
            error={formState.errors.documentTwo === "error"}
            helperText={
              formState.errors.documentTwo === "error"
                ? "Valid Document Two is required"
                : null
            }
            label="Document Two"
            id="documentTwo"
            name="documentTwo"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.documentTwo || ""}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={4} lg={4}>
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

        <GridItem xs={12} sm={12} md={4} lg={4}>
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
        <GridContainer justify="center" md={12} md={12} xs={12} sm={12}>
          <GridItem
            xs={12}
            sm={12}
            md={3}
            lg={3}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <legend>NID Image Front</legend>
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
              name="nidImgFront"
              handleImageChange={handleImageChange}
            />
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={3}
            lg={3}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <legend>NID Image Back</legend>
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
              name="nidImgBack"
              handleImageChange={handleImageChange}
            />
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={3}
            lg={3}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <legend>Passport Main</legend>
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
              name="passportMain"
              handleImageChange={handleImageChange}
            />
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={3}
            lg={3}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <legend>Passport Main Old</legend>
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
              name="passportMainOld"
              handleImageChange={handleImageChange}
            />
          </GridItem>
        </GridContainer>
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
              backgroundColor: "#00AFC3",
              color: "white",
            }}
            className={classes.registerButton}
            round
          >
            Save Level 2 Info
          </Button>
        </GridItem>
      </GridContainer>
    </Animated>
  );
}
