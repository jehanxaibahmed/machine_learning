export const data = {
    //Summary Chart data
    summarySeries: [
      {
        data: [5, 36, 28, 67, 251],
      },
    ],
    summaryOptions: {
      fill: {
        colors: ["#35c72e"],
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
    },
  
    // purchase chart data
  
    purchaseSeries: [
      {
        data: [0.59, 0.34, 0.02, 0.01, 0.0],
      },
    ],
    purchaseOptions: {
      chart: {
        toolbar: {
          show: false,
        },
  
        type: "bar",
        events: {
          click: function (chart, w, e) {},
        },
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
          ["MountainPro"],
          ["CycleGo"],
          ["Betol Parts"],
          ["BC Hydro"],
          ["Jose Designs"],
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
    },
  
    //Vendors By Amount Chart Data
    amountSeries: [
      {
        data: [0.22, 0.15, 0.01, 0.0, 0.0],
      },
    ],
    amountOptions: {
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
          ["CycleGo"],
          ["MountainPro"],
          ["Betol Parts"],
          ["Jose Designs"],
          ["Kendal Tub.."],
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
    },
  
    //Total vs Paid Chart Data
    TvPseries: [
      {
        name: "Purchased",
        type: "column",
  
        data: [44, 55, 41, 64, 22, 43, 44, 55, 41, 64, 21],
      },
      {
        name: "Paid",
        type: "column",
        data: [53, 32, 44, 55, 41, 64, 33, 52, 13, 44, 32],
      },
      {
        name: "Average Credit Terms",
        // type: "line",
        data: [53, 32, 44, 55, 55, 64, 33, 52, 13, 44, 32],
      },
    ],
    TvPoptions: {
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
          ["Jul-2017"],
          ["Aug-2017"],
          ["Sep-2017"],
          ["Oct-2017"],
          ["Nov-2017"],
          ["Dec-2017"],
          ["Jan-2018"],
          ["Feb-2018"],
          ["Mar-2018"],
          ["Apr-2018"],
          ["May-2018"],
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
    },
  };
  