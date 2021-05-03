import React from "react";
import { Link } from "react-router-dom";
// @material-ui/core components
import {
  makeStyles,
  LinearProgress,
  Typography,
  Box,
  IconButton,
  Backdrop,
  CircularProgress
} from "@material-ui/core";

import Icon from "@material-ui/core/Icon";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import StorageIcon from "@material-ui/icons/Storage";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
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
import BarChartIcon from "@material-ui/icons/BarChart";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import FindReplaceIcon from "@material-ui/icons/FindReplace";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import axios from "axios";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import dateFormat from "dateformat";
import CenterFocusWeakIcon from "@material-ui/icons/CenterFocusWeak";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import DateRangeIcon from "@material-ui/icons/DateRange";
import RoomIcon from "@material-ui/icons/Room";
import ViewListIcon from "@material-ui/icons/ViewList";
import { formatDateTime, addZeroes } from "../Functions/Functions";
import PieChartView from "./PieChart";
import LineChart from "./LineChart";
import Calendar from "../../Calendar/Calendar";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import Carousel from "react-material-ui-carousel";
import ReactApexChart from "react-apexcharts";
import { data } from "./Data";
import { setIsTokenExpired } from "actions";
const useStyles = makeStyles(styles);
const useStyleBackDrop = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));
  
export default function VendorDashboard() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  let decoded = jwt.decode(Token);
  const year =  new Date().getFullYear();
  const classes = useStyles();
  const backdropCss = useStyleBackDrop();
  const pendingApprovalIcon = require("assets/img/pendingApproval.png");
  const [chartdata, setChartData] = React.useState(data);
  const [quarterChartOptions, setQuarterChartOptions] = React.useState(data.quarterOptions);
  const [byAmountChartOptions, setByAmountChartOptions] = React.useState(data.byAmountOptions);
  const [graphData, setGraphData] = React.useState({});
  const [apiData, setApiData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();

  const getChartData = async () => {
    let dashboard_tables = [],
      quarter_tables = [],
      invByCount_totalOverdue = 0,
      invByCount_totalUnpaid = 0,
      invByCount_totalReadyForPay = 0,
      invByAmount_totalOverdue = 0,
      invByAmount_totalUnpaid = 0,
      invByAmount_totalReadyForPay = 0,
      q1_totalOverdue = 0,
      q1_totalUnpaid = 0,
      q1_totalReadyForPay = 0,
      q2_totalOverdue = 0,
      q2_totalUnpaid = 0,
      q2_totalReadyForPay = 0,
      q3_totalOverdue = 0,
      q3_totalUnpaid = 0,
      q3_totalReadyForPay = 0,
      q4_totalOverdue = 0,
      q4_totalUnpaid = 0,
      q4_totalReadyForPay = 0;
      console.log(decoded);
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getVendorChartData/${decoded.id}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setApiData(response.data);
        //Handling
        response.data.forEach((item, index) => {
          invByCount_totalOverdue += item.overDueCount;
          invByCount_totalUnpaid += item.unPaidCount;
          invByCount_totalReadyForPay += item.readyToPayCount;

          invByAmount_totalOverdue += item.overDueAmount;
          invByAmount_totalUnpaid += item.unPaidAmount;
          invByAmount_totalReadyForPay += item.readyToPayAmount;
        });

        let dashboard_table_1 = {
          key: "0",
          title: "Invoices By Count",
          totalOverdue: invByCount_totalOverdue,
          totalUnpaid: invByCount_totalUnpaid,
          totalReadyForPay: invByCount_totalReadyForPay,
        };

        let dashboard_table_2 = {
          key: "1",
          title: "Invoices By Amount",
          totalOverdue: invByAmount_totalOverdue.toFixed(2),
          totalUnpaid: invByAmount_totalUnpaid.toFixed(2),
          totalReadyForPay: invByAmount_totalReadyForPay.toFixed(2),
        };

        dashboard_tables.push(dashboard_table_1);
        dashboard_tables.push(dashboard_table_2);

        //Quarters Tables

        //Jan-Mar
        q1_totalOverdue = (
          response.data[0].overDueAmount +
          response.data[1].overDueAmount +
          response.data[2].overDueAmount
        ).toFixed(2);
        q1_totalUnpaid = (
          response.data[0].unPaidAmount +
          response.data[1].unPaidAmount +
          response.data[2].unPaidAmount
        ).toFixed(2);
        q1_totalReadyForPay = (
          response.data[0].readyToPayAmount +
          response.data[1].readyToPayAmount +
          response.data[2].readyToPayAmount
        ).toFixed(2);

        //Apr-Jun
        q2_totalOverdue = (
          response.data[3].overDueAmount +
          response.data[4].overDueAmount +
          response.data[5].overDueAmount
        ).toFixed(2);
        q2_totalUnpaid = (
          response.data[3].unPaidAmount +
          response.data[4].unPaidAmount +
          response.data[5].unPaidAmount
        ).toFixed(2);
        q2_totalReadyForPay = (
          response.data[3].readyToPayAmount +
          response.data[4].readyToPayAmount +
          response.data[5].readyToPayAmount
        ).toFixed(2);

        //Jul-Sep
        q3_totalOverdue = (
          response.data[6].overDueAmount +
          response.data[7].overDueAmount +
          response.data[8].overDueAmount
        ).toFixed(2);
        q3_totalUnpaid = (
          response.data[6].unPaidAmount +
          response.data[7].unPaidAmount +
          response.data[8].unPaidAmount
        ).toFixed(2);
        q3_totalReadyForPay = (
          response.data[6].readyToPayAmount +
          response.data[7].readyToPayAmount +
          response.data[8].readyToPayAmount
        ).toFixed(2);

        //Oct-Dec
        q4_totalOverdue = (
          response.data[9].overDueAmount +
          response.data[10].overDueAmount +
          response.data[11].overDueAmount
        ).toFixed(2);
        q4_totalUnpaid = (
          response.data[9].unPaidAmount +
          response.data[10].unPaidAmount +
          response.data[11].unPaidAmount
        ).toFixed(2);
        q4_totalReadyForPay = (
          response.data[9].readyToPayAmount +
          response.data[10].readyToPayAmount +
          response.data[11].readyToPayAmount
        ).toFixed(2);

        let q1_table = {
          key: "0",
          title: "Q1",
          period: `Jan-Mar ${year}`,
          totalOverdue: q1_totalOverdue,
          totalUnpaid: q1_totalUnpaid,
          totalReadyForPay: q1_totalReadyForPay,
        };
        let q2_table = {
          key: "1",
          title: "Q2",
          period: `Apr-Jun ${year}`,
          totalOverdue: q2_totalOverdue,
          totalUnpaid: q2_totalUnpaid,
          totalReadyForPay: q2_totalReadyForPay,
        };
        let q3_table = {
          key: "2",
          title: "Q3",
          period: `Jul-Sep ${year}`,
          totalOverdue: q3_totalOverdue,
          totalUnpaid: q3_totalUnpaid,
          totalReadyForPay: q3_totalReadyForPay,
        };
        let q4_table = {
          key: "3",
          title: "Q4",
          period: `Oct-Dec ${year}`,
          totalOverdue: q4_totalOverdue,
          totalUnpaid: q4_totalUnpaid,
          totalReadyForPay: q4_totalReadyForPay,
        };

        quarter_tables.push(q1_table);
        quarter_tables.push(q2_table);
        quarter_tables.push(q3_table);
        quarter_tables.push(q4_table);
        setGraphData({ dashboard_tables, quarter_tables });
        setLoading(false);
        console.log({ dashboard_tables, quarter_tables });
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setGraphData({});
        setLoading(false);
        console.log(error);
      });
  };
  React.useEffect(() => {
    getChartData();
  }, []);

  React.useEffect(()=>{
    if(graphData && apiData){
    const quarterOptions =  {
      fill: {
          colors: ["#007f5e"],
      },
    chart: {
      toolbar: {
        show: false,
      },
      type: "bar",
      
    },
    plotOptions: {
      bar: {
        columnWidth: "80%",
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
      //   formatter: function (val, opts) {
      //     return `${apiData[0] ? apiData[0].currencyCode : ''} ${val}`
      // }
    }
    },
    dataLabels: {
      offsetY: -20,
      enabled: true,
    //   formatter: function (val, opts) {
    //     return `${apiData[0] ? apiData[0].currencyCode : ''} ${val}`
    // },
      style: {
        fontSize: "12px",
        colors: ["black"],
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      title: {
        text: `Amount (${apiData[0] ? apiData[0].currencyCode : ''})`
      }
    },
    xaxis: {
      categories: [
        ["Over Due"],
        ["Un Paid"],
        ["Ready To Pay"]
      ],
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
  };
  const byAmountOptions = {
    fill: {
        colors: ["#095392"],
    },
  chart: {
    toolbar: {
      show: false,
    },
    type: "bar",
  },
  plotOptions: {
    bar: {
      columnWidth: "80%",
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  dataLabels: {
    offsetY: -20,
    enabled: true,
  //   formatter: function (val, opts) {
  //     return `${apiData[0] ? apiData[0].currencyCode : ''} ${val}`
  // },
    style: {
      fontSize: "12px",
      colors: ["black"],
    },
  },
  legend: {
    show: false,
  },
  yaxis: {
    title: {
      text: `Amount (${apiData[0] ? apiData[0].currencyCode : ''})`
    }
  },
  xaxis: {
    categories: [
      ["Over Due"],
      ["Un Paid"],
      ["Ready To Pay"]
    ],
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
};

    setQuarterChartOptions(quarterOptions);
    setByAmountChartOptions(byAmountOptions);
}
  },[graphData])


  return (
    <React.Fragment>
    {!loading ?
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
              <h3 className={classes.cardTitle}>
                {graphData.dashboard_tables
                  ? parseFloat(graphData.dashboard_tables[0].totalOverdue) +
                    parseFloat(graphData.dashboard_tables[0].totalReadyForPay) +
                    parseFloat(graphData.dashboard_tables[0].totalUnpaid)
                  : 0}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <InsertDriveFileIcon />
                <Link to="/admin/invoices">Show Invoices</Link>
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
              <p className={classes.cardCategory}>Over Due Invoices</p>
              <h3 className={classes.cardTitle}>
                {graphData.dashboard_tables
                  ? parseFloat(graphData.dashboard_tables[0].totalOverdue)
                  : 0}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <CenterFocusWeakIcon />
                <Link to="#">Show Open Invoices</Link>
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
              <p className={classes.cardCategory}>Un Paid Invoices</p>
              <h3 className={classes.cardTitle}>{graphData.dashboard_tables
                  ? parseFloat(graphData.dashboard_tables[0].totalUnpaid)
                  : 0}
                  </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <CenterFocusStrongIcon />
                <Link to="#">Show Closed Invoices</Link>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                {/* <i className="fab fa-twitter" /> */}
                <img
                  style={{
                    width: "36px",
                    height: "36px",
                    margin: "10px 10px 4px",
                    fontSize: "36px",
                    textAlign: "center",
                    lineHeight: "56px",
                  }}
                  src={pendingApprovalIcon}
                />
              </CardIcon>
              <p className={classes.cardCategory}>Ready To Pay</p>
              <h3 className={classes.cardTitle}>
                {graphData.dashboard_tables
                  ? parseFloat(graphData.dashboard_tables[0].totalReadyForPay) 
                  : 0}
              </h3>
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
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                {/* <BarChartIcon fontSize="large" /> */}
                <h4 className={classes.cardTitleWhite}>Invoices By Amount</h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridContainer justify="space-between">
                <GridItem xs={12} sm={12} md={12}>
                  <ReactApexChart
                    options={byAmountChartOptions}
                    series={
                      [
                        {
                          data:
                            graphData && graphData.dashboard_tables ? [
                            graphData.dashboard_tables[1].totalOverdue,
                            graphData.dashboard_tables[1].totalUnpaid,
                            graphData.dashboard_tables[1].totalReadyForPay
                          ]:
                          [0,0,0],
                        },
                      ]
                    }
                    type="bar"
                    height="300%"
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <Carousel autoPlay={false} animation="slide" timeout={100}>
            <GridContainer>
              <GridItem xs={12} sm={6} md={6} lg={6}>
                <Card>
                  <CardHeader color="danger" icon>
                    <CardText color="danger">
                      <h4 className={classes.cardTitleWhite}>Q1</h4>
                    </CardText>
                    <Typography
                      component="h2"
                      varient="body2"
                      style={{ float: "right", color: "grey" }}
                    >
                      Jan-Mar {year}
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <ReactApexChart
                      options={quarterChartOptions}
                      series={[
                        {
                          data:
                            graphData && graphData.quarter_tables ? [
                            graphData.quarter_tables[0].totalOverdue,
                            graphData.quarter_tables[0].totalUnpaid,
                            graphData.quarter_tables[0].totalReadyForPay
                          ]:
                          [0,0,0],
                        },
                      ]}
                      type="bar"
                      height="290%"
                    />
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={6} md={6} lg={6}>
                <Card>
                  <CardHeader color="info" icon>
                    <CardText color="info">
                      <h4 className={classes.cardTitleWhite}>Q2</h4>
                    </CardText>
                    <Typography
                      component="h2"
                      varient="body2"
                      style={{ float: "right", color: "grey" }}
                    >
                      Apr-Jun {year}
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <ReactApexChart
                      options={quarterChartOptions}
                      series={[
                        {
                          data: 
                            graphData && graphData.quarter_tables ? [
                            graphData.quarter_tables[1].totalOverdue,
                            graphData.quarter_tables[1].totalUnpaid,
                            graphData.quarter_tables[1].totalReadyForPay
                          ]:
                          [0,0,0],
                        },
                      ]}
                      type="bar"
                      height="290%"
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={6} md={6} lg={6}>
                <Card>
                  <CardHeader color="danger" icon>
                    <CardText color="danger">
                      <h4 className={classes.cardTitleWhite}>Q3</h4>
                    </CardText>
                    <Typography
                      component="h2"
                      varient="body2"
                      style={{ float: "right", color: "grey" }}
                    >
                      Jul-Sep {year}
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <ReactApexChart
                      options={quarterChartOptions}
                      series={[
                        {
                          data: 
                            graphData && graphData.quarter_tables ? [
                            graphData.quarter_tables[2].totalOverdue,
                            graphData.quarter_tables[2].totalUnpaid,
                            graphData.quarter_tables[2].totalReadyForPay
                          ]:
                          [0,0,0],
                        },
                      ]}
                      type="bar"
                      height="290%"
                    />
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={6} md={6} lg={6}>
                <Card>
                  <CardHeader color="info" icon>
                    <CardText color="info">
                      <h4 className={classes.cardTitleWhite}>Q4</h4>
                    </CardText>
                    <Typography
                      component="h2"
                      varient="body2"
                      style={{ float: "right", color: "grey" }}
                    >
                      Oct-Dec {year}
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <ReactApexChart
                      options={quarterChartOptions}
                      series={[
                        {
                          data: 
                            graphData && graphData.quarter_tables ? [
                            graphData.quarter_tables[3].totalOverdue,
                            graphData.quarter_tables[3].totalUnpaid,
                            graphData.quarter_tables[3].totalReadyForPay
                          ]:
                          [0,0,0],
                        },
                      ]}
                      type="bar"
                      height="290%"
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </Carousel>
        </GridItem>
      </GridContainer>
    </div>
    :
        <Backdrop className={backdropCss.backdrop} open={loading}>
          <CircularProgress  color="inherit" />
        </Backdrop>
    }
    </React.Fragment>
  );
}
