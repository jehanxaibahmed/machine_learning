import React, { Component } from "react";
import Chart from "react-apexcharts";

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: ["0-1", "1-2", "2-3", "3-4", "4-5", "6-7", "6-7"]
        }
      },
      series: [
        {
          name: "series-1",
          data: [10, 140, 425, 50, 549, 660, 70]
        }
      ]
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="line"
              width="100%"
              height="300px"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Graph;