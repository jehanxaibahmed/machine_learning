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
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ViewWorkFlow from "./ViewWorkflow";
import convertUrlToHash from "./FileHash";
//Redux
import { sendNotification, getNotification, sendEventLog } from "actions";
import { useSelector, useDispatch } from "react-redux";
//Animation
import BlockchainAnimation from "components/BlockchainAnimation/BlockChainAnimation";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { setIsTokenExpired } from "actions";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const Check = require("is-null-empty-or-undefined").Check;

export default function InitWorkflow(props) {
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
  const hideAlert = () => {
     props.closeModal();
    setAlert(null);
  };
  const [formState, setFormState] = React.useState({
    userDetails: null,
    fileAuthDetails: null,
    workFlows: [],
    values: {
      workFlowName: '',
      workflowReviewSteps: [],
      workflowApproveSteps: [],
    },
    errors: {
      workFlowName: ''
    },
  });
  const handleChange = (event) => {
    event.persist();
    if (event.target.name == 'workFlowName') {
      let workflowId = formState.workFlows.find(workflow => workflow.workflowName == event.target.value)._id;
      setIsLoading(true);
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getWorkflowDetailsById/${workflowId}`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          setFormState((formState) => ({
            ...formState,
            values: {
              ...formState.values,
              workflowReviewSteps: response.data.steps.filter(item => item.event == "reviewer"),
              workflowApproveSteps: response.data.steps.filter(item => item.event == "approver")
            },
          }));
          setIsLoading(false);
        })
        .catch((error) => {
          error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));
          console.log(
            typeof error.response != "undefined"
              ? error.response.data
              : error.message
          );
          setIsLoading(false);
        });
    }
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
  };

  const handleRAChange = (event, sqId) => {
    event.persist();
    if (event.target.name == 'review') {
      var rArray = formState.values.workflowReviewSteps;
      rArray[sqId].SelectedUser = event.target.value.toLowerCase();
      rArray[sqId].Status = 'pending';
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          workflowReviewSteps: rArray,
        },
      }));
    }
    else if (event.target.name == 'approve') {
      var aArray = formState.values.workflowApproveSteps;
      aArray[sqId].SelectedUser = event.target.value.toLowerCase();
      aArray[sqId].Status = 'pending';
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          workflowApproveSteps: aArray,
        },
      }));
    }
  }


  const getWorkFlows = () => {
    let userDetails = jwt.decode(Token);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getworkflowbyorganization/${userDetails.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          workFlows: response.data
        }));
      })
      .catch((error) => {
        error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
      })
  }

  React.useEffect(() => {
    convertUrlToHash(`${process.env.REACT_APP_LDOCS_API_URL}/${props.fileData.invoicePath}/${props.fileData.invoiceId}.pdf`).then((res) => {
      if (res === props.fileData.pdfHash) {
        setIsFileSame(true);
      } else {
        setIsFileSame(false);
        dispatch(sendEventLog(props.fileData, {
          eventTitle: 'File is Changed',
          eventDescription: 'File is modified (Off_Chain.....)'
        }));
      }
    });
    getWorkFlows();
  }, []);

  const initWorkFlow = () => {
    setIsInitWorkFlow(true);
    let workflowId = formState.workFlows.find(workflow => workflow.workflowName == formState.values.workFlowName)._id;
    let data = {
      invoiceId: props.fileData.invoiceId,
      version: props.fileData.version,
      workflowId: workflowId,
      reviewSteps: formState.values.workflowReviewSteps,
      approveSteps: formState.values.workflowApproveSteps,
      createdBy: props.fileData.createdBy,
      status: 'pending',
      tenantId:props.fileData.tenantId,
      organizationId:props.fileData.organizationId,
      organizationName:props.fileData.organizationName,
      requestedBy: decoded.email
    };   
    const userDetails = jwt.decode(Token);
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoiceReview/initInvoiceWorkflow`,
      data: data,
      headers: { cooljwt: Token },
    })
      .then(async(response) => {
        //successAlert('WORKFLOW INITIATED');
        setIsInitWorkFlow(false);
        props.loadFiles(userDetails,false);
        await props.closeModal();
      })
      .catch((error) => {
        error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        errorAlert('Some Issue in Init Workflow');
      })
  }

  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} md={12} >
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
                {isInitWorkFlow ? 'MOVING TO BLOCKCHAIN' : 'INITIATE WORKFLOW'}
              </h4>
            </CardIcon>
          </CardHeader>
          {isInitWorkFlow ? <div style={{ width: '100%' }} ><BlockchainAnimation /></div> :
            <CardBody>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={11}
                  lg={11}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    error={formState.errors.workFlowName === "error"}
                    fullWidth={true}
                    helperText={
                      formState.errors.workFlowName === "error"
                        ? "Workflow Name name is required"
                        : null
                    }
                    label="Workflow Name"
                    name="workFlowName"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    select
                    value={formState.values.workFlowName || ""}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose Workflow
                        </MenuItem>
                    {formState.workFlows.map((workflow, index) => {
                      return (
                        <MenuItem key={index} value={workflow.workflowName}>
                          {workflow.workflowName}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={1}
                  lg={1}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  {
                    isLoading
                      ? <CircularProgress /> :
                      <Avatar onClick={() => setIsViewWorkflow(!isViewWorkFlow)} style={{ background: '#095392' }}>
                        {isViewWorkFlow ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </Avatar>
                  }

                </GridItem>

                {isViewWorkFlow ?
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <ViewWorkFlow
                      list={formState.values.workflowReviewSteps.concat(formState.values.workflowApproveSteps)}
                      isTitle={true}
                    />
                  </GridItem> :
                  ''}
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  {formState.values.workflowReviewSteps.length !== 0
                    && !isViewWorkFlow
                    ?
                    <GridContainer>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                      >
                        <Typography variant="subtitle2">Reviewers</Typography>
                      </GridItem>
                      {formState.values.workflowReviewSteps.map((reviewStep, index) => {
                        const isOutSideOrg = reviewStep.isExtOrg ? "OUTSIDE ORG" : "INSIDE ORG";
                        return (
                          <GridItem
                            key={index}
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                          >
                            <TextField
                              className={classes.textField}
                              //error={formState.errors.organizationName === "error"}
                              fullWidth={true}
                              // helperText={
                              //   formState.errors.organizationName === "error"
                              //     ? "Organization name is required"
                              //     : null
                              // }
                              label={`R${index + 1} (${reviewStep.designation.toUpperCase()}-${isOutSideOrg})`}
                              name="review"
                              onChange={(event) => {
                                handleRAChange(event, index);
                              }}
                              select
                              //value={formState.values.organizationName || ""}
                              value={formState.values.workflowReviewSteps[index].SelectedUser ?
                                formState.values.workflowReviewSteps[index].SelectedUser.toUpperCase() : ''
                              }
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem,
                                }}
                              >
                                Choose Reviewer
                                </MenuItem>
                              {
                                reviewStep.user.map((user, index) => {
                                  return (
                                    <MenuItem key={index} value={user.level3.email.toUpperCase()}>
                                      {user.level1.displayName.toUpperCase()}
                                    </MenuItem>
                                  )
                                })
                              }
                            </TextField>
                          </GridItem>
                        )
                      })}
                    </GridContainer>
                    : ''}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  {formState.values.workflowApproveSteps.length !== 0
                    && !isViewWorkFlow
                    ?
                    <GridContainer>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                      >
                        <Typography variant="subtitle2" >Approvers</Typography>
                      </GridItem>
                      {formState.values.workflowApproveSteps.map((approveStep, index) => {
                        const isOutSideOrg = approveStep.isExtOrg ? "OUTSIDE ORG" : "INSIDE ORG";
                        return (
                          <GridItem
                            key={index}
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                          >
                            <TextField
                              className={classes.textField}
                              //error={formState.errors.organizationName === "error"}
                              fullWidth={true}
                              // helperText={
                              //   formState.errors.organizationName === "error"
                              //     ? "Organization name is required"
                              //     : null
                              // }
                              label={`A${index + 1} (${approveStep.designation.toUpperCase()}-${isOutSideOrg})`}
                              name="approve"
                              onChange={(event) => {
                                handleRAChange(event, index);
                              }}
                              select
                              //value={formState.values.organizationName || ""}
                              value={formState.values.workflowApproveSteps[index].SelectedUser ?
                                formState.values.workflowApproveSteps[index].SelectedUser.toUpperCase() : ''
                              }
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem,
                                }}
                              >
                                Choose Approver
                                </MenuItem>
                              {
                                approveStep.user.map((user, index) => {
                                  return (
                                    <MenuItem key={index} value={user.level3.email.toUpperCase()}>
                                      {user.level1.displayName.toUpperCase()}
                                    </MenuItem>
                                  )
                                })
                              }
                            </TextField>
                          </GridItem>
                        )
                      })}
                    </GridContainer>
                    : ''}
                </GridItem>
                {/* {!isFileSame ?
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <List style={{ width: 500 }}>
                      <ListItem>
                        <ListItemAvatar>
                          <Button
                            justIcon
                            round
                            simple
                            icon={WarningIcon}
                            color="danger"
                            className="Edit"
                          >
                            <WarningIcon />
                          </Button>
                        </ListItemAvatar>
                        <ListItemText primary="File has been modified (Off-Chain)" />
                      </ListItem>
                    </List>
                  </GridItem>
                  : ''} */}
              </GridContainer>
              <span style={{ float: "right" }}>
                <React.Fragment>
                  <Button
                    color="info"
                    className={classes.registerButton}
                    round
                    type="button"
                    onClick={initWorkFlow}
                  >
                    {'Init WorkFlow'}
                  </Button>
                </React.Fragment>
                <Button
                  color="danger"
                  className={classes.registerButton}
                  onClick={props.closeModal}
                  round
                >
                  Close
                </Button>
              </span>
            </CardBody>}
        </Card>
      </GridItem>
    </GridContainer>
  );
}
