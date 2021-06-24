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
let MoneyButton = require("@moneybutton/react-money-button").default;

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function InitiatePayment(props) {
  let div = React.createRef();
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const decoded = jwt.decode(Token);
  const [vendorData, setVendorData] = React.useState();
  const [clientID, setClientID] = React.useState();
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [isLoading, setIsLoading] = React.useState(false);
  const [paymentInProcess, setPaymentInProcess] = React.useState(false);
  const [buttonLoaded, setButtonLoaded] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [showVendorDetails, setShowVendorDetails] = React.useState(false);
  const [PaymentGateways, setPaymentGateways] = React.useState([]);
  const [formState, setFormState] = React.useState({
    values: {
      paidAmount: "",
      paymentBy: "",
      paymentType: "full",
      currencyType: 1,
    },
    errors: {
      paidAmount: "",
      paymentBy: "",
      paymentType: "",
      currencyType: "",
    },
  });
  

  const onLoad =  (load) => {
   console.log('Load', load);
}

function onMoneyButtonPayment (payment) {
  let data = {
    tenantId: props.fileData.tenantId,
    organizationId: props.fileData.organizationId,
    invoiceId: props.fileData.invoiceId,
    version: props.fileData.version,
    paidAmount:
      formState.values.paymentType == "full"
        ? parseFloat(props.fileData.balanceDue).toFixed(2)
        : parseFloat(formState.values.paidAmount).toFixed(2),
    updatedBy: decoded.email,
    paymentID: "",
    payerID: "",
    paymentType: formState.values.paymentType,
    currencyType: formState.values.currencyType,
    orderId: orderId,
    paymentGateway: formState.values.paymentBy,
    currencyCode: props.fileData.LC_currency.Code,
    balanceDue:
      formState.values.paymentType == "full"
        ? 0
        : parseFloat(props.fileData.balanceDue) -
          parseFloat(formState.values.paidAmount),
    paymentMethod: formState.values.paymentBy,
    transactionFee: "1",
  };
  axios({
    method: "post",
    url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/invoicePayment`,
    data: data,
    headers: {
      cooljwt: Token,
    },
  })
    .then(async (response) => {
      console.log(response);
      await props.loadFiles(decoded, false);
      setPaymentInProcess(false);
      // setButtonLoaded(true);
      successAlert("Payment Successful...");
    })
    .catch((err) => {
      errorAlert("Payment Already Done");
    });}

 

 
  React.useEffect(() => {
    getPaymentMethods();
    getVendorData();
    getClientId();
  }, []);



  React.useEffect(()=>{
         
    var css = 'div[style="position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; z-index: 1001;"] {z-index: 99999999999999 !important; }div[style="position: relative; display: inline-block; width: 280px; height: 50px;"]{width:195px !important}iframe[style="border: none; width: 280px; height: 50px;"]{width:195px !important}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet){
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
      },[])



  React.useEffect(() => {
    paymentButton();
  }, [formState.values.paymentBy]);

  const handleChange = (event) => {
    event.persist();
    let paidAmount;
    var error = false;
    if (event.target.name == "paidAmount") {
      if (
        event.target.value <= props.fileData.balanceDue &&
        event.target.value > 0
      ) {
        paidAmount = "success";
      } else {
        paidAmount = "error";
        error = true;
      }
      setFormState((formState) => ({
        ...formState,
        values: {
          paymentType: "partial",
          paymentBy: "",
          currencyType: 1,
        },
        errors: {
          ...formState.errors,
          paidAmount: paidAmount,
        },
      }));
    }
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
      url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/getGateway/${props.fileData.vendorId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        console.log(response.data);
        setPaymentGateways(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getClientId = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/getClintId`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setClientID(response.data.client_id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getVendorData = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorsByOrganization/${props.fileData.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        const vendor = response.data.find(
          (v) => v._id == props.fileData.vendorId
        );
        if (vendor) {
          setVendorData(vendor);
        } else {
          setVendorData({});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (vendorData && clientID) {
      let ClientID = clientID;
      let vendorMerchantID =
        vendorData.level3.payPalAcc_details.merchantIdInPayPal;
      let src = `https://www.paypal.com/sdk/js?&client-id=${ClientID}&merchant-id=${vendorMerchantID}`;
      const script = document.createElement("script");
      script.async = true;
      script.src = src;

      document.getElementById("body").prepend(script);
    }
  }, [vendorData, clientID]);

  const paymentButton = () => {
    if (
      formState.values.paymentType != "full" &&
      formState.errors.paidAmount == "error"
    ) {
      console.log("Error Amount");
    } else {
      if (formState.values.paymentBy == "PayPal") {
        setButtonLoaded(false);
        axios({
          method: "get",
          url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/requestAccessTokenPaypal`,
        }).then((response) => {
          let accessToken = response.data.access_token;
          paypal
            .Buttons({
              createOrder: function(data, actions) {
                return axios({
                  method: "post",
                  url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/my-server/create-order`,
                  data: {
                    access_token: accessToken,
                    purchase_units: [
                      {
                        amount: {
                          currency_code: props.fileData.LC_currency.Code,
                          value:
                            formState.values.paymentType == "full"
                              ? parseFloat(props.fileData.balanceDue).toFixed(2)
                              : parseFloat(formState.values.paidAmount).toFixed(
                                  2
                                ),
                        },
                        payee: {
                          email_address:
                            vendorData.level3.payPalAcc_details.payPal_email,
                          // email_address:'jehanxaibahmed@gmail.com',
                        },
                        payment_instruction: {
                          disbursement_mode: "INSTANT",
                          platform_fees: [
                            {
                              amount: {
                                currency_code: props.fileData.LC_currency.Code,
                                value: 1.0,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                  headers: {
                    "Content-Type": "application/json",
                    cooljwt: Token,
                  },
                })
                  .then(function(res) {
                    return res;
                  })
                  .then(function(data) {
                    return data.data.id.id;
                  });
              },
              onApprove: function(data, actions) {
                setButtonLoaded(false);
                setPaymentInProcess(true);
                return axios({
                  method: "post",
                  url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/my-server/handle-approve/${data.orderID}`,
                  data: {
                    access_token: accessToken,
                  },
                  headers: {
                    "Content-Type": "application/json",
                    cooljwt: Token,
                  },
                }).then(function(res) {
                  if (!res.ok) {
                    console.log(res);
                    let response = res.data.result;
                    let payer = response.payer;
                    let purchase_units = response.purchase_units;
                    let status = response.status;
                    let transaction = purchase_units[0].payments.captures[0];
                    let orderId = response.id;
                    let payerEmail = payer.email_address;
                    let payerId = payer.payer_id;
                    console.log("Order ID", orderId);
                    console.log("Transaction ID", transaction.id);

                    let data = {
                      tenantId: props.fileData.tenantId,
                      organizationId: props.fileData.organizationId,
                      invoiceId: props.fileData.invoiceId,
                      vendorId:props.fileData.vendorId,
                      version: props.fileData.version,
                      paidAmount:
                        formState.values.paymentType == "full"
                          ? parseFloat(props.fileData.balanceDue).toFixed(2)
                          : parseFloat(formState.values.paidAmount).toFixed(2),
                      updatedBy: decoded.email,
                      paymentID: transaction.id,
                      payerID: payerId,
                      paymentType: formState.values.paymentType,
                      currencyType: formState.values.currencyType,
                      orderId: orderId,
                      paymentGateway: formState.values.paymentBy,
                      currencyCode: props.fileData.LC_currency.Code,
                      balanceDue:
                        formState.values.paymentType == "full"
                          ? 0
                          : parseFloat(props.fileData.balanceDue) -
                            parseFloat(formState.values.paidAmount),
                      paymentMethod: formState.values.paymentBy,
                      transactionFee: "1",
                    };
                    axios({
                      method: "post",
                      url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/invoicePayment`,
                      data: data,
                      headers: {
                        cooljwt: Token,
                      },
                    })
                      .then(async (response) => {
                        console.log(response);
                        await props.loadFiles(decoded, false);
                        setPaymentInProcess(false);
                        // setButtonLoaded(true);
                        successAlert("Payment Successful...");
                      })
                      .catch((err) => {
                        errorAlert("Payment Already Done");
                      });
                  }
                });
              },
            })
            .render("#paypal-button");
          setTimeout(() => {
            setButtonLoaded(true);
          }, 3000);
        });
      }
    if (formState.values.paymentBy == "moneybutton") {
      setButtonLoaded(false);
      setTimeout(() => {
        setButtonLoaded(true);
      }, 3000);
    }
      // if (formState.values.paymentBy == "moneybutton") {
      //   const div = document.getElementById("my-money-button");
      //   moneyButton.render(div, {
      //     to: "ryan@moneybutton.com",
      //     amount:
      //       formState.values.paymentType == "full"
      //         ? parseFloat(props.fileData.balanceDue)
      //         : parseFloat(formState.values.paidAmount),
      //     currency: props.fileData.LC_currency.Code,
      //     label: "Pay Through Money Button",
      //     clientIdentifier: "some public client identifier",
      //     buttonId: "234325",
      //     buttonData: "{}",
      //     type: "tip",
      //     onPayment: function(arg) {
      //       console.log("onPayment", arg);
      //     },
      //     onError: function(arg) {
      //       console.log("onError", arg);
      //     },
      //   });
      // }
    }
  };

  function closeModal() {
    props.closeModal();
  }
  return (
    <GridContainer ref={div}>
       
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
                Initiate Payment Invoice:&nbsp;
                {props.fileData.invoiceId}
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
                <Tooltip title="Show Bank Details">
                  <IconButton
                    onClick={() => setShowVendorDetails(!showVendorDetails)}
                  >
                    {showVendorDetails ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </GridItem>
              {showVendorDetails ? (
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
                    goBack={() => setShowVendorDetails(!showVendorDetails)}
                    vendorData={vendorData}
                  />
                </GridItem>
              ) : (
                <React.Fragment>
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
                      <MenuItem value="full">Full</MenuItem>
                      <MenuItem value="partial">Partial</MenuItem>
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
                      type="text"
                      fullWidth={true}
                      label="Amount Due"
                      disabled={true}
                      value={
                        `${props.fileData.LC_currency.Code}  ${addZeroes(
                          props.fileData.balanceDue
                        )}` || ""
                      }
                    ></TextField>
                  </GridItem>
                  {formState.values.paymentType != "full" ? (
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
                        error={formState.errors.paidAmount === "error"}
                        fullWidth={true}
                        helperText={
                          formState.errors.paidAmount === "error"
                            ? "Amount must be less then balance"
                            : null
                        }
                        label="Amount To Pay"
                        name="paidAmount"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        value={formState.values.paidAmount || ""}
                      ></TextField>
                    </GridItem>
                  ) : (
                    ""
                  )}
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
                      fullWidth={true}
                      label="Payment In"
                      name="currencyType"
                      select
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      value={formState.values.currencyType || ""}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Choose Currency Type
                      </MenuItem>
                      <MenuItem value={1}>Fiat Payment</MenuItem>
                      <MenuItem value={2}>Crypto Payment</MenuItem>
                    </TextField>
                  </GridItem>

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
                      error={formState.errors.paymentBy === "error"}
                      fullWidth={true}
                      helperText={
                        formState.errors.paymentBy === "error"
                          ? "Payment Option is required"
                          : null
                      }
                      label="Payment Options"
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
                        Choose Payment Option
                      </MenuItem>
                      {PaymentGateways.filter((pg) =>
                        pg.currencyType.includes(
                          parseInt(formState.values.currencyType)
                        )
                      ).map((p) => (
                        <MenuItem value={p.serviceName}>
                          <div className="fileinput text-right">
                            <div className="" style={{ marginTop: 20 }}>
                              {`${p.serviceName.toUpperCase()} ${p.default ? "(Preferred)":""}`}
                            </div>
                          </div>
                          {/* <div className="fileinput text-right">
                            <div className="" style={{ marginTop: 20 }}>
                              <img
                                height="26px"
                                width="120px"
                                src=
                                {`${process.env.REACT_APP_LDOCS_API_URL}/${p.serviceName.toUpperCase()}`}
                                alt={p.serviceName}
                              />
                            </div>
                          </div> */}
                        </MenuItem>
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
                          (pg) => pg.serviceName == formState.values.paymentBy
                        ) ? (
                          <img
                            height="60px"
                            width="100%"
                            src={`${process.env.REACT_APP_LDOCS_API_URL}/${
                              PaymentGateways.find(
                                (pg) =>
                                  pg.serviceName == formState.values.paymentBy
                              ).imgUrl
                            }`}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </GridItem>
                </React.Fragment>
              )}
            </GridContainer>

            {!showVendorDetails ? (
              <span
                id="paymentWrapper"
                style={{ float: "right", marginTop: "20px" }}
              >
                {formState.values.paymentBy == "PayPal" ? (
                  <span
                    style={{
                      marginTop: "20px",
                      display: buttonLoaded ? "block" : "none",
                    }}
                    id="paypal-button"
                  ></span>
                ) : (
                  ""
                )}
                 {formState.values.paymentBy == "moneybutton" ? 
                 (
                   <MoneyButton
                   style={{
                    marginTop: "20px",
                    display: buttonLoaded ? "block" : "none",
                  }}
                   to={vendorData.level3.moneyButton_details.email}
                   amount={formState.values.paymentType == "full"
                   ? parseFloat(props.fileData.balanceDue).toFixed(2)
                   : parseFloat(formState.values.paidAmount).toFixed(
                       2
                     )}
                  label="Pay Now"
                  onError={()=>{ props.closeModal(); }}
                  onLoad={(payload)=>console.log("Loaded")}
                  onPayment={onMoneyButtonPayment}
                  successMessage="Payment SuccessFully Transfered"
                  devMode={true}
                   currency={props.fileData.LC_currency.Code}
                 />
                ) : (
                  ""
                )}
                {buttonLoaded == false ? <CircularProgress /> : ""}
                {/* {formState.values.paymentBy == "moneybutton" ? (
                  <div style={{ maxWidth: 237 }}>
                    <span id="my-money-button"></span>
                  </div>
                ) : (
                  ""
                )} */}

              
              </span>
            ) : (
              ""
            )}
            {/* {paymentInProcess? 
            <CircularProgress />:""  
            } */}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
