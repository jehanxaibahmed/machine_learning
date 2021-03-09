import React, { useState, useEffect } from "react";
import {
  makeStyles,
} from "@material-ui/core";
// @material-ui/core components
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import {Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import defaultAvatar from "assets/img/placeholder.jpg";
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
    position: 'relative',
    maxWidth: 360,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  table: {
    minWidth: '100%',
    border:1
  },
  TableCell:{
      minWidth:'10%'
  },
  TableRow:{
      cursor:'pointer',
      background:'white',
      border:1, width:'100%'
  },
  TableID:{
    maxWidth:'3%'
  }
  
  }));


export default function Step2(props) {
  const useStyles = makeStyles(styles);
  const classesList = useStyle();
  const [animateStep, setAnimateStep] = useState(true);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  React.useEffect(()=>{
    if(props.isWorkflowInit === true){
    setWorkflowSteps(props.workflow == null ? [] : props.workflow.steps);
    }
    else if(props.isWorkflowInit === 'true'){
      setWorkflowSteps(props.workflow == null ? [] : props.workflow.steps);
    }
    else{
    setWorkflowSteps([]);
    }
  },[])
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
                    <TableCell className={classesList.TableID}>ID</TableCell>
                    <TableCell className={classesList.TableCell}>DESIGNTION</TableCell>
                    <TableCell className={classesList.TableCell}>ROLE</TableCell>
                    <TableCell className={classesList.TableCell}>STATUS</TableCell>
                </TableRow>
            </TableHead>
            <TableBody style={{paddingBottom:5}}>
                {workflowSteps.map((item, index)=>{
                    return (
                    <TableRow key={item.id}>
                        <TableCell className={classesList.TableID}>{index+1}</TableCell>
                        <TableCell className={classesList.TableCell}>{item.designation}</TableCell>
                        <TableCell className={classesList.TableCell}>{item.event.charAt(0).toUpperCase() + item.event.slice(1)}</TableCell>
                        <TableCell className={classesList.TableCell}>
                          {props.blockChainData.length/2 >= index+1 ? <div><CheckCircleIcon style={{color:'green'}} fontSize="small"/><small> (Done)</small></div>:
                           <div><QueryBuilderIcon style={{color:'#c1a12f'}} fontSize="small"/> <small> (Pending)</small></div>} 
                        </TableCell>
                    </TableRow>
                     )})}
            </TableBody>
            </Table>
      </GridContainer>
    </Animated>
  );
}
