import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

import { filters } from "./GlobalFilters";

import Iframe from 'react-iframe'

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
  Chip
} from "@material-ui/core";
// @material-ui/icons
import {
  LocalOffer,
  Visibility,
  Send,
} from "@material-ui/icons";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import dateFormat from "dateformat";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import FileTags from "./FileTags";
import FileTasks from "./FileTasks";
import FileAdvanceView from "../AdvanceView/FileAdvanceView";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import RateReview from "@material-ui/icons/RateReview";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Filters from "./Filters";
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
import Pending from "assets/img/statuses/Pending.png";
import Success from "assets/img/statuses/Success.png";
import Rejected from "assets/img/statuses/Rejected.png";
import NoStatus from "assets/img/statuses/NoStatus.png";
import VerticalLinearStepper  from "../../../Components/VerticalStepper";
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { useDispatch, useSelector } from "react-redux";
import FileReceived from "./FileReceived";
import InitiatePayment from "./InitiatePayment";
import { partial } from "lodash";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  }
};

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -7,
    top: -2,
    border: `2px solid #9E2654`,
    padding: '0 4px',
    background:'#9E2654'
  },
}))(Badge);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function FilesList(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const classes = useStyles();
  const [componentName, setComponentName] = React.useState('Invoices');
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
  const [isViewingBlockChainView, setIsViewingBlockChainView] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState(false);
  const [pdfModalData, setPdfModalData] = React.useState(false);
  const [data, setData] = React.useState();
  const [row, setRow] = React.useState();
  const [blockChainData, setBlockChainData] = React.useState(null);
  const [markAsReceivedModel, setMarkAsReceivedModel] = React.useState(false);
  const [initPaymentModel, setinitPaymentModel] = React.useState(false);
  const [decoded, setDecoded] = React.useState(null);
  const [view, setView] = React.useState('read');
  const [showFiltersModel, setShowFiltersModel] = React.useState(false);
  const [filesData, setFilesData] = React.useState([]);
  const [formState, setFormState] = React.useState({
    filters:{
        status:true,
        date:true,
        amount:true,
        partialPaid:true,
        fullPaid:true,
        notPaid:true
    },
    values: {  
      status:[],
      submitStart:null,
      submitEnd:null,
      amountTo:null,
      amountfrom:null,
      partialPaid:false,
      fullPaid:false,
      notPaid:false
    }
  });

 
  //Add File Tags
  const addFileTags = (row) => {
    setRow(row)
    setTagModal(true);
  };
  //Mark as Received
  const markAsReceived = (row) => {
    setRow(row)
    setMarkAsReceivedModel(true);
  };
  //Payment as Received
  const initPayment = (row) => {
    setRow(row)
    setinitPaymentModel(true);
  };
  //Add File Tasks
  const addFileTasks = (row) => {
    setRow(row)
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
      url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/invoice-workflow-history/${row.invoiceId}-${row.version}`
      })
      .then((response) => {
        if(response.data.length !== 0){
        setBlockChainData(response.data);
        setIsViewingBlockChainView(true);
        setAnimateTable(false);
        setAnimateBlockChain(true);
        }
      })

  };
  //Open Advance View
  const viewQrView = (row) => {
        setRow(row)
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
  }
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
    setData(
      response.reverse()
      .map((prop, key) => {
        return {
          id: prop._id,
          invoiceId: 
          (
            // <MenuProvider data={prop} id="menu_id">
              prop.invoiceId
            // </MenuProvider> 
          ),
          status:(
            <MenuProvider data={prop} id="menu_id">
            {prop.markedAs == 'unread' ? <Chip style={{background:'#deb725', color:'#fff'}} label="Pending"/> : prop.markedAs == 'read' ? <Chip label="Received"  color="primary" /> : prop.markedAs == 'rejected' ? <Chip  color="secondary" label="Rejected" />:''}
            </MenuProvider> 
          ),
          createdDate: (
            <MenuProvider data={prop} id="menu_id">
              {dateFormat(prop.createdDate, "dd/mm/yyyy")}
            </MenuProvider> 
          ),
          date: (
            <MenuProvider data={prop} id="menu_id">
              {dateFormat(prop.dueDate, "dd/mm/yyyy")}
            </MenuProvider>
          ),
          vendorName: (
            <MenuProvider data={prop} id="menu_id">
              {prop.vendorName}
            </MenuProvider>
          ),
          netAmt: (
            <MenuProvider data={prop} id="menu_id">
              {`$${prop.netAmt.toFixed(2)}`} 
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
          {prop.initWorkFlow ?
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
            :''}
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
          {prop.markedAs == 'unread' ? (
          <Tooltip title="Mark as Received" aria-label="received">
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
          ):''}
           {prop.approveStatus == 'approved' ? (
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
            </Tooltip>
          ):''}
            </div>
          ),
        };
      })
    )
  }
  //Get Files
  const getMyFiles = async (user, loading) => {
      setIsLoading(loading);
      axios({
        method: "get", //you can set what request you want to be
        url:  user.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceTenant/${user.tenantId}` : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceOrg/${user.orgDetail.organizationId}`,
        data: { pagination: "30", page: "1" },
        headers: {
          cooljwt: Token,
        },
      })
        .then((response) => {
          setFilesData(response.data);
          setTableData(response.data);
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
  //Close Models
  const closeTagModal = () => {
    setTagModal(false);
  }
  //Close Models
  const closeMarkAsReceivedModel = () => {
    setMarkAsReceivedModel(false);
  }
  const closePaymentModel = () => {
    setinitPaymentModel(false);
  }
  const closeTaskModal = () => {
    setTaskModal(false);
  }
  const closeQrModal = () => {
    setQrModal(false);
  }
  const setFilter = (data) => {
    setFormState((formState) => ({
      ...formState,
      values: data.values,
      filters: data.filters
    }));
    let files = filesData;
    if(data.filters.status && data.values.status.length != 0 && !data.values.status.includes(0)){
    const statusFilter = filters.filter(f=>data.values.status.includes(f._id));
    var filteredFiles = [];
    files.map(f=>{
      statusFilter.map(s=>{
        if (s.p_id == 1) {
          if (f.markedAs == s.id) {
            if (filteredFiles.find(ff=>ff._id == f._id) == undefined ) {
              filteredFiles.push(f);              
            }
          }
        }
        else if (s.p_id == 2){
          if (f.reviewStatus == s.id) {
            if (filteredFiles.find(ff=>ff._id == f._id) == undefined ) {
              filteredFiles.push(f);              
            }          }
        }
        else if (s.p_id == 3){
          if (f.approveStatus == s.id) {
            if (filteredFiles.find(ff=>ff._id == f._id) == undefined ) {
              filteredFiles.push(f);              
            }          }
        }
          
      })
    });
    files = filteredFiles;
    }

    if (data.filters.amount && data.values.amountTo >= 1 && data.values.amountfrom >= 1) {
      files =  files.filter(file=>file.netAmt <= parseInt(data.values.amountTo) && file.netAmt >= parseInt(data.values.amountfrom));
    }

    if (data.filters.date && data.values.submitEnd !== null || undefined && data.values.submitStart !== null || undefined){
      console.log('In');
      var endDate = new Date(data.values.submitEnd);
      endDate. setDate(endDate. getDate() + 1);
      files =  files.filter(file=>new Date(file.createdDate) >= new Date(data.values.submitStart) && new Date(file.createdDate) <= new Date(endDate));
    }

    if (data.filters.partialPaid && data.values.partialPaid ) {
      files =  files.filter(file=>file.paymentStatus == 'partial');
    }

    if (data.filters.fullPaid && data.values.fullPaid ) {
      files =  files.filter(file=>file.paymentStatus == 'full');
    }

    if (data.filters.notPaid && data.values.notPaid ) {
      files =  files.filter(file=>file.paymentStatus == 'pending');
    }


    // if (data.filters.status) {
    //   files =  files.filter(file=>file.markedAs == data.values.status);
    // }
    // if (data.filters.reviewStatus) {
    //   files =  files.filter(file=>file.reviewStatus == data.values.reviewStatus);
    // }
    // if (data.filters.approvalStatus) {
    //   files =  files.filter(file=>file.approveStatus == data.values.approvalStatus);
    // }
    // if (data.filters.amountTo) {
    //   files =  files.filter(file=>file.netAmt <= parseInt(data.values.amountTo));
    // }
    // if (data.filters.amountfrom) {
    //   files =  files.filter(file=>file.netAmt >= parseInt(data.values.amountfrom));
    // }
    // if (data.filters.submitStart){
    //   files =  files.filter(file=>new Date(file.createdDate) >= new Date(data.values.submitStart));
    // }
    // if (data.filters.submitEnd){
    //     var endDate = new Date(data.values.submitEnd);
    //     endDate. setDate(endDate. getDate() + 1);
    //   files =  files.filter(file=>new Date(file.createdDate) <= new Date(endDate));
    // }

    setTableData(files);
    setShowFiltersModel(false);
  }
  
  //Set File Data
  const [fileData, setFileData] = React.useState();
  const [type, setType] = React.useState("");
  const initWorkFLow = ({ event, props }) => {
    if(!props.initWorkFlow){
      setFileData(props);
      setInitWorkFlowModal(true);
    }else{
    msgAlert('WorkFlow Already Initiated...')
    } 
  };
  //Open Advance View From through Awesome Menu
  const viewQrViewFromAwesomeMenu = ({ event, props }) => {viewQrView(props)};
  //Open BlockChain View From through Awesome Menu
  const viewBlockChainViewFromAwesomeMenu = ({ event, props }) => {viewBlockChainView(props)};
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
      <Item onClick={viewBlockChainViewFromAwesomeMenu}>
        <ClearAllIcon />
        &nbsp;&nbsp;BlockChain View
      </Item>
      <Separator />
      <Item onClick={viewQrViewFromAwesomeMenu}>
        <ViewModuleIcon />
        &nbsp;&nbsp;Invoice View
      </Item>
      <Separator />
      <Item onClick={initWorkFLow}>
        <Send />
        &nbsp;&nbsp;Initialize WorkFlow
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
                    color='danger'
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
                    <h4 className={classes.cardTitleText}>
                     Blockchain View
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
                <FileReceived closeFileReceivedModal={closeMarkAsReceivedModel} fileData={row} loadFiles={getMyFiles} />
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
              maxWidth={"sm"}
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
                <InitiatePayment closeModal={closePaymentModel} fileData={row} loadFiles={getMyFiles} />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )}
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
                   <h4 className={classes.cardTitleText}>
                    Invoice View
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
                <FileAdvanceView fileData={row} />
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

      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={animateTable}
      >
      {/* Awesome Menu */}
        <MyAwesomeMenu  />
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
                <Button
                  color="danger"
                  round
                  style={{ float: "right" }}
                  className={classes.marginRight}
                  onClick={() => msgAlert('Working on this feature')}
                >
                  Export
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
                        Header: "Invoice ID",
                        accessor: "invoiceId",
                        filterable:true,
                        filter:"fuzzyText"
                      },
                      {
                        Header: "Status",
                        accessor: "status",
                      },
                      {
                        Header: "Submit Date",
                        accessor: "createdDate"
                      },
                      {
                        Header: "Vendor Name",
                        accessor: "vendorName"
                      },
                      {
                        Header: "Amount",
                        accessor: "netAmt"
                      },
                      {
                        Header: "Version",
                        accessor: "version"
                      },
                      {
                        Header: "Reviewed",
                        accessor: "reviewed",
                      },
                      {
                        Header: "Approved",
                        accessor: "approved"
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
      <SwipeableDrawer
            anchor={'right'}
            open={showFiltersModel}
            onClose={()=>setShowFiltersModel(false)}
            // onOpen={}
      >
        <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={showFiltersModel}
      >
       
        <Filters filters={formState.filters} values={formState.values} closeModal={()=>setShowFiltersModel(false)} setFilters={setFilter} />

        </Animated>
        </SwipeableDrawer>
    </div>
  );
}
