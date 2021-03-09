import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from '@material-ui/icons/CropFree';
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import fakeqr from "assets/img/fakeqr.png"
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

const useStyles = makeStyles(styles);



export default function LoginSecret() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();

  function handleClick(e) {
   // e.preventDefault();
    
  }

  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="info"
                
              >
                <h4 className={classes.cardTitle}>Activation</h4>
              
              </CardHeader>
              <CardBody>
                  <center>
              <img src={fakeqr} alt="fake QR" style={{maxWidth: "15vW"}}/>
              </center>
                <CustomInput
                  labelText="Secret key.."
                  id="twofa"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />
                
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button  color="info" simple size="lg" block onClick={handleClick}>
                  Enter Secret
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      
      </GridContainer>
    </div>
  );
}
