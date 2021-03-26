/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, MenuItem, TextField, LinearProgress} from "@material-ui/core";
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
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function FileReceived(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const decoded = jwt.decode(Token);
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
//   const [isSavingTags, setIsSavingTags] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [formState, setFormState] = React.useState({
    values: {
      status: "",
      reviewComments:"",
    },
    errors: {
      status: "",
      reviewComments:"",
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
        onConfirm={() => hideAlert()}
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
    setAlert(null);
  };

  React.useEffect(() => {
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

  const markFileNow = () => {
    setIsLoading(true);
    let status;
    let reviewComments;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;
    if (!Check(formState.values.status)) {
        status = "success";
    } else {
        status = "error";
        error = true;
    }
    if (!Check(formState.values.reviewComments)) {
        reviewComments = "success";
    } else {
        reviewComments = "error";
        error = true;
    }
    setFormState((formState) => ({
        ...formState,
        errors: {
            ...formState.errors,
            status: status,
            reviewComments: reviewComments,
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
            markedAs:formState.values.status,
            reviewComments: formState.values.reviewComments,
        };
        console.log(data);
        axios({
            method: "put",
            url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/markedAs`,
            data: data,
            headers: {
                cooljwt: Token,
            },
        }).then(async (response) => {
                await props.loadFiles(decoded, false);
                setIsLoading(false);
                props.closeFileReceivedModal();
            })
            .catch((error) => {
                errorAlert(
                    typeof error.response != "undefined"
                        ? error.response.data
                        : error.message
                );
            });
    }
} 

  function closeModal() {
    props.closeFileReceivedModal();
  }
  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitle}>
                            Mark Invoice:&nbsp;
                            {props.fileData.invoiceId}
                          </h4>
                        </CardIcon>
                      </CardHeader>
                      <CardBody>
                      {isLoading ? 
                      <GridItem xs={12} sm={12} md={12}>
                        <LinearProgress />  
                      </GridItem>
                      :''}
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
                            error={formState.errors.status === "error"}
                            fullWidth={true}
                            helperText={
                              formState.errors.status === "error"
                                ? "Status is required"
                                : null
                            }
                            label="Status"
                            name="status"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            select
                            value={formState.values.status || ""}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem,
                              }}
                            >
                              Choose Status
                            </MenuItem>
                            <MenuItem value="read">
                              MARK AS RECIEVED&nbsp;&nbsp;
                              <div className="fileinput text-center">
                                <div className="thumbnail img-circle3">
                                  <img src={Success} alt={"MARK AS RECIEVED"} />
                                </div>
                              </div>
                            </MenuItem>
                            <MenuItem value="correctionRequired">
                              CORRECTION REQUIRED&nbsp;&nbsp;
                              <div className="fileinput text-center">
                                <div className="thumbnail img-circle3">
                                  <img src={Pending} alt={"MARK AS REJECT"} />
                                </div>
                              </div>
                            </MenuItem>
                            <MenuItem value="rejected">
                              MARK AS REJECT&nbsp;&nbsp;
                              <div className="fileinput text-center">
                                <div className="thumbnail img-circle3">
                                  <img src={Rejected} alt={"MARK AS REJECT"} />
                                </div>
                              </div>
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
                            error={formState.errors.reviewComments === "error"}
                            fullWidth={true}
                            helperText={
                              formState.errors.reviewComments === "error"
                                ? "Comments is required"
                                : null
                            }
                            label="Received Comments"
                            name="reviewComments"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.reviewComments || ""}
                          ></TextField>
                        </GridItem>
                        <span style={{ float: "right" }}>
                            <Button
                                color="info"
                                className={classes.registerButton}
                                round
                                type="button"
                                onClick={markFileNow}
                            >
                                Mark it
                            </Button>
                            <Button
                                color="danger"
                                className={classes.registerButton}
                                onClick={closeModal}
                                round
                            >
                                Close
                            </Button>
                            </span>
                        </CardBody>
                        </Card>
                    </GridItem>
                    </GridContainer>
  );
}
