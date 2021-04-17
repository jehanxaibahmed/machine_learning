/* Imports */
import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

class LineChartView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MonthlyCount:props.chartData.MonthlyCount,
      fullPayment:props.chartData.fullPayment,
      partialPayment:props.chartData.partialPayment,
      paymentPending:props.chartData.paymentPending,
    };
  }
  componentDidMount() {
    let chart = am4core.create(
      "chartdiv" + this.props.chatID,
      am4charts.XYChart
    );
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        status: "Total Invoices",
        count: this.state.MonthlyCount,
      },
      {
        status: "Pending for Payments ",
        count: this.state.paymentPending,
      },
      {
        status: "Partial Paid",
        count: this.state.partialPayment,
      },
      {
        status: "Invoice Paid",
        count: this.state.fullPayment,
      },
    ];
    
    let colors = [am4core.color("#095392"),am4core.color("#095392"),am4core.color("#095392"),am4core.color("#095392")];

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "status";
    categoryAxis.renderer.minGridDistance = 100;
    categoryAxis.fontSize = 11;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = this.state.MonthlyCount+10;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;
    // axis break
    let axisBreak = valueAxis.axisBreaks.create();
    axisBreak.startValue = 1000;
    axisBreak.endValue = 1500;
    //axisBreak.breakSize = 0.005;

    // fixed axis break
    let d =
      (axisBreak.endValue - axisBreak.startValue) /
      (valueAxis.max - valueAxis.min);
    axisBreak.breakSize = (0.05 * (1 - d)) / d; // 0.05 means that the break will take 5% of the total value axis height

    // make break expand on hover
    let hoverState = axisBreak.states.create("hover");
    hoverState.properties.breakSize = 1;
    hoverState.properties.opacity = 0.1;
    hoverState.transitionDuration = 1500;

    axisBreak.defaultState.transitionDuration = 1000;
    /*
// this is exactly the same, but with events
axisBreak.events.on("over", function() {
  axisBreak.animate(
    [{ property: "breakSize", to: 1 }, { property: "opacity", to: 0.1 }],
    1500,
    am4core.ease.sinOut
  );
});
axisBreak.events.on("out", function() {
  axisBreak.animate(
    [{ property: "breakSize", to: 0.005 }, { property: "opacity", to: 1 }],
    1000,
    am4core.ease.quadOut
  );
});*/

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "status";
    // series.columns.fill = "color";
    // series.columns.template.column.fill = "color";

    series.dataFields.valueY = "count";
    series.columns.template.tooltipText = "{valueY.value}";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target) {
        return colors[target.dataItem.index];
    });
  }

  render() {
    console.log(this.state);
    return (
      <div
        id={"chartdiv" + this.props.chatID}
        style={{ width: "100%", height: "410px" }}
      ></div>
    );
  }
}

export default LineChartView;
