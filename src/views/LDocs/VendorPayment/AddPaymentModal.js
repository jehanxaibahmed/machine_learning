/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  makeStyles,
  MenuItem,
  TextField,
  CircularProgress,
  Slide,
  Dialog,
  LinearProgress,
  DialogContent,
  IconButton,
  Tooltip,
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
import ChipInput from "material-ui-chip-input";
import Pending from "assets/img/statuses/Pending.png";
import Success from "assets/img/statuses/Success.png";
import Rejected from "assets/img/statuses/Rejected.png";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useDispatch, useSelector } from "react-redux";
import BuildNetwork from "views/LDocs/Vendor/BuildNetwork";
import Step3 from "views/LDocs/Vendor/steps/level3";
import { formatDateTime } from "views/LDocs/Functions/Functions";
import { PayPalButton } from "react-paypal-button-v2";
import { addZeroes } from "views/LDocs/Functions/Functions";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function AddPaymentModal({type, closeModal, getPaymentgateways}) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const decoded = jwt.decode(Token);
 
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [PaymentGateways, setPaymentGateways] = React.useState([]);
  const [formState, setFormState] = React.useState({
    values: {
     paymentGateway:"" 
    },
    errors: {
     paymentGateway:""
    },
  });
  
  React.useEffect(() => {
    getPaymentMethods();
  }, []);


  const addPaymentGateway = () => {
    let paymentGateway;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;
    if (!Check(formState.values.paymentGateway)) {
        paymentGateway = "success";
    } else {
        paymentGateway = "error";
      error = true;
    }
    setFormState((formState) => ({
        ...formState,
        errors: {
          ...formState.errors,
          paymentGateway: paymentGateway,
        }
      }));
      if (error) {
        return false;
      }else{
          var data= {
            vendorId:decoded.id,
            Enable:true,
            default:false,
            channel_id:PaymentGateways.find(p=> p.serviceName == formState.values.paymentGateway)._id,
            currencyType:type
          }
        axios({
            method: "post",
            url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/saveGateway`,
            data: data,
            headers: { cooljwt: Token },
          })
            .then((response) => {
                getPaymentgateways();
                closeModal();
                // successAlert('Added Successfully..');
            }).catch((err)=>{
                getPaymentgateways();
                errorAlert('Already Exist');
            })
      }


  }

  const handleChange = (event) => {
    event.persist();
    console.log(event.target.value);
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
  };

  const getPaymentMethods = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/getPayChannel`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setPaymentGateways(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };




  return (
        <Card>
         
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
                Add Payment Method
                </h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
            <GridContainer>
                <React.Fragment>
                  <GridItem
                    xs={9}
                    sm={9}
                    md={9}
                    lg={9}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <TextField
                      className={classes.textField}
                      error={formState.errors.paymentGateway === "error"}
                      fullWidth={true}
                      helperText={
                        formState.errors.paymentGateway === "error"
                          ? "Payment Type is required"
                          : null
                      }
                      label="Payment Gateway"
                      name="paymentGateway"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      select
                      value={formState.values.paymentGateway || ""}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Choose Payment Gateway
                      </MenuItem>
                      {PaymentGateways.filter(p=>p.currencyType.includes(type)).map(pay => (
                         <MenuItem value={pay.serviceName} key={pay._id} >{pay.serviceName.toUpperCase()}</MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem
                    xs={3}
                    sm={3}
                    md={3}
                    lg={3}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                       <div className="fileinput text-right">
                            <div className="" style={{ marginTop: 20 }}>
                            {PaymentGateways.find(
                                  pg => pg.serviceName == formState.values.paymentGateway
                                ) ? <img
                                height="30px"
                                width="100%"
                                src={`${process.env.REACT_APP_LDOCS_API_URL}/${
                                 PaymentGateways.find(
                                  pg => pg.serviceName == formState.values.paymentGateway
                                ).imgUrl}`}
                              />
                              :""}
                            </div>
                          </div>
                  </GridItem>
                </React.Fragment>
            </GridContainer>
            <Button
              color="danger"
              round
              style={{ float: "right" }}
              className={classes.marginRight}
              onClick={addPaymentGateway}
            >
              Add Payment Gateway
            </Button>
          </CardBody>
        </Card>
       );
}
