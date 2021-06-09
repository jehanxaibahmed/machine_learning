import React, { useState, useEffect } from "react";
// @material-ui/icons
import { makeStyles, Tooltip } from "@material-ui/core";
// @material-ui/core components
import { EditOutlined } from "@material-ui/icons";
import DetailsIcon from '@material-ui/icons/Details';
// core components
import { Animated } from "react-animated-css";
import GridContainer from "components/Grid/GridContainer.js";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
} from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const useStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxHeight: 500,
    position: "relative",
    maxWidth: 360,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
  table: {
    minWidth: "100%",
    border: 1,
  },
  TableCell: {
    minWidth: "10%",
    alignContent: "right",
  },
  TableID: {
    maxWidth: "3%",
  },
  TableRow: {
    cursor: "pointer",
    background: "white",
    border: 1,
    width: "100%",
  },
}));

export default function Fiat({ addPayment, setType, paymentGateways, editGateway, showDetails }) {
  const classes = useStyles();
  const classesList = useStyle();
  const [animateStep, setAnimateStep] = useState(true);
  React.useEffect(() => {
    setType(1);
  }, []);
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateStep}
    >
      <GridContainer>
        <Table className={classesList.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classesList.TableRow}>
              <TableCell className={classesList.TableCell}>
                Channel
              </TableCell>
              <TableCell className={classesList.TableCell}> </TableCell>
              <TableCell className={classesList.TableCell}>Enable</TableCell>
              <TableCell className={classesList.TableCell}>Preferred</TableCell>
              <TableCell className={classesList.TableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ paddingBottom: 5 }}>
            {paymentGateways
              .filter((p) => p.currencyType.includes(1))
              .map((pay) => (
                <TableRow>
                  <TableCell className={classesList.TableCell}>
                    {pay.serviceName.toUpperCase()}
                  </TableCell>
                  <TableCell className={classesList.TableCell}>
                    <img
                      height="30px"
                      width="200px"
                      src={`${process.env.REACT_APP_LDOCS_API_URL}/${pay.imgUrl}`}
                    />
                  </TableCell>
                  <TableCell className={classesList.TableCell}>
                    {pay.Enable ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                  </TableCell>
                  <TableCell className={classesList.TableCell}>
                    {pay.default ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                  </TableCell>
                 
                  <TableCell className={classesList.TableCell}>
                    <Tooltip title={"Edit"} aria-label="edit">
                      <Button
                        justIcon
                        round
                        simple
                        icon={EditOutlined}
                        onClick={()=>editGateway(pay)}
                        color="info"
                      >
                        <EditOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title={"Details"} aria-label="details">
                      <Button
                        justIcon
                        round
                        simple
                        icon={DetailsIcon}
                        onClick={()=>showDetails(pay)}
                        color="info"
                      >
                        <DetailsIcon />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Button
          color="danger"
          round
          style={{ float: "right", marginTop: 30 }}
          className={classes.marginRight}
          onClick={() => addPayment(1)}
        >
          Add Payment Channel
        </Button>
      </GridContainer>
    </Animated>
  );
}
