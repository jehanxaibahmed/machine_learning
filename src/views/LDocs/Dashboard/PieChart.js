import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
// function openFIle(e) {
//   console.log("clicked on ", e);
// }
class PieChartView extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  openFIle = () => {
  }
  componentDidMount() {
    let chart = am4core.create(
      "chartdiv" + this.props.chatID,
      am4charts.PieChart
    );

    chart.paddingRight = 20;
      if(typeof this.props.chartData.ByCountStatus !== "undefined"){
        if(this.props.chartData.ByCountStatus.length > 0){
          let row = this.props.chartData.ByCountStatus;
          chart.data = row.map(itm=>{return {color:itm.color, status: itm._id, count: itm.count, fileName: itm.data.length > 0 ? itm.data.map(file=>{return "\n"+file.invoiceId; }):""}})
        }else {
          chart.data = [{status: "No Data To Display",count:1}];
          }
      }
        //   let pieSeries = chart.series.push(new am4charts.PieSeries());
          // pieSeries.dataFields.value = "count";
          // pieSeries.dataFields.category = "status";
          // pieSeries.dataFields.files = "fileName";
        //   // pieSeries.labels.template.text = "{category}: {value.value}";
        //   pieSeries.slices.template.tooltipText = "{category}: ({files}) Total: ({value.value})";

        // this.chart = chart;
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        chart.logo.disabled = true;
        pieSeries.dataFields.value = "count";
        pieSeries.dataFields.category = "status";
        pieSeries.dataFields.files = "fileName";
        pieSeries.slices.template.tooltipText = "[bold]Invoices[/]: {files}\n [bold]Total:[/] {value.value}";
        pieSeries.slices.template.propertyFields.fill = "color";

// Let's cut a hole in our Pie chart the size of 40% the radius
chart.innerRadius = am4core.percent(60);
pieSeries.tooltip.label.interactionsEnabled = true;
pieSeries.tooltip.keepTargetHover = false;
// Disable ticks and labels
pieSeries.labels.template.disabled = true;
pieSeries.ticks.template.disabled = true;

// Disable tooltips
// Add a legend
chart.legend = new am4charts.Legend();
chart.legend.useDefaultMarker = true;
let marker = chart.legend.markers.template.children.getIndex(0);
marker.cornerRadius(12, 12, 12, 12);
marker.strokeWidth = 2;
marker.strokeOpacity = 1;
marker.stroke = am4core.color("#ccc");
let markerTemplate = chart.legend.markers.template;
markerTemplate.width = 20;
markerTemplate.height = 20;

chart.legend.labels.template.text = "[bold {color}]{name}[/] \n [bold {color}] Total Invoices: [/]{value.value}";

this.chart = chart;

  }
  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  componentDidUpdate(oldProps) {
    if (oldProps.paddingRight !== this.props.paddingRight) {
      this.chart.paddingRight = this.props.paddingRight;
    }
  }
  render() {
    return (
      <div
        id={"chartdiv" + this.props.chatID}
        style={{ width: "100%", height: "420px" }}
      ></div>
    );
  }
}
 
export default PieChartView;