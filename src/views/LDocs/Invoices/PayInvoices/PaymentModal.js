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
import SweetAlert from "react-bootstrap-sweetalert";
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
        onConfirm={() => {
          hideAlert();
        }}
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
    getPaymentMethods();
    getVendorData();
    getClientId();
  }, []);

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
      url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/getGateway/${props.fileData.tenantId}`,
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
  const initPayment = () => {
    setIsLoading(true);
    let paidAmount;
    let paymentBy;
    let paymentType;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;
    if (
      !Check(formState.values.paidAmount) &&
      formState.values.paidAmount <= props.fileData.balanceDue
    ) {
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
        paymentType: paymentType,
      },
    }));
    if (error) {
      setIsLoading(false);
      return false;
    } else {
      let data = {
        tenantId: props.fileData.tenantId,
        organizationId: props.fileData.organizationId,
        invoiceId: props.fileData.invoiceId,
        version: props.fileData.version,
        paidAmount: formState.values.paidAmount,
        updatedBy: decoded.email,
        paymentType: formState.values.paymentType,
        paymentBy: formState.values.paymentBy,
        balanceDue: props.fileData.balanceDue - formState.values.paidAmount,
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
          await props.loadFiles(decoded, false);
          setIsLoading(false);
          //props.closeModal();
          successAlert("Payment Initiated Successfully!");
        })
        .catch((error) => {
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(
            typeof error.response != "undefined"
              ? error.response.data
              : error.message
          );
          errorAlert("There is Some Issue ..");
        });
    }
  };

  useEffect(() => {
    if (vendorData && clientID) {
      let ClientID = clientID;
      let vendorMerchantID =
        vendorData.level3.payPalAcc_details.merchantIdInPayPal;
      let src = `https://www.paypal.com/sdk/js?&client-id=${ClientID}&merchant-id=${vendorMerchantID}`;
      // let src =
      //   "https://www.paypal.com/sdk/js?&client-id=AVuqQ1kwJEdy8IxI9SDI-IT-cdQNW0Ruh9H44S6uPKst-lwEC-el8bB8ErDAxxX2ZhhuSejbqYIlfAAM&merchant-id=HRUTW4GF7EM7N";
      const script = document.createElement("script");
      script.async = true;
      script.src = src;

      document.getElementById("body").prepend(script);

      // div.current.appendChild(script);
    }
    // const script = document.createElement("script");

    // script.src = `https://www.paypal.com/sdk/js?&client-id=${ClientID}&merchant-id=${vendorMerchantID}"`;
    // script.async = true;

    // document.head.appendChild(script);

    // return () => {
    //   document.head.removeChild(script);
    // };
  }, [vendorData, clientID]);

  const paymentButton = () => {
    if (
      formState.values.paymentType != "full" &&
      formState.errors.paidAmount == "error"
    ) {
      console.log("Error Amount");
    } else {
      if (formState.values.paymentBy == "PayPal") {
        let orderID;
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
                              ? parseFloat(props.fileData.netAmt_bc)
                              : parseFloat(formState.values.paidAmount),
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
                    console.log("ResU", res);
                    return res;
                  })
                  .then(function(data) {
                    console.log("Res", data);
                    return data.data.id.id;
                  });
              },
              onApprove: function(data, actions) {
                console.log("orderData", data);
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
                      version: props.fileData.version,
                      paidAmount:
                        formState.values.paymentType == "full"
                          ? parseFloat(props.fileData.netAmt_bc)
                          : parseFloat(formState.values.paidAmount),
                      updatedBy: decoded.email,
                      paymentID: transaction.id,
                      payerID: payerId,
                      paymentType: formState.values.paymentType,
                      currencyType: formState.values.currencyType,
                      orderId: orderId,
                      paymentGateway:formState.values.paymentBy,
                      balanceDue:
                        formState.values.paymentType == "full"
                          ? 0
                          : parseFloat(props.fileData.balanceDue) -
                            parseFloat(formState.values.paidAmount),
                      paymentMethod: formState.values.paymentBy,
                      transactionFee:"1",
                    };
                    axios({
                      method: "post",
                      url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/invoicePayment`,
                      data: data,
                      headers: {
                        cooljwt: Token,
                      },
                    }).then(async (response) => {
                      console.log(response);
                      props
                      await props.loadFiles(decoded, false);
                      successAlert("Payment Successful...");
                      
                    }).catch((err)=>{
                      errorAlert('Payment Already Done');
                    });
                  }
                });
              },
            })
            .render("#paypal-button");
        });

        // paypal.Button.render(
        //   {
        //     env: "sandbox", // Or 'production'
        //     // Set up the payment:
        //     // 1. Add a payment callback
        //     payment: function(data, actions) {
        //       // 2. Make a request to your server
        //       return actions.request
        //         .post(
        //           `${process.env.REACT_APP_LDOCS_API_URL}/payment/createPayment`,
        //           {
        //             invoiceId: props.fileData.invoiceId,
        //             organizationId: props.fileData.organizationId,
        //             description: `Payment for Invoice ${props.fileData.invoiceId}`,
        //             amount:
        //               formState.values.paymentType == "full"
        //                 ? parseFloat(props.fileData.netAmt_bc)
        //                 : parseFloat(formState.values.paidAmount),
        //             currency: props.fileData.LC_currency.Code,
        //           }
        //         )
        //         .then(function(res) {
        //           // 3. Return res.id from the response
        //           return res.id;
        //         });
        //     },
        //     // Execute the payment:
        //     // 1. Add an onAuthorize callback
        //     onAuthorize: function(data, actions) {
        //       // 2. Make a request to your server
        //       return actions.request
        //         .post(
        //           `${process.env.REACT_APP_LDOCS_API_URL}/payment/executePayment`,
        //           {
        //             paymentID: data.paymentID,
        //             payerID: data.payerID,
        //             amount:
        //               formState.values.paymentType == "full"
        //                 ? parseFloat(props.fileData.netAmt_bc)
        //                 : parseFloat(formState.values.paidAmount),
        //             currency: props.fileData.LC_currency.Code,
        //           }
        //         )
        //         .then(function(res) {
        //           let data = {
        //             tenantId: props.fileData.tenantId,
        //             organizationId: props.fileData.organizationId,
        //             invoiceId: props.fileData.invoiceId,
        //             version: props.fileData.version,
        //             paidAmount:
        //               formState.values.paymentType == "full"
        //                 ? parseFloat(props.fileData.netAmt_bc)
        //                 : parseFloat(formState.values.paidAmount),
        //             updatedBy: decoded.email,
        //             paymentID: res.id,
        //             payerID: res.payer.payer_info.payer_id,
        //             paymentType: formState.values.paymentType,
        //             paymentBy: formState.values.paymentBy.currencyType,
        //             balanceDue:
        //               formState.values.paymentType == "full"
        //                 ? 0
        //                 : parseFloat(props.fileData.balanceDue) -
        //                   parseFloat(formState.values.paidAmount),
        //             paymentMethod: formState.values.paymentBy,
        //           };
        //           axios({
        //             method: "post",
        //             url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/invoicePayment`,
        //             data: data,
        //             headers: {
        //               cooljwt: Token,
        //             },
        //           }).then(async (response) => {
        //             console.log(res);
        //             successAlert("Payment Successful...");
        //           });
        //         });
        //     },
        //   },
        //   "#paypal-button"
        // );
      }
      if (formState.values.paymentBy == "moneybutton") {
        const div = document.getElementById("my-money-button");
        moneyButton.render(div, {
          to: "ryan@moneybutton.com",
          amount:
            formState.values.paymentType == "full"
              ? parseFloat(props.fileData.netAmt_bc)
              : parseFloat(formState.values.paidAmount),
          currency: props.fileData.LC_currency.Code,
          label: "Pay Through Money Button",
          clientIdentifier: "some public client identifier",
          buttonId: "234325",
          buttonData: "{}",
          type: "tip",
          onPayment: function(arg) {
            console.log("onPayment", arg);
          },
          onError: function(arg) {
            console.log("onError", arg);
          },
        });
      }
    }
  };

  function closeModal() {
    props.closeModal();
  }
  return (
    <GridContainer ref={div}>
      {alert}
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
                        `${props.fileData.LC_currency.Code}  ${props.fileData.netAmt_bc}` ||
                        ""
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
                            ? "Amount must be less then balance due"
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
                      label="Currency Type"
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
                      {PaymentGateways.filter(
                        (pg) =>
                          pg.currencyType ==
                          parseInt(formState.values.currencyType)
                      ).map((p) => (
                        <MenuItem value={p.serviceName}>
                          {/* {p.title}&nbsp;&nbsp; */}
                          <div className="fileinput text-right">
                            <div className="" style={{ marginTop: 20 }}>
                              <img
                                height="26px"
                                width="120px"
                                src={`${process.env.REACT_APP_LDOCS_API_URL}/${p.imgUrl}`}
                                alt={p.serviceName}
                              />
                            </div>
                          </div>
                        </MenuItem>
                      ))}
                    </TextField>
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
                  //    <PayPalButton
                  //    amount="0.01"
                  //    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  //    onSuccess={(details, data) => {
                  //      alert("Transaction completed by " + details.payer.name.given_name);

                  //      // OPTIONAL: Call your server to save the transaction
                  //      return fetch("/paypal-transaction-complete", {
                  //        method: "post",
                  //        body: JSON.stringify({
                  //          orderId: data.orderID
                  //        })
                  //      });
                  //    }}
                  //    options={{
                  //      clientId: clientID,
                  //      merchantId:  vendorData.level3.payPalAcc_details.merchantIdInPayPal
                  //    }}
                  //  />
                  <span style={{ marginTop: "20px" }} id="paypal-button"></span>
                ) : (
                  ""
                )}
                {formState.values.paymentBy == "moneybutton" ? (
                  <div style={{ maxWidth: 237 }}>
                    <span id="my-money-button"></span>
                  </div>
                ) : (
                  ""
                )}
              </span>
            ) : (
              ""
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
