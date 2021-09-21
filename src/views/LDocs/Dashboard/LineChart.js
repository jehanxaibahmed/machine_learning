/* Imports */
import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

export default function LineChartView(props) {
  const [state, setState] = React.useState({
    MonthlyCount: props.chartData.MonthlyCount,
    fullPayment: props.chartData.fullPayment,
    partialPayment: props.chartData.partialPayment,
    paymentPending: props.chartData.paymentPending,
  });


  React.useEffect(()=>{
    setState({
      MonthlyCount: props.chartData.MonthlyCount,
      fullPayment: props.chartData.fullPayment,
      partialPayment: props.chartData.partialPayment,
      paymentPending: props.chartData.paymentPending
    })
  },[props.chartData])


  let summaryOptions = {
      fill: {
        colors: ["#5A2C66"],
      },
  
      chart: {
        toolbar: {
          show: false,
        },
  
        type: "bar",
        events: {
          click: function (chart, w, e) {
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
          ["Total Invoices"],
          ["Pending Payment"],
          ["Partial paid"],
          ["Invoice Paid"]
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
  }


  return (
    <div>
      <ReactApexChart
        options={summaryOptions}
        series={
          state
            ? [
                {
                  data: [
                    parseInt(state.MonthlyCount),
                    parseInt(state.paymentPending),
                    parseInt(state.partialPayment),
                    parseInt(state.fullPayment),
                  ],
                },
              ]
            : [
                {
                  data: [0, 0, 0, 0],
                },
              ]
        }
        type="bar"
        height="260%"
      />
    </div>
  );
}
