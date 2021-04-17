export const data = {
    //Summary Chart data
    summarySeries: [
      {
        data: [5, 36, 28, 67, 251],
      },
    ],
    summaryOptions: {
      fill: {
        colors: ["#095392"],
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
        data: [0, 0, 0, 0, 0],
      },
    ],
    purchaseOptions: {
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
              [""],
              [""],
              [""],
              [""],
              [""],
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
        data: [0, 0, 0, 0, 0],
      },
    ],
    amountOptions: {
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
          [""],
          [""],
          [""],
          [""],
          [""],
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
        fill: {
            colors: ["#095392"],
        },
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        fill: {
            colors: ["#095392"],
        },
        name: "Paid",
        type: "column",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      }
    ],
    TvPoptions: {
        colors:['#095392', '#007f5e'],
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
            colors:['#095392', '#007f5e'],
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
          [""],
          [""],
          [""],
          [""],
          [""],
          [""],
          [""],
          [""],
          [""],
          [""],
          [""],
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
    },

    // purchase chart data
  
    quarterSeries: [
      {
        data: [0, 0, 0],
      },
    ],
    quarterOptions: {
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
        },
    //Vendors By Amount Chart Data
    byAmountSeries: [
      {
        data: [0, 0, 0],
      },
    ],
    byAmountOptions: {
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
    },
  
  };
  

  