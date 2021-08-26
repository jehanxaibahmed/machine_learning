import React from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
// react component for creating dynamic tables
import ReactTable from "react-table";
import Table from "components/Table/Table.js";

// @material-ui/core components
import {
  makeStyles,
  MenuItem,
  TextField,
  CircularProgress,
  Slide,
  Dialog,
  DialogContent,
  Tooltip,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
// @material-ui/icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import RateReview from "@material-ui/icons/RateReview";
import Swal from "sweetalert2";
import {
  successAlert,
  errorAlert,
  msgAlert,
} from "views/LDocs/Functions/Functions";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import Iframe from "react-iframe";
import FileAdvanceView from "../Invoices/AdvanceView/FileAdvanceView";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import jwt from "jsonwebtoken";
import {
  validateInvoice,
  formatDateTime,
} from "views/LDocs/Functions/Functions";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Validator from "../../Components/Timeline";
import { sendNotification, getNotification } from "actions";
import { useSelector, useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { CallReceived, DoneAll } from "@material-ui/icons";
import { setIsTokenExpired } from "actions";
import { addZeroes, _IsAr } from "../Functions/Functions";
import { Link } from "react-router-dom";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
    color: "black",
  },
  cardTitleText: {
    color: "white",
  },
  cardCategory: {
    color: "black",
  },
  buttonRight: {},
};

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Cashflow() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const decoded = jwt.decode(Token);

  const isAr = useSelector((state) => state.userReducer.isAr);
  const [graphData, setGraphData] = React.useState([]);
  const [isLoading, setisLoading] = React.useState(true);
  const classes = useStyles();
  const [statistics, setStatistics] = React.useState({
    data: null,
    cashflow: {
      options: {
        colors: ["#5A2C66", "#9E2654"],
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "March",
            "April",
            "May",
            "Jun",
            "July",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((m) => {
            return m.concat(" " + new Date().getFullYear());
          }),
        },
      },
      series: [
        {
          name: "Income",
          data: [30, 43344, 45, 50, 49, 4360, 70, 9341, 103, 300, 5443, 5342],
        },
        {
          name: "Expense",
          data: [30, 40, 45, 3450, 449, 60, 70, 91, 3232, 6676, 443543, 345435],
        },
      ],
    },
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    setisLoading(true);
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/cashFlowDashBoard`,
      data: {
        organizationId: decoded.orgDetail.organizationId,
      },
      headers: { cooljwt: Token },
    })
      .then((response) => {
        console.log(response);
        setGraphData(response ? response.data : []);
        setisLoading(false);
      })
      .catch((error) => {
        setisLoading(false);
        console.log(error);
        // if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setGraphData([]);
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={true}
      >
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  {/* <Store /> */}
                  <InsertDriveFileIcon />
                </CardIcon>
                <p className={classes.cardCategory}>Receivable Summary</p>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle} style={{ color: "black" }}>
                    {graphData?.arPaidAmount
                      ? `${graphData.currency.Code}  ${graphData
                          ?.arPaidAmount[0]?.netAmt_bc || 0}`
                      : 0}
                  </h3>
                )}
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <InsertDriveFileIcon />
                  <Link to="/admin/invoices">Show Receivables</Link>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  {/* <Store /> */}
                  <InsertDriveFileIcon />
                </CardIcon>
                <p className={classes.cardCategory}>Payable Summary</p>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle} style={{ color: "black" }}>
                    {graphData?.apPaidAmount
                      ? `${graphData.currency.Code}  ${graphData
                          ?.apPaidAmount[0]?.netAmt_bc || 0}`
                      : 0}
                  </h3>
                )}
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <InsertDriveFileIcon />
                  <Link to="/admin/invoices">Show Payables</Link>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  {/* <Store /> */}
                  <InsertDriveFileIcon />
                </CardIcon>
                <p className={classes.cardCategory}>
                  Payable VS Receivable 
                </p>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle} style={{ color: "black" }}>
                    {`${graphData.currency.Code}  ${addZeroes(graphData?.APvsAR).toFixed(2) || 0}`}
                  </h3>
                )}
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={12}>
            <Card>
              <CardHeader color="danger" icon>
                <CardIcon color="danger">
                  <h4 className={classes.cardTitleText}>Cashflow</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                <Chart
                  options={{
                    colors: ["#5A2C66", "#9E2654"],
                    xaxis: {
                      categories: graphData.arMonthlyPaid
                        ? Object.keys(graphData?.arMonthlyPaid[0]?.data || [])
                        : [],
                    },
                  }}
                  series={[
                    {
                      name: "Receivable",
                      data: graphData.arMonthlyPaid
                        ? Object.values(graphData?.arMonthlyPaid[0]?.data || [])
                        : [],
                    },
                    {
                      name: "Payable",
                      data: graphData.apMonthlyPaid
                        ? Object.values(graphData?.apMonthlyPaid[0]?.data || [])
                        : [],
                    },
                  ]}
                  type="line"
                  width="100%"
                  height="500px"
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>
                    Payments (Received Vs Paid)
                  </h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                <ReactApexChart
                  options={{
                    colors: ["#5A2C66", "#9E2654"],
                    xaxis: {
                      categories: graphData.apMonthlyPaid
                        ? Object.keys(graphData?.arInvoicePaid[0]?.data || [])
                        : [],
                    },
                  }}
                  series={[
                    {
                      name: "Received",
                      data: graphData.apMonthlyPaid
                        ? Object.values(graphData?.arInvoicePaid[0]?.data || [])
                        : [],
                    },
                    {
                      name: "Paid",
                      data: graphData.apMonthlyPaid
                        ? Object.values(graphData?.apInvoicePaid[0]?.data || [])
                        : [],
                    },
                  ]}
                  type="bar"
                  width="100%"
                  height="500px"
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardHeader color="danger" icon>
                <CardIcon color="danger">
                  <h4 className={classes.cardTitleText}>Latest Receivables</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <Table
                    hover
                    tableHeaderColor="info"
                    tableHead={["DATE", "CUSTOMER", "AMOUNT"]}
                    tableData={
                      graphData?.arLatestInvoices.map((inv) => {
                        return [
                          formatDateTime(inv.createdDate),
                          inv.clientName,
                          `${inv.LC_currency.Code} ${inv.netAmt_bc}`,
                        ];
                      }) || []
                    }
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>Latest Payables</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <Table
                    hover
                    tableHeaderColor="info"
                    tableHead={["DATE", "VENDOR", "AMOUNT"]}
                    tableData={
                      graphData?.apLatestInvoices.map((inv) => {
                        return [
                          formatDateTime(inv.createdDate),
                          inv.vendorName,
                          `${inv.LC_currency.Code} ${inv.netAmt_bc}`,
                        ];
                      }) || []
                    }
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
