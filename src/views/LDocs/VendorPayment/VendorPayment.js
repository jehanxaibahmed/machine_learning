import React, { useEffect } from "react";
import { useSelector } from "react-redux";
// @material-ui/core components
import { makeStyles, CircularProgress, Slide, DialogContent, Dialog, Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import defaultAvatar from "assets/img/placeholder.jpg";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Button from "components/CustomButtons/Button.js";
import { Animated } from "react-animated-css";
import Wizard from "./Wizard.js";
import Crypto from "./steps/Crypto";
import Fiat from "./steps/Fiat";
import jwt from "jsonwebtoken";
import axios from "axios";
import AddPaymentModal from "./AddPaymentModal";
import EditPaymentModal from "./EditPaymentModal";
import Paypal from "./Paypal/Paypal";
import MoneyButton from "./MoneyButton/MoneyButton.js";
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
export default function VendorPayment() {
    const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const decoded = jwt.decode(Token);
  const classes = useStyles();
  const [PaymentGateways, setPaymentGateways] = React.useState([]);
  const [addPaymentGatewayModal, setAddPaymentGatewayModal] = React.useState(
    false
  );
  const [editPaymentGatewayModal, setEditPaymentGatewayModal] = React.useState(
    false
  );
  const [detailPaymentGatewayModal, setDetailPaymentGatewayModal] = React.useState(
    false
  );
  const [gridView, setGridView] = React.useState(
    true
  );
  const [item, setItem] = React.useState(null);
  const [type, setType] = React.useState(1);
  const [value, setValue] = React.useState('0');

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  const addPayment = (i) => {
      //i==1?Fiat : Crypto
    setType(i);
    setAddPaymentGatewayModal(true);
    }


const editGateway = (i) => {
    console.log(i);
    setItem(i);
    setEditPaymentGatewayModal(true);

}

const editDetails = (i) => {
    setItem(i);
    setGridView(false);
    setDetailPaymentGatewayModal(true);
}

const goBack = () => {
    setDetailPaymentGatewayModal(false);
    setGridView(true);
}

const handleRadioChange = (event) => {
    setValue(event.target.value);
  };

    const getVendorPaymentGateway = () => {
        axios({
            method: "get",
            url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/getGateway/${decoded.id}`,
            headers: { cooljwt: Token },
          })
            .then((response) => {
              setPaymentGateways(response.data);
            })
            .catch((err) => {
              console.log(err);
            });
    }



  React.useEffect(() => {
    getVendorPaymentGateway();
  }, []);

  return (
    <div>
      {gridView ?
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={gridView}
      >
       
        <GridContainer>
        {addPaymentGatewayModal ? (
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                fullWidth={true}
                maxWidth={"md"}
                scroll="body"
                open={addPaymentGatewayModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setAddPaymentGatewayModal(false)}
                aria-labelledby="tag-modal-slide-title"
                aria-describedby="tag-modal-slide-description"
              >
                <DialogContent
                  id="tag-modal-slide-description"
                  className={classes.modalBody}
                >
                  <AddPaymentModal
                    type={type}
                    closeModal={() => setAddPaymentGatewayModal(false)}
                    getPaymentgateways = {getVendorPaymentGateway}
                  />
                </DialogContent>
              </Dialog>
            </GridItem>
        ) : (
          ""
        )}
         {editPaymentGatewayModal ? (
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                fullWidth={true}
                maxWidth={"xs"}
                scroll="body"
                open={editPaymentGatewayModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setEditPaymentGatewayModal(false)}
                aria-labelledby="tag-modal-slide-title"
                aria-describedby="tag-modal-slide-description"
              >
                <DialogContent
                  id="tag-modal-slide-description"
                  className={classes.modalBody}
                >
                  <EditPaymentModal
                    item={item}
                    closeModal={() => setEditPaymentGatewayModal(false)}
                    getPaymentgateways = {getVendorPaymentGateway}
                  />
                </DialogContent>
              </Dialog>
            </GridItem>
        ) : (
          ""
        )}
          <GridItem xs={12} sm={12} md={12}>
            <Card profile>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitle}>Payments Channels </h4>
                </CardIcon>
                <RadioGroup value={value} onChange={handleRadioChange} style={{float:'right'}} row aria-label="position" name="position" defaultValue="bottom">
        <FormControlLabel
          value="0"
          control={<Radio  color="primary" />}
          label="Fiat"
          labelPlacement="bottom"
        />
        <FormControlLabel
          value="1"
          control={<Radio color="primary" />}
          label="Crypto"
          labelPlacement="bottom"
        />
        </RadioGroup>
              </CardHeader>
              <CardBody profile>
                  {value == 0 ? 
                  <Fiat
                  addPayment={addPayment}
                  setType={setType}
                  editGateway={editGateway}
                  showDetails={editDetails}
                  paymentGateways={PaymentGateways}
                  
                  /> :
                  <Crypto
                  addPayment={addPayment}
                  setType={setType}
                  editGateway={editGateway}
                  showDetails={editDetails}
                  paymentGateways={PaymentGateways}
                  
                  />}
                {/* <Wizard
                  validate
                  steps={[
                    {
                      stepName: "Fiat",
                      stepComponent: Fiat,
                      stepId: "fiat",
                    },
                    {
                      stepName: "Crypto",
                      stepComponent: Crypto,
                      stepId: "crypto",
                    },
                  ]}
                  addPayment={addPayment}
                  setType={setType}
                  editGateway={editGateway}
                  paymentGateways={PaymentGateways}
                /> */}
              </CardBody>
            </Card>
          </GridItem>
          
        </GridContainer>
      </Animated>:""}
      {detailPaymentGatewayModal ?
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={detailPaymentGatewayModal}
      >
       
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card profile>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitle}>Channel Details ({item ? item.serviceName.toUpperCase():""})</h4>
                </CardIcon>
                <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => goBack()}
                  >
                    Go Back
                  </Button>
              </CardHeader>
              <CardBody profile>
                  {item.serviceName == 'PayPal'? 
                 <Paypal />
                 :""}
                  {item.serviceName == 'moneybutton'? 
                 <MoneyButton />
                 :""}
              </CardBody>
            </Card>
          </GridItem>
          
        </GridContainer>
      </Animated>:""}
    </div>

  );
}
