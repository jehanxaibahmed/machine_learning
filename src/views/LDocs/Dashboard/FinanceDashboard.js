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
import { useSelector } from "react-redux";
import { addZeroes } from "../Functions/Functions";

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
    color: '#fff',
  }
}));
export default function FinanceDashboard() {
  const classes = useStyles();
  const [chartdata, setChartData] = useState(data);
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const [graphData, setGraphData] = React.useState([]);
  const [purchaseOptions, setPurchaseOptions] = React.useState({purchaseOptions :data.purchaseOptions, purchaseSeries:data.purchaseSeries});
  const [amountOptions, setAmountOptions] = React.useState({amountOptions :data.amountOptions, amountSeries:data.amountSeries});
  const [tvpOptions, setTvpOptions] = React.useState({TvPoptions :data.TvPoptions, TvPseries:data.TvPseries});
  const [loading, setLoading] = React.useState(true)
  const getChartData = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/dashboard/financeBoard`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setGraphData(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        setGraphData([]);
        setLoading(false);
        console.log(error);
      });
  };
  React.useEffect(() => {
    getChartData();
  }, []);
  React.useEffect(() => {
    //Purchase Series
    if(graphData.topFiveVendor){
    const purchaseSeries = [
      {
        data: [
          graphData.topFiveVendor[0] ? addZeroes(graphData.topFiveVendor[0].totalAmount).toFixed(2) : 0, 
          graphData.topFiveVendor[1] ? addZeroes(graphData.topFiveVendor[1].totalAmount).toFixed(2) : 0,
          graphData.topFiveVendor[2] ? addZeroes(graphData.topFiveVendor[2].totalAmount).toFixed(2) : 0,
          graphData.topFiveVendor[3] ? addZeroes(graphData.topFiveVendor[3].totalAmount).toFixed(2) : 0,
          graphData.topFiveVendor[4] ? addZeroes(graphData.topFiveVendor[4].totalAmount).toFixed(2) : 0,
        ],
      },
    ];
    const purchaseOptions = {
      fill: {
        colors: ["#9e2654"],
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
        style: {
          fontSize: "12px",
          colors: ["black"],
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          graphData.topFiveVendor[0] ? [graphData.topFiveVendor[0]._id] : [""],
          graphData.topFiveVendor[1] ? [graphData.topFiveVendor[1]._id] : [""],
          graphData.topFiveVendor[2] ? [graphData.topFiveVendor[2]._id] : [""],
          graphData.topFiveVendor[3] ? [graphData.topFiveVendor[3]._id] : [""],
          graphData.topFiveVendor[4] ? [graphData.topFiveVendor[4]._id] : [""],
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
    };
    setPurchaseOptions({purchaseSeries,purchaseOptions });
  }
  if(graphData.topFiveVendorsAmountDue){
    const amountSeries = [
      {
        data: [
          graphData.topFiveVendorsAmountDue[0] ? addZeroes(graphData.topFiveVendorsAmountDue[0].totalDueAmount).toFixed(2) : 0, 
          graphData.topFiveVendorsAmountDue[1] ? addZeroes(graphData.topFiveVendorsAmountDue[1].totalDueAmount).toFixed(2) : 0,
          graphData.topFiveVendorsAmountDue[2] ? addZeroes(graphData.topFiveVendorsAmountDue[2].totalDueAmount).toFixed(2) : 0,
          graphData.topFiveVendorsAmountDue[3] ? addZeroes(graphData.topFiveVendorsAmountDue[3].totalDueAmount).toFixed(2) : 0,
          graphData.topFiveVendorsAmountDue[4] ? addZeroes(graphData.topFiveVendorsAmountDue[4].totalDueAmount).toFixed(2) : 0,
        ],
      },
    ];
    const amountOptions = {
      fill: {
        colors: ["#5a2c66"],
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
        style: {
          fontSize: "12px",
          colors: ["black"],
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          graphData.topFiveVendorsAmountDue[0] ? [graphData.topFiveVendorsAmountDue[0]._id] : [""],
          graphData.topFiveVendorsAmountDue[1] ? [graphData.topFiveVendorsAmountDue[1]._id] : [""],
          graphData.topFiveVendorsAmountDue[2] ? [graphData.topFiveVendorsAmountDue[2]._id] : [""],
          graphData.topFiveVendorsAmountDue[3] ? [graphData.topFiveVendorsAmountDue[3]._id] : [""],
          graphData.topFiveVendorsAmountDue[4] ? [graphData.topFiveVendorsAmountDue[4]._id] : [""],
        ]
        ,
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
  if(graphData.totalPurchasedVsPaid){
        //Total vs Paid Chart 
        const purchased = Object.values(graphData.totalPurchasedVsPaid.PurchasedInvoice[0].data);
        const purchasedMonths = Object.keys(graphData.totalPurchasedVsPaid.PurchasedInvoice[0].data);
        const paidMonths = Object.keys(graphData.totalPurchasedVsPaid.PaidInvoice[0].data);
        const paid = Object.values(graphData.totalPurchasedVsPaid.PaidInvoice[0].data);

        const TvPseries =  [
          {
            name: "Purchased",
            type: "column",
            fill: {
                colors: ["#5a2c66"],
            },
            // data: [44, 55, 41, 64, 22, 43, 44, 55, 41, 64, 21],
            data: [
              purchased[0] ? addZeroes(purchased[0]).toFixed(2) : 0,
              purchased[1] ? addZeroes(purchased[1]).toFixed(2) : 0,
              purchased[2] ? addZeroes(purchased[2]).toFixed(2) : 0,
              purchased[3] ? addZeroes(purchased[3]).toFixed(2) : 0,
              purchased[4] ? addZeroes(purchased[4]).toFixed(2) : 0,
              purchased[5] ? addZeroes(purchased[5]).toFixed(2) : 0,
              purchased[6] ? addZeroes(purchased[6]).toFixed(2) : 0,
              purchased[7] ? addZeroes(purchased[7]).toFixed(2) : 0,
              purchased[8] ? addZeroes(purchased[8]).toFixed(2) : 0,
              purchased[9] ? addZeroes(purchased[9]).toFixed(2) : 0,
              purchased[10] ? addZeroes(purchased[10]).toFixed(2) : 0,
              purchased[11] ? addZeroes(purchased[11]).toFixed(2) : 0,
            
             
            ],
          },
          {
            fill: {
                colors: ["#5a2c66"],
            },
            name: "Paid",
            type: "column",
            data: [
              paid[0] ? addZeroes(paid[0]).toFixed(2) : 0,
              paid[1] ? addZeroes(paid[1]).toFixed(2) : 0,
              paid[2] ? addZeroes(paid[2]).toFixed(2) : 0,
              paid[3] ? addZeroes(paid[3]).toFixed(2) : 0,
              paid[4] ? addZeroes(paid[4]).toFixed(2) : 0,
              paid[5] ? addZeroes(paid[5]).toFixed(2) : 0,
              paid[6] ? addZeroes(paid[6]).toFixed(2) : 0,
              paid[7] ? addZeroes(paid[7]).toFixed(2) : 0,
              paid[8] ? addZeroes(paid[8]).toFixed(2) : 0,
              paid[9] ? addZeroes(paid[9]).toFixed(2) : 0,
              paid[10] ? addZeroes(paid[10]).toFixed(2) : 0,
              paid[11] ? addZeroes(paid[11]).toFixed(2) : 0,
             
            ]
          }
        ];
        const TvPoptions = {
            colors:['#5a2c66', '#9e2654'],
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
                colors:['#5a2c66', '#9e2654'],
            },
            bar: {
              columnWidth: "70%",
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
            offsetX: 40,
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
    {!loading ?
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
                variant="h3"
                style={{
                  marginTop: "10px",
                }}
              >
                
                {`SAR ${graphData.totalDueInvoices && graphData.totalDueInvoices[0]
                  ? parseFloat(
                      graphData.totalDueInvoices[0].totalAmount
                    ).toFixed(2)
                  : 0}`}
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
                variant="h3"
                style={{
                  marginTop: "10px",
                }}
              >
                {graphData.totalInvoiceAmount && graphData.totalInvoiceAmount[0]
                  ? parseFloat(
                      graphData.totalInvoiceAmount[0].totalAmount
                    ).toFixed(2)
                  : 0}
              </Typography>
            </CardContent>
          </Card>
        </GridItem>
        <GridItem xs={6} md={6} lg={6}>
          <Card elevation="0">
            <CardHeader color="danger" icon>
              <CardText color="danger">
                <h4 className={classes.cardTitleWhite}>Due By Age Summary</h4>
              </CardText>
            </CardHeader>
            <CardContent>
              <ReactApexChart
                options={chartdata.summaryOptions}
                series={
                  graphData.AgeSummery
                    ? [
                        {
                          data: [
                            parseFloat(graphData.AgeSummery.thirtyDays).toFixed(2),
                            parseFloat(graphData.AgeSummery.sixtyDays).toFixed(2),
                            parseFloat(graphData.AgeSummery.ninetyDays).toFixed(2),
                            parseFloat(graphData.AgeSummery.oneTwentyDays).toFixed(2),
                            parseFloat(graphData.AgeSummery.older).toFixed(2),
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
                total amount outstanding to creditors, as well as for how long
                it's been outstanding. In this example you're able to see
                straight.
              </Typography>
            </CardContent>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
     :
     <Backdrop className={classes.backdrop} open={loading}>
       <CircularProgress  color="inherit" />
     </Backdrop>
 }
 </React.Fragment>
  );
}
