import React from "react";
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles, LinearProgress, Typography, Box, IconButton } from "@material-ui/core";

import Icon from "@material-ui/core/Icon";
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import StorageIcon from '@material-ui/icons/Storage';
import DescriptionIcon from '@material-ui/icons/Description';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

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

import PieChartView from "./PieChart";
import LineChart from "./LineChart";
import  Calendar from "../../Calendar/Calendar";
import jwt from "jsonwebtoken";
import _ from 'lodash';
import { useSelector } from "react-redux";

const useStyles = makeStyles(styles);

const formatAMPM = (dat) => {
  var date = new Date(dat);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  //minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const formatDate = (dat) => {
  var d = new Date(dat);
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear(); 
  var dateStr = date + "/" + month + "/" + year;
  return dateStr;
}

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
  let decoded = jwt.decode(Token);
  const classes = useStyles();
  const pendingApprovalIcon = require("assets/img/pendingApproval.png");

  React.useEffect(() => {
    getDashboardData();
    getFilesHistory();
    getCountReviewChart();
    getCountApproveChart();
    getGraphData();
  }, []);

const [statistics, setStatistics] = React.useState({
  totalInvoice:0,
  openInvoices:0,
  closedInvoices:0,
  pendingInvoices:0
});
const [graphData, setGraphData] = React.useState([]);
  const getGraphData = async () => {
    var data = {
      tenantId:decoded.tenantId,
      Date : new Date(),
      organizationId:decoded.isTenant ? null : decoded.orgDetail.organizationId,
    }
    await axios({
      method: "post",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/getBarMapDataTent` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/getBarMapDataOrg`,
      data:data,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setGraphData(response.data);
      })
      .catch((error) => {
        setGraphData([]);
        console.log(error);
      });
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
    await axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantOpenInvoice` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/openInvoice/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        stats.openInvoices = response.data.openInvoice
      })
      .catch((error) => {
        stats.openInvoices = 0
      });
       //Close Invoices
    await axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantCloseInvoice` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/closeInvoice/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        stats.closedInvoices=response.data.totalClosedInvoice
      })
      .catch((error) => {
        stats.closedInvoices=0;
      });
       //Total Invoices
    await axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantTotalInvoices` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/totalInvoices/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
          stats.totalInvoice=response.data.totalInvoice;
      })
      .catch((error) => {
        stats.totalInvoice=0;
      });
     //Pending Invoices
    await axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantPendingInvoice` : `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/pendingInvoice/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
         stats.pendingInvoices=response.data.pendingInvoice;
        setLoadingStats(false);
      })
      .catch((error) => {
        stats.pendingInvoices=0;
        setLoadingStats(false);
      });
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
    setLoadingFiles(true);
    axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantRecentInvoice`: `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/recentInvoice/${decoded.orgDetail.organizationId}`,
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
  };

const [chartOneData, setChartOneData] = React.useState({});
const [loadingChartOne, setLoadingChartOne] = React.useState(false);
  const getCountReviewChart = () => {
    setLoadingChartOne(true);
    axios({
      method: "get",
      url: decoded.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantInvoiceReviewChart`: `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/invoiceReviewChart/${decoded.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        let Pending = response.data.ByCountStatus.find(r=>r._id == 'pending');
        Pending.color = am4core.color("#5A2C66");
        let Reviewed = response.data.ByCountStatus.find(r=>r._id == 'reviewed');
        Reviewed.color = am4core.color("#763A87");
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
  };
const [chartTwoData, setChartTwoData] = React.useState({});
const [loadingChartTwo, setLoadingChartTwo] = React.useState(false);

  const getCountApproveChart = () => {
    setLoadingChartTwo(true);
    axios({
      method: "get",
      url: decoded.isTenant ?`${process.env.REACT_APP_LDOCS_API_URL}/dashboard/tenantInvoiceApproveChart`: `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/invoiceApproveChart/${decoded.orgDetail.organizationId}`,
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
              <p className={classes.cardCategory}>Open Invoices</p>
              {loadingStats ? <LinearProgress  />:<h3 className={classes.cardTitle}>{statistics.openInvoices}</h3>}
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
              <CenterFocusWeakIcon/>
                <Link to="#">
                  Show Open Invoices
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
              <p className={classes.cardCategory}>Closed Invoices</p>
              {loadingStats ? <LinearProgress  />: <h3 className={classes.cardTitle}>{statistics.closedInvoices}</h3>}
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
              <CenterFocusStrongIcon />
                <Link to="#">
                  Show Closed Invoices
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
      <h3>My Listings</h3>
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
                tableHead={["Invoice ID", "Submit Date", "Due Date", "Vendor Name", "Amount", "Version", 'Status']}
                tableData={typeof fileHistory.recentInvoices !== "undefined" && fileHistory.recentInvoices.length > 0 ? fileHistory.recentInvoices.map((file,index)=>{return [file.invoiceId,formatAMPM(file.invoiceDate)+' '+formatDate(file.invoiceDate), formatAMPM(file.dueDate) +' '+formatDate(file.dueDate) ,file.vendorName,file.netAmt,file.version,file.status]}): []}
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
