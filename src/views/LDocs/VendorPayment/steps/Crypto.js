import React, { useState, useEffect } from "react";
import { makeStyles, Tooltip } from "@material-ui/core";
// @material-ui/core components
import { EditOutlined } from "@material-ui/icons";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import DetailsIcon from '@material-ui/icons/Details';


import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import defaultAvatar from "assets/img/placeholder.jpg";
import Button from "components/CustomButtons/Button.js";
const sweetAlertStyle = makeStyles(styles2);
let Token = localStorage.getItem("cooljwt");
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
  },
  TableRow: {
    cursor: "pointer",
    background: "white",
    border: 1,
    width: "100%",
  },
  TableID: {
    maxWidth: "3%",
  },
}));

export default function Crypto({ addPayment, setType, paymentGateways, editGateway, showDetails }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const classesList = useStyle();
  const [animateStep, setAnimateStep] = useState(true);

  React.useEffect(() => {
    setType(2);
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
                Service Name
              </TableCell>
              <TableCell className={classesList.TableCell}> </TableCell>
              <TableCell className={classesList.TableCell}>Enable</TableCell>
              <TableCell className={classesList.TableCell}>Prefered</TableCell>
              <TableCell className={classesList.TableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ paddingBottom: 5 }}>
            {paymentGateways
              .filter((p) => p.currencyType.includes(2))
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
          onClick={() => addPayment(2)}
        >
          Add Payment Method
        </Button>
      </GridContainer>
    </Animated>
  );
}
