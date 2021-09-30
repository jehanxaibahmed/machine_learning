import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

import Iframe from "react-iframe";

import { useReactToPrint } from "react-to-print";

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
} from "@material-ui/core";
// @material-ui/icons
import {
  LocalOffer,
  Visibility,
  Send,
  Edit,
  EditOutlined,
  Refresh,
  GetApp,
} from "@material-ui/icons";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import RefreshIcon from "@material-ui/icons/Refresh";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import dateFormat from "dateformat";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import FileTags from "./FileTags";
import FileTasks from "./FileTasks";
import FileAdvanceView from "../AdvanceView/FileAdvanceView";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import RateReview from "@material-ui/icons/RateReview";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import Filters from "./Filters";
import {
  addZeroes,
  currentTracking,
  formatDate,
  formatDateTime,
} from "views/LDocs/Functions/Functions";
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
import Swal from "sweetalert2";
import {
  successAlert,
  errorAlert,
  msgAlert,
} from "views/LDocs/Functions/Functions";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import InitWorkflow from "../InitWorkflow/InitWorkflow";
import Pending_Invoice from "assets/img/statuses/Asset_1.png";
import Recieved_Invoice from "assets/img/statuses/Asset_4.png";
import UnderReview_Invoice from "assets/img/statuses/Asset_3.png";
import Approved_Invoice from "assets/img/statuses/Asset_5.png";
import Rejected_Invoice from "assets/img/statuses/Asset_6.png";
import Resubmit_Invoice from "assets/img/statuses/Asset_7.png";
import Ready_Invoice from "assets/img/statuses/Asset_2.png";
import Pending from "assets/img/statuses/Pending.png";
import Success from "assets/img/statuses/Success.png";
import Rejected from "assets/img/statuses/Rejected.png";
import NoStatus from "assets/img/statuses/NoStatus.png";
import VerticalLinearStepper from "../../../Components/VerticalStepper";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import { useDispatch, useSelector } from "react-redux";
import FileReceived from "./FileReceived";
import InitiatePayment from "./InitiatePayment";
import { partial } from "lodash";
import CreateInvoice from "../CreateInvoice/CreateInvoice";
import ExportToFusion from "./ExportToFusion";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { setIsTokenExpired } from "actions";

//Filters
const filters = [
  { id: "unread", value: "Pending for Acceptance", id: 1 },
  { id: "read", value: "Accepted (Initially Reviewed)", id: 2 },
  { id: "rejected", value: "Pending for Review", id: 3 },
  { id: "pending", value: "Reviewed", id: 4 },
  { id: "reviewed", value: "Pending For Approval", id: 5 },
  { id: "rejected", value: "Approved", id: 6 },
  { id: "pending", value: "Correction Required", id: 7 },
  { id: "approved", value: "Rejected ", id: 8 },
];

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  },
};

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
  const dispatch = useDispatch();
  let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
  let isVendor = userDetail.isVendor;
  const classes = useStyles();
  const [componentName, setComponentName] = React.useState("Invoices");
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
  const [showFiltersModel, setShowFiltersModel] = React.useState(false);
  const [filesData, setFilesData] = React.useState([]);
  const [editHandler, setEdithandler] = React.useState(null);
  const [formState, setFormState] = React.useState({
    filters: {
      status: true,
      date: true,
      amount: true,
      partialPaid: true,
      fullPaid: true,
      notPaid: true,
      invoiceType: true,
    },
    values: {
      status: [],
      submitStart: null,
      submitEnd: null,
      amountTo: null,
      amountfrom: null,
      partialPaid: false,
      fullPaid: false,
      notPaid: false,
      invoiceType: null,
    },
  });

  //Add File Tags
  const addFileTags = (row) => {
    setRow(row);
    setTagModal(true);
  };
  //Mark as Received
  const markAsReceived = (row) => {
    setRow(row);
    setMarkAsReceivedModel(true);
  };
  //Payment as Received
  const initPayment = (row) => {
    setRow(row);
    setinitPaymentModel(true);
  };
  const exportToFusion = (row) => {
    setRow(row);
    setExportToFusionModel(true);
  };
  //Edit Invoice
  const editSelectedInvoice = (row, i) => {
    //if i = 1 ? Edit
    //if i = 2 ? Resubmission
    setEdithandler(i);
    setRow(row);
    setAnimateTable(false);
    setEditInvoiceModel(true);
  };
  //Add File Tasks
  const addFileTasks = (row) => {
    setRow(row);
    setTaskModal(true);
  };
  //View File
  const viewFile = (row) => {
    setIsViewing(false);
    setPdfModalData(row);
    setPdfUrl(
      `${process.env.REACT_APP_LDOCS_API_URL}/${row.invoicePath}/${row.invoiceId}.pdf`
      // 'http://localhost:8025/Tenants/19881545-1519-4a39-a8c6-9442e81098d1/60097b478057a239384abad5/601a8a3b65c1c4271439d998/101-ORGONE/1/101-ORGONE.pdf'
    );
    setIsViewing(true);
    setAnimateTable(false);
    setAnimatePdf(true);
  };
  //Open BlockChainView
  const viewBlockChainView = (row) => {
    setIsViewingBlockChainView(false);
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/invoiceWorkflow/get-invoice-workflow-history/${row.vendorId}-${row.invoiceId}-${row.version}`,
    }).then((response) => {
      if (response.data.InvoiceWorkflowHistory.length !== 0) {
        let blockChainData = response.data.InvoiceWorkflowHistory;
        setBlockChainData(blockChainData);
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
    getMyFiles(userDetail, false);
    setAnimateTable(true);
    setAnimatePdf(false);
    setAnimateBlockChain(false);
    setAnimateQr(false);
    setPdfModalData("");
  };
  //Use Effect Hook
  React.useEffect(() => {
    let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
    setDecoded(userDetail);
    // let path = props.history.location.pathname;
    // if (path == "/admin/invoices") {
    //   setComponentName("Invoices");
    // }
    getMyFiles(userDetail, true);
  }, []);

  const setTableData = (response) => {
    let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
    let isVendor = userDetail.isVendor;

    setData(
      response.reverse().map((prop, key) => {
        var currentStatus = currentTracking(prop.trackingStatus);
        console.log(currentStatus);
        let isSubmitedByVendor =
          !prop.initWorkFLow && !isVendor && prop.markedAs == "unread";
        let isCorrectionRequiredInWorkflow =
          !isVendor && prop.workFlowStatus == "correctionRequired";
        return {
          id: prop._id,
          invoiceId: prop.invoiceId,
          status: (
            <MenuProvider data={prop} id="menu_id">
              {/* {isVendor ? ( */}
              {currentStatus.status == "rejected" ? (
                <Tooltip title="REJECTED">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="REJECTED"
                    clickable
                    color="secondary"
                  />
                </Tooltip>
              ) : (currentStatus.status == "correctionRequired" &&
                  currentStatus.val == 1) ||
                isCorrectionRequiredInWorkflow ? (
                <Tooltip title="SENT FOR CORRECTION">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="SENT FOR CORRECTION"
                    clickable
                    style={{ border: "orange 1px solid", color: "orange" }}
                  />
                </Tooltip>
              ) : currentStatus.status == "rejected" ? (
                <Tooltip title="REJECTED">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="REJECTED"
                    clickable
                    color="secondary"
                  />
                </Tooltip>
              ) : prop.trackingStatus.paid.status == "partial" ? (
                <Tooltip title="PARTIALLY PAID">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="PARTIALLY PAID"
                    clickable
                    style={{
                      border: "lightgreen 1px solid",
                      color: "lightgreen",
                    }}
                  />
                </Tooltip>
              ) : prop.trackingStatus.paid.status == "completed" ? (
                <Tooltip title="FULLY PAID">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="FULLY PAID"
                    clickable
                    style={{ border: "green 1px solid", color: "green" }}
                  />
                </Tooltip>
              ) : currentStatus.status == "readyToPay" ? (
                <Tooltip title="READY TO PAY">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="READY TO PAY"
                    clickable
                    style={{ border: "orange 1px solid", color: "orange" }}
                  />
                </Tooltip>
              ) : currentStatus.val == 0 ? (
                <Tooltip title="PENDING">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="PENDING"
                    clickable
                    style={{ border: "orange 1px solid", color: "orange" }}
                  />
                </Tooltip>
              ) : currentStatus.val == 1 ? (
                <Tooltip title="UNDER INITIAL REVIEW">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="INITIAL REVIEW"
                    clickable
                    color="primary"
                  />
                </Tooltip>
              ) : currentStatus.val == 2 ? (
                <Tooltip title="UNDER REVIEW">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="UNDER REVIEW"
                    clickable
                    color="primary"
                  />
                </Tooltip>
              ) : currentStatus.val == 3 ? (
                <Tooltip title="UNDER APPROVAL">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="UNDER APPROVAL"
                    clickable
                    color="primary"
                  />
                </Tooltip>
              ) : currentStatus.val == 4 ? (
                <Tooltip title="DONE">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="APPROVAL DONE"
                    clickable
                    style={{ border: "green 1px solid", color: "green" }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="NO STATUS">
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
                    label="NO STATUS"
                    clickable
                    color="primary"
                  />
                </Tooltip>
              )
              /* ) : prop.markedAs == "unread" ? (
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
              )} */
              }
            </MenuProvider>
          ),
          po: prop.po,
          invoiceType: prop.isPrePayment
            ? "Pre-Payment"
            : prop.isPettyCash
            ? "Petty Cash"
            : prop.isReceipt
            ? "With Receipt"
            : "",
          createdDate: (
            <MenuProvider data={prop} id="menu_id">
              {formatDateTime(prop.createdDate)}
            </MenuProvider>
          ),
          date: (
            <MenuProvider data={prop} id="menu_id">
              {formatDate(prop.dueDate)}
            </MenuProvider>
          ),
          vendorName: (
            <MenuProvider data={prop} id="menu_id">
              {prop.vendorName}
            </MenuProvider>
          ),
          customerName: (
            <MenuProvider data={prop} id="menu_id">
              {prop.organizationName}
            </MenuProvider>
          ),
          netAmt: (
            <MenuProvider data={prop} id="menu_id">
              <Tooltip
                title={`${prop.LC_currency.Code} 1 ≈ ${prop.FC_currency.Code} ${
                  prop.conversionRate
                    ? parseFloat(prop.conversionRate).toFixed(4)
                    : ""
                }`}
                aria-label="conversionRate"
              >
                <div>
                  {`${prop.FC_currency.Code} ${addZeroes(prop.netAmt)}`}
                  <br />
                  {prop.FC_currency && prop.LC_currency
                    ? prop.FC_currency._id !== prop.LC_currency._id
                      ? `(${prop.LC_currency.Code || ""} ${prop.netAmt_bc ||
                          "0.00"})`
                      : ""
                    : ""}
                </div>
              </Tooltip>
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
              <Tooltip title="Add Task" aria-label="addtask">
                <Button
                  justIcon
                  round
                  simple
                  icon={PlaylistAddIcon}
                  onClick={() => {
                    addFileTasks(prop);
                  }}
                  color="info"
                  className="Edit"
                >
                  <PlaylistAddIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Add Tags" aria-label="addtags">
                <Button
                  justIcon
                  round
                  simple
                  icon={LocalOffer}
                  onClick={() => {
                    addFileTags(prop);
                  }}
                  color="info"
                  className="Edit"
                >
                  <LocalOffer />
                </Button>
              </Tooltip>
              {prop.initWorkFlow && !isVendor ? (
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
              ) : (
                ""
              )}
              {!isVendor ? (
                <>
                  <Tooltip title="XLRS FILE" aria-label="export">
                    <Button
                      justIcon
                      round
                      simple
                      icon={GetApp}
                      onClick={() => {
                        exportToCSV(prop);
                      }}
                      color="info"
                      className="Edit"
                    >
                      <GetApp />
                    </Button>
                  </Tooltip>
                  {/* <Tooltip title="Init Workflow" aria-label="initWorkflow">
                    <Button
                      justIcon
                      round
                      simple
                      icon={<Send />}
                      onClick={() => {
                        initWorkFLow({event ,props });
                      }}
                      color="info"
                      className="Edit"
                    >
                      <Send />
                    </Button>
                  </Tooltip> */}
                </>
              ) : (
                ""
              )}
              <Tooltip title="360&#176; View" aria-label="advanceDocumentView">
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
              {/* {isCorrectionRequiredInWorkflow && prop.createdByVendor ? (
                <Tooltip
                  title={
                    isSubmitedByVendor
                      ? "Mark as Received"
                      : isCorrectionRequiredInWorkflow
                      ? "Send for Correction"
                      : "Mark as Received"
                  }
                  aria-label="received"
                >
                  <Button
                    justIcon
                    round
                    simple
                    icon={RateReview}
                    onClick={() => markAsReceived(prop)}
                    color="info"
                  >
                    <RateReview />
                  </Button>
                </Tooltip>
              ) : (
                ""
              )} */}
              {currentStatus.val == 1 &&
              prop.workFlowStatus != "correctionRequired" &&
              currentStatus.status == "inProgress" &&
              prop.createdByVendor &&
              !isVendor ? (
                <Tooltip title={"Edit Invoice"} aria-label="received">
                  <Button
                    justIcon
                    round
                    simple
                    icon={EditOutlined}
                    onClick={() => editSelectedInvoice(prop, 1)}
                    color="info"
                  >
                    <EditOutlined />
                  </Button>
                </Tooltip>
              ) : (
                ""
              )}

              {prop.markedAs !== "rejected" &&
              prop.workFlowStatus == "correctionRequired" &&
              !isVendor ? (
                // && !prop.createdByVendor &&
                <React.Fragment>
                  {/* <Tooltip title="RE SUBMIT" >
                  <Button
                    justIcon
                    round
                    simple
                    icon={RefreshIcon}
                    onClick={() => editSelectedInvoice(prop, 2)}
                    color="info"
                  >
                    <RefreshIcon />
                  </Button>
                </Tooltip> */}
                  <Tooltip title={"Edit Invoice"} aria-label="received">
                    <Button
                      justIcon
                      round
                      simple
                      icon={EditOutlined}
                      onClick={() => editSelectedInvoice(prop, 1)}
                      color="info"
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                </React.Fragment>
              ) : (
                ""
              )}
              {currentStatus.val == 1 &&
              currentStatus.status == "correctionRequired" &&
              // && !prop.createdByVendor
              isVendor ? (
                <Tooltip title="RE SUBMIT">
                  <Button
                    justIcon
                    round
                    simple
                    icon={RefreshIcon}
                    onClick={() => editSelectedInvoice(prop, 2)}
                    color="info"
                  >
                    <RefreshIcon />
                  </Button>
                </Tooltip>
              ) : (
                ""
              )}
              {/* {prop.approveStatus == "approved" && !isVendor ? (
                <React.Fragment>
                  <Tooltip title="Initiate Payment" aria-label="initPayment">
                    <Button
                      justIcon
                      round
                      simple
                      icon={MonetizationOnIcon}
                      onClick={() => initPayment(prop)}
                      color="info"
                    >
                      <MonetizationOnIcon />
                    </Button>
                  </Tooltip> */}
              {/* {!prop.exported && !isVendor ? (
                    <Tooltip title="Export to Fusion" aria-label="export">
                      <Button
                        justIcon
                        round
                        simple
                        icon={ExitToAppIcon}
                        onClick={() => exportToFusion(prop)}
                        color="info"
                      >
                        <ExitToAppIcon />
                      </Button>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                 </React.Fragment>
              ) : (
                ""
              )} */}
            </div>
          ),
        };
      })
    );
  };
  const exportToCSV = (file) => {
    console.log(file);
    axios({
      method: "post", //you can set what request you want to be
      url:
        file == undefined
          ? `${process.env.REACT_APP_LDOCS_API_URL}/report/ExportToCsv`
          : `${process.env.REACT_APP_LDOCS_API_URL}/report/InvoiceToXlsx`,
      data:
        file == undefined
          ? { organizationId: userDetail?.orgDetail?.organizationId }
          : {
              tenantId: file.tenantId,
              organizationId: file.organizationId,
              invoiceId: file.invoiceId,
              version: file.version,
            },
      headers: {
        cooljwt: Token,
        // responseType: 'blob',
      },
    })
      .then((response) => {
        console.log(response);
        const downloadUrl = `${process.env.REACT_APP_LDOCS_API_URL}/${response.data.path}`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", ""); //any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Get Files
  const getMyFiles = async (user, loading) => {
    setIsLoading(loading);
    axios({
      method: "get", //you can set what request you want to be
      url: user.isVendor
        ? `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceByVendor`
        : user.isTenant
        ? `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceTenant/${user.tenantId}`
        : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceOrg/${user.orgDetail.organizationId}`,
      data: { pagination: "30", page: "1" },
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        setFilesData(user.isVendor ? response.data.result : response.data);
        setTableData(user.isVendor ? response.data.result : response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
        }
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsLoading(false);
      });
  };

  //Close Models
  const closeTagModal = () => {
    setTagModal(false);
  };
  //Close Models
  const closeMarkAsReceivedModel = () => {
    setMarkAsReceivedModel(false);
  };
  const closePaymentModel = () => {
    setinitPaymentModel(false);
  };
  const closeInvoiceModel = () => {
    setEditInvoiceModel(null);
    setEditInvoiceModel(false);
    setAnimateTable(true);
  };
  const closeTaskModal = () => {
    setTaskModal(false);
  };
  const closeQrModal = () => {
    setQrModal(false);
  };
  const setFilter = (data) => {
    setFormState((formState) => ({
      ...formState,
      values: data.values,
      filters: data.filters,
    }));
    let files = filesData;
    if (
      data.filters.status &&
      data.values.status.length != 0 &&
      !data.values.status.includes(0)
    ) {
      const statusFilter = filters.filter((f) =>
        data.values.status.includes(f.id)
      );
      var filteredFiles = [];
      files.map((f) => {
        //If !Vendor Use These Statuses & f = Invoice
        if (!isVendor) {
          statusFilter.map((s) => {
            //s = Filter Status
            const currentStatus = currentTracking(f.trackingStatus);
            //Waiting for Acceptance
            if (
              s.id == 1 &&
              currentStatus.val == 1 &&
              currentStatus.status == "inProgress"
            ) {
              if (filteredFiles.find((fi) => fi._id == f._id) == undefined) {
                //fi == If !exit in Filtered Files Push else !
                filteredFiles.push(f);
              }
            }
            //Accepted Intial Review
            if (
              s.id == 2 &&
              currentStatus.val == 2 &&
              currentStatus.status == "inProgress"
            ) {
              if (filteredFiles.find((fi) => fi._id == f._id) == undefined) {
                //fi == If !exit in Filtered Files Push else !
                filteredFiles.push(f);
              }
            }
            //Pending Review
            if (
              s.id == 3 &&
              currentStatus.val == 2 &&
              currentStatus.status == "inProgress"
            ) {
              if (filteredFiles.find((fi) => fi._id == f._id) == undefined) {
                //fi == If !exit in Filtered Files Push else !
                filteredFiles.push(f);
              }
            }
            //Reviewed
            if (
              s.id == 4 &&
              currentStatus.val == 3 &&
              currentStatus.status == "inProgress"
            ) {
              if (filteredFiles.find((fi) => fi._id == f._id) == undefined) {
                //fi == If !exit in Filtered Files Push else !
                filteredFiles.push(f);
              }
            }
            //Pending Approval
            if (
              s.id == 5 &&
              currentStatus.val == 3 &&
              currentStatus.status == "inProgress"
            ) {
              if (filteredFiles.find((fi) => fi._id == f._id) == undefined) {
                //fi == If !exit in Filtered Files Push else !
                filteredFiles.push(f);
              }
            }
            //Approved
            if (
              s.id == 6 &&
              currentStatus.val == 3 &&
              currentStatus.status == "completed"
            ) {
              if (filteredFiles.find((fi) => fi._id == f._id) == undefined) {
                //fi == If !exit in Filtered Files Push else !
                filteredFiles.push(f);
              }
            }
            //Correction Required
            if (
              (s.id == 7 && currentStatus.status == "correctionRequired") ||
              f.workFlowStatus == "correctionRequired"
            ) {
              if (filteredFiles.find((ff) => ff._id == f._id) == undefined) {
                filteredFiles.push(f);
              }
            }
            //Rejected
            if (s.id == 8 && currentStatus.status == "rejected") {
              if (filteredFiles.find((ff) => ff._id == f._id) == undefined) {
                filteredFiles.push(f);
              }
            }
          });
        } else {
          data.values.status.map((s) => {
            if (f.organizationId == s) {
              filteredFiles.push(f);
            }
          });
        }
      });
      files = filteredFiles;
    }
    //Amount
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
    //Date
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

    if (data.values.invoiceType == 1) {
      files = files.filter((f) => f.isPrePayment != false);
    }
    if (data.values.invoiceType == 2) {
      files = files.filter((f) => f.isReceipt != false);
      console.log(files);
    }
    if (data.values.invoiceType == 3) {
      files = files.filter((f) => f.isPettyCash != false);
    }

    //Invoice Type
    // if (data.filters.invoiceType) {
    // 	console.log(data.values.invoiceType);
    //   switch (data.values.invoiceType) {
    //     case 1:
    // 			files = files.filter(f => f.isPo == true);
    //       break;
    //     case 2:
    // 			files = files.filter(f => f.isExpense == true);
    //       break;
    //     case 3:
    // 			files = files.filter(f => f.isPettyCash == true);
    //       break;
    //     default:
    // 			files = files;
    //       break;
    //   }
    //  }
    setTableData(files.reverse());
    setShowFiltersModel(false);
  };

  //Set File Data
  const [fileData, setFileData] = React.useState();
  const [type, setType] = React.useState("");
  const initWorkFLow = ({ event, props }) => {
    if (props.markedAs == "unread") {
      msgAlert("Review Invoice Before Initiate Workflow...");
    } else if (props.initWorkFlow) {
      msgAlert("WorkFlow Already Initiated...");
    } else {
      setFileData(props);
      setInitWorkFlowModal(true);
    }
  };
  //Open Advance View From through Awesome Menu
  const viewQrViewFromAwesomeMenu = ({ event, props }) => {
    viewQrView(props);
  };
  //Open BlockChain View From through Awesome Menu
  const viewBlockChainViewFromAwesomeMenu = ({ event, props }) => {
    viewBlockChainView(props);
  };
  //Print
  // const print = () => {
  //   fetch(pdfUrl).then(function(response) {
  //     return response.blob();
  // }).then(function(myBlob) {
  //     var objectURL = URL.createObjectURL(myBlob);
  //     document.querySelector('#pdf-frame').src = '';
  //     document.querySelector('#pdf-frame').src = objectURL;
  //     objectURL = URL.revokeObjectURL(myBlob);
  // }).then(
  //     function() {
  //         window.setTimeout(function() {
  //             document.querySelector('#pdf-frame').contentWindow.print();
  //         }, 1000)
  //     });
  //   }

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
      <Separator />
      {!isVendor ? (
        <Item onClick={initWorkFLow}>
          <Send />
          &nbsp;&nbsp;Initialize WorkFlow
        </Item>
      ) : (
        ""
      )}
    </Menu>
  );
  return (
    <div>
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
                  {/* <Button
                    color="info"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => console.log('22323')}
                  >
                    Print Document
                  </Button> */}
                </CardHeader>
                <CardBody>
                  {/* <PDFViewer
                    document={{
                      url: pdfUrl,
                    }}
                    navbarOnTop={true}
                    scale={2}
                  /> */}
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
      {/* Tag Model */}
      {tagModal ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"sm"}
              open={tagModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={closeTagModal}
              aria-labelledby="tag-modal-slide-title"
              aria-describedby="tag-modal-slide-description"
            >
              <DialogContent
                id="tag-modal-slide-description"
                className={classes.modalBody}
              >
                <FileTags closeTagModal={closeTagModal} fileData={row} />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )}
      {/* Mark As Received Model */}
      {markAsReceivedModel ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"sm"}
              open={markAsReceivedModel}
              TransitionComponent={Transition}
              keepMounted
              onClose={closeMarkAsReceivedModel}
              aria-labelledby="tag-modal-slide-title"
              aria-describedby="tag-modal-slide-description"
            >
              <DialogContent
                id="tag-modal-slide-description"
                className={classes.modalBody}
              >
                <FileReceived
                  closeFileReceivedModal={closeMarkAsReceivedModel}
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
      {/* Mark As Payment Model */}
      {initPaymentModel ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"md"}
              scroll="body"
              open={initPaymentModel}
              TransitionComponent={Transition}
              keepMounted
              onClose={closePaymentModel}
              aria-labelledby="tag-modal-slide-title"
              aria-describedby="tag-modal-slide-description"
            >
              <DialogContent
                id="tag-modal-slide-description"
                className={classes.modalBody}
              >
                <InitiatePayment
                  closeModal={closePaymentModel}
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
      {/* Mark As edit Model */}
      {/* {editInvoice ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"lg"}
              scroll="body"
              open={editInvoice}
              // TransitionComponent={TransitionLeft}
              keepMounted
              onClose={closeInvoiceModel}
              aria-labelledby="tag-modal-slide-title"
              aria-describedby="tag-modal-slide-description"
            >
              <DialogContent
                id="tag-modal-slide-description"
                className={classes.modalBody}
              >
                <CreateInvoice edit={editInvoice} closeModal={closeInvoiceModel} fileData={row} />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )} */}
      {/* Task Model */}
      {taskModal ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"sm"}
              open={taskModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={closeTaskModal}
              aria-labelledby="tag-modal-slide-title"
              aria-describedby="tag-modal-slide-description"
            >
              <DialogContent
                id="tag-modal-slide-description"
                className={classes.modalBody}
              >
                <FileTasks closeTaskModal={closeTaskModal} fileData={row} />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )}
      {/* Advance View Model */}
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
                    <h4 className={classes.cardTitleText}>360&#176; View</h4>
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
      {/* Init Workflow Model */}
      {initWorkFlowModal ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"md"}
              open={initWorkFlowModal}
              scroll="body"
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setInitWorkFlowModal(false)}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}
              >
                <InitWorkflow
                  closeModal={() => setInitWorkFlowModal(false)}
                  fileData={fileData}
                  loadFiles={getMyFiles}
                  type={type}
                />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )}

      {/* Init Workflow Model */}
      {/* {showFiltersModel ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"md"}
              open={showFiltersModel}
              scroll="body"
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setShowFiltersModel(false)}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}
              >
                <Filters
                  closeModal={() => setShowFiltersModel(false)}
                  loadFiles={getMyFiles}
                />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )} */}
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
          {/* <GridContainer>
        <GridItem xs={12}>
        <IconButton onClick={()=>setView('read')} style={{ float: "right",color : view == 'read' ? "#9E2654" : ""}} aria-label="Read View" component="span">
        <StyledBadge badgeContent={1} color="secondary">
        <PlaylistAddCheckIcon   />
        </StyledBadge>
        </IconButton>
        <IconButton onClick={()=>setView('unread')} style={{ float: "right", color : view == 'unread' ? "#9E2654" : ""}} aria-label="Unread View" component="span">
        <StyledBadge badgeContent={4} color="secondary">
        <CallReceivedIcon   />
        </StyledBadge>
        </IconButton>
        </GridItem>
        </GridContainer> */}
          <GridContainer>
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
                  {filesData.length > 0 ? (
                    <Button
                      color="danger"
                      round
                      style={{ float: "right" }}
                      className={classes.marginRight}
                      onClick={() => exportToCSV()}
                    >
                      Export
                    </Button>
                  ) : (
                    ""
                  )}
                  <Tooltip
                    id="tooltip-top"
                    title="Refresh"
                    style={{ float: "right" }}
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button
                      onClick={() => getMyFiles(userDetail, false)}
                      simple
                      color="info"
                      justIcon
                    >
                      <Refresh className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <LinearProgress />
                  ) : (
                    <ReactTable
                      data={data}
                      sortable={false}
                      columns={
                        !isVendor
                          ? [
                              {
                                Header: "Invoice ID",
                                accessor: "invoiceId",
                                filterable: true,
                                filter: "fuzzyText",
                                sortType: "basic",
                              },
                              {
                                Header: "Status",
                                accessor: "status",
                              },
                              {
                                Header: "Submit Date",
                                accessor: "createdDate",
                              },
                              {
                                Header: "Supplier Name",
                                accessor: "vendorName",
                              },
                              {
                                Header: "Amount",
                                accessor: "netAmt",
                              },
                              {
                                Header: "Invoice Type",
                                accessor: "invoiceType",
                                filterable: true,
                                filter: "fuzzyText",
                                sortType: "basic",
                              },
                              {
                                Header: "PO Number",
                                accessor: "po",
                                filterable: true,
                                filter: "fuzzyText",
                                sortType: "basic",
                              },
                              {
                                Header: "Reviewed",
                                accessor: "reviewed",
                              },
                              {
                                Header: "Approved",
                                accessor: "approved",
                              },
                              {
                                Header: "Actions",
                                accessor: "actions",
                                filterable: false,
                              },
                            ]
                          : [
                              {
                                Header: "Invoice ID",
                                accessor: "invoiceId",
                                filterable: true,
                                filter: "fuzzyText",
                                sortType: "basic",
                              },
                              {
                                Header: "Status",
                                accessor: "status",
                              },
                              {
                                Header: "Submit Date",
                                accessor: "createdDate",
                              },
                              {
                                Header: "Customer Name",
                                accessor: "customerName",
                              },
                              {
                                Header: "Amount",
                                accessor: "netAmt",
                              },
                              {
                                Header: "Po Number",
                                accessor: "po",
                                filterable: true,
                                filter: "fuzzyText",
                                sortType: "basic",
                              },
                              {
                                Header: "Actions",
                                accessor: "actions",
                                filterable: false,
                              },
                            ]
                      }
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
      {editInvoice ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={editInvoice}
        >
          <CreateInvoice
            edit={editInvoice}
            loadFiles={getMyFiles}
            closeModal={closeInvoiceModel}
            editHandler={editHandler}
            fileData={row}
          />
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
            closeModal={() => setShowFiltersModel(false)}
            setFilters={setFilter}
            isVendor={isVendor}
          />
        </Animated>
      </SwipeableDrawer>
    </div>
  );
}
