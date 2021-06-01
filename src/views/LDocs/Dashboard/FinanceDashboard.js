import React, { useState } from "react";
import {
  Typography,
  Container,
  Grid,
  CardContent,
  Backdrop,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { data } from "./Data";
import { useSelector, useDispatch } from "react-redux";
import { setIsTokenExpired } from "actions";

const useStyles = makeStyles((theme) => ({
  root: {
    // textAlign: "center",
  },
  cardHeadStyle: {
    backgroundColor: "gray",
    color: "white",
  },
  cardContent: {
    textAlign: "center",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
export default function FinanceDashboard() {
  const classes = useStyles();
  const [chartdata, setChartData] = useState(data);
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const [graphData, setGraphData] = React.useState([]);
  const [summaryOptions, setSummaryOptions] = React.useState({
    summaryOptions: data.summaryOptions,
    summarySeries: data.summarySeries,
  });
  const [purchaseOptions, setPurchaseOptions] = React.useState({
    purchaseOptions: data.purchaseOptions,
    purchaseSeries: data.purchaseSeries,
  });
  const [amountOptions, setAmountOptions] = React.useState({
    amountOptions: data.amountOptions,
    amountSeries: data.amountSeries,
  });
  const [tvpOptions, setTvpOptions] = React.useState({
    TvPoptions: data.TvPoptions,
    TvPseries: data.TvPseries,
  });
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const formatCash = (n) => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
  };
  const getChartData = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/financeBoard`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        console.log(response);
        setGraphData(response ? response.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setGraphData([]);
        setLoading(false);
        console.log(error);
      });
  };
  React.useEffect(() => {
    getChartData();
  }, []);
  React.useEffect(() => {
    //Summary Options
    if (graphData.AgeSummery) {
      const summaryOptions = {
        fill: {
          colors: ["#095392"],
        },

        chart: {
          toolbar: {
            show: false,
          },

          type: "bar",
          events: {
            click: function(chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "80%",
            // style: {
            //   backgroundColor: ["green"],
            // },
            // distributed: true,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          //   formatter: function (val, opts) {
          //     return `${graphData.currencyInfo.Code} ${val}`
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
          // title: {
          //   text: `Amount ( ${graphData.currencyInfo.Code} )`,
          // },
          labels: {
            formatter: function (val, opts) {
              return `${graphData.currencyInfo.Code} ${val}`
            }
          },
        },
        xaxis: {
          categories: [
            ["<30 Days"],
            ["<60 Days"],
            ["<90 Days"],
            ["<120 Days"],
            ["Other"],
          ],
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      };

      setSummaryOptions({
        summaryOptions: summaryOptions,
        summarySeries: graphData.AgeSummery,
      });
    }
    //Purchase Series
    if (graphData.topFiveVendor) {
      const purchaseSeries = [
        {
          data: [
            graphData.topFiveVendor[0]
              ? parseFloat(
                  graphData.topFiveVendor[0]
                    ? graphData.topFiveVendor[0].totalAmount
                    : 0
                ).toFixed(2)
              : 0,
            graphData.topFiveVendor[1]
              ? parseFloat(
                  graphData.topFiveVendor[1]
                    ? graphData.topFiveVendor[1].totalAmount
                    : 0
                ).toFixed(2)
              : 0,
            graphData.topFiveVendor[2]
              ? parseFloat(
                  graphData.topFiveVendor[2]
                    ? graphData.topFiveVendor[2].totalAmount
                    : 0
                ).toFixed(2)
              : 0,
            graphData.topFiveVendor[3]
              ? parseFloat(
                  graphData.topFiveVendor[3]
                    ? graphData.topFiveVendor[3].totalAmount
                    : 0
                ).toFixed(2)
              : 0,
            graphData.topFiveVendor[4]
              ? parseFloat(
                  graphData.topFiveVendor[4]
                    ? graphData.topFiveVendor[4].totalAmount
                    : 0
                ).toFixed(2)
              : 0,
          ],
        },
      ];
      const purchaseOptions = {
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
        },
        dataLabels: {
          //   formatter: function (val, opts) {
          //     return `${graphData.currencyInfo.Code} ${val}`
          // },
          offsetY: -20,
          enabled: true,

          style: {
            fontSize: "12px",
            colors: ["black"],
          },
        },
        legend: {
          show: false,
        },
        yaxis: {
          // title: {
          //   text: `Amount ( ${graphData.currencyInfo.Code} )`,
          // },
          labels: {
            formatter: function (val, opts) {
              return `${graphData.currencyInfo.Code} ${val}`
            }
          },
        },
        xaxis: {
          categories: [
            graphData.topFiveVendor[0]
              ? [graphData.topFiveVendor[0]._id]
              : [""],
            graphData.topFiveVendor[1]
              ? [graphData.topFiveVendor[1]._id]
              : [""],
            graphData.topFiveVendor[2]
              ? [graphData.topFiveVendor[2]._id]
              : [""],
            graphData.topFiveVendor[3]
              ? [graphData.topFiveVendor[3]._id]
              : [""],
            graphData.topFiveVendor[4]
              ? [graphData.topFiveVendor[4]._id]
              : [""],
          ],
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      };
      setPurchaseOptions({ purchaseSeries, purchaseOptions });
    }
    if (graphData.topFiveVendorsAmountDue) {
      const amountSeries = [
        {
          data: [
            graphData.topFiveVendorsAmountDue[0]
              ? parseFloat(
                  graphData.topFiveVendorsAmountDue[0].totalDueAmount
                ).toFixed(2)
              : 0,
            graphData.topFiveVendorsAmountDue[1]
              ? parseFloat(
                  graphData.topFiveVendorsAmountDue[1].totalDueAmount
                ).toFixed(2)
              : 0,
            graphData.topFiveVendorsAmountDue[2]
              ? parseFloat(
                  graphData.topFiveVendorsAmountDue[2].totalDueAmount
                ).toFixed(2)
              : 0,
            graphData.topFiveVendorsAmountDue[3]
              ? parseFloat(
                  graphData.topFiveVendorsAmountDue[3].totalDueAmount
                ).toFixed(2)
              : 0,
            graphData.topFiveVendorsAmountDue[4]
              ? parseFloat(
                  graphData.topFiveVendorsAmountDue[4].totalDueAmount
                ).toFixed(2)
              : 0,
          ],
        },
      ];
      const amountOptions = {
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
          //   formatter: function (val, opts) {
          //     return `${graphData.currencyInfo.Code} ${val}`
          // },
          offsetY: -20,
          enabled: true,
          style: {
            fontSize: "12px",
            colors: ["black"],
          },
        },
        legend: {
          show: false,
        },
        yaxis: {
          // title: {
          //   text: `Amount ( ${graphData.currencyInfo.Code} )`,
          // },
          labels: {
            formatter: function (val, opts) {
              return `${graphData.currencyInfo.Code} ${val}`
            }
          },
        },
        xaxis: {
          categories: [
            graphData.topFiveVendorsAmountDue[0]
              ? [graphData.topFiveVendorsAmountDue[0]._id]
              : [""],
            graphData.topFiveVendorsAmountDue[1]
              ? [graphData.topFiveVendorsAmountDue[1]._id]
              : [""],
            graphData.topFiveVendorsAmountDue[2]
              ? [graphData.topFiveVendorsAmountDue[2]._id]
              : [""],
            graphData.topFiveVendorsAmountDue[3]
              ? [graphData.topFiveVendorsAmountDue[3]._id]
              : [""],
            graphData.topFiveVendorsAmountDue[4]
              ? [graphData.topFiveVendorsAmountDue[4]._id]
              : [""],
          ],
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      };
      console.log({ amountSeries, amountOptions });
      setAmountOptions({ amountSeries, amountOptions });
    }
    if (graphData.totalPurchasedVsPaid) {
      //Total vs Paid Chart
      const purchased = Object.values(
        graphData.totalPurchasedVsPaid.PurchasedInvoice[0]
          ? graphData.totalPurchasedVsPaid.PurchasedInvoice[0].data
          : []
      );
      const purchasedMonths = Object.keys(
        graphData.totalPurchasedVsPaid.PurchasedInvoice[0]
          ? graphData.totalPurchasedVsPaid.PurchasedInvoice[0].data
          : []
      );
      const paidMonths = Object.keys(
        graphData.totalPurchasedVsPaid.PaidInvoice[0]
          ? graphData.totalPurchasedVsPaid.PaidInvoice[0].data
          : []
      );
      const paid = Object.values(
        graphData.totalPurchasedVsPaid.PaidInvoice[0]
          ? graphData.totalPurchasedVsPaid.PaidInvoice[0].data
          : []
      );

      const TvPseries = [
        {
          name: "Purchased",
          type: "column",
          fill: {
            colors: ["#095392"],
          },
          // data: [44, 55, 41, 64, 22, 43, 44, 55, 41, 64, 21],
          data: graphData.totalPurchasedVsPaid.PurchasedInvoice
            ? [
                purchased[0] ? parseFloat(purchased[0]).toFixed(2) : 0,
                purchased[1] ? parseFloat(purchased[1]).toFixed(2) : 0,
                purchased[2] ? parseFloat(purchased[2]).toFixed(2) : 0,
                purchased[3] ? parseFloat(purchased[3]).toFixed(2) : 0,
                purchased[4] ? parseFloat(purchased[4]).toFixed(2) : 0,
                purchased[5] ? parseFloat(purchased[5]).toFixed(2) : 0,
                purchased[6] ? parseFloat(purchased[6]).toFixed(2) : 0,
                purchased[7] ? parseFloat(purchased[7]).toFixed(2) : 0,
                purchased[8] ? parseFloat(purchased[8]).toFixed(2) : 0,
                purchased[9] ? parseFloat(purchased[9]).toFixed(2) : 0,
                purchased[10] ? parseFloat(purchased[10]).toFixed(2) : 0,
                purchased[11] ? parseFloat(purchased[11]).toFixed(2) : 0,
              ]
            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          fill: {
            colors: ["#095392"],
          },
          name: "Paid",
          type: "column",
          data: graphData.totalPurchasedVsPaid.PaidInvoice
            ? [
                paid[0] ? parseFloat(paid[0]).toFixed(2) : 0,
                paid[1] ? parseFloat(paid[1]).toFixed(2) : 0,
                paid[2] ? parseFloat(paid[2]).toFixed(2) : 0,
                paid[3] ? parseFloat(paid[3]).toFixed(2) : 0,
                paid[4] ? parseFloat(paid[4]).toFixed(2) : 0,
                paid[5] ? parseFloat(paid[5]).toFixed(2) : 0,
                paid[6] ? parseFloat(paid[6]).toFixed(2) : 0,
                paid[7] ? parseFloat(paid[7]).toFixed(2) : 0,
                paid[8] ? parseFloat(paid[8]).toFixed(2) : 0,
                paid[9] ? parseFloat(paid[9]).toFixed(2) : 0,
                paid[10] ? parseFloat(paid[10]).toFixed(2) : 0,
                paid[11] ? parseFloat(paid[11]).toFixed(2) : 0,
              ]
            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ];
      const TvPoptions = {
        colors: ["#095392", "#007f5e"],
        chart: {
          type: "line",
          height: 350,
          toolbar: {
            show: false,
          },
        },
        stroke: {
          width: [0, 4],
        },
        plotOptions: {
          fill: {
            colors: ["#095392", "#007f5e"],
          },
          bar: {
            columnWidth: "70%",
          },
        },
        dataLabels: {
          background: {
            enabled: false,
          },
          //   formatter: function (val, opts) {
          //     return `${graphData.currencyInfo.Code} ${val}`
          // },
          offsetY: -20,
          enabled: true,
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          offsetX: 40,
        },
        yaxis: {
          // title: {
          //   text: `Amount ( ${graphData.currencyInfo.Code} )`,
          // },
          labels: {
            formatter: function (val, opts) {
              return `${graphData.currencyInfo.Code} ${val}`
            }
          },
        },
        xaxis: {
          categories: [
            [paidMonths[0]],
            [paidMonths[1]],
            [paidMonths[2]],
            [paidMonths[3]],
            [paidMonths[4]],
            [paidMonths[5]],
            [paidMonths[6]],
            [paidMonths[7]],
            [paidMonths[8]],
            [paidMonths[9]],
            [paidMonths[10]],
            [paidMonths[11]],
          ],
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      };
      setTvpOptions({ TvPseries, TvPoptions });
    }
  }, [graphData]);

  return (
    <React.Fragment>
      {!loading ? (
        <div>
          <GridContainer className={classes.root}>
            <GridItem item xs={2} md={2} lg={2}>
              <Card>
                <CardHeader color="info" icon>
                  <CardText color="info">
                    <h4 className={classes.cardTitleWhite}>Average Days</h4>
                  </CardText>
                </CardHeader>
                <CardContent className={classes.cardContent}>
                  <Typography
                    style={{ marginTop: "10px" }}
                    variant="h3"
                    color="error"
                  >
                    {graphData.avgDays && graphData.avgDays[0].days
                      ? parseFloat(graphData.avgDays[0].days).toFixed(2)
                      : 0}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader color="danger" icon>
                  <CardText color="danger">
                    <h4 className={classes.cardTitleWhite}>Total Due Amount</h4>
                  </CardText>
                </CardHeader>
                <CardContent className={classes.cardContent}>
                  <Typography
                    variant="h4"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    {`${
                      graphData.currencyInfo ? graphData.currencyInfo.Code : ""
                    } ${
                      graphData.totalDueInvoices &&
                      graphData.totalDueInvoices[0]
                        ? formatCash(graphData.totalDueInvoices[0].totalAmount.toFixed(2))
                        : 0
                    }`}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader color="info" icon>
                  <CardText color="info">
                    <h4 className={classes.cardTitleWhite}>Total Invoices</h4>
                  </CardText>
                </CardHeader>
                <CardContent className={classes.cardContent}>
                  <Typography
                    variant="h4"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    {`${
                      graphData.currencyInfo ? graphData.currencyInfo.Code : ""
                    } ${
                      graphData.totalInvoiceAmount &&
                      graphData.totalInvoiceAmount[0]
                        ? formatCash(
                            graphData.totalInvoiceAmount[0].totalAmount.toFixed(2)
                          )
                        : 0
                    }`}
                  </Typography>
                </CardContent>
              </Card>
            </GridItem>
            <GridItem xs={6} md={6} lg={6}>
              <Card elevation="0">
                <CardHeader color="danger" icon>
                  <CardText color="danger">
                    <h4 className={classes.cardTitleWhite}>
                      Due By Age Summary
                    </h4>
                  </CardText>
                </CardHeader>
                <CardContent>
                  <ReactApexChart
                    options={summaryOptions.summaryOptions}
                    series={
                      graphData.AgeSummery
                        ? [
                            {
                              data: [
                                parseFloat(
                                  graphData.AgeSummery.thirtyDays
                                ).toFixed(2),
                                parseFloat(
                                  graphData.AgeSummery.sixtyDays
                                ).toFixed(2),
                                parseFloat(
                                  graphData.AgeSummery.ninetyDays
                                ).toFixed(2),
                                parseFloat(
                                  graphData.AgeSummery.oneTwentyDays
                                ).toFixed(2),
                                parseFloat(graphData.AgeSummery.older).toFixed(
                                  2
                                ),
                              ],
                            },
                          ]
                        : [
                            {
                              data: [0, 0, 0, 0, 0],
                            },
                          ]
                    }
                    type="bar"
                    height="280%"
                  />
                </CardContent>
              </Card>
            </GridItem>
            <GridItem xs={4} md={4} lg={4}>
              <Card elevation="0">
                <CardHeader color="info" icon>
                  <CardText color="info">
                    <h4 className={classes.cardTitleWhite}>
                      Top 5 Vendors By Purchases !
                    </h4>
                  </CardText>
                </CardHeader>
                <CardContent>
                  <ReactApexChart
                    options={purchaseOptions.purchaseOptions}
                    series={purchaseOptions.purchaseSeries}
                    type="bar"
                    height="100%"
                  />
                </CardContent>
              </Card>
              <Card elevation="0">
                <CardHeader color="danger" icon>
                  <CardText color="danger">
                    <h4 className={classes.cardTitleWhite}>
                      Top 5 Vendors By Amount Due !
                    </h4>
                  </CardText>
                </CardHeader>
                <CardContent>
                  <ReactApexChart
                    options={amountOptions.amountOptions}
                    series={amountOptions.amountSeries}
                    type="bar"
                    height="100%"
                  />
                </CardContent>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer className={classes.root}>
            <GridItem style={{}} item xs={12} md={12} lg={12}>
              <Card elevation="0">
                <CardHeader color="danger" icon>
                  <CardText color="danger">
                    <h4 className={classes.cardTitleWhite}>
                      Total invoices vs paid invoices
                    </h4>
                  </CardText>
                </CardHeader>
                <CardContent>
                  <Typography
                    variant="h5"
                    className={classes.cardHeadStyle}
                  ></Typography>
                  <ReactApexChart
                    options={tvpOptions.TvPoptions}
                    series={tvpOptions.TvPseries}
                    type="line"
                    height="300%"
                  />
                </CardContent>
                <CardContent>
                  <Typography variant="p" style={{ fontSize: 14 }}>
                    Look at the Due by Age Summary, a bussiness ower can see the
                    total amount outstanding to creditors, as well as for how
                    long it's been outstanding. In this example you're able to
                    see straight.
                  </Typography>
                </CardContent>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      ) : (
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </React.Fragment>
  );
}
