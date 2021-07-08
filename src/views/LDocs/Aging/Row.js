import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles, Tooltip, Button, Table, TableHead, TableBody, Paper, TableContainer } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import Invoices from "./Invoices";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import Graph from "./Graph";
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
    width:'7%',
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width:'7%',
  },

}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.action.hover,
    width:'7%',
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width:'7%',
  },
}))(TableRow);
export default function Row() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <React.Fragment>
      <StyledTableRow key={0}>
        <StyledTableCell colSpan={2}  component="th" scope="row">
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
          Salic Vendor
        </StyledTableCell>

        <StyledTableCell align="right">$1000.00</StyledTableCell>
        <StyledTableCell align="right">$100.00</StyledTableCell>
        <StyledTableCell align="right">$0.00</StyledTableCell>
        <StyledTableCell align="right">$0.00</StyledTableCell>
        <StyledTableCell align="right">$0.00</StyledTableCell>
        <StyledTableCell align="right">$0.00</StyledTableCell>
        <StyledTableCell align="right">$0.00</StyledTableCell>
        <StyledTableCell align="right">
          <Tooltip title="360&#176; View" aria-label="advanceDocumentView">
            <Button
              justIcon
              round
              simple
              icon={ViewModuleIcon}
              onClick={() => {
                // viewQrView(prop);
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
                    size="small" aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                      <StyledTableCell >
                      Invoices
                        </StyledTableCell>
                        <StyledTableCell >
                          
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          
                        </StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                        <StyledTableCell align="right"> </StyledTableCell>
                        <StyledTableCell align="right"> </StyledTableCell>
                        <StyledTableCell align="right">
                          
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          Detail View{" "}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                <Invoices />
                <Invoices />
                <Invoices />
                </TableBody>
                </Table>
              </Collapse>
            </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={0}>
              <StyledTableCell colSpan="10">
                <Graph />
              </StyledTableCell>
            </StyledTableRow>
          </React.Fragment>
        ) : (
          ""
        )}
    </React.Fragment>
  );
}
