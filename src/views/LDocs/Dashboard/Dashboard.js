import React from "react";
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles, LinearProgress, Typography, Box, IconButton } from "@material-ui/core";

import Icon from "@material-ui/core/Icon";
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import StorageIcon from '@material-ui/icons/Storage';
import DescriptionIcon from '@material-ui/icons/Description';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MapIcon from '@material-ui/icons/Map';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import CardText from "components/Card/CardText.js";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Language from "@material-ui/icons/Language";
import * as am4core from "@amcharts/amcharts4/core";
import BarChartIcon from '@material-ui/icons/BarChart';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import axios from "axios";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import dateFormat from "dateformat";
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import DateRangeIcon from '@material-ui/icons/DateRange';
import RoomIcon from '@material-ui/icons/Room';
import ViewListIcon from '@material-ui/icons/ViewList';
import { formatDateTime, addZeroes } from "../Functions/Functions";
import PieChartView from "./PieChart";
import LineChart from "./LineChart";
import  Calendar from "../../Calendar/Calendar";
import jwt from "jsonwebtoken";
import _ from 'lodash';
import { useSelector, useDispatch } from "react-redux";
import { setIsTokenExpired } from "actions";
import Map from "./Map";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(styles);

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="80%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const history = useHistory();
  const isAr =
    history.location.pathname.substring(history.location.pathname.lastIndexOf("/") + 1) == "ar"
      ? true
      : false;
  let decoded = jwt.decode(Token);
  const classes = useStyles();
  const pendingApprovalIcon = require("assets/img/pendingApproval.png");
  const dispatch = useDispatch();

  const getStats = () => {
    getDashboardData();
    getFilesHistory();
    getCountReviewChart();
    getCountApproveChart();
    getGraphData();
  }


  // React.useEffect(() => {
  //   getStats();
  // }, []);

  React.useEffect(() => {
    getStats();
  }, [isAr]);

const [statistics, setStatistics] = React.useState({
  totalInvoice:0,
  openInvoices:0,
  closedInvoices:0,
  pendingInvoices:0
});
const [graphData, setGraphData] = React.useState([]);
  const getGraphData = async () => {
    decoded = jwt.decode(Token);
    if(!decoded.isVendor){
    var data = {
      tenantId:decoded.tenantId,
      Date : new Date(),
      organizationId:decoded.isTenant ? null : decoded.orgDetail.organizationId,
    }
    await axios({
      method: "post",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/getBarMapDataTent` : isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/getBarMapDataOrgAR` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/getBarMapDataOrg`,
      data:data,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setGraphData(response.data);
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setGraphData([]);
        console.log(error);
      });
  }
  }
  const [loadingStats, setLoadingStats] = React.useState(true);
  const getDashboardData = async () => {
    let stats = {
      totalInvoice:0,
      openInvoices:0,
      closedInvoices:0,
      pendingInvoices:0
    }
    setLoadingStats(true);
    //Open Invoices
    if(!decoded.isVendor){
    await axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantOpenInvoice` : isAr ?  `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/openInvoiceAR/${decoded.orgDetail.organizationId}`:`${process.env.REACT_APP_LDOCS_API_URL}/dashboard/openInvoice/${decoded.orgDetail.organizationId}` ,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        stats.openInvoices = response.data.openInvoice
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        stats.openInvoices = 0
      });
       //Close Invoices
    await axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantCloseInvoice` : isAr ?  `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/closeInvoiceAR/${decoded.orgDetail.organizationId}` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/closeInvoice/${decoded.orgDetail.organizationId}` ,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        stats.closedInvoices=response.data.totalClosedInvoice
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        stats.closedInvoices=0;
      });
       //Total Invoices
    await axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantTotalInvoices` : isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/totalInvoicesAR/${decoded.orgDetail.organizationId}` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/totalInvoices/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
          stats.totalInvoice=response.data.totalInvoice;
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        stats.totalInvoice=0;
      });
     //Pending Invoices
    await axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantPendingInvoice` : isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/pendingInvoiceAR/${decoded.orgDetail.organizationId}`: `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/pendingInvoice/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
         stats.pendingInvoices=response.data.pendingInvoice;
        setLoadingStats(false);
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        stats.pendingInvoices=0;
        setLoadingStats(false);
      });
    }
      setStatistics(stats);
  };
// const [locationDocs, setLocationDocs] = React.useState([]);
//   const getLocationDocs = () => {
//     setLoadingStats(true);
//     axios({
//       method: "get",
//       url: `${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/getLocationDocsCount`,
//       headers: { cooljwt: Token },
//     })
//       .then((response) => {
//         if(_.isEmpty(response.data)){ setLocationDocs([]);}
//         else {setLocationDocs(response.data);}
//         setLoadingStats(false);
//       })
//       .catch((error) => {
//         setLocationDocs([]);
//         setLoadingStats(false);
//       });
//   }
const [fileHistory, setFileHistory] = React.useState([]);
const [loadingFiles, setLoadingFiles] = React.useState(true);
  const getFilesHistory = () => {
    if(!decoded.isVendor){
    setLoadingFiles(true);
    axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantRecentInvoice`: isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/recentInvoiceAR/${decoded.orgDetail.organizationId}` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/recentInvoice/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        console.log(response);
        setFileHistory(response.data);
        setLoadingFiles(false);
      })
      .catch((error) => {
        setFileHistory([]);
        setLoadingFiles(false);
      });
    }
  };

const [chartOneData, setChartOneData] = React.useState({});
const [loadingChartOne, setLoadingChartOne] = React.useState(false);
  const getCountReviewChart = () => {
    if(!decoded.isVendor){
    setLoadingChartOne(true);
    axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantInvoiceReviewChart`: isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/invoiceReviewChartAR/${decoded.orgDetail.organizationId}` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/invoiceReviewChart/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        let Pending = response.data.ByCountStatus.find(r=>r._id == 'pending');
        Pending.color = am4core.color("#5A2C66");
        let Reviewed = response.data.ByCountStatus.find(r=>r._id == 'reviewed');
        Reviewed.color = am4core.color("#763A83");
        let Rejected = response.data.ByCountStatus.find(r=>r._id == 'rejected');
        Rejected.color = am4core.color("#9D4DB3");
        let Total = response.data.totalfilesforreview;
        var check = 
        {
          ByCountStatus : [Pending,Reviewed,Rejected],
          totalfilesforreview:Total
        }
        setChartOneData(check);
        
        setLoadingChartOne(false);
      })
      .catch((error) => {
        setChartOneData([]);
        setLoadingChartOne(false);
      });
    }
  };
const [chartTwoData, setChartTwoData] = React.useState({});
const [loadingChartTwo, setLoadingChartTwo] = React.useState(false);

  const getCountApproveChart = () => {
    if(!decoded.isVendor){
    setLoadingChartTwo(true);
    axios({
      method: "get",
      url: decoded.isTenant ?`${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantInvoiceApproveChart`: isAr ?  `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/invoiceApproveChartAR/${decoded.orgDetail.organizationId}` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/invoiceApproveChart/${decoded.orgDetail.organizationId}` ,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        let Pending = response.data.ByCountStatus.find(r=>r._id == 'pending');
        Pending.color = am4core.color("#9E2654");
        let Reviewed = response.data.ByCountStatus.find(r=>r._id == 'approved');
        Reviewed.color = am4core.color("#BC2E65");
        let Rejected = response.data.ByCountStatus.find(r=>r._id == 'rejected');
        Rejected.color = am4core.color("#D34D80");
        let Total = response.data.totalfilesforreview;
        var check = 
        {
          ByCountStatus : [Pending,Reviewed,Rejected],
          totalfilesforreview:Total
        }
        
        setChartTwoData(check);
        
        setLoadingChartTwo(false);
      })
      .catch((error) => {
        console.log(error);
        setChartTwoData([]);
        setLoadingChartTwo(false);
      });
    }
  };

  
  
  
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                {/* <Store /> */}
                <InsertDriveFileIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Invoices</p>
              {loadingStats ? <LinearProgress  />:<h3 className={classes.cardTitle}>{statistics.totalInvoice}</h3>}
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
              <InsertDriveFileIcon />
                <Link to="/admin/invoices">
                Show Invoices
                </Link>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
              <CenterFocusWeakIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Ready To Pay</p>
              {loadingStats ? <LinearProgress  />:<h3 className={classes.cardTitle}>{statistics.openInvoices}</h3>}
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
              <CenterFocusWeakIcon/>
                <Link to="#">
                  Show Ready To Pay Invoices
                </Link>
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
              <p className={classes.cardCategory}>Paid Invoices</p>
              {loadingStats ? <LinearProgress  />: <h3 className={classes.cardTitle}>{statistics.closedInvoices}</h3>}
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
              <CenterFocusStrongIcon />
                <Link to="#">
                  Show Paid Invoices
                </Link>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                  {/* <i className="fab fa-twitter" /> */}
                   <img style={{
                    width: '36px',
                    height: '36px',
                    margin: '10px 10px 4px',
                    fontSize: '36px',
                    textAlign: 'center',
                    lineHeight: '56px',
                    }} src={pendingApprovalIcon} />
 
              </CardIcon>
              <p className={classes.cardCategory}>Pending Action</p>
              {loadingStats ? <LinearProgress  />:<h3 className={classes.cardTitle}>
                {statistics.pendingInvoices}
              </h3>}
              
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <WatchLaterIcon />
                </Danger>
                <a href="#space" onClick={(e) => e.preventDefault()}>
                  Action pending
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" icon>
              <CardText color="danger">
                <h4 className={classes.cardTitleWhite}>
                  Review Statisticss
                </h4>
              </CardText>
            </CardHeader>
            <CardBody>
                {/* <GridItem xs={12} sm={12} md={12}>
                  <Table
                    tableData={[
                      [<LoyaltyIcon />, "FINANCE", "20"],
                      [<LoyaltyIcon />, "HR", "13"],
                      [<LoyaltyIcon />, "MOM", "10"],
                      [<LoyaltyIcon />, "MEMO", "18"],
                      [<LoyaltyIcon />, "REQUEST", "22"],
                      [<LoyaltyIcon />, "REJECTED", "5"],
                    ]}
                  />
                </GridItem> */}
                      {loadingChartOne ? <LinearProgress  /> : <PieChartView paddingRight={20}  chartData={chartOneData} chatID="2" />}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="info" icon>
              <CardText color="info">
                <h4 className={classes.cardTitleWhite}>
                  Approval Statisticss
                </h4>
              </CardText>
            </CardHeader>
            <CardBody>
              <GridContainer justify="space-between">
                    <GridItem xs={12} sm={12} md={12}>
                    {loadingChartTwo ? <LinearProgress  /> : <PieChartView paddingRight={20} chatID="3" chartData={chartTwoData} />}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
              <BarChartIcon fontSize="large" />
                {/* <h4 className={classes.cardTitleWhite}>
                  Mate Maps
                </h4> */}
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridContainer justify="space-between">
                    <GridItem xs={12} sm={12} md={12}>
                    {loadingChartTwo ? <LinearProgress  /> : <LineChart paddingRight={20} chatID="4" chartData={graphData} /> }
                    </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                <MapIcon fontSize="large" />
                  {/* <h4 className={classes.cardTitleWhite}>
                    Mate Map
                  </h4> */}
                </CardIcon>
              </CardHeader>
              <CardBody>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <Map />    
                    </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem> 
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                <DateRangeIcon fontSize="large" />
                  {/* <h4 className={classes.cardTitleWhite}>
                    Mate Calender
                  </h4> */}
                </CardIcon>
              </CardHeader>
              <CardBody>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <Calendar />    
                    </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem> 
      </GridContainer>
      <h3>Last 5 Invoices</h3>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
              <ViewListIcon fontSize="large" />
                {/* <h4 className={classes.cardTitleWhite}>
                  Most Recent Invoices
                </h4> */}
              </CardIcon>
            </CardHeader>
            <CardBody>
              {loadingFiles ? <LinearProgress  /> : 
              <Table
                hover
                tableHeaderColor="info"
                tableHead={["Invoice ID","Version","Submit Date", "Due Date", isAr ? "Customer Name":"Supplier Name", "Amount"]}
                tableData={typeof fileHistory.recentInvoices !== "undefined" && fileHistory.recentInvoices.length > 0 ? fileHistory.recentInvoices.map((file,index)=>{return [file.invoiceId,file.version,formatDateTime(file.invoiceDate), formatDateTime(file.dueDate) ,isAr ? file.clientName :file.vendorName,`${file.FC_currency ? file.FC_currency.Code : '$'} ${addZeroes(file.netAmt)} / ${file.LC_currency ? file.LC_currency.Code : ""} ${addZeroes(file.netAmt_bc ? file.netAmt_bc : 0.00) 
                }` ]}): []}
              />
              }
            </CardBody>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning" text>
              <CardText color="warning">
                <h4 className={classes.cardTitleWhite}>
                  Most Recent Requested Reviews
                </h4>
              </CardText>
            </CardHeader>
            <CardBody>
            {loadingFiles ? <LinearProgress  /> : 
              <Table
                hover
                tableHeaderColor="warning"
                tableHead={[
                  "ID",
                  "File Name",
                  "Status",
                  "Date",
                  "Requested By",
                ]}
                tableData={typeof fileHistory.mostrecentrequestedreviews !== "undefined" && fileHistory.mostrecentrequestedreviews.length > 0? fileHistory.mostrecentrequestedreviews.map((file,index)=>{return [index+1,file.fileName,file.status,dateFormat(file.requestedTime, "dd/mm/yyyy"), file.requestedBy]}): []}
              />
              }
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success" text>
              <CardText color="success">
                <h4 className={classes.cardTitleWhite}>
                  Most Recent Requested Approvals
                </h4>
              </CardText>
            </CardHeader>
            <CardBody>
            {loadingFiles ? <LinearProgress  /> : 
              <Table
                hover
                tableHeaderColor="success"
                tableHead={[
                  "ID",
                  "File Name",
                  "Status",
                  "Date",
                  "Requested By",
                ]}
                tableData={typeof fileHistory.mostrecentrequestedapprovals !== "undefined" && fileHistory.mostrecentrequestedapprovals.length > 0? fileHistory.mostrecentrequestedapprovals.map((file,index)=>{return [index+1,file.fileName,file.status,dateFormat(file.requestedTime, "dd/mm/yyyy"), file.requestedBy]}): []}
              />
              }
            </CardBody>
          </Card>
        </GridItem> */}
      </GridContainer>

      {/* <br />
      <h3>My Pending</h3>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning" text>
              <CardText color="warning">
                <h4 className={classes.cardTitleWhite}>Pending For Reviews</h4>
              </CardText>
            </CardHeader>
            <CardBody>
            {loadingFiles ? <LinearProgress  /> : 
              <Table
                hover
                tableHeaderColor="warning"
                tableHead={[
                  "ID",
                  "File Name",
                  "Status",
                  "Date",
                  "Reviewed By",
                ]}
                tableData={typeof fileHistory.mypendingreviews !== "undefined" && fileHistory.mypendingreviews.length > 0? fileHistory.mypendingreviews.map((file,index)=>{return [index+1,file.fileName,file.status,dateFormat(file.requestedTime, "dd/mm/yyyy"), file.reviewedBy]}): []}
              />
              }
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success" text>
              <CardText color="success">
                <h4 className={classes.cardTitleWhite}>
                  Pending For Approvals
                </h4>
              </CardText>
            </CardHeader>
            <CardBody>
            {loadingFiles ? <LinearProgress  /> : 
              <Table
                hover
                tableHeaderColor="success"
                tableHead={[
                  "ID",
                  "File Name",
                  "Status",
                  "Date",
                  "Approved By",
                ]}
                tableData={typeof fileHistory.mypendingapproval !== "undefined" && fileHistory.mypendingapproval.length > 0? fileHistory.mypendingapproval.map((file,index)=>{return [index+1,file.fileName,file.status,dateFormat(file.requestedTime, "dd/mm/yyyy"), file.approvedBy]}): []}
              />
              }
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer> */}
    </div>
  );
}
