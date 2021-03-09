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

export default function LevelFilegroup(props) {
  const classes = useStyles();
  const AccessGroupsArray = [
    {
      value: "0000",
      label: "0000",
      color: "info",
      description: ["User can not review or approve any files."],
    },
    {
      value: "0001",
      label: "0001",
      color: "primary",
      description: ["User can review team file."],
    },
    {
      value: "0002",
      label: "0002",
      color: "warning",
      description: ["User can approve team file. "],
    },
    {
      value: "0010",
      label: "0010",
      color: "rose",
      description: ["User can review dept files. "],
    },
    {
      value: "0020",
      label: "0020",
      color: "success",
      description: ["User can approve dept files."],
    },
    {
      value: "0100",
      label: "0100",
      color: "info",
      description: ["User can review comp files."],
    },
    {
      value: "0200",
      label: "0200",
      color: "warning",
      description: ["User can approve comp files."],
    },
    {
      value: "1000",
      label: "1000",
      color: "rose",
      description: ["User can review org files."],
    },
    {
      value: "2000",
      label: "2000",
      color: "primary",
      description: ["User can approve org files."],
    },
    {
      value: "2222",
      label: "2222",
      color: "success",
      description: ["User can approve all files his org or down the line."],
    },
    {
      value: "1111",
      label: "1111",
      color: "info",
      description: ["User can review all files his org or down the line."],
    },
    {
      value: "3333",
      label: "3333",
      color: "rose",
      description: ["User can review or approve all files down the line."],
    },
  ];
  // const $wrapperRef = useRef(null);
  const [accessCode, setAccessCode] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [isValid, setIsValid] = React.useState(true);
  const [disabled, setDisbaled] = React.useState(true);
  const [accessUserGroup, SetAccessUserGroup] = React.useState([]);
  const changeCode = (code) => {
    if (code.length == 1) {
      if (code[1] == 0 || code[1] == 1 || code[1] == 2 || code[1] == 3) {
        setIsValid(true);
        setAccessCode(code);
        setMessage("");
      } else {
        setIsValid(false);
        setMessage("Code Can Only be 0, 1, 2 or 3");
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
        setDisbaled(false);
        setMessage("");
      } else {
        setIsValid(false);
        setMessage("Code Can Only be 0, 1, 2 or 3");
      }
    }
  };
  const saveCode = () => {
    props.setFileGroupCode(accessCode);
    props.closeModal();
  };
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>File Group Selection</h4>
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
                <h4>File Group Code</h4>
                <ReactCodesInput
                  // wrapperRef={$wrapperRef}
                  id="accessCode"
                  codeLength={4}
                  type="number"
                  placeholder="00000"
                  value={accessCode}
                  onChange={(res) => {
                    changeCode(res);
                  }}
                  isValid={false}
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
                                  {itm.description.map((description, index) => {
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
                                  })}
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
