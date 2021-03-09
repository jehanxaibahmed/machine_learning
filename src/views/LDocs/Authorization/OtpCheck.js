import React, {useState} from "react";
import { Redirect } from "react-router-dom";

// @material-ui/core components
import { makeStyles, TextField, InputAdornment, CircularProgress } from "@material-ui/core";
// @material-ui/icons
import Email from '@material-ui/icons/ScreenLockPortrait';
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
const useStyles = makeStyles(styles);



export default function OtpCheck(props) {

  const [twofa, setTwofa] = useState("");
  const [twofaError, setTwofaError] = useState("");
  const classes = useStyles();

  function handletwofa(event) {
    setTwofa(event.target.value);
  }
    const handleSecret = () => {
        const Check = require("is-null-empty-or-undefined").Check;
        if (!Check(twofa)) {
            setTwofaError("success");
            props.setOtpValue(twofa);
          } else {
            setTwofaError("error");
           }
    }
  return (
    <Card login>
        <CardHeader
        className={`${classes.cardHeader} ${classes.textCenter}`}
        color="info"
        >
        <h4 className={classes.cardTitle}>Secret Key</h4>
        </CardHeader>
        <CardBody>
        <TextField
            fullWidth={true}
            error={twofaError === "error"}
            helperText={twofaError === "error" ? "Invalid OTP" : null}
            label="Secret key.."
            id="twofa"
            name="twofa"
            onChange={(event) => {
            handletwofa(event);
            }}
            InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                <Email className={classes.inputAdornmentIcon} />
                </InputAdornment>
                ),
            }}
            type="number"
            value={twofa || ""}
        />
        </CardBody>
        <CardFooter className={classes.justifyContentCenter}>
        <Button color="info" simple size="lg" block type="button" onClick={handleSecret}>
            Send
        </Button>
        </CardFooter>
    </Card>
  );
}
