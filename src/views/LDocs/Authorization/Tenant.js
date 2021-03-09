import React,{useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import styles from "assets/jss/material-dashboard-pro-react/views/tenantPageStyle";
import RegTenant from "./RegTenant";
import { Animated } from "react-animated-css";
const useStyles = makeStyles(styles);

export default function Tenant() {
 const classes = useStyles();
 const [register, setRegister] = useState(true);
 const [successMessage, setSuccessMessage] = useState(false);
 const loginSuccess = () => {
     setRegister(false);
     setSuccessMessage(true);
 };
  return (
    <div className={classes.container}> 
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
            {register ? 
            <Animated
            animationIn="bounceInUp"
            animationOut="bounceOutUp"
              animationInDuration={1000}
              animationOutDuration={1000}
              isVisible={register}
            >
              <div>
                <RegTenant loginSuccess={loginSuccess} />
              </div>
            </Animated>
            :''}
            {successMessage?
            <Animated
            animationIn="bounceInUp"
            animationOut="bounceOutUp"
              animationInDuration={1000}
              animationOutDuration={1000}
              isVisible={successMessage}
            >
              <div>
                <h1>Hello , </h1>
                <p>Thanks for Registeration . Please check you E-mail and activate you account</p>
              </div>
            </Animated>
            :''}
        </GridItem>
      </GridContainer>
    </div>
  );
}
