/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
// @material-ui/core components
import {
  MenuItem,
  makeStyles,
  CircularProgress,
  TextField,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Avatar,
  IconButton,
  Divider,
  ListSubheader,
} from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import jwt from "jsonwebtoken";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";

// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import ReactCodesInput from "react-codes-input";
import "react-codes-input/lib/react-codes-input.min.css";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);


export default function LevelAccessgroup(props) {
  const classes = useStyles();
    const AccessGroupsArray = [
      {
        value: "00000",
        label: "00000",
        color: "info",
        description: [
          "User can not share file.",
          "User can not view team files.",
          "User can view files shared with him only.",
        ],
      },
      {
        value: "10000",
        label: "10000",
        color: "rose",
        description: [
          "File can be shared and received from outside organization with individual.  ",
        ],
      },
      {
        value: "00001",
        label: "00001",
        color: "success",
        description: [
          "User can not share file with team.",
          "User can view any team files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "00002",
        label: "00002",
        color: "warning",
        description: [
          "User can share file with team only.",
          "User can not view team files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "00003",
        label: "00003",
        color: "primary",
        description: [
          "User can share file with team only.",
          "User can view team files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "00010",
        label: "00010",
        color: "info",
        description: [
          "User can not share file with dept.",
          "User can view dept files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "00020",
        label: "00020",
        color: "warning",
        description: [
          "User can share file with dept only.",
          "User can not view dept files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "00030",
        label: "00030",
        color: "info",
        description: [
          "User can share file with dept only.",
          "User can view only dept files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "00100",
        label: "00100",
        color: "rose",
        description: [
          "User can not share file with comp.",
          "User can view only comp files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "00200",
        label: "00200",
        color: "success",
        description: [
          "User can share file with comp only.",
          "User can not view comp files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "00300",
        label: "00300",
        color: "warning",
        description: [
          "User can share file with comp only.",
          "User can view only comp files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "01000",
        label: "01000",
        color: "primary",
        description: [
          "User can not share file with org.",
          "User can view only org files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "02000",
        label: "02000",
        color: "rose",
        description: [
          "User can share file with org only.",
          "User can not view org files.",
          "User can only view files shared with him only.",
        ],
      },
      {
        value: "03000",
        label: "03000",
        color: "info",
        description: [
          "User can share file with org only.",
          "User can view only org files.",
          "User can only view files shared with him only.",
        ],
      },
    ];
  const $wrapperRef = useRef(null);
  const [accessCode, setAccessCode] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [isValid, setIsValid] = React.useState(true);
  const [disabled, setDisbaled] = React.useState(true);
  const [accessUserGroup, SetAccessUserGroup] = React.useState([]);
  const changeCode = (code) => {
    if (code.length == 1) {
      if (code == 0 || code == 1) {
        setIsValid(true);
        setAccessCode(code);
        setMessage("");
      } else {
        setIsValid(false);
        setMessage("Code Can Only be 0 or 1");
      }
    } else if (code.length == 2) {
      if (code[1] == 0 || code[1] == 1 || code[1] == 2 || code[1] == 3) {
        setIsValid(true);
        setAccessCode(code);
        setMessage("");
      } else {
        setIsValid(false);
        setMessage("Code Can Only be 0, 1, 2 or 3");
      }
    } else if (code.length == 3) {
      if (code[2] == 0 || code[2] == 1 || code[2] == 2 || code[2] == 3) {
        setIsValid(true);
        setAccessCode(code);
        setMessage("");
      } else {
        setIsValid(false);
        setMessage("Code Can Only be 0, 1, 2 or 3");
      }
    } else if (code.length == 4) {
      if (code[3] == 0 || code[3] == 1 || code[3] == 2 || code[3] == 3) {
        setIsValid(true);
        setAccessCode(code);
        setMessage("");
      } else {
        setIsValid(false);
        setMessage("Code Can Only be 0, 1, 2 or 3");
      }
    } else if (code.length == 5) {
      if (code[4] == 0 || code[4] == 1 || code[4] == 2 || code[4] == 3) {
        setIsValid(true);
        setAccessCode(code);
        setDisbaled(false);
        setMessage("");
      } else {
        setIsValid(false);
        setMessage("Code Can Only be 0, 1, 2 or 3");
      }
    }
    
  }
  const saveCode = () => {
    props.setAccessCode(accessCode);
    props.closeModal();
  }
   return (
     <GridContainer>
       <GridItem xs={12} sm={12} md={12}>
         <Card>
           <CardHeader color="info" icon>
             <CardIcon color="info">
               <h4 className={classes.cardTitle}>Access Group Selection</h4>
             </CardIcon>
             <span style={{ float: "right" }}></span>
           </CardHeader>
           <CardBody>
             <GridContainer>
               <GridItem
                 xs={12}
                 sm={12}
                 md={12}
                 lg={12}
                 style={{ marginBottom: "10px" }}
               >
                 <h4>Enter Access Group Code</h4>
                 <ReactCodesInput
                   wrapperRef={$wrapperRef}
                   id="accessCode"
                   codeLength={5}
                   type="number"
                   placeholder="00000"
                   value={accessCode}
                   onChange={(res) => {
                     changeCode(res);
                   }}
                  //  isValid={false}
                 />
                 <p
                   style={{
                     color: "red",
                   }}
                 >
                   {message}
                 </p>
                 <Button
                   style={{
                     backgroundColor: "#00AFC3",
                     color: "white",
                   }}
                   className={classes.registerButton}
                   round
                   onClick={saveCode}
                   disabled={disabled}
                 >
                   Save Code
                 </Button>
               </GridItem>

               <GridItem
                 xs={12}
                 sm={12}
                 md={12}
                 lg={12}
                 style={{ marginBottom: "10px" }}
               >
                 <GridContainer>
                   {AccessGroupsArray.map((itm, index) => {
                     return (
                       <React.Fragment key={index}>
                         <GridItem
                           xs={12}
                           sm={12}
                           md={4}
                           lg={4}
                           style={{
                             marginBottom: "10px",
                             marginTop: "10px",
                           }}
                         >
                           <Card>
                             <CardHeader color={itm.color} icon>
                               <CardIcon color={itm.color}>
                                 <h4 className={classes.cardTitle}>
                                   {itm.label}
                                 </h4>
                               </CardIcon>
                               <span style={{ float: "right" }}></span>
                             </CardHeader>
                             <CardBody>
                               <div className={classes.root}>
                                 <List
                                   component="nav"
                                   aria-label="main mailbox folders"
                                 >
                                   {itm.description.map(
                                     (description, index) => {
                                       return (
                                         <React.Fragment>
                                           <Tooltip
                                             title={`Access Role: ${description}`}
                                             aria-label="viewfile"
                                           >
                                             <ListItem
                                               button
                                               selected={selectedIndex === 0}
                                             >
                                               <ListItemAvatar>
                                                 <Avatar>
                                                   <FolderIcon />
                                                 </Avatar>
                                               </ListItemAvatar>
                                               <ListItemText
                                                 primary={description}
                                               />
                                             </ListItem>
                                           </Tooltip>
                                           <Divider />
                                         </React.Fragment>
                                       );
                                     }
                                   )}
                                 </List>
                               </div>
                             </CardBody>
                           </Card>
                         </GridItem>
                       </React.Fragment>
                     );
                   })}
                 </GridContainer>
               </GridItem>
             </GridContainer>

             <Button color="danger" className={classes.registerButton} round>
               Close
             </Button>
           </CardBody>
         </Card>
       </GridItem>
     </GridContainer>
   );
}
