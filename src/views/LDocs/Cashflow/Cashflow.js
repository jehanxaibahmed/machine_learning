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
  const isAr = useSelector((state) => state.userReducer.isAr);
  const classes = useStyles();
  const [statistics, setStatistics] = React.useState({
    cashflow: {
      options: {
        colors:['#5A2C66', '#9E2654'],
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: ["Jan 2021", "Feb 2021", "March 2021", "April 2021", "May 2021", "Jun 2021", "Junly 2021", "Aug 2021", "Sep 2021", "Oct 2021", "Nov 2021", "Dec 2021"],
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
                {1 + 1 == 2 ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle}>
                    {statistics?.totalInvoice}
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
                {1 + 1 == 2 ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle}>
                    {statistics?.totalInvoice}
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
                {1 + 1 == 2 ? (
                  <LinearProgress />
                ) : (
                  <h3 className={classes.cardTitle}>
                    {statistics?.totalInvoice}
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
                  options={statistics.cashflow.options}
                  series={statistics.cashflow.series}
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
                  <h4 className={classes.cardTitleText}>Payments (Received Vs Paid)</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                <ReactApexChart
                  options={statistics.cashflow.options}
                  series={statistics.cashflow.series}
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
              {1 + 1 == 3 ? <LinearProgress  /> : 
              <Table
                hover
                tableHeaderColor="info"
                tableHead={["DATE","CUSTOMER","AMOUNT"]}
                tableData={[]}
              />
              }
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
              {1 + 1 == 3 ? <LinearProgress  /> : 
              <Table
                hover
                tableHeaderColor="info"
                tableHead={["DATE","VENDOR","AMOUNT"]}
                tableData={[]}
              />
              }
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>
    </div>
  );
}
