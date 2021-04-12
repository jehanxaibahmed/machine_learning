/*eslint-disable*/
import React, { useState, useEffect, forwardRef } from "react";
// @material-ui/core components
import {
  makeStyles,
  withStyles,
  Typography,
  Chip,
  Divider,
  LinearProgress,
  Dialog,
  DialogContent,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@material-ui/core";
// core components
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import SweetAlert from "react-bootstrap-sweetalert";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import axios from "axios";
import jwt from "jsonwebtoken";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import QRCode from "qrcode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import StepConnector from "@material-ui/core/StepConnector";
import List from "@material-ui/core/List";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import WizardView from "./WizardView";
import Horizentalteppers from "../../../Components/HorizentalStepper";
import {
  addZeroes,
  formatDateTime,
  validateInvoice,
} from "../../Functions/Functions";
import Approve from "./approve";
import Review from "./review";

const useStyle = makeStyles(styles);
const useStyles = makeStyles((theme) => ({
  list: {
    color: "black",
  },
}));
const sweetAlertStyle = makeStyles(styles2);
const FileAdvanceView = forwardRef((props, ref) => {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const decoded = jwt.decode(Token);
  const classes = useStyle();
  const isVendor = props.isVendor;
  const classesList = useStyles();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markModal, setMarkModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [blockChainData, setBlockChainData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [versions, setVersions] = useState([]);
  const [fileData, setFileData] = useState(props.fileData);
  const [version, setVersion] = useState(fileData.version);
  const [workflow, setWorkflow] = useState(null);
  const [validation, setValidation] = React.useState({});
  //Get BlockChain View
  const getBlockChainData = async () => {
    await axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/invoice-workflow-history/${fileData.vendorId}-${fileData.invoiceId}-${fileData.version}`,
    })
      .then((response) => {
        if (response.data.length !== 0) {
          setBlockChainData(response.data.reverse());
        } else {
          setBlockChainData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setBlockChainData([]);
      });
  };

  //Get BlockChain View
  const getPaymentData = async () => {
    await axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/payment-history/${fileData.invoiceId}-${fileData.version}`,
    })
      .then((response) => {
        if (response.data.length !== 0) {
          setPaymentData(response.data.reverse());
        } else {
          setPaymentData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setPaymentData([]);
      });
  };

  //Get QrR Code
  const getQrCode = async () => {
    await QRCode.toDataURL(fileData.invoiceId)
      .then((url) => {
        setQrCode(url);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //Get Inited Workflow Details
  const getWorkflowSteps = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getWorkflowDetailsById/${fileData.workflowId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        if (typeof response.data == "object") {
          setWorkflow(response.data);
        } else {
          setWorkflow([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setWorkflow([]);
      });
  };

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
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg}
        <br />
        Unable To Review Invoice Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  //Get Validator
  const getValidator = async () => {
    await validateInvoice(fileData, Token).then((res) => {
      setValidation(res);
    });
  };

  //Get File version
  const getFileVersions = async () => {
    let data = {
      tenantId: fileData.tenantId,
      organizationId: fileData.organizationId,
      invoiceId: fileData.invoiceId,
    };
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceVersions`,
      data: data,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setVersions(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Use Effect Hook
  useEffect(() => {
    loadFunctions();
  }, [fileData]);

  //Change Version
  const Changehandler = (event) => {
    setIsLoading(true);
    const File = versions.find((item) => item.version == event.target.value);
    setFileData(File);
    setVersion(File.version);
    setIsLoading(false);
  };
  const markIt = (event) => {
    setMarkModal(true);
    if (event == "approve") {
      setEvent(event);
    }
    if (event == "review") {
      setEvent(event);
    }
  };
  const marked = async () => {
    setMarkModal(false);
    axios({
      method: "post", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getSingleInvoiceByVersion`,
      data: { 
        invoiceId:fileData.invoiceId,
        version:fileData.version,
        vendorId:fileData.vendorId
       },
    headers: {
      cooljwt: Token,
    },
  })
    .then((invoiceRes) => {
      const invoice = invoiceRes.data;
      setFileData(invoice);
      loadFunctions();
    }).catch((er)=>{
      console.log(err);
    })
    successAlert(`Invoice is ${event}ed Successfully`);
  };
  //Load All Functions
  const loadFunctions = async () => {
    setBlockChainData([]);
    setIsLoading(true);
    await getQrCode();
    await getFileVersions();
    if (!isVendor) {
      await getValidator();
    }
    if (fileData.initWorkFlow && !isVendor) {
      await getBlockChainData();
      await getWorkflowSteps();
      await getPaymentData();
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  //BLockChain Stepper
  const QontoConnector = withStyles({
    alternativeLabel: {
      top: 3,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    line: {
      borderColor: "#eaeaf0",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  })(StepConnector);

  //Step Content
  function getStepContent(stp, ind) {
    var step = JSON.parse(stp.Record);
    console.log(blockChainData.length);
    console.log(ind);
    return (
      <Card variant="outlined" style={{ padding: "10px", marginTop: -5 }}>
        <CardHeader>
          <Typography variant="subtitle2" component="h2">
            {step.Event.toUpperCase()} STEP (
            {formatDateTime(step.EventInitDate)})
          </Typography>
        </CardHeader>
        <Divider />
        <CardBody>
          <GridContainer style={{ padding: "10px" }}>
            <GridItem xs={12} sm={12} md={6} lg={6}>
              <Tooltip title={step.EventFor.toUpperCase()}>
                <Typography variant="subtitle2" component="h2">
                  {step.EventFor.split("@")[0].toUpperCase()}
                </Typography>
              </Tooltip>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} lg={6}>
              <Chip
                size="small"
                clickable={
                  step.EventStatus == "pending" &&
                  ind+1 == blockChainData.length &&
                  step.EventFor == decoded.email
                    ? true
                    : false
                }
                style={{
                  float: "right",
                  color: "white",
                  cursor : step.EventStatus == "pending" && ind+1 == blockChainData.length ? 'pointer': '',
                  background:
                    step.EventStatus == "pending"
                      ? "#c1a12f"
                      : step.EventStatus == "reviewed" || "approved"
                      ? "green"
                      : "red",
                }}
                onClick={() => step.EventStatus == "pending" && ind+1 == blockChainData.length ? markIt(step.Event): console.log('Completed')}
                label={
                  step.EventStatus == "pending"
                    ? `SENT FOR ${step.Event.toUpperCase()}`
                    : step.EventStatus == "correctionRequired"
                    ? "CORRECTION REQUIRED"
                    : step.EventStatus.toUpperCase()
                }
              />
            </GridItem>
          </GridContainer>
        </CardBody>
        <Divider />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions3-content"
            id="additional-actions3-header"
            style={{ border: "none", boxShadow: "none" }}
          >
            <Typography variant="body1" component="h2">
              Comments
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <Typography variant="body2" component="h2">
                {step.EventComments}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  }
  {
    return isLoading ? (
      <LinearProgress />
    ) : (
      <GridContainer ref={ref}>
        {alert}
        {markModal ? (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
            fullWidth={true}
            maxWidth={"sm"}
            open={markModal}
            keepMounted
            onClose={() => setMarkModal(false)}
            aria-labelledby="pdf-modal-slide-title"
            aria-describedby="pdf-modal-slide-description"
          >
            <DialogContent id="pdfupload" className={classes.modalBody}>
              {event == "approve" ? 
              <Approve 
                close={()=>{setMarkModal(false)}}
                invoiceData={fileData}
                actionDone={marked}
              /> :
              <Review
                close={()=>{setMarkModal(false)}}
                invoiceData={fileData}
                actionDone={marked}
              />}
            </DialogContent>
          </Dialog>
        ) : (
          ""
        )}
        <GridItem
          xs={12}
          sm={12}
          md={12}
          lg={blockChainData.length !== 0 ? 8 : 12}
        >
          <Card style={{ padding: "20px" }}>
            <GridContainer style={{ marginTop: "20px", marginBottom: "20px" }}>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: "20px" }}
              >
                <Horizentalteppers fileData={fileData} />
              </GridItem>
              <GridItem xs={12} sm={12} md={4} lg={4}>
                <List className={classesList.list}>
                  <ListItemText
                    primary="Invoice ID"
                    secondary={fileData.invoiceId}
                  />
                  <ListItemText
                    onClick={() => console.log("SHOW Recipt NO")}
                    primary="Receipt Number"
                    secondary={fileData.receiptNumber || 0}
                  />
                  <ListItemText
                    primary="Gross Amount"
                    secondary={`${fileData.FC_currency.sign} ${addZeroes(
                      fileData.grossAmt
                    )}`}
                  />
                  <ListItemText
                    primary="Discount"
                    secondary={`${fileData.FC_currency.sign} ${addZeroes(
                      (fileData.discountPercent * fileData.grossAmt) / 100
                    )} (${fileData.discountPercent}%)`}
                  />
                  <ListItemText
                    primary="Tax"
                    secondary={`${fileData.FC_currency.sign} ${addZeroes(
                      fileData.taxAmt
                    )} (${(fileData.taxAmt * 100) / fileData.grossAmt}%)`}
                  />
                  <ListItemText
                    primary="Net Amount"
                    secondary={`${fileData.FC_currency.sign} ${addZeroes(
                      fileData.netAmt
                    )}`}
                  />
                </List>
              </GridItem>
              <GridItem xs={12} sm={12} md={4} lg={4}>
                <List className={classesList.list}>
                  <ListItemText
                    primary="Vendor ID"
                    secondary={fileData.vendorId}
                  />
                  <ListItemText
                    primary="Vendor Name"
                    secondary={fileData.vendorName}
                  />
                  <ListItemText
                    onClick={() => console.log("SHOW PO")}
                    primary="PO Number"
                    secondary={fileData.po || 0}
                  />
                  <ListItemText
                    primary="Currency"
                    secondary={fileData.FC_currency.Name.toUpperCase()}
                  />
                  <ListItemText
                    primary={`Created By`}
                    secondary={`${fileData.createdBy} ${
                      fileData.createdByVendor ? "(Supplier)" : "(Requester)"
                    }`}
                  />
                </List>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={4}
                lg={4}
                style={{ textAlign: "center" }}
              >
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Invoice Version
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={version}
                        style={{ width: 150 }}
                        onChange={Changehandler}
                        label="Version"
                      >
                        {versions.map((vrsn) => {
                          return (
                            <MenuItem key={vrsn.version} value={vrsn.version}>
                              Version {vrsn.version}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <CopyToClipboard
                      text={fileData.invoiceId}
                      onCopy={() => {
                        setIsCopied(!isCopied);
                      }}
                    >
                      <img style={{ width: 200 }} src={qrCode} />
                    </CopyToClipboard>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <CopyToClipboard
                      text={fileData.invoiceId}
                      onCopy={() => {
                        setIsCopied(!isCopied);
                      }}
                    >
                      <small
                        style={{
                          cursor: "pointer",
                          color: isCopied ? "blue" : "black",
                        }}
                      >
                        {isCopied ? "Copied" : fileData.invoiceId.slice(0, 9)}
                        ....
                      </small>
                    </CopyToClipboard>
                  </GridItem>
                </GridContainer>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ textAlign: "left", marginTop: 20 }}
              >
                <Typography>{fileData.description}</Typography>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ textAlign: "center", marginTop: 20 }}
              >
                <Tooltip
                  title={
                    validation.Validate
                      ? validation.Validate.isSame == false
                        ? "Invoice has been modified"
                        : "Invoice Hash"
                      : "Invoice Hash"
                  }
                >
                  <Chip
                    style={{
                      color: validation.Validate
                        ? validation.Validate.isSame == false
                          ? "red"
                          : ""
                        : "",
                    }}
                    size="small"
                    label={fileData.invoiceHash}
                  />
                </Tooltip>
              </GridItem>
            </GridContainer>
          </Card>
          <GridContainer style={{ marginTop: -20 }}>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card style={{ padding: "20px" }}>
                <WizardView
                  items={fileData.items}
                  isWorkflowInit={fileData.initWorkFlow}
                  blockChainData={blockChainData}
                  workflow={workflow}
                  attachments={fileData.attachments}
                  payments={paymentData}
                  currency={fileData.FC_currency}
                  validation={validation}
                  isVendor={isVendor}
                  isExported={fileData.trackingStatus.paymentInProcess}
                />
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        {blockChainData.length !== 0 ? (
          <GridItem xs={12} sm={12} md={12} lg={4}>
            <Card style={{ padding: "10px" }}>
              <Typography variant="h6" component="h2">
                Workflow Logs
              </Typography>
              <Stepper orientation="vertical" connector={<QontoConnector />}>
                {blockChainData.map((data, index) => (
                  <Step active={true} key={index}>
                    <StepLabel>{JSON.parse(data.Record).docHash}</StepLabel>
                    <StepContent>
                      <div>{getStepContent(data, index)}</div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Card>
          </GridItem>
        ) : (
          ""
        )}
      </GridContainer>
    );
  }
});

export default FileAdvanceView;
