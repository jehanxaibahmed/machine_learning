import React, { useEffect, useState } from "react";
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
import { Animated } from "react-animated-css";
import ShowVendor from "views/LDocs/Vendor/ShowVendor";
import FileAdvanceView from "views/LDocs/Invoices/AdvanceView/FileAdvanceView";
import jwt from "jsonwebtoken";
import Row from "./Row";
import { addZeroes } from "../Functions/Functions";
import Payable from "../Payable/Payable";
import Receivable from "../Receivable/Receivable";
import { useHistory } from "react-router-dom";
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
    const history = useHistory();
    const isAr =
      history.location.pathname.substring(history.location.pathname.lastIndexOf("/") + 1) == "ar"
        ? true
        : false;
  const decoded = jwt.decode(Token);
  const dispatch = useDispatch();
  const Check = require("is-null-empty-or-undefined").Check;
  const [viewVendor, setViewVendor] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(false);
  const [viewAging, setViewAging] = useState(true);
  const [formState, setFormState] = useState({
    range: 3,
    rangeType: "1",
    isAddPrevios: false,
    agingData: [],
    intervals: ["1-3 Days", "4-6 Days", "7-9 Days", "10-12 Days", "12+ Days"],
    vendorDetails: null,
    invoiceDetails: null,
    sum: null,
  });
  const handleChange = (event) => {
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

  const goBack = () => {
    setViewVendor(false);
    setViewInvoice(false);
    setViewAging(true);
  };

  const openVendor = (payload) => {
    setFormState((formState) => ({
      ...formState,
      vendorDetails: payload,
    }));
    console.log(payload);
    setViewAging(false);
    setViewVendor(true);
  };

  const openInvoice = (payload) => {
    axios({
      method: "post", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getSingleInvoiceByVersion`,
      data: {
        invoiceId: payload.invoiceId,
        version: payload.version,
        vendorId: payload.vendorId,
      },
      headers: {
        cooljwt: Token,
      },
    })
      .then(async (invoiceRes) => {
        const invoice = invoiceRes.data;
        console.log(invoice);
        setFormState((formState) => ({
          ...formState,
          invoiceDetails: invoice,
        }));
        setViewAging(false);
        setViewInvoice(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const exportExcel = async () => {
    let intervals = [];
    let x = 0;
    let interval =
      formState.rangeType == 2
        ? 7
        : formState.rangeType == 3
        ? 30
        : formState.range;
    while (intervals.length < 5) {
      let previous = x + 1;
      x = x + interval;
      intervals.push(`Days ${previous} - ${x}`);
      if (intervals.length == 4) {
        setTimeout(() => {
          axios({
            method: "post", //you can set what request you want to be
            url: isAr ?  `${process.env.REACT_APP_LDOCS_API_URL}/report/invoiceAgingToXlsxAR` :  `${process.env.REACT_APP_LDOCS_API_URL}/report/invoiceAgingToXlsx`,
            data: {
              organizationId: decoded.orgDetail.organizationId,
              type: null,
              header:[...intervals, `Days ${x}+`],
              interval: interval,
              addPrevious: formState.addPrevious,
            },
            headers: {
              cooljwt: Token,
              // responseType: 'blob',
            },
          })
            .then((response) => {
              const downloadUrl = `${process.env.REACT_APP_LDOCS_API_URL}/${response.data.path}`;
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.setAttribute("download", ""); //any other extension
              document.body.appendChild(link);
              link.click();
              link.remove();
            })
            .catch((error) => {
              console.log(error);
            });
        }, 2000);
        

      }
    }
  };
  const getReport = async () => {
    let intervals = [];
    let x = 0;
    let interval =
      formState.rangeType == 2
        ? 7
        : formState.rangeType == 3
        ? 30
        : formState.range;
    while (intervals.length < 5) {
      let previous = x + 1;
      x = x + interval;
      intervals.push(`Days ${previous} - ${x}`);
      if (intervals.length == 4) {
        setFormState((formState) => ({
          ...formState,
          intervals: [...intervals, `Days ${x}+`],
        }));
      }
    }
    let data = {
      organizationId: "602241c47a18fc82a41cd973",
      type: null,
      interval: interval,
      addPrevious: formState.isAddPrevios,
    };
    await axios({
      method: "post",
      url:isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/invoiceAgingAR` : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/invoiceAging`,
      data: data,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        if (typeof response.data == "object") {
          setFormState((formState) => ({
            ...formState,
            agingData: response.data.vendorInvoices,
            sum: response.data.col_sum,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
      getReport();      
  }, [isAr]);

  return (
    <React.Fragment>
      {viewAging ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={viewAging}
        >
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
                        <ToggleButton value="1">Days</ToggleButton>
                        <ToggleButton value="2">Weekly</ToggleButton>
                        <ToggleButton value="3">Monthly</ToggleButton>
                      </ToggleButtonGroup>
                    </GridItem>
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
                          Choose Days Interval
                        </MenuItem>
                        {[3, 7, 15, 21, 30, 60].map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {`From 1 To ${item} Days`}
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
                        label="Accrual"
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
                        onClick={getReport}
                      >
                        View Report
                      </Button>
                      <Button
                        color="danger"
                        round
                        className={classes.marginRight}
                        style={{ float: "right" }}
                        onClick={exportExcel}
                      >
                        Export Excel
                      </Button>
                    </GridItem>
                  </GridContainer>
                  <GridContainer style={{ marginTop: 10 }}>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <Table
                        className={classes.table}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>{isAr ? "Client":"Supplier"}</StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell align="right">
                              Outstanding
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              Total Amt Due
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {formState.intervals[0]}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {formState.intervals[1]}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {formState.intervals[2]}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {formState.intervals[3]}{" "}
                            </StyledTableCell>

                            <StyledTableCell align="right">
                              {formState.intervals[4]}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              Actions{" "}
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <React.Fragment>
                            {formState.agingData.map((age) => (
                              <Row
                                data={age}
                                intervals={formState.intervals}
                                viewVendor={openVendor}
                                viewInvoice={openInvoice}
                              />
                            ))}
                            {formState.sum ? (
                              <TableRow>
                                <StyledTableCell colspan="2">
                                  <b>Total</b>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formState.agingData[0].orgCurrency.Code}{" "}
                                  {addZeroes(formState.sum.outstanding_sum)}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formState.agingData[0].orgCurrency.Code}{" "}
                                  {addZeroes(
                                    formState.sum.total_due_Amount_sum
                                  )}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formState.agingData[0].orgCurrency.Code}{" "}
                                  {addZeroes(formState.sum.col_1_sum)}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formState.agingData[0].orgCurrency.Code}{" "}
                                  {addZeroes(formState.sum.col_2_sum)}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formState.agingData[0].orgCurrency.Code}{" "}
                                  {addZeroes(formState.sum.col_3_sum)}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {formState.agingData[0].orgCurrency.Code}{" "}
                                  {addZeroes(formState.sum.col_4_sum)}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                  {formState.agingData[0].orgCurrency.Code}{" "}
                                  {addZeroes(formState.sum.col_5_sum)}
                                </StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                              </TableRow>
                            ) : (
                              ""
                            )}
                          </React.Fragment>
                        </TableBody>
                      </Table>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
      {viewVendor ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={viewVendor}
        >
          <React.Fragment>
            <Button
              color="danger"
              round
              style={{ float: "right", zIndex: 999 }}
              className={classes.marginRight}
              onClick={goBack}
            >
              Go Back
            </Button>
            {isAr ? 
            <Receivable 
              goBack={goBack}
              vendor={formState.vendorDetails._id}
              org={decoded.orgDetail.organizationId}
            />:
            <Payable
              goBack={goBack}
              vendor={formState.vendorDetails._id}
              org={decoded.orgDetail.organizationId}
            />}
          </React.Fragment>
        </Animated>
      ) : (
        ""
      )}
      {viewInvoice ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={viewInvoice}
        >
          <React.Fragment>
            <Button
              color="danger"
              round
              style={{ float: "right" }}
              className={classes.marginRight}
              onClick={goBack}
            >
              Go Back
            </Button>
            <FileAdvanceView
              isVendor={false}
              fileData={formState.invoiceDetails}
            />
          </React.Fragment>
        </Animated>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
