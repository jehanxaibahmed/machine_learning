import React, { useState, useEffect } from "react";
// @material-ui/icons
import {
  Button,
  MenuItem,
  makeStyles,
  CircularProgress,
  TextField,
} from "@material-ui/core";
// @material-ui/core components

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import axios from "axios";
import { Animated } from "react-animated-css";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
const useStyles = makeStyles(styles);

export default function Step1(props) {
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);
  const [formState, setFormState] = useState({
    isRegistered: false,
    isLoading: false,
    refreshing: false,
    isRegistering: false,
    message: "",
    teams: [],
    values: {
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
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.name === "error"}
            helperText={
              formState.errors.name === "error"
                ? "Valid name is required"
                : null
            }
            label="User ID"
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
            error={formState.errors.phone === "error"}
            helperText={
              formState.errors.phone === "error"
                ? "Valid phone is required"
                : null
            }
            label="Phone"
            id="phone"
            name="phone"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.phone || ""}
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
            error={formState.errors.extension === "error"}
            helperText={
              formState.errors.extension === "error"
                ? "Valid extension is required"
                : null
            }
            label="Extension"
            id="extension"
            name="extension"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.extension || ""}
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
                ? "Valid direct is required"
                : null
            }
            label="Direct"
            id="direct"
            name="direct"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.direct || ""}
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
            error={formState.errors.dataUrl === "error"}
            helperText={
              formState.errors.dataUrl === "error"
                ? "Valid dataUrl is required"
                : null
            }
            label="Data Url"
            id="dataUrl"
            name="dataUrl"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.dataUrl || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.reportingTo === "error"}
            helperText={
              formState.errors.reportingTo === "error"
                ? "Valid reportingTo is required"
                : null
            }
            label="Reporting To"
            id="reportingTo"
            name="reportingTo"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.reportingTo || ""}
          />
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            fullWidth={true}
            error={formState.errors.title === "error"}
            helperText={
              formState.errors.title === "error"
                ? "Valid title is required"
                : null
            }
            label="Title"
            id="title"
            name="title"
            onChange={(event) => {
              handleChange(event);
            }}
            type="text"
            value={formState.values.title || ""}
          />
        </GridItem>
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
            Save Level 1 Info
          </Button>
        </GridItem>
      </GridContainer>
    </Animated>
  );
}
