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
  Done,
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
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {
  addZeroes,
  formatDate,
  formatDateTime,
  successAlert,
  errorAlert,
  msgAlert,
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
import { over } from "lodash";
import { setIsTokenExpired } from "actions";
import { ToastContainer, toast } from "react-toastify";

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
const notify = (msg) =>
  toast(msg, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const TransitionRight = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});
const TransitionLeft = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function SentInvoices(props) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const dispatch = useDispatch();
  let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
  let isVendor = userDetail.isVendor;
  const classes = useStyles();
  const [componentName, setComponentName] = React.useState("Financial System");
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
  const [exported, setExported] = React.useState(false);
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
    files: [],
    readyToSendCount: 0,
    sentCount: 0,
    notifiedCount: 0,
    acknowledgedCount: 0,
    vendors: [],
    export: null,
    pos: [],
    filter: null,
    exported: false,
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
      poNumber: null,
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
    let userDetails = jwt.decode(Token);
    axios({
      method: "post", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/po/getPoc`,
      data: {
        organizationId: userDetails.orgDetail.organizationId,
      },
      headers: {
        cooljwt: Token,
      },
    })
      .then((res) => {
        console.log(res.data);
        setFormState((formState) => ({
          ...formState,
          pos: res.data,
        }));
      })
      .catch((error) => {
        if (error.response) {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
        }
        setFormState((formState) => ({
          ...formState,
          pos: [],
        }));
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
      })
      .catch((error) => {
        if (error.response) {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
        }
        console.log(error);
      });
  };
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
  const setFilter = (from, data) => {
    console.log(from);
    //from 1 == internal , 0 == external
    if (from == 0) {
      setFormState((formState) => ({
        ...formState,
        values: data.values,
        filters: data.filters,
      }));
      let files = formState.files;
      if (data.filters.supplierId && data.values.supplierId) {
        files = files.filter((file) => file.vendorId == data.values.supplierId);
      }

      if (data.filters.poNumber && data.values.poNumber) {
        files = files.filter((file) => file.po == data.values.poNumber);
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
    }
    if (from == 1) {
      let filter = "totalInvCount";
      if (data.id == 0) {
        filter = "totalInvCount";
      }
      if (data.id == 1) {
        if (data.val == 0) {
          filter = "paymentDueWeek";
        }
        if (data.val == 1) {
          filter = "paymentDueMonth";
        }
        if (data.val == 2) {
          filter = "paymentDueMonthAfter";
        }
      }
      if (data.id == 2) {
        if (data.val == 0) {
          filter = "paymentOverDueWeek";
        }
        if (data.val == 1) {
          filter = "paymentOverDueMonth";
        }
        if (data.val == 2) {
          filter = "paymentOverDueMonthAfter";
        }
      }
      if (data.id == 3) {
        filter = "paymentInProcessCount";
      }
      setFormState((formState) => ({
        ...formState,
        filter: filter,
      }));
    }
  };
  //Open BlockChainView
  const viewBlockChainView = (row) => {
    setIsViewingBlockChainView(false);
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/invoiceWorkflow/get-invoice-workflow-history/${row.vendorId}-${row.invoiceId}-${row.version}`,
    }).then((response) => {
      if (response.data.InvoiceWorkflowHistory.length !== 0) {
        setBlockChainData(response.data.InvoiceWorkflowHistory);
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
        let isSelected =
          selected.filter(
            (s) =>
              s.id == prop.invoiceId &&
              s.version == prop.version &&
              s.vendorId == prop.vendorId
          ).length > 0
            ? true
            : false;
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
              {formatDate(prop.dueDate)}
            </MenuProvider>
          ),
          vendorName: (
            <MenuProvider data={prop} id="menu_id">
              {prop.clientName}
            </MenuProvider>
          ),
          approvedDate: (
            <MenuProvider data={prop} id="menu_id">
              {formatDateTime(prop.approved)}
            </MenuProvider>
          ),
          requester: (
            <MenuProvider data={prop} id="menu_id">
              {prop.createdByVendor ? "Supplier" : prop.createdBy.split("@")[0]}
            </MenuProvider>
          ),
          poNumber: (
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
          select: (
            <div className="actions">
              <Checkbox
                // disabled={
                //   formState.filter == "totalInvCount" ||
                //   formState.filter == "paymentInProcessCount"
                // }
                checked={isSelected}
                onChange={() => select(prop)}
              />
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
      url: `${process.env.REACT_APP_LDOCS_API_URL}/AR/getInvoiceArClientDetails/${user.orgDetail.organizationId}/null`,
      data: { pagination: "30", page: "1" },
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          files:
            formState.filter == null
              ? response.data.invoicesApproved
              : response.data,
          readyToSendCount:
            formState.filter == null
              ? response.data.readyToSendCount
              : formState.readyToSendCount,
          sentCount:
            formState.filter == null
              ? response.data.sentCount
              : formState.sentCount,
          acknowledgedCount:
            formState.filter == null
              ? response.data.acknowledgedCount
              : formState.acknowledgedCount,
          notifiedCount:
            formState.filter == null
              ? response.data.notifiedCount
              : formState.notifiedCount,
        }));
        setFilesData(
          formState.filter == null
            ? response.data.invoicesApproved
            : response.data
        );
        setTableData(
          formState.filter == null
            ? response.data.invoicesApproved
            : response.data
        );
        setIsLoading(false);
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
        setIsLoading(false);
      });
  };

  const select = (invoice) => {
    let selectedInvoices = selected;
    console.log(exported);
    if (exported) {
      selectedInvoices = [];
      setExported(false);
    }
    if (!invoice) {
      if (selected.length == filesData.length) {
        selectedInvoices = [];
      } else {
        filesData.map((file) => {
          if (
            selected.filter(
              (s) =>
                s.id == file.invoiceId &&
                s.version == file.version &&
                s.vendorId == file.vendorId
            ).length < 1
          ) {
            selectedInvoices.push({
              id: file.invoiceId,
              version: file.version,
              vendorId: file.vendorId,
            });
          }
        });
      }
    } else {
      if (
        selected.filter(
          (s) =>
            s.id == invoice.invoiceId &&
            s.version == invoice.version &&
            s.vendorId == invoice.vendorId
        ).length < 1
      ) {
        selectedInvoices.push({
          id: invoice.invoiceId,
          version: invoice.version,
          vendorId: invoice.vendorId,
        });
      } else {
        const index = selected.findIndex(
          (s) =>
            s.id == invoice.invoiceId &&
            s.version == invoice.version &&
            s.vendorId == invoice.vendorId
        );
        if (index > -1) {
          selectedInvoices.splice(index, 1);
        }
      }
    }
    setSelected(selectedInvoices);
    setTableData(filesData);
  };
  React.useEffect(() => {
    setTableData(filesData);
  }, [selected.length]);
  React.useEffect(() => {
    let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
    getMyFiles(userDetail, true);
  }, [formState.filter]);

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
  const exportInvoices = (n) => {
    // n = 1 && export Invoices
    // n = 2 && Payment Invoices
    setFormState((formState) => ({
      ...formState,
      export: n,
    }));
    let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
    setExportToFusionModel(true);
    setExported(true);
    setSelected([]);
    axios({
      method: "post",
      url:
        n == 1
          ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/InvoiceSent`
          : `${process.env.REACT_APP_LDOCS_API_URL}/AR/moveToFinance`,
      data: selected,
      headers: {
        cooljwt: Token,
      },
    })
      .then(async (response) => {
        setFormState((formState) => ({
          ...formState,
          filter: null,
        }));
        let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
        await getMyFiles(userDetail, false);

        setExportToFusionModel(false);
        notify(n == 1 ? "SENT Successfully" : "Sent For Payment");
      })
      .catch((error) => {
        if (error.response) {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
        }
        console.log(error);
      });
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
                      Invoice:
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
                  title="SENT TO CLIENT"
                  export={formState.export || 1}
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
                  <p className={classes.cardCategory}>Ready To Send Count</p>
                  <h3 className={classes.cardTitle}>
                    {formState.readyToSendCount}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}></div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <CenterFocusWeakIcon />
                  </CardIcon>
                  <p className={classes.cardCategory}>Sent Count</p>
                  <h3 className={classes.cardTitle}>{formState.sentCount}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}></div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <CenterFocusStrongIcon />
                  </CardIcon>
                  <p className={classes.cardCategory}>Acknowledged Count</p>
                  <h3 className={classes.cardTitle}>{formState.acknowledgedCount}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}></div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    {/* <Store /> */}
                    <InsertDriveFileIcon />
                  </CardIcon>
                  <p className={classes.cardCategory}>Notified Count</p>
                  <h3 className={classes.cardTitle}>
                    {formState.notifiedCount}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}></div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12}>
              <Card>
                <CardHeader color="danger" icon>
                  <CardIcon color="danger">
                    <h4 className={classes.cardTitleText}>{componentName}</h4>
                  </CardIcon>
                  <p style={{ color: "gray" }}>
                    Note: Right click on any file to see multiple options
                  </p>

                  <React.Fragment>
                    <Button
                      color="info"
                      round
                      style={{ float: "right" }}
                      className={classes.marginRight}
                      onClick={() =>
                        selected.length > 0
                          ? exportInvoices(1)
                          : msgAlert("Please Select a Invoice.")
                      }
                    >
                      Sent to Client ({selected.length})
                    </Button>
                  </React.Fragment>
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
                              checked={
                                filesData.length == selected.length &&
                                selected.length >= 0
                              }
                              onChange={() => select()}
                              // disabled={
                              //   formState.filter == "totalInvCount" ||
                              //   formState.filter == "paymentInProcessCount"
                              // }
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
                          Header: "Client Name",
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
                          Header: "Requested By",
                          accessor: "requester",
                        },
                        {
                          Header: "Approval Date",
                          accessor: "approvedDate",
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
