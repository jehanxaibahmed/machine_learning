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
  ListItemText
} from "@material-ui/core";
// core components

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import jwt from "jsonwebtoken";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import QRCode from 'qrcode'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import StepConnector from '@material-ui/core/StepConnector';
import List from '@material-ui/core/List';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useDispatch, useSelector } from "react-redux";
import WizardView from './WizardView';
import Horizentalteppers from "../../../Components/HorizentalStepper";

const useStyle = makeStyles(styles);
const useStyles = makeStyles((theme) => ({
  list: {
    color: 'black'
  }

}));
const FileAdvanceView = forwardRef((props, ref) => {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const decoded = jwt.decode(Token);
  const classes = useStyle();
  const classesList = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [blockChainData, setBlockChainData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [versions, setVersions] = useState([]);
  const [fileData, setFileData] = useState(props.fileData);
  const [version, setVersion] = useState(fileData.version);
  const [workflow, setWorkflow] = useState(null);

//Get BlockChain View
  const getBlockChainData = async () => {
      await axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/invoice-workflow-history/${fileData.invoiceId}-${fileData.version}`
      })
        .then((response) => {
          if (response.data.length !== 0) {
            setBlockChainData(response.data.reverse());
          }else{
            setBlockChainData([]);
          }
        })
        .catch((err) => {
          console.log(err);
          setBlockChainData([]);
        })
  }

  
//Get BlockChain View
const getPaymentData = async () => {
  await axios({
    method: "get", //you can set what request you want to be
    url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/payment-history/${fileData.invoiceId}-${fileData.version}`
  })
    .then((response) => {
      if (response.data.length !== 0) {
        setPaymentData(response.data.reverse());
      }else{
        setPaymentData([]);
      }
    })
    .catch((err) => {
      console.log(err);
      setPaymentData([]);
    })
}

//Get QrR Code
  const getQrCode = async () => {
      await QRCode.toDataURL(fileData.invoiceId)
        .then(url => {
          setQrCode(url)
        })
        .catch(err => {
          console.error(err)
        });
  }

  
  //Get Inited Workflow Details
  const getWorkflowSteps = async () => {
    await axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getWorkflowDetailsById/${fileData.workflowId}`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          if (typeof response.data == "object" ) {
            setWorkflow(response.data);            
          }
          else{
            setWorkflow([]);            
          }
        })
        .catch((err) => {
          console.log(err);
          setWorkflow([]);            
        })
  };




  //Get File version
  const getFileVersions = async () => {
      let data = {
        tenantId: fileData.tenantId,
        organizationId: fileData.organizationId,
        invoiceId: fileData.invoiceId
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
        })
  };

//Use Effect Hook
  useEffect(() => {
    loadFunctions();
  }, [fileData]);

  //Change Version 
  const Changehandler = (event) => {
    setIsLoading(true);
    const File = versions.find(item => item.version == event.target.value);
    setFileData(File);
    setVersion(File.version);
    setIsLoading(false);

  }

  //Load All Functions
  const loadFunctions = async () => {
    setBlockChainData([]);
    setIsLoading(true);
    await getQrCode();
    await getFileVersions();
    if(fileData.initWorkFlow){
      await getBlockChainData();
      await getWorkflowSteps();
      await getPaymentData();
      setIsLoading(false);
    }
    setIsLoading(false);
  }

//BLockChain Stepper
  const QontoConnector = withStyles({
    alternativeLabel: {
      top: 3,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    line: {
      borderColor: '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  })(StepConnector);

  //Step Content
  function getStepContent(stp, ind) {
    var step = JSON.parse(stp.Record);
    return (
      <Card variant="outlined"
        style={{ padding: "10px", marginTop: -5 }}
      >
        <CardHeader>
          <Typography variant="subtitle2" component="h2">
            {step.Event.toUpperCase()} STEP
        </Typography>
        </CardHeader>
        <Divider />
        <CardBody>
          <GridContainer
            style={{ padding: "10px" }}
          >
            <GridItem
              xs={12}
              sm={12}
              md={8}
              lg={8}
            >
              <Typography variant="subtitle2" component="h2">
                {step.EventFor.toUpperCase()}
              </Typography>
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={4}
              lg={4}
            >
              <Chip size="small" style={{color:'white',background : step.EventStatus == 'pending' ? '#c1a12f' : step.EventStatus == 'reviewed' || 'approved' ? 'green' : 'red'}} label={step.EventStatus.toUpperCase()} />
            </GridItem>
          </GridContainer>
        </CardBody>
        <Divider />
        <CardHeader
        >
          <Typography variant="subtitle2" component="h2"
            style={{ padding: "10px" }}
          >
            {step.EventInitDate.toUpperCase()}
          </Typography>
        </CardHeader>
      </Card>)
  }
  {
    return (
      isLoading ?
        <LinearProgress /> :
        <GridContainer ref={ref}>
          <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={blockChainData.length !== 0 ? 8 : 12}
          >
            <Card
              style={{ padding: "20px" }}
            >
              <GridContainer
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: "20px" }}
                >
                  <Horizentalteppers fileData={fileData} />
              </GridItem>
              <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                >
                  <List className={classesList.list}>
                    <ListItemText primary="Invoice ID" secondary={fileData.invoiceId} />
                    <ListItemText primary="Discount" secondary={`${fileData.discountPercent.toFixed(2)}%`} />
                    <ListItemText primary="Gross Amount" secondary={`$${fileData.grossAmt.toFixed(2)}`} />
                    <ListItemText primary="Net Amount" secondary={`$${fileData.netAmt.toFixed(2)}`} />
                  </List>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                >
                  <List className={classesList.list}>
                    <ListItemText primary="Vendor ID" secondary={fileData.vendorId} />
                    <ListItemText primary="Vendor Name" secondary={fileData.vendorName} />
                    {fileData.ref ? (<ListItemText primary="Vendor Name" secondary={fileData.ref} />):""}
                    <ListItemText primary="Created Date" secondary={fileData.invoiceDate} />
                  </List>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ textAlign: 'center' }}
                >
                  <GridContainer>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Invoice Version</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={version}
                          style={{ width: 150 }}
                          onChange={Changehandler}
                          label="Version"
                        >
                          {versions.map(vrsn => {
                            return <MenuItem key={vrsn.version} value={vrsn.version}>Version {vrsn.version}</MenuItem>
                          })}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <CopyToClipboard text={fileData.invoiceId}
                        onCopy={() => {setIsCopied(!isCopied)}}>
                        <img style={{ width: 200 }} src={qrCode} />
                      </CopyToClipboard>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <CopyToClipboard text={fileData.invoiceId}
                        onCopy={() => {setIsCopied(!isCopied)}}>
                        <small style={{ cursor: 'pointer', color: isCopied ? 'blue' : 'black' }}>{isCopied ? 'Copied' : fileData.invoiceId.slice(0, 9)}....</small>
                      </CopyToClipboard>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem
                 xs={12}
                 sm={12}
                 md={12}
                 lg={12}
                 style={{textAlign:'center', marginTop:20}}
                >
                <Chip size="small"  label={fileData.invoiceHash} />
                </GridItem>
              </GridContainer>
            </Card>
            <GridContainer style={{ marginTop: -20 }}>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Card
                  style={{ padding: "20px" }}
                >
                  <WizardView items={fileData.items} isWorkflowInit={fileData.initWorkFlow} blockChainData={blockChainData} workflow={workflow} attachments={fileData.attachments} payments={paymentData} />
                </Card>
              </GridItem>
            </GridContainer>
          </GridItem>
          {blockChainData.length !== 0 ?
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={4}
            >
              <Card
                style={{ padding: "10px" }}
              >
                <Typography variant="h6" component="h2">
                  Workflow History
                </Typography>
                <Stepper orientation="vertical" connector={<QontoConnector />}>
                  {blockChainData.map((data, index) => (
                    <Step active={true} key={index}>
                      <StepLabel >{JSON.parse(data.Record).docHash}</StepLabel>
                      <StepContent>
                        <div>{getStepContent(data, index)}</div>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Card>
            </GridItem>
            : ''
          }

        </GridContainer>
    );
  }
});


export default FileAdvanceView;