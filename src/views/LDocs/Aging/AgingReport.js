import React, { useState } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  Tooltip,
  IconButton,
  withStyles,
  MenuItem,
  Typography,
  Select,
  Input,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridItem from "components/Grid/GridItem.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Collapse from "@material-ui/core/Collapse";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CreateIcon from "@material-ui/icons/Create";
import { useDispatch, useSelector } from "react-redux";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import axios from "axios";
import { Visibility } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { setIsTokenExpired } from "actions/index";
import { conversionRate } from "views/LDocs/Functions/Functions";
import Row from "./Row";
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
  table: {
    minWidth: "100%",
  },
  itemName: {
    width: 300,
  },
  itemNumber: {
    width: "55%",
  },
};
const useStyles = makeStyles(styles);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.action.hover,
    width: "7%",
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width: "5%",
  },
}))(TableCell);

export default function AgingReport() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const dispatch = useDispatch();
  const Check = require("is-null-empty-or-undefined").Check;
  const [formState, setFormState] = useState({
    range: 1,
    rangeType: "1",
    isAddPrevios: false,
  });
  const handleChange = (event) => {
    // rangeType
    // range
    // isAddPrevios
    setFormState((formState) => ({
      ...formState,
      [event.target.name]:
        event.target.name == "isAddPrevios"
          ? !formState.isAddPrevios
          : event.target.value,
    }));
  };
  const handleChangeType = (event, nextView) => {
    setFormState((formState) => ({
      ...formState,
      rangeType: nextView,
    }));
  };
  const classes = useStyles();

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitleText}>Invoice Aging</h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={5}
                lg={5}
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <TextField
                  className={classes.textField}
                  fullWidth={true}
                  label="Select Days Range"
                  name="range"
                  onChange={handleChange}
                  select
                  disabled={formState.rangeType !== "1"}
                  variant="outlined"
                  value={formState.range || ""}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    Choose Days Range
                  </MenuItem>
                  {[0, 1, 2, 3, 4, 5].map((item, index) => {
                    return (
                      <MenuItem key={index} value={item}>
                        {`From ${index} To ${index + 3} Days`}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={2}
                lg={2}
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <ToggleButtonGroup
                  size="large"
                  value={formState.rangeType}
                  exclusive
                  name="rangeType"
                  onChange={handleChangeType}
                >
                  <ToggleButton value="1">Day</ToggleButton>
                  <ToggleButton value="2">Week</ToggleButton>
                  <ToggleButton value="3">Month</ToggleButton>
                </ToggleButtonGroup>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={2}
                lg={2}
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formState.isAddPrevios}
                      onChange={handleChange}
                      value={!formState.isAddPrevios}
                      name="isAddPrevios"
                      color="primary"
                    />
                  }
                  labelPlacement="bottom"
                  label="Add Previous"
                />
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={3}
                lg={3}
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <Button
                  color="danger"
                  round
                  className={classes.marginRight}
                  style={{ float: "right" }}
                  onClick={() => console.log("Clicked")}
                >
                  Generate Report
                </Button>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ marginTop: 10 }}>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <TableContainer component={Paper} style={{}}>
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Vendor / Customer</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell align="right">
                          Outstanding
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          Total Amt Due
                        </StyledTableCell>
                        <StyledTableCell align="right">1-4 Days</StyledTableCell>
                        <StyledTableCell align="right">5-8 Days</StyledTableCell>
                        <StyledTableCell align="right">9-12 Days</StyledTableCell>
                        <StyledTableCell align="right">13-16 Days</StyledTableCell>
                        <StyledTableCell align="right">
                          16+ Days{" "}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          Actions{" "}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <React.Fragment>
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                        <Row />
                      </React.Fragment>
                    </TableBody>
                  </Table>
                </TableContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
