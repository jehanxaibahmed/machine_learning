import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  withStyles,
  Tooltip,
  Button,
  Table,
  TableHead,
  TableBody,
  Paper,
  TableContainer,
} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import Invoice from "./Invoice";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import Graph from "./Graph";
import { addZeroes } from "../Functions/Functions";
const useStyles = makeStyles((theme) => ({
  root: {},
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.action.hover,
    width: "7%",
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width: "7%",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.action.hover,
    width: "7%",
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width: "7%",
  },
}))(TableRow);
export default function Row({ data, intervals, viewVendor, viewInvoice }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const currencyCode = data.orgCurrency.Code;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  console.log(data);

  return (
    <React.Fragment>
      <StyledTableRow key={0}>
        <StyledTableCell colSpan={2} component="th" scope="row">
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          {data.vendors}
        </StyledTableCell>

        <StyledTableCell align="right">
          <small>{currencyCode}</small>{" "}
          {`${data.outstanding ? addZeroes(data.outstanding) : 0}`}
        </StyledTableCell>
        <StyledTableCell align="right">
          <small>{currencyCode}</small>{" "}
          {`${data.totalamtdue ? addZeroes(data.totalamtdue) : 0}`}
        </StyledTableCell>
        <StyledTableCell align="right">
          <small>{currencyCode}</small>{" "}
          {`${data["col_1"] ? addZeroes(data["col_1"]) : 0}`}
        </StyledTableCell>
        <StyledTableCell align="right">
          <small>{currencyCode}</small>{" "}
          {`${data["col_2"] ? addZeroes(data["col_2"]) : 0}`}
        </StyledTableCell>
        <StyledTableCell align="right">
          <small>{currencyCode}</small>
          {` ${data["col_3"] ? addZeroes(data["col_3"]) : 0}`}
        </StyledTableCell>
        <StyledTableCell align="right">
          <small>{currencyCode}</small>{" "}
          {` ${data["col_4"] ? addZeroes(data["col_4"]) : 0}`}
        </StyledTableCell>
        <StyledTableCell align="right">
          <small>{currencyCode}</small>{" "}
          {`${data["col_5"] ? addZeroes(data["col_5"]) : 0}`}
        </StyledTableCell>
        <StyledTableCell align="right">
          <Tooltip title="360&#176; View" aria-label="advanceDocumentView">
            <Button
              justIcon
              round
              simple
              icon={ViewModuleIcon}
              onClick={() => {
                viewVendor(data.vendorDetail);
              }}
              color="info"
              className="Edit"
            >
              <ViewModuleIcon />
            </Button>
          </Tooltip>
        </StyledTableCell>
      </StyledTableRow>
      {expanded ? (
        <React.Fragment>
          <StyledTableRow key={1}>
            <StyledTableCell style={{ padding: 0 }} colSpan="10">
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Table
                  className={classes.table}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Invoices</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                      <StyledTableCell align="right"> </StyledTableCell>
                      <StyledTableCell align="right"> </StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                      <StyledTableCell align="right">
                        Detail View{" "}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.invoices
                      ? data.invoices.map((invce) => (
                          <Invoice data={invce} viewInvoice={viewInvoice} />
                        ))
                      : ""}
                  </TableBody>
                </Table>
              </Collapse>
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow key={0}>
            <StyledTableCell colSpan="10">
              <Graph
                intervals={intervals}
                values={[
                  data["col_1"] ? data["col_1"].toFixed(2) : 0,
                  data["col_2"] ? data["col_2"].toFixed(2) : 0,
                  data["col_3"] ? data["col_3"].toFixed(2) : 0,
                  data["col_4"] ? data["col_4"].toFixed(2) : 0,
                  data["col_5"] ? data["col_5"].toFixed(2) : 0,
                ]}
              />
            </StyledTableCell>
          </StyledTableRow>
        </React.Fragment>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
