import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import Iframe from "react-iframe";

import { useReactToPrint } from "react-to-print";
import { Link } from "react-router-dom";
import CenterFocusWeakIcon from "@material-ui/icons/CenterFocusWeak";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import DateRangeIcon from "@material-ui/icons/DateRange";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  LinearProgress,
  Slide,
  Dialog,
  DialogContent,
  Tooltip,
  IconButton,
  Badge,
  withStyles,
  Typography,
  SwipeableDrawer,
  Chip,
  Checkbox,
  Avatar,
} from "@material-ui/core";
// @material-ui/icons
import {
  LocalOffer,
  Visibility,
  Send,
  Edit,
  EditOutlined,
} from "@material-ui/icons";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CardIcon from "components/Card/CardIcon.js";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import dateFormat from "dateformat";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import FileAdvanceView from "../AdvanceView/FileAdvanceView";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import RateReview from "@material-ui/icons/RateReview";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { addZeroes, formatDateTime } from "../../Functions/Functions";
import {
  Menu,
  Item,
  Separator,
  animation,
  MenuProvider,
  theme,
  Submenu,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import SweetAlert from "react-bootstrap-sweetalert";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import InitWorkflow from "../InitWorkflow/InitWorkflow";
import Pending_Invoice from "assets/img/statuses/Asset_1.png";
import Recieved_Invoice from "assets/img/statuses/Asset_4.png";
import UnderReview_Invoice from "assets/img/statuses/Asset_3.png";
import Approved_Invoice from "assets/img/statuses/Asset_5.png";
import Rejected_Invoice from "assets/img/statuses/Asset_6.png";
import Ready_Invoice from "assets/img/statuses/Asset_6.png";
import Pending from "assets/img/statuses/Pending.png";
import Success from "assets/img/statuses/Success.png";
import Rejected from "assets/img/statuses/Rejected.png";
import NoStatus from "assets/img/statuses/NoStatus.png";
import VerticalLinearStepper from "../../../Components/VerticalStepper";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import { useDispatch, useSelector } from "react-redux";
import ExportToFusion from "./ExportToFusion";
import Filters from "./Filters";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -7,
    top: -2,
    border: `2px solid #9E2654`,
    padding: "0 4px",
    background: "#9E2654",
  },
}))(Badge);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const TransitionRight = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});
const TransitionLeft = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function FilesList(props) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
  let isVendor = userDetail.isVendor;
  const classes = useStyles();
  const [componentName, setComponentName] = React.useState("Export To Fusion");
  const [classicModal, setClassicModal] = React.useState(false);
  const [tagModal, setTagModal] = React.useState(false);
  const [qrModal, setQrModal] = React.useState(false);
  const [taskModal, setTaskModal] = React.useState(false);
  const [reviewerModal, setReviewerModal] = React.useState(false);
  const [initWorkFlowModal, setInitWorkFlowModal] = React.useState(false);
  const [animateTable, setAnimateTable] = React.useState(true);
  const [animatePdf, setAnimatePdf] = React.useState(false);
  const [animateBlockChain, setAnimateBlockChain] = React.useState(false);
  const [animateQr, setAnimateQr] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isViewing, setIsViewing] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [isViewingBlockChainView, setIsViewingBlockChainView] = React.useState(
    false
  );
  const [pdfUrl, setPdfUrl] = React.useState(false);
  const [pdfModalData, setPdfModalData] = React.useState(false);
  const [data, setData] = React.useState();
  const [row, setRow] = React.useState();
  const [blockChainData, setBlockChainData] = React.useState(null);
  const [markAsReceivedModel, setMarkAsReceivedModel] = React.useState(false);
  const [initPaymentModel, setinitPaymentModel] = React.useState(false);
  const [exportToFusionModel, setExportToFusionModel] = React.useState(false);
  const [editInvoice, setEditInvoiceModel] = React.useState(false);
  const [decoded, setDecoded] = React.useState(null);
  const [view, setView] = React.useState("read");
  const [filesData, setFilesData] = React.useState([]);
  const [showFiltersModel, setShowFiltersModel] = React.useState(false);
  const [formState, setFormState] = React.useState({
    files:[],
    vendors:[],
    pos:[],
    filters: {
      supplierId: true,
      poNumber: true,
      date: true,
      amount: true,
      partialPaid: true,
      fullPaid: true,
      notPaid: true,
    },
    values: {
      supplierId: null,
      poNumber:null,
      submitStart: null,
      submitEnd: null,
      amountTo: null,
      amountfrom: null,
      partialPaid: false,
      fullPaid: false,
      notPaid: false,
    },
  });

  const getPos = () => {
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/po/getPoc`,
      headers: {
        cooljwt: Token,
      },
    })
      .then((res) => {
        setFormState((formState) => ({
          ...formState,
          pos:res.data
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getVendors = () => {
    let userDetails = jwt.decode(Token);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorsByOrganization/${userDetails.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          vendors: response.data,
        }));
      }).catch((err)=>{
        console.log(err);
      })
}
  //View File
  const viewFile = (row) => {
    setIsViewing(false);
    setPdfModalData(row);
    setPdfUrl(
      `${process.env.REACT_APP_LDOCS_API_URL}/${row.invoicePath}/${row.invoiceId}.pdf`
    );
    setIsViewing(true);
    setAnimateTable(false);
    setAnimatePdf(true);
  };
  const setFilter = (data) => {
    setFormState((formState) => ({
      ...formState,
      values: data.values,
      filters: data.filters,
    }));
    let files = formState.files;
    if (
      data.filters.supplierId &&
      data.values.supplierId
    ) {
      files = files.filter(
        (file) =>
          file.vendorId == data.values.supplierId
      );
    }

    if (
      data.filters.poNumber &&
      data.values.poNumber
    ) {
      files = files.filter(
        (file) =>
          file.po == data.values.poNumber
      );
    }

    if (
      data.filters.amount &&
      data.values.amountTo >= 1 &&
      data.values.amountfrom >= 1
    ) {
      files = files.filter(
        (file) =>
          file.netAmt <= parseInt(data.values.amountTo) &&
          file.netAmt >= parseInt(data.values.amountfrom)
      );
    }

    if (
      (data.filters.date && data.values.submitEnd !== null) ||
      (undefined && data.values.submitStart !== null) ||
      undefined
    ) {
      var endDate = new Date(data.values.submitEnd);
      endDate.setDate(endDate.getDate() + 1);
      files = files.filter(
        (file) =>
          new Date(file.createdDate) >= new Date(data.values.submitStart) &&
          new Date(file.createdDate) <= new Date(endDate)
      );
    }

    if (data.filters.partialPaid && data.values.partialPaid) {
      files = files.filter((file) => file.paymentStatus == "partial");
    }

    if (data.filters.fullPaid && data.values.fullPaid) {
      files = files.filter((file) => file.paymentStatus == "full");
    }

    if (data.filters.notPaid && data.values.notPaid) {
      files = files.filter((file) => file.paymentStatus == "pending");
    }
    setFilesData(files.reverse());
    setTableData(files.reverse());
    setShowFiltersModel(false);
  };
  //Open BlockChainView
  const viewBlockChainView = (row) => {
    setIsViewingBlockChainView(false);
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/invoice-workflow-history/${row.invoiceId}-${row.version}`,
    }).then((response) => {
      if (response.data.length !== 0) {
        setBlockChainData(response.data);
        setIsViewingBlockChainView(true);
        setAnimateTable(false);
        setAnimateBlockChain(true);
      }
    });
  };
  //Open Advance View
  const viewQrView = (row) => {
    setRow(row);
    setQrModal(true);
    setAnimateTable(false);
    setAnimateQr(true);
  };
  //Close Views
  const goBack = () => {
    setPdfUrl();
    setQrModal(false);
    setIsViewing(false);
    setIsViewingBlockChainView(false);
    setAnimateTable(true);
    setAnimatePdf(false);
    setAnimateBlockChain(false);
    setAnimateQr(false);
    setPdfModalData("");
  };
  //Use Effect Hook
  React.useEffect(() => {
    let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
    getPos();
    getVendors();
    setDecoded(userDetail);
    getMyFiles(userDetail, true);
  }, []);

  const setTableData = (response) => {
    setData(
      response.map((prop, index) => {
        let isSelected = selected.includes(`${prop.invoiceId}-${prop.version}`);
        return {
          id: prop._id,
          invoiceId: prop.invoiceId,
          status: (
            <MenuProvider data={prop} id="menu_id">
              {prop.markedAs == "unread" ? (
                <Chip
                  style={{ background: "#deb725", color: "#fff" }}
                  label="Pending"
                />
              ) : prop.markedAs == "read" ? (
                <Chip label="Received" color="primary" />
              ) : prop.markedAs == "rejected" ? (
                <Chip color="secondary" label="Rejected" />
              ) : (
                ""
              )}
            </MenuProvider>
          ),
          createdDate: (
            <MenuProvider data={prop} id="menu_id">
              {formatDateTime(prop.createdDate)}
            </MenuProvider>
          ),
          dueDate: (
            <MenuProvider data={prop} id="menu_id">
              {formatDateTime(prop.dueDate)}
            </MenuProvider>
          ),
          vendorName: (
            <MenuProvider data={prop} id="menu_id">
              {prop.vendorName}
            </MenuProvider>
          ),
          approvedDate:(
            <MenuProvider data={prop} id="menu_id">
              {formatDateTime(prop.approved)}
            </MenuProvider>
          ),
          requester:(
            <MenuProvider data={prop} id="menu_id">
              {fileData.createdByVendor ? 'Supplier' : fileData.createdBy.split('@')[0]}
            </MenuProvider>
          ),
          poNumber:(
            <MenuProvider data={prop} id="menu_id">
              {prop.po}
            </MenuProvider>
          ),
          customerName: (
            <MenuProvider data={prop} id="menu_id">
              {prop.organizationName}
            </MenuProvider>
          ),
          netAmt: (
            <MenuProvider data={prop} id="menu_id">
              {`${prop.FC_currency.sign}${addZeroes(prop.netAmt)}`}
            </MenuProvider>
          ),
          version: (
            <MenuProvider data={prop} id="menu_id">
              {prop.version}
            </MenuProvider>
          ),
          reviewed: (
            <MenuProvider data={prop} id="menu_id">
              {prop.reviewStatus == "pending" ? (
                <div className="fileinput text-center">
                  <div className="thumbnail img-circle2">
                    <img src={Pending} alt={prop.reviewStatus} />
                  </div>
                </div>
              ) : prop.reviewStatus == "reviewed" ? (
                <div className="fileinput text-center">
                  <div className="thumbnail img-circle2">
                    <img src={Success} alt={prop.reviewStatus} />
                  </div>
                </div>
              ) : prop.reviewStatus == "rejected" ? (
                <div className="fileinput text-center">
                  <div className="thumbnail img-circle2">
                    <img src={Rejected} alt={prop.reviewStatus} />
                  </div>
                </div>
              ) : (
                <div className="fileinput text-center">
                  <div className="thumbnail img-circle2">
                    <img src={NoStatus} alt={prop.reviewedStatus} />
                  </div>
                </div>
              )}
            </MenuProvider>
          ),
          approved: (
            <MenuProvider data={prop} id="menu_id">
              {prop.approveStatus == "pending" ? (
                <div className="fileinput text-center">
                  <div className="thumbnail img-circle2">
                    <img src={Pending} alt={prop.approvedstatus} />
                  </div>
                </div>
              ) : prop.approveStatus == "approved" ? (
                <div className="fileinput text-center">
                  <div className="thumbnail img-circle2">
                    <img src={Success} alt={prop.approvedstatus} />
                  </div>
                </div>
              ) : prop.approveStatus == "rejected" ? (
                <div className="fileinput text-center">
                  <div className="thumbnail img-circle2">
                    <img src={Rejected} alt={prop.approvedstatus} />
                  </div>
                </div>
              ) : (
                <div className="fileinput text-center">
                  <div className="thumbnail img-circle2">
                    <img src={NoStatus} alt={prop.approvedstatus} />
                  </div>
                </div>
              )}
            </MenuProvider>
          ),
          select: (
            <div className="actions">
              <Checkbox checked={isSelected} onChange={() => select(prop)} />
            </div>
          ),
          actions: (
            <div className="actions-right">
              <Tooltip title="View File" aria-label="viewfile">
                <Button
                  justIcon
                  round
                  simple
                  icon={Visibility}
                  onClick={() => {
                    viewFile(prop);
                  }}
                  color="danger"
                  className="Edit"
                >
                  <Visibility />
                </Button>
              </Tooltip>
              <Tooltip title="BlockChain View" aria-label="blockChainView">
                <Button
                  justIcon
                  round
                  simple
                  icon={ClearAllIcon}
                  onClick={() => {
                    viewBlockChainView(prop);
                  }}
                  color="info"
                  className="Edit"
                >
                  <ClearAllIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Invoice View" aria-label="advanceDocumentView">
                <Button
                  justIcon
                  round
                  simple
                  icon={ViewModuleIcon}
                  onClick={() => {
                    viewQrView(prop);
                  }}
                  color="info"
                  className="Edit"
                >
                  <ViewModuleIcon />
                </Button>
              </Tooltip>
            </div>
          ),
        };
      })
    );
  };
  //Get Files
  const getMyFiles = async (user, loading) => {
    setIsLoading(loading);
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceTenant/${user.tenantId}`,
      data: { pagination: "30", page: "1" },
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          files: response.data.filter((f) => f.approveStatus == "approved"),
        }));
        setFilesData(
          response.data.filter((f) => f.approveStatus == "approved")
        );
        setTableData(
          response.data.filter((f) => f.approveStatus == "approved")
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
  const sweetClass = sweetAlertStyle();
  const [alert, setAlert] = React.useState(null);
  //Msg Alert
  const msgAlert = (msg) => {
    setAlert(
      <SweetAlert
        alert
        style={{ display: "block", marginTop: "-100px" }}
        title="Info!"
        onConfirm={() => hideErrorAlert()}
        onCancel={() => hideErrorAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.info}
      >
        {msg}
      </SweetAlert>
    );
  };
  const hideErrorAlert = () => {
    setAlert(null);
  };
  const select = (invoice) => {
    let selectedInvoices = selected;
    if (!invoice) {
      if (selected.length == filesData.length) {
        selectedInvoices = [];
      } else {
        filesData.map((file) => {
          if (!selected.includes(`${file.invoiceId}-${file.version}`)) {
            selectedInvoices.push(`${file.invoiceId}-${file.version}`);
          }
        });
      }
    } else {
      console.log("Select");
      if (!selected.includes(`${invoice.invoiceId}-${invoice.version}`)) {
        selectedInvoices.push(`${invoice.invoiceId}-${invoice.version}`);
      } else {
        const index = selectedInvoices.indexOf(
          `${invoice.invoiceId}-${invoice.version}`
        );
        if (index > -1) {
          selectedInvoices.splice(index, 1);
        }
      }
    }
    setSelected(selectedInvoices);
    console.log(selectedInvoices.length);
    setTableData(filesData);
  };
  React.useEffect(() => {
    setTableData(filesData);
  }, [selected.length]);

  //Set File Data
  const [fileData, setFileData] = React.useState();
  const [type, setType] = React.useState("");
  //Open Advance View From through Awesome Menu
  const viewQrViewFromAwesomeMenu = ({ event, props }) => {
    viewQrView(props);
  };
  //Open BlockChain View From through Awesome Menu
  const viewBlockChainViewFromAwesomeMenu = ({ event, props }) => {
    viewBlockChainView(props);
  };
  //Right Click Menu
  const MyAwesomeMenu = () => (
    <Menu id="menu_id" theme={theme.dark} animation={animation.zoom}>
      {!isVendor ? (
        <Item onClick={viewBlockChainViewFromAwesomeMenu}>
          <ClearAllIcon />
          &nbsp;&nbsp;BlockChain View
        </Item>
      ) : (
        ""
      )}
      <Separator />
      <Item onClick={viewQrViewFromAwesomeMenu}>
        <ViewModuleIcon />
        &nbsp;&nbsp;Invoice View
      </Item>
    </Menu>
  );
  return (
    <div>
      {alert}
      {/* View File */}
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
                      Invoice:{" "}
                      {pdfModalData.invoiceId +
                        " Version: " +
                        pdfModalData.version}
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
                  <Iframe
                    url={pdfUrl}
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
      {/* Open BlockChain View */}
      {isViewingBlockChainView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateBlockChain}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>Blockchain View</h4>
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
                  <VerticalLinearStepper data={blockChainData} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}

      {/* Mark As Payment Model */}
      {exportToFusionModel ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"sm"}
              scroll="body"
              open={exportToFusionModel}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setExportToFusionModel(false)}
              aria-labelledby="tag-modal-slide-title"
              aria-describedby="tag-modal-slide-description"
            >
              <DialogContent
                id="tag-modal-slide-description"
                className={classes.modalBody}
              >
                <ExportToFusion
                  closeModal={() => setExportToFusionModel(false)}
                  fileData={row}
                  loadFiles={getMyFiles}
                />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )}
      {qrModal ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateQr}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>Invoice View</h4>
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
                  <FileAdvanceView isVendor={isVendor} fileData={row} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}

      {animateTable ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateTable}
        >
          {/* Awesome Menu */}
          <MyAwesomeMenu />
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    {/* <Store /> */}
                    <InsertDriveFileIcon />
                  </CardIcon>
                  <p className={classes.cardCategory}>Total Invoices</p>
                  <h3 className={classes.cardTitle}>70</h3>
                </CardHeader>
                <CardFooter stats>
                  <div style={{height:'62px'}} className={classes.stats}>
                    <InsertDriveFileIcon />
                    <Link>Show All Invoices</Link>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    {/* <Store /> */}
                    <InsertDriveFileIcon />
                  </CardIcon>
                  <p className={classes.cardCategory}>Payment in Process</p>
                  <h3 className={classes.cardTitle}>50</h3>
                </CardHeader>
                <CardFooter  stats>
                  <div style={{height:'62px'}} className={classes.stats}>
                    <InsertDriveFileIcon />
                    <Link>Show Payment in Proccess Invoices</Link>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <CenterFocusWeakIcon />
                  </CardIcon>
                  <p className={classes.cardCategory}>Payment Due</p>
                  <h3 className={classes.cardTitle}>15</h3>
                </CardHeader>
                <CardFooter stats>
                  <div
                 
                  className={classes.stats}
                  >
                    <Tooltip title="Today">
                    <IconButton >
                        <Avatar>T</Avatar>
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Tomorrow">
                    <IconButton>
                        <Avatar>TM</Avatar>
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Weekly">
                    <IconButton>
                        <Avatar>W</Avatar>
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Fornightly">
                    <IconButton>
                        <Avatar>F</Avatar>
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Monthly">
                    <IconButton>
                        <Avatar>M</Avatar>
                    </IconButton>
                    </Tooltip>
                    {/* <CenterFocusWeakIcon />
                    <Link to="#">Show Payment Due Invoices</Link> */}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <CenterFocusStrongIcon />
                  </CardIcon>
                  <p className={classes.cardCategory}>Over Due</p>
                  <h3 className={classes.cardTitle}>5</h3>
                </CardHeader>
                <CardFooter stats>
                  <div style={{height:'62px'}} className={classes.stats}>
                    <CenterFocusStrongIcon />
                    <Link to="#">Show Over Due Invoices</Link>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>{componentName}</h4>
                  </CardIcon>
                  <p style={{ color: "gray" }}>
                    Note: Right click on any file to see multiple options
                  </p>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => setShowFiltersModel(true)}
                  >
                    Filters
                  </Button>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => msgAlert("Working on this feature")}
                  >
                    Export to Fusion ({selected.length})
                  </Button>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <LinearProgress />
                  ) : (
                    <ReactTable
                      data={data}
                      sortable={false}
                      columns={[
                        {
                          Header: (
                            <Checkbox
                              checked={filesData.length == selected.length}
                              onChange={() => select()}
                            />
                          ),
                          accessor: "select",
                          disableSortBy: false,
                        },
                        {
                          Header: "Invoice ID",
                          accessor: "invoiceId",
                          filterable: true,
                          filter: "fuzzyText",
                        },
                        {
                          Header: "Submit Date",
                          accessor: "createdDate",
                        },
                        {
                          Header: "Due Date",
                          accessor: "dueDate",
                        },
                        {
                          Header: "Supplier Name",
                          accessor: "vendorName",
                        },
                        {
                          Header: "Po Number",
                          accessor: "poNumber",
                        },
                        {
                          Header: "Amount",
                          accessor: "netAmt",
                        },
                        {
                          Header: "Actions",
                          accessor: "actions",
                          filterable: false,
                        },
                      ]}
                      defaultPageSize={10}
                      showPaginationTop
                      showPaginationBottom={true}
                      className="-striped -highlight"
                    />
                  )}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
      <SwipeableDrawer
        anchor={"right"}
        open={showFiltersModel}
        onClose={() => setShowFiltersModel(false)}
        // onOpen={}
      >
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={showFiltersModel}
        >
          <Filters
            filters={formState.filters}
            values={formState.values}
            vendors={formState.vendors}
            pos={formState.pos}
            closeModal={() => setShowFiltersModel(false)}
            setFilters={setFilter}
            isVendor={isVendor}
          />
        </Animated>
      </SwipeableDrawer>
    </div>
  );
}
