/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  MenuItem,
  makeStyles,
  CircularProgress,
  TextField,
  Typography
} from "@material-ui/core";

import WarningIcon from '@material-ui/icons/Warning';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';


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
//Redux
import { sendNotification, getNotification, sendEventLog } from "actions";
import { useSelector, useDispatch } from "react-redux";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";

//Animation
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const Check = require("is-null-empty-or-undefined").Check;

export default function Filter(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const decoded = jwt.decode(Token);
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isViewWorkFlow, setIsViewWorkflow] = React.useState(false);
  const [isInitWorkFlow, setIsInitWorkFlow] = React.useState(false);
  const [isFileSame, setIsFileSame] = React.useState(true);
  const [alert, setAlert] = React.useState(null);
  const dispatch = useDispatch();

  const warningAlert = (msg) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Warning!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={
          sweetClass.button + " " + sweetClass.warning
        }
      >
        {msg}
      </SweetAlert>
    );
  };
  const successAlert = (msg) => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => { hideAlert(); props.closeModal() }}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={
          sweetClass.button + " " + sweetClass.success
        }
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
        confirmBtnCssClass={
          sweetClass.button + " " + sweetClass.danger
        }
      >
        {msg}
        <br />
    For Details Please Contact {process.env.REACT_APP_LDOCS_FOOTER_COPYRIGHT_LEVEL_1}
      </SweetAlert>
    );
  };


  const getValues = () => {
    props.setFilters(formState);            
    }

  const [formState, setFormState] = React.useState({
    statusOptions: [{id:'unread', value:'Pending'},{id:'read', value:'Received'},{id:'rejected', value:'Rejected'}],
    reviewStatusOptions: [{id:'pending', value:'Pending'},{id:'reviewed', value:'Reviewed'},{id:'rejected', value:'Rejected'}],
    approveStatusOptions: [{id:'pending', value:'Pending'},{id:'approved', value:'Approved'},{id:'rejected', value:'Rejected'}],
    filters:props.filters,
    values:props.values
  });
  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
  };
  const handleFilterChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      filters: {
        ...formState.filters,
        [event.target.name]: event.target.checked,
      },
    }));
    if (event.target.checked == false) {
        setFormState((formState) => ({
            ...formState,
            values: {
              ...formState.values,
              [event.target.name]: "",
            },
          }));
    }
  };
  


  React.useEffect(() => {
   
  }, []);

  return (
    <Card style={{maxWidth:300, boxShadow:'none'}}>
    <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitleText}>Filters</h4>
            </CardIcon>
          </CardHeader>
      <CardBody>
        <div>
              <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={10}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    label="Status"
                    name="status"
                    disabled={!formState.filters.status}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    select
                    value={formState.values.status || ""}
                  >
                    {formState.statusOptions.map((o, index) => {
                      return (
                        <MenuItem key={index} value={o.id}>
                          {o.value}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </GridItem>
                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ marginTop: "22px", marginBottom: "10px" }}
                >
                   <Checkbox
                    checked={formState.filters.status}
                    onChange={handleFilterChange}
                    name="status"
                    color="primary"
                 />
                </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    label="Review Status"
                    name="reviewStatus"
                    disabled={!formState.filters.reviewStatus}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    select
                    value={formState.values.reviewStatus || ""}
                  >
                    {formState.reviewStatusOptions.map((o, index) => {
                      return (
                        <MenuItem  key={index} value={o.id}>
                          {o.value}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </GridItem>
                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ marginTop: "22px", marginBottom: "10px" }}
                >
                   <Checkbox
                    checked={formState.filters.reviewStatus}
                    onChange={handleFilterChange}
                    name="reviewStatus"
                    color="primary"
                 />
                </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    label="Approval Status"
                    name="approvalStatus"
                    disabled={!formState.filters.approvalStatus}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    select
                    value={formState.values.approvalStatus || ""}
                  >
                    {formState.approveStatusOptions.map((o, index) => {
                      return (
                        <MenuItem key={index} value={o.id}>
                          {o.value}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </GridItem>
                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ marginTop: "22px", marginBottom: "10px" }}
                >
                   <Checkbox
                    checked={formState.filters.approvalStatus}
                    onChange={handleFilterChange}
                    name="approvalStatus"
                    color="primary"
                 />
                </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    label="Submit From"
                    name="submitStart"
                    type="date"
                    disabled={!formState.filters.submitStart}
                    id="datetime-local"
                    defaultValue={Date.now()}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    value={formState.values.submitStart || ""}
                  />
                </GridItem>
                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ marginTop: "22px", marginBottom: "10px" }}
                >
                   <Checkbox
                    checked={formState.filters.submitStart}
                    onChange={handleFilterChange}
                    name="submitStart"
                    color="primary"
                 />
                </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    type="date"
                    id="datetime-local"
                    defaultValue={Date.now()}
                    label="Submit End"
                    name="submitEnd"
                    disabled={!formState.filters.submitEnd}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    value={formState.values.submitEnd || ""}
                   />
                </GridItem>
                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ marginTop: "22px", marginBottom: "10px" }}
                >
                   <Checkbox
                    checked={formState.filters.submitEnd}
                    onChange={handleFilterChange}
                    name="submitEnd"
                    color="primary"
                 />
                </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    label="Amount From"
                    name="amountfrom"
                    type="number"
                    disabled={!formState.filters.amountfrom}
                    defaultValue={0}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    value={formState.values.amountfrom || ""}
                  />
                </GridItem>
                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ marginTop: "22px", marginBottom: "10px" }}
                >
                   <Checkbox
                    checked={formState.filters.amountfrom}
                    onChange={handleFilterChange}
                    name="amountfrom"
                    color="primary"
                 />
                </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    type="number"
                    label="Amount To"
                    name="amountTo"
                    disabled={!formState.filters.amountTo}
                    defaultValue={0}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    value={formState.values.amountTo || ""}
                   />
                </GridItem>
                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ marginTop: "22px", marginBottom: "10px" }}
                >
                   <Checkbox
                    checked={formState.filters.amountTo}
                    onChange={handleFilterChange}
                    name="amountTo"
                    color="primary"
                 />
                </GridItem>
              </GridContainer>
              <span style={{ float: "right", marginTop:100 }}>
                <React.Fragment>
                  <Button
                    color="info"
                    className={classes.registerButton}
                    round
                    type="button"
                    onClick={()=>getValues()}
                  >
                    {'Apply Filters'}
                  </Button>
                </React.Fragment>
                <Button
                  color="danger"
                  className={classes.registerButton}
                  onClick={()=>props.closeModal()}
                  round
                >
                  Close
                </Button>
              </span>
        </div>
        </CardBody>
        </Card>
  );
}
