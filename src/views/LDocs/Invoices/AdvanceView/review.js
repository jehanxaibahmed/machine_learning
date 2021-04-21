import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
// @material-ui/core components
import { makeStyles, MenuItem, TextField,CircularProgress,
Slide,
Dialog,
DialogContent,
Tooltip, 
IconButton} from "@material-ui/core";
// @material-ui/icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import RateReview from "@material-ui/icons/RateReview";
import SweetAlert from "react-bootstrap-sweetalert";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import Pending from "assets/img/statuses/Pending.png";
import Success from "assets/img/statuses/Success.png";
import Rejected from "assets/img/statuses/Rejected.png";
import NoStatus from "assets/img/statuses/NoStatus.png";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { sendNotification, getNotification } from "actions";
import { useSelector, useDispatch } from "react-redux";
import Alert from '@material-ui/lab/Alert';
import { CallReceived, DoneAll } from "@material-ui/icons";
import { setIsTokenExpired } from "actions";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  },
  buttonRight: {},
};

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Review({close, invoiceData, actionDone}) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const classes = useStyles();
  const [isReviewingFile, setIsReviewingFile] = React.useState(false);
  const [pdfModalData, setPdfModalData] = React.useState(false);
  const [reviewModal, setReviewModal] = React.useState(false);
  const [animateTable, setAnimateTable] = React.useState(true);
  const [animatePdf, setAnimatePdf] = React.useState(false);
  const [animateAdvanceView, setAnimateAdvanceView] = React.useState(true);
  const [isViewing, setIsViewing] = React.useState(false);
  const [isAdvanceView, setIsAdvanceView] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [pdfUrl, setPdfUrl] = React.useState(false);
  const [data, setData] = React.useState();
  const [show, setShow] = React.useState(true);
  const dispatch = useDispatch();

const goBack = () => {
    };
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
    const reviewFileNow = () => {
        setIsReviewingFile(true);
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
            setIsReviewingFile(false);
            return false;
        } else {
            let data = {
              ...invoiceData,
              reviewComments: formState.values.reviewComments,
              status: formState.values.status,
            };
            axios({
                method: "post",
                url: `${process.env.REACT_APP_LDOCS_API_URL}/invoiceReview/reviewUpdate`,
                data: data,
                headers: {
                    cooljwt: Token,
                },
            }).then((response) => {
                setIsReviewingFile(false);
                actionDone();
                setFormState((formState) => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        status: '',
                        reviewComments: '',
                    }
                }));
                })
                .catch((error) => {
                  if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
                    console.log(
                        typeof error.response != "undefined"
                            ? error.response.data
                            : error.message
                    );
                });
        }
    } 
  return (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitle}>
                            Review Invoice:&nbsp;
                          </h4>
                        </CardIcon>
                      </CardHeader>
                      <CardBody>
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
                            <MenuItem value="reviewed">
                              MARK AS REVIEWED&nbsp;&nbsp;
                              <div className="fileinput text-center">
                                <div className="thumbnail img-circle3">
                                  <img src={Success} alt={"MARK AS REVIEWED"} />
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
                            label="Review Comments"
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
                            onClick={reviewFileNow}
                          >
                            Review
                          </Button>
                          {isReviewingFile ? (
                            <CircularProgress disableShrink />
                          ) : (
                            ""
                          )}
                          <Button
                            color="danger"
                            className={classes.registerButton}
                            onClick={() => close()}
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
