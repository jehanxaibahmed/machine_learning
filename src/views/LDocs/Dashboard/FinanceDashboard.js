import React, {useState} from "react";
import {
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    makeStyles,
  } from "@material-ui/core";
  import ReactApexChart from "react-apexcharts";
  import { data } from "./Data";
  
  const useStyles = makeStyles((theme) => ({
    root: {
      textAlign: "center",
    },
    cardHeadStyle: {
      backgroundColor: "gray",
      color: "white",
    },
  }));
  export default function FinanceDashboard (){
    const classes = useStyles();
    const [chartdata, setChartData] = useState(data);
    return (
      <div>
          <Grid className={classes.root} container xs={12} md={12} lg={12}>
            <Grid item xs={2} md={2} lg={2}>
              <Card>
                <CardContent>
                  <Typography variant="h5" className={classes.cardHeadStyle}>
                    Creditors Days
                  </Typography>
                  <Typography
                    style={{ marginTop: "15px" }}
                    variant="h3"
                    color="error"
                  >
                    181.44!
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent style={{ backgroundColor: "#093030" }}>
                  <Typography
                    variant="h4"
                    style={{
                      color: "white",
                      marginTop: "15px",
                    }}
                  >
                    $38,575
                  </Typography>
                  <Typography
                    style={{ marginTop: "10px", color: "white" }}
                    variant="h5"
                  >
                    Bank Balance
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent style={{ backgroundColor: "#385c6b" }}>
                  <Typography
                    variant="h4"
                    style={{
                      color: "white",
                      marginTop: "15px",
                    }}
                  >
                    $38,6202
                  </Typography>
                  <Typography
                    style={{ marginTop: "10px", color: "white" }}
                    variant="h5"
                  >
                    Total Due
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid style={{}} item xs={6} md={6} lg={6}>
              <Card elevation="0">
                <CardContent>
                  <Typography variant="h5" className={classes.cardHeadStyle}>
                    Due By Age Summary
                  </Typography>
                  <ReactApexChart
                    options={chartdata.summaryOptions}
                    series={chartdata.summarySeries}
                    type="bar"
                    height="200%"
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid style={{ height: "10px" }} item xs={4} md={4} lg={4}>
              <Card elevation="0">
                <CardContent>
                  <Typography variant="h5" className={classes.cardHeadStyle}>
                    Top 5 Vendors By Purchases !
                  </Typography>
                  <ReactApexChart
                    options={chartdata.purchaseOptions}
                    series={chartdata.purchaseSeries}
                    type="bar"
                    height="85%"
                  />
                </CardContent>
  
                <CardContent>
                  <Typography variant="h5" className={classes.cardHeadStyle}>
                    Top 5 Vendors By Amount Due !
                  </Typography>
                  <ReactApexChart
                    options={chartdata.amountOptions}
                    series={chartdata.amountSeries}
                    type="bar"
                    height="80%"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid className={classes.root}>
            <Grid style={{}} item xs={12} md={12} lg={12}>
              <Card elevation="0">
                <CardContent>
                  <Typography variant="h5" className={classes.cardHeadStyle}>
                    Total invoices vs paid invoices
                  </Typography>
                  <ReactApexChart
                    options={chartdata.TvPoptions}
                    series={chartdata.TvPseries}
                    type="line"
                    height="100%"
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
            </Grid>
          </Grid>
      </div>
    );
  };
  