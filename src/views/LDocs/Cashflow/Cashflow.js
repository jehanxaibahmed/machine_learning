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
import { _IsAr } from "../Functions/Functions";
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

  React.useEffect(async () => {
    setisLoading(true);
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/cashFlowDashBoard`,
      data: {
        organizationId: decoded.orgDetail.organizationId,
      },
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setisLoading(false);
        console.log(response);
        setGraphData(response ? response.data : []);
      })
      .catch((error) => {
        setisLoading(false);
        console.log(error);
        // if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setGraphData([]);
        console.log(error);
      });
  }, []);

  // {arPaidAmount: Array(0), apPaidAmount: Array(0), APvsAR: '', arMonthlyPaid: Array(0), apMonthlyPaid: Array(0), …}
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
                <p className={classes.cardCategory}>Income Summary</p>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle} style={{ color: "black" }}>
                    {graphData?.arPaidAmount?.[0] || 0}
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
                <p className={classes.cardCategory}>Expense Summary</p>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle} style={{ color: "black" }}>
                    {graphData?.apPaidAmount?.[0] || 0}
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
                  Income VS Expense Summary
                </p>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle} style={{ color: "black" }}>
                    {graphData?.APvsAR || 0}
                  </h3>
                )}
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <InsertDriveFileIcon />
                  <Link to="/admin/invoices">Show</Link>
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
                  }}
                  series={[
                    {
                      name: "Income",
                      data: [
                        30,
                        43344,
                        45,
                        50,
                        49,
                        4360,
                        70,
                        9341,
                        103,
                        300,
                        5443,
                        5342,
                      ],
                    },
                    {
                      name: "Expense",
                      data: [
                        30,
                        40,
                        45,
                        3450,
                        449,
                        60,
                        70,
                        91,
                        3232,
                        6676,
                        443543,
                        345435,
                      ],
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
                    colors: ["#9E2654","#5A2C66"],
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
                  }}
                  series={[
                    {
                      name: "Income",
                      data: [
                        30,
                        43344,
                        45,
                        50,
                        49,
                        4360,
                        70,
                        9341,
                        103,
                        300,
                        5443,
                        5342,
                      ],
                    },
                    {
                      name: "Expense",
                      data: [
                        30,
                        40,
                        45,
                        3450,
                        449,
                        60,
                        70,
                        91,
                        3232,
                        6676,
                        443543,
                        345435,
                      ],
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
                  <h4 className={classes.cardTitleText}>Latest Income</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                {1 + 1 == 3 ? (
                  <LinearProgress />
                ) : (
                  <Table
                    hover
                    tableHeaderColor="info"
                    tableHead={["DATE", "CUSTOMER", "AMOUNT"]}
                    tableData={[]}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>Latest Expense</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                {1 + 1 == 3 ? (
                  <LinearProgress />
                ) : (
                  <Table
                    hover
                    tableHeaderColor="info"
                    tableHead={["DATE", "VENDOR", "AMOUNT"]}
                    tableData={[]}
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
