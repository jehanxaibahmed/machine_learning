/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  MenuItem,
  makeStyles,
  CircularProgress,
  TextField,
  Typography,
  Select,
  Input,
  FormControlLabel
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
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import jwt from "jsonwebtoken";
//Redux
import { sendNotification, getNotification, sendEventLog } from "actions";
import { useSelector, useDispatch } from "react-redux";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
import {filters} from "./FiltersJson";

//Animation
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const Check = require("is-null-empty-or-undefined").Check;

export default function Filter(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const [customers, setCustomers] = useState([]);
  const decoded = jwt.decode(Token);
  const isVendor = props.isVendor;
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
  const hideAlert = () => {
    setAlert(null);
  };

  const getValues = () => {
    props.setFilters(formState);            
  }

  const clearFilters = () => {
    props.setFilters(
    {
      filters:{
      status:true,
      date:true,
      amount:true,
      partialPaid:true,
      fullPaid:true,
      notPaid:true
    },
    values: {  
    status:[],
    submitStart:null,
    submitEnd:null,
    amountTo:null,
    amountfrom:null,
    partialPaid:false,
    fullPaid:false,
    notPaid:false
    }
    });
  }

  const [formState, setFormState] = React.useState({
    statusOptions: filters,
    filters:props.filters,
    values:props.values
  });

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value || event.target.checked ,
      },
    }));
  }


  React.useEffect(() => {
    if(isVendor){
      axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/organizationByVender`,
        headers: {
          cooljwt: Token,
        },
      })
        .then((response) => {
          setCustomers(response.data.organizations);
          console.log(response.data.organizations);
        }).catch((err)=>{
          console.log(err);
        })
    }
  }, []);

  return (
    <Card style={{maxWidth:400,boxShadow:'none'}}>
    <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitleText}>Filters</h4>
            </CardIcon>
            <span style={{ float: "right"}}>
                <Button
                  color="danger"
                  onClick={()=>clearFilters()}
                  round
                >
                  Clear All
                </Button>
              </span>
          </CardHeader>
      <CardBody>
        <div>
              <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Typography varient="h6" component="h2" >
                  {isVendor ? 'Customers' : 'Invoice Status'}
                  </Typography>
                  <Select
                    className={classes.textField}
                    fullWidth={true}
                    label={isVendor ? 'Customers' : 'Invoice Status'}
                    multiple
                    name="status"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    input={<Input />}
                    // MenuProps={MenuProps}          
                    select
                    value={formState.values.status || []}
                  >
                    
                    {isVendor ? 
                    customers.map((o, index)=>{
                      return (
                        <MenuItem key={index} value={o.organizationId}>
                          {o.organizationName}
                        </MenuItem>
                      )
                    }):
                    formState.statusOptions.map((o, index) => {
                      return (
                        <MenuItem key={index} value={o.id}>
                          {o.value}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Typography varient="h6" component="h2" >
                      Invoice Submission Time
                  </Typography>
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
                    fullWidth={true}
                    label="Submit From"
                    name="submitStart"
                    type="date"
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
                  xs={6}
                  sm={6}
                  md={6}
                  lg={6}
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
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px" }}
                >
                  <Typography varient="h6" component="h2" >
                      Invoice Amount 
                  </Typography>
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
                    fullWidth={true}
                    label="Amount From"
                    name="amountfrom"
                    type="number"
                    defaultValue={0}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    value={formState.values.amountfrom || ""}
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
                    fullWidth={true}
                    type="number"
                    label="Amount To"
                    name="amountTo"
                    defaultValue={0}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    value={formState.values.amountTo || ""}
                   />
                </GridItem>

              </GridContainer>
              <span style={{ float: "right", marginTop:30 }}>
                <React.Fragment>
                  <Button
                    color="info"
                    className={classes.registerButton}
                    round
                    size="small"
                    type="button"
                    onClick={()=>getValues()}
                  >
                    {'Apply Filters'}
                  </Button>
                </React.Fragment>
                <Button
                  color="danger"
                  size="small"
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
