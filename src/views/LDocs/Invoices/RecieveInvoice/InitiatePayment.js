/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, MenuItem, TextField,CircularProgress,
    Slide,
    Dialog,
    LinearProgress,
    DialogContent,
    IconButton,
    Tooltip } from "@material-ui/core";
// core components
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
import ChipInput from "material-ui-chip-input";
import Pending from "assets/img/statuses/Pending.png";
import Success from "assets/img/statuses/Success.png";
import Rejected from "assets/img/statuses/Rejected.png";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useDispatch, useSelector } from "react-redux";
import BuildNetwork from "views/LDocs/Vendor/BuildNetwork";
import Step3 from "views/LDocs/Vendor/steps/level3";
import { formatDateTime } from "views/LDocs/Functions/Functions";


const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function InitiatePayment(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const decoded = jwt.decode(Token);
  const [vendorData, setVendorData] = React.useState();
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [showVendorDetails, setShowVendorDetails] = React.useState(false);
  const [formState, setFormState] = React.useState({
    values: {
        paidAmount:"",
        paymentBy:"",
        paymentType:""
    },
    errors: {
        paidAmount:"",
        paymentBy:"",
        paymentType:""
    },
  });
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
        onConfirm={() => {hideAlert() }}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg}
        <br />
        For Details Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    props.closeModal();
    setAlert(null);
  };

  React.useEffect(() => {
    getVendorData();
  }, []);

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

  const getVendorData = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorsByOrganization/${props.fileData.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        const vendor = response.data.find(v=> v._id == props.fileData.vendorId);
        if(vendor){
          setVendorData(vendor)
        }else{
          setVendorData({});
        }
      }).catch((err)=>{
        console.log(err);
      })
  }
  const initPayment = () => {
    setIsLoading(true);
    let paidAmount;
    let paymentBy;
    let paymentType;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;
    if (!Check(formState.values.paidAmount) && formState.values.paidAmount <= props.fileData.balanceDue ) {
        paidAmount = "success";
    } else {
        paidAmount = "error";
        error = true;
    }
    if (!Check(formState.values.paymentBy)) {
        paymentBy = "success";
    } else {
        paymentBy = "error";
        error = true;
    }
    if (!Check(formState.values.paymentType)) {
        paymentType = "success";
    } else {
        paymentType = "error";
        error = true;
    }
    setFormState((formState) => ({
        ...formState,
        errors: {
            ...formState.errors,
            paidAmount: paidAmount,
            paymentBy: paymentBy,
            paymentType: paymentType
        }
    }));
    if (error) {
        setIsLoading(false);
        return false;
    } else {
        let data = {
            tenantId:props.fileData.tenantId,
            organizationId:props.fileData.organizationId,
            invoiceId:props.fileData.invoiceId,
            version:props.fileData.version,
            paidAmount:formState.values.paidAmount,
            updatedBy:decoded.email,
            paymentType:formState.values.paymentType,
            paymentBy:formState.values.paymentBy,
            balanceDue:props.fileData.balanceDue - formState.values.paidAmount
        };
        axios({
            method: "post",
            url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/invoicePayment`,
            data: data,
            headers: {
                cooljwt: Token,
            },
        }).then(async (response) => {
                await props.loadFiles(decoded, false);
                setIsLoading(false);
                //props.closeModal();
                successAlert("Payment Initiated Successfully!");
            })
            .catch((error) => {
              error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));
                console.log(
                    typeof error.response != "undefined"
                           ? error.response.data
                            : error.message
                )
                errorAlert(
                    "There is Some Issue .."
                );
            });
    }
} 

  function closeModal() {
    props.closeModal();
  }
  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitle}>
                            Initiate Payment Invoice:&nbsp;
                            {props.fileData.invoiceId}-v{props.fileData.version}
                          </h4>
                        </CardIcon>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                      <GridItem
                          xs={10}
                          sm={10}
                          md={11}
                          lg={11}
                          style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <TextField
                            className={classes.textField}
                            type="text"
                            fullWidth={true}
                            label="Supplier Name"
                            disabled={true}
                            value={props.fileData.vendorName || ""}
                          ></TextField>
                        </GridItem>
                        <GridItem
                          xs={2}
                          sm={2}
                          md={1}
                          lg={1}
                          style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                        >
                           <Tooltip title="Show Bank Details" ><IconButton onClick={()=>setShowVendorDetails(!showVendorDetails)} >{showVendorDetails ?<VisibilityIcon fontSize="small"/>:<VisibilityOffIcon fontSize="small"/>}</IconButton></Tooltip>                       
                        </GridItem>
                        {showVendorDetails ?
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
                        <Step3 
                          goBack={()=>setShowVendorDetails(!showVendorDetails)}
                          vendorData={vendorData}
                        />
                        </GridItem>
                        : 
                        <React.Fragment>
                        {props.fileData.paymentStatus != 'pending' ? 
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
                            className={classes.textField}
                            type="text"
                            label="Balance Due"
                            disabled={true}
                            fullWidth={true}
                            value={props.fileData.balanceDue.toFixed(2) || ""}
                          ></TextField>
                        </GridItem>:''}
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
                            className={classes.textField}
                            error={formState.errors.paymentType === "error"}
                            fullWidth={true}
                            helperText={
                              formState.errors.paymentType === "error"
                                ? "Payment Type is required"
                                : null
                            }
                            label="Payment Type"
                            name="paymentType"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            select
                            value={formState.values.paymentType || ""}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem,
                              }}
                            >
                              Choose Payment Type
                            </MenuItem>
                            <MenuItem value="Full">
                              Full
                            </MenuItem>
                            <MenuItem value="Partial">
                              Partial
                            </MenuItem>
                          </TextField>
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
                            className={classes.textField}
                            error={formState.errors.paymentBy === "error"}
                            fullWidth={true}
                            helperText={
                              formState.errors.paymentBy === "error"
                                ? "Instrument Type is required"
                                : null
                            }
                            label="Instrument Type"
                            name="paymentBy"
                            select
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.paymentBy || ""}
                          >
                             <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem,
                              }}
                            >
                              Choose Instrument Type
                            </MenuItem>
                            <MenuItem value="Cheque">
                              Cheque
                            </MenuItem>
                            <MenuItem value="Cash">
                              Cash
                            </MenuItem>
                          </TextField>
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
                            className={classes.textField}
                            type="number"
                            error={formState.errors.paidAmount === "error"}
                            fullWidth={true}
                            helperText={
                              formState.errors.paidAmount === "error"
                                ? "Amount must be less then balance due"
                                : null
                            }
                            label="Paid Amount"
                            name="paidAmount"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.paidAmount || ""}
                          ></TextField>
                        </GridItem>
                        </React.Fragment>
                        }
                        </GridContainer>
                        {!showVendorDetails ?
                        <span style={{ float: "right" }}>
                            <Button
                                color="info"
                                className={classes.registerButton}
                                round
                                type="button"
                                onClick={initPayment}
                            >
                               {isLoading ? <CircularProgress disableShrink />:'Save Payment'} 
                            </Button>
                            <Button
                                color="danger"
                                className={classes.registerButton}
                                onClick={closeModal}
                                round
                            >
                                Close
                            </Button>
                            </span>:""}
                        </CardBody>
                        </Card>
                    </GridItem>
                    </GridContainer>
  );
}
