import React from "react";
import { useSelector, useDispatch } from "react-redux";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  Dialog,
  DialogContent,
  Slide,
  TextField,
} from "@material-ui/core";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import defaultAvatar from "assets/img/placeholder.jpg";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import axios from "axios";
import Button from "components/CustomButtons/Button.js";
import { setIsTokenExpired } from "actions";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import jwt from "jsonwebtoken";


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

const useStyles = makeStyles(styles);
export default function MoneyButton(props) {
  const classes = useStyles();
  const user = useSelector((state) => state.userReducer.userListData);
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const decoded = jwt.decode(Token);
  const dispatch = useDispatch();
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });
  const [formState, setFormState] = React.useState({
    values: {
      paypalEmail: "",
      attached:""
    },
    errors: {
      paypalEmail: "",
    },
  });

  
  const saveMoneyButtonDetails = () => {
    let paypalEmail;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.paypalEmail)) {
      paypalEmail = "success";
    } else {
      paypalEmail = "error";
      error = true;
    }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        paypalEmail: paypalEmail,
      },
    }));
    if (error) {
      return false;
    } else {
    axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/setMoneyButtonDetails`,
        data: {
            moneyButtonEmail: formState.values.paypalEmail,
        },
        headers: { cooljwt: Token },
      })
        .then((response) => {
            setDetails();
          console.log('Information Saved Successfully.');
          
        })
        .catch((error) => {
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(error);
        });
  }
}

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));

  };


  const setDetails = () => {
    axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/getVendorInfoById/${decoded.id}`,
        data: {
            moneyButtonEmail: formState.values.paypalEmail,
        },
        headers: { cooljwt: Token },
      })
        .then((response) => {
            console.log();
            var moneyButton_details = response.data.result ? response.data.result.level3:{};
            if(moneyButton_details){
                setFormState((formState) => ({
                  ...formState,
                  values: {
                    ...formState.values,
                    paypalEmail:moneyButton_details.moneyButton_details.email,
                    attached:moneyButton_details.moneyButton_details.email ? true : false
                  },
                }));
              }
        }).catch((err)=>{
            console.log(err);
        })

  }



  React.useEffect(()=>{
    setDetails();
  },[user.level3])

  return (
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={true}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <Card profile>
              <CardHeader color="danger" icon>
                <CardIcon color="danger">
                  <h4 className={classes.cardTitle}>MoneyButton Account</h4>
                </CardIcon>
              </CardHeader>
              <CardBody profile>
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <TextField
                      error={formState.errors.paypalEmail === "error"}
                      helperText={
                        formState.errors.paypalEmail === "error"
                          ? "Valid Paymail is required"
                          : null
                      }
                      className={classes.textField}
                      fullWidth={true}
                      label="Paymail"
                      name="paypalEmail"
                      type="text"
                      id="paypal-email"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formState.values.paypalEmail || ""}
                    />
                  </GridItem>
                </GridContainer>
                <Button
                color="info"
                round
                className={classes.marginRight}
                onClick={saveMoneyButtonDetails}
                style={{ float: "right" }}
              >
                Connect {'\u00A0'}{'\u00A0'} {formState.values.attached ?  <CheckCircleOutlineIcon /> : ""}
              </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>
  );
}
