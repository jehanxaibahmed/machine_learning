import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import PhoneIcon from '@material-ui/icons/Phone';
import Email from "@material-ui/icons/Email";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import axios from "axios";

const useStyles = makeStyles(styles);



export default function RegTenant(props) {
  const [emailError, setEmailError] = useState("");
  const [apiErrorMessage, setAPIErrorMessage] = useState("");
  const [logging, setlogging] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const classes = useStyles();

 const handleEmail = (event) => {
   event.persist();
   setEmail(event.target.value);
 };
 const handleName = (event) => {
   event.persist();
   setName(event.target.value);
  };
  const handlePhone = (event) => {
    event.persist();
    setPhone(event.target.value);
   };
    const handleLoginIn = (event) => {
      event.preventDefault();
      var data = {
        email: email,
        name: name,
        phone: phone
      };
      setAPIErrorMessage("");
      setlogging(true);
      axios
        .post(`${process.env.REACT_APP_LDOCS_API_URL}/tenant/regTenant`, data)
        .then((response) => {
          setlogging(false);
          setEmailError("success");          
          props.loginSuccess();
        })
        .catch((error) => {
          setlogging(false);
          setEmailError("error");
          setAPIErrorMessage(typeof error.response != "undefined"
            ? error.response.data
            : error.message);
            setTimeout(function() {
              setAPIErrorMessage("");
            }, 2000);
        });
    };
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={8}>
          <form onSubmit={handleLoginIn}>
            <Card login>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="info"
              >
                <h4 className={classes.cardTitle}>Register</h4>
              </CardHeader>
              <CardBody>
              <CustomInput
                  labelText="Name"
                  id="name"
                  name="name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      handleName(event);
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Face className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    type: "text",
                    autoComplete: "off",
                  }}
                />
                <CustomInput
                  success={emailError === "success"}
                  error={emailError === "error"}
                  labelText="Email ID"
                  id="email"
                  name="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      handleEmail(event);
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    type: "email",
                  }}
                />
                <CustomInput
                  success={emailError === "success"}
                  error={emailError === "error"}
                  labelText="Phone"
                  id="phone"
                  name="phone"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      handlePhone(event);
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneIcon className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    type: "phone",
                  }}
                />

                <br />
                <h6 style={{ color: "red" }}>{apiErrorMessage}</h6>
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="info" simple size="lg" type="submit" block>
                {logging ? <CircularProgress /> : "Let's Go"} 
                </Button>
                
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
