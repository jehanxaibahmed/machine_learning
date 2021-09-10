/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  makeStyles,
  Checkbox,
  Divider 
} from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
import axios from "axios";
import jwt from "jsonwebtoken";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useDispatch, useSelector } from "react-redux";
import Typography from "views/Components/Typography";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function EditPaymentGateway({item, closeModal,getPaymentgateways}) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const decoded = jwt.decode(Token);
 
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [PaymentGateways, setPaymentGateways] = React.useState([]);
  const [formState, setFormState] = React.useState({
    values: {
     isEnable:item.Enable,
     isDefault:item.default 
    },
    errors: {
     paymentGateway:""
    },
  });
  console.log(item);
  

  React.useEffect(() => {
  }, []);


  const updatePaymentGateway = () => {
          var data= {
            vendorId:decoded.id,
            Enable:formState.values.isEnable,
            default:formState.values.isDefault,
            channel_id:item.channel_id
          }
        axios({
            method: "post",
            url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/saveGateway`,
            data: data,
            headers: { cooljwt: Token },
          })
            .then((response) => {
              getPaymentgateways();
              closeModal();
                // successAlert('Edit Successfully..');
            }).catch((err)=>{
              getPaymentgateways();
              errorAlert('There is an issue..');
            })

  }

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.name == "isEnable" ?  !formState.values.isEnable : !formState.values.isDefault ,
      },
    }));
  };





  return (
        <Card>
         
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
               {item.serviceName}
                </h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
            <GridContainer>
                <React.Fragment>
                  <GridItem
                    xs={9}
                    sm={9}
                    md={9}
                    lg={9}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                   <h5>Enable</h5>
                  </GridItem>
                  <GridItem
                    xs={3}
                    sm={3}
                    md={3}
                    lg={3}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                     <Checkbox
                      checked={formState.values.isEnable}
                      name="isEnable"
                      onChange={handleChange}
                      value={formState.values.isEnable}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    /> 
                  </GridItem>
                  <Divider /> 
                  <GridItem
                    xs={9}
                    sm={9}
                    md={9}
                    lg={9}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                      <h5>Prefered</h5>
                  </GridItem>
                  <GridItem
                    xs={3}
                    sm={3}
                    md={3}
                    lg={3}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                       <Checkbox
                      checked={formState.values.isDefault}
                      name="isDefault"
                      onChange={handleChange}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    /> 
                  </GridItem>
                </React.Fragment>
            </GridContainer>
            <Button
              color="danger"
              round
              style={{ float: "right" }}
              className={classes.marginRight}
              onClick={updatePaymentGateway}
            >
              Save
            </Button>
          </CardBody>
        </Card>
       );
}
