import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
// @material-ui/core components
import { makeStyles, MenuItem, TextField,CircularProgress,
Slide,
Dialog,
DialogContent,
Tooltip } from "@material-ui/core";
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
import Iframe from 'react-iframe'
import FileAdvanceView from "../Invoices/AdvanceView/FileAdvanceView";
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { validateInvoice } from "../Functions/Functions.js";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Validator from "../../Components/Timeline";
import { sendNotification, getNotification } from "actions";
import { useSelector, useDispatch } from "react-redux";

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

export default function Requested() {
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
  const [InvoiceData, setInvoiceData] = React.useState();
  const [validation, setValidation] = React.useState({});
  const [validateModal, setValidateModal] = React.useState(false);
  const dispatch = useDispatch();


  React.useEffect(() => {
    getRequests();
  }, []);

  const getInvoiceDetails = (row) => {
     axios({
       method: "get", //you can set what request you want to be
       url:  `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceOrg/${row.organizationId}`,
       data: { pagination: "1", page: "1" },
       headers: {
         cooljwt: Token,
       },
     })
       .then((response) => {
         if(response.data !== null || undefined){
             const invoice = response.data.find(invoice=>invoice.invoiceId === row.invoiceId && invoice.version === row.version);
            setIsAdvanceView(false);
            setInvoiceData(invoice);
            setAnimateTable(false);
            setIsAdvanceView(true);
            setAnimateAdvanceView(true);
         }
       });
   }

   const viewFile = (row) => {
     let Token = localStorage.getItem("cooljwt");
     let decoded = jwt.decode(Token);
     setIsViewing(false);
     setPdfModalData(row);
     setPdfUrl(
       `${process.env.REACT_APP_LDOCS_API_URL}/${row.invoicePath}/${row.invoiceId}.pdf`
     );
     
     setAnimateTable(false);
     setIsViewing(true);
     setAnimatePdf(true);
    };
    const reviewFile = async (row) => {
      setInvoiceData(row);
      validateInvoice(row, Token).then(res=>{
        setValidation(res);
      });
      setReviewModal(true);   
    }
    const ValidateFile = async (row) => {
        setInvoiceData(row);
        validateInvoice(row, Token).then(res=>{
        setAnimateTable(false);
        setValidation(res);
        setValidateModal(true);   
      });
    }
    
    const getRequests = () => {
    setIsLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoiceReview/reviewMyPending`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setData(
          response.data.map((prop, key) => {
            return {
              id: prop._id,
              fileName: prop.invoiceId,
              requestedBy: prop.requestedBy,
              reviewedBy: prop.reviewedBy,
              status:
                prop.status === "pending" ? (
                  <div className="fileinput text-center">
                    <div className="thumbnail img-circle2">
                      <img src={Pending} alt={prop.status} />
                    </div>
                  </div>
                ) : prop.status === "reviewed" ? (
                  <div className="fileinput text-center">
                    <div className="thumbnail img-circle2">
                      <img src={Success} alt={prop.status} />
                    </div>
                  </div>
                ) : prop.status === "rejected" ? (
                  <div className="fileinput text-center">
                    <div className="thumbnail img-circle2">
                      <img src={Rejected} alt={prop.status} />
                    </div>
                  </div>
                ) : (
                  <div className="fileinput text-center">
                    <div className="thumbnail img-circle2">
                      <img src={NoStatus} alt={prop.status} />
                    </div>
                  </div>
                ),
              version: prop.version,
              actions: (
                <div className="actions-right">
                  <Tooltip title="View Invoice View" aria-label="viewfile">
                    <Button
                      justIcon
                      round
                      simple
                      color="info"
                      icon={ViewModuleIcon}
                      onClick={() => getInvoiceDetails(prop)}
                      className="View"
                    >
                    <ViewModuleIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="View Invoice" aria-label="viewfile">
                    <Button
                      justIcon
                      round
                      simple
                      icon={VisibilityIcon}
                      onClick={() => viewFile(prop)}
                      color="warning"
                      className="View"
                    >
                      <VisibilityIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Validate File" aria-label="validatefile">
                    <Button
                      justIcon
                      round
                      simple
                      icon={VerifiedUserIcon}
                      onClick={() => ValidateFile(prop)}
                      color="info"
                    >
                      <VerifiedUserIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Review File" aria-label="reviewfile">
                    <Button
                      justIcon
                      round
                      simple
                      icon={RateReview}
                      onClick={() => reviewFile(prop)}
                      color="info"
                    >
                      <RateReview />
                    </Button>
                  </Tooltip>
                </div>
              ),
            };
          })
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsLoading(false);
      });
  };
const goBack = () => {
  setPdfUrl();
  setIsViewing(false);
  setValidateModal(false);
  setAnimateTable(true);
  setAnimatePdf(false);
  setAnimateAdvanceView(false);
  setIsAdvanceView(false);
  setPdfModalData("");
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
              ...InvoiceData,
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
                    successAlert("Invoice Reviewed Successfully!");
                    dispatch(sendNotification(`${InvoiceData.fileId} Invoice is Reviewed`, InvoiceData.fileOwner));
                    dispatch(getNotification());
                    setIsReviewingFile(false);
                    getRequests();
                })
                .catch((error) => {
                    console.log(
                        typeof error.response != "undefined"
                            ? error.response.data
                            : error.message
                    );
                    errorAlert('There is some issue ..');
                    setIsReviewingFile(false);
                });
        }
    } 
  return (
    <div>
      {alert}
      {validateModal ? (
                <Animated
                animationIn="bounceInRight"
                animationOut="bounceOutLeft"
                animationInDuration={1000}
                animationOutDuration={1000}
                isVisible={validateModal}
              >
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} className={classes.center}>
                    <Card>
                      <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitleText}>
                            Invoice :{" "}
                            {InvoiceData.invoiceId}
                          </h4>
                        </CardIcon>
                        <Button
                          color="danger"
                          round
                          style={{ float: "right" }}
                          className={classes.marginRight}
                          onClick={() => goBack()}
                        >
                          Go Back
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <Validator validation={validation} />
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>
              </Animated>
      ):('')}
      {reviewModal ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"sm"}
              open={reviewModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setReviewModal(false)}
              aria-labelledby="tag-modal-slide-title"
              aria-describedby="tag-modal-slide-description"
            >
              <DialogContent
                id="tag-modal-slide-description"
                className={classes.modalBody}
              >
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitle}>
                            Review Invoice:&nbsp;
                            {InvoiceData.invoiceId}
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
                        {/* {validation ? validation.IsValidate.isSame == false ? 
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
                           <Alert severity="warning">Invoice has been Modified — check it out!</Alert>
                        </GridItem>
                        :'':''} */}
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
                            onClick={() => setReviewModal(false)}
                            round
                          >
                            Close
                          </Button>
                        </span>
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )}
      {isViewing ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animatePdf}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                      Invoice :{" "}
                      {pdfModalData.fileName}
                    </h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => goBack()}
                  >
                    Go Back
                  </Button>
                </CardHeader>
                <CardBody>
                 
                   <Iframe url={pdfUrl}
                    width="100%"
                    id="myId"
                    
                    allow="print 'none'; download 'none'"
                    className="myClassname"
                    height={window.screen.height}
                    />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
       {isAdvanceView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateAdvanceView}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                      Invoice View:{" "}
                      {InvoiceData.invoiceId}
                    </h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => goBack()}
                  >
                    Go Back
                  </Button>
                </CardHeader>
                <CardBody>
                <FileAdvanceView fileData={InvoiceData} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={animateTable}
      >
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>
                    Invoice Requested For Review
                  </h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <CircularProgress disableShrink />
                ) : (
                  <ReactTable
                    data={data}
                    sortable={false}
                    columns={[
                      {
                        Header: "Invoice ID",
                        accessor: "fileName",
                      },
                      {
                        Header: "Version",
                        accessor: "version",
                      },
                      {
                        Header: "Requested By",
                        accessor: "requestedBy",
                      },
                      {
                        Header: "Reviewed By",
                        accessor: "reviewedBy",
                      },
                      {
                        Header: "Status",
                        accessor: "status",
                      },
                      {
                        Header: "Actions",
                        accessor: "actions",
                      },
                    ]}
                    defaultPageSize={10}
                    showPaginationTop
                    showPaginationBottom={false}
                    filterable={true}
                    className="-striped -highlight"
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>
    </div>
  );
}
