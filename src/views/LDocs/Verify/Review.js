
import React, {useState, useEffect} from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { TextField, InputAdornment } from "@material-ui/core";
// @material-ui/icons
import SearchIcon from '@material-ui/icons/Search';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import NavPills from "components/NavPills/NavPills.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import Table from "components/Table/Table.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import dateFormat from "dateformat";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  },
  buttonRight: {},
};

const useStyles = makeStyles(styles);

export default function Review(props) {
  const classes = useStyles();
  return (
    <div>
         <Table
          hover
          tableHeaderColor="info"
          tableShopping={true}
          tableHead={[
            "Sr No.",
            "File Owner",
            "Reviewer",
            "Status",
            "Time"
          ]}
          tableData={props.file.map((file,index)=>{return [index+1, file.fileowner,file.rBy, file.rStatus, dateFormat(file.rTimestamp, "dd/mm/yyyy hh:mm:ss")]}) }
          />
    </div>
  );
}
