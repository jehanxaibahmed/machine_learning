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
import Loader from "./Loader";
import { setIsTokenExpired } from "actions";


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
export default function PaymentGateways(props) {
  const classes = useStyles();
  const user = useSelector((state) => state.userReducer.userListData);
  const [loaderModel, setLoaderModel] = React.useState(false);
  const [paypalDetails, setPaypalDetails] = React.useState(null);
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });
  const [formState, setFormState] = React.useState({
    values: {
      paypalEmail: "",
    },
    errors: {
      paypalEmail: "",
    },
  });

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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

  const referalLink = () => {
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
      setLoaderModel(true);
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/payment/requestAccessTokenPaypal`,
      }).then((response) => {
        let accessToken = response.data.access_token;

        var dataString = {
          individual_owners: [
            {
              names: [
                {
                  prefix: "Mr.",
                  given_name: "John",
                  surname: "Doe",
                  middle_name: "Middle",
                  suffix: "Jr.",
                  full_name: "John Middle Doe Jr.",
                  type: "LEGAL",
                },
              ],
              citizenship: "US",
              addresses: [
                {
                  address_line_1: "One Washington Square",
                  address_line_2: "Apt 123",
                  admin_area_2: "San Jose",
                  admin_area_1: "CA",
                  postal_code: "95112",
                  country_code: "US",
                  type: "HOME",
                },
              ],
              phones: [
                {
                  country_code: "1",
                  national_number: "6692468839",
                  extension_number: "1234",
                  type: "MOBILE",
                },
              ],
              birth_details: {
                date_of_birth: "1955-12-29",
              },
              type: "PRIMARY",
            },
          ],
          business_entity: {
            business_type: {
              type: "INDIVIDUAL",
              subtype: "ASSO_TYPE_INCORPORATED",
            },
            business_industry: {
              category: "1004",
              mcc_code: "2025",
              subcategory: "8931",
            },
            business_incorporation: {
              incorporation_country_code: "US",
              incorporation_date: "1986-12-29",
            },
            names: [
              {
                business_name: "Test Enterprise",
                type: "LEGAL_NAME",
              },
            ],
            emails: [
              {
                type: "CUSTOMER_SERVICE",
                email: "customerservice@example.com",
              },
            ],
            website: "https://mystore.testenterprises.com",
            addresses: [
              {
                address_line_1: "One Washington Square",
                address_line_2: "Apt 123",
                admin_area_2: "San Jose",
                admin_area_1: "CA",
                postal_code: "95112",
                country_code: "US",
                type: "WORK",
              },
            ],
            phones: [
              {
                country_code: "1",
                national_number: "6692478833",
                extension_number: "1234",
                type: "CUSTOMER_SERVICE",
              },
            ],
            beneficial_owners: {
              individual_beneficial_owners: [
                {
                  names: [
                    {
                      prefix: "Mr.",
                      given_name: "John",
                      surname: "Doe",
                      middle_name: "Middle",
                      suffix: "Jr.",
                      full_name: "John Middle Doe Jr.",
                      type: "LEGAL",
                    },
                  ],
                  citizenship: "US",
                  addresses: [
                    {
                      address_line_1: "One Washington Square",
                      address_line_2: "Apt 123",
                      admin_area_2: "San Jose",
                      admin_area_1: "CA",
                      postal_code: "95112",
                      country_code: "US",
                      type: "HOME",
                    },
                  ],
                  phones: [
                    {
                      country_code: "1",
                      national_number: "6692468839",
                      extension_number: "1234",
                      type: "MOBILE",
                    },
                  ],
                  birth_details: {
                    date_of_birth: "1955-12-29",
                  },
                  percentage_of_ownership: "50",
                },
              ],
              business_beneficial_owners: [
                {
                  business_type: {
                    type: "INDIVIDUAL",
                    subtype: "ASSO_TYPE_INCORPORATED",
                  },
                  business_industry: {
                    category: "1004",
                    mcc_code: "2025",
                    subcategory: "8931",
                  },
                  business_incorporation: {
                    incorporation_country_code: "US",
                    incorporation_date: "1986-12-29",
                  },
                  names: [
                    {
                      business_name: "Test Enterprise",
                      type: "LEGAL_NAME",
                    },
                  ],
                  emails: [
                    {
                      type: "CUSTOMER_SERVICE",
                      email: formState.values.paypalEmail,
                    },
                  ],
                  website: process.env.process.env.REACT_APP_LDOCS_API_SELF_URL,
                  addresses: [
                    {
                      address_line_1: "One Washington Square",
                      address_line_2: "Apt 123",
                      admin_area_2: "San Jose",
                      admin_area_1: "CA",
                      postal_code: "95112",
                      country_code: "US",
                      type: "WORK",
                    },
                  ],
                  phones: [
                    {
                      country_code: "1",
                      national_number: "6692478833",
                      extension_number: "1234",
                      type: "CUSTOMER_SERVICE",
                    },
                  ],
                  percentage_of_ownership: "50",
                },
              ],
            },
            office_bearers: [
              {
                names: [
                  {
                    prefix: "Mr.",
                    given_name: "John",
                    surname: "Doe",
                    middle_name: "Middle",
                    suffix: "Jr.",
                    full_name: "John Middle Doe Jr.",
                    type: "LEGAL",
                  },
                ],
                citizenship: "US",
                addresses: [
                  {
                    address_line_1: "One Washington Square",
                    address_line_2: "Apt 123",
                    admin_area_2: "San Jose",
                    admin_area_1: "CA",
                    postal_code: "95112",
                    country_code: "US",
                    type: "HOME",
                  },
                ],
                phones: [
                  {
                    country_code: "1",
                    national_number: "6692468839",
                    extension_number: "1234",
                    type: "MOBILE",
                  },
                ],
                birth_details: {
                  date_of_birth: "1955-12-29",
                },
                role: "DIRECTOR",
              },
            ],
            annual_sales_volume_range: {
              minimum_amount: {
                currency_code: "USD",
                value: "10000",
              },
              maximum_amount: {
                currency_code: "USD",
                value: "50000",
              },
            },
            average_monthly_volume_range: {
              minimum_amount: {
                currency_code: "USD",
                value: "1000",
              },
              maximum_amount: {
                currency_code: "USD",
                value: "50000",
              },
            },
            purpose_code: "P0104",
          },
          email: formState.values.paypalEmail,
          preferred_language_code: "en-US",
          tracking_id: "testenterprices123122",
          partner_config_override: {
            partner_logo_url:
              "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg",
            return_url: `${process.env.process.env.REACT_APP_LDOCS_API_SELF_URL}/vendor/user-profile`,
            return_url_description:
              "the url to return the merchant after the paypal onboarding process.",
            action_renewal_url:
              "https://testenterprises.com/renew-exprired-url",
            show_add_credit_card: true,
          },
          operations: [
            {
              operation: "API_INTEGRATION",
              api_integration_preference: {
                rest_api_integration: {
                  integration_method: "PAYPAL",
                  integration_type: "THIRD_PARTY",
                  third_party_details: {
                    features: [
                      "PAYMENT",
                      "REFUND"
                   ]
                  }
                }
              }
            }
          ],
          legal_consents: [
            {
              type: "SHARE_DATA_CONSENT",
              granted: true,
            },
          ],
          products: ["EXPRESS_CHECKOUT"],
        };

        axios({
          method: "POST",
          url: "https://api-m.sandbox.paypal.com/v2/customer/partner-referrals",
          data: dataString,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        })
          .then((response) => {
            localStorage.setItem("paypalEmail", formState.values.paypalEmail);
            if (response.data) {
              setLoaderModel(false);
              window.open(response.data.links[1].href, "_blank");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  };

  React.useEffect(() => {
    let merchantId = getParameterByName("merchantId");
    let merchantIdInPayPal = getParameterByName("merchantIdInPayPal");
    let permissionsGranted = getParameterByName("permissionsGranted");
    let accountStatus = getParameterByName("accountStatus");
    let consentStatus = getParameterByName("consentStatus");
    let productIntentID = getParameterByName("productIntentID");
    // let productIntentId = getParameterByName("productIntentId");
    let isEmailConfirmed = getParameterByName("isEmailConfirmed");
    let returnMessage = getParameterByName("returnMessage");

    if (isEmailConfirmed) {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/setPayPalAccDetails`,
        data: {
          accountStatus: accountStatus,
          consentStatus: consentStatus,
          isEmailConfirmed: isEmailConfirmed,
          merchantId: merchantId,
          merchantIdInPayPal: merchantIdInPayPal,
          payPal_email: localStorage.getItem('paypalEmail'),
          permissionsGranted: permissionsGranted,
          productIntentId: productIntentID,
          returnMessage: returnMessage,
          riskStatus: "riskStatus"
        },
        headers: { cooljwt: Token },
      })
        .then((response) => {
          console.log('Information Saved Successfully.');
        })
        .catch((error) => {
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(error);
        });
    }
  }, []);

  React.useEffect(()=>{
    var paypalDetails = user ? user.level3:{};
    if(paypalDetails){
      setPaypalDetails(paypalDetails.payPalAcc_details);
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          paypalEmail:paypalDetails.payPalAcc_details.payPal_email,
        },
      }));
    }
  },[user.level3])

  return (
    <div>
      {loaderModel ? (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} className={classes.center}>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"sm"}
              scroll="body"
              open={loaderModel}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setLoaderModel(false)}
              aria-labelledby="tag-modal-slide-title"
              aria-describedby="tag-modal-slide-description"
            >
              <DialogContent
                id="tag-modal-slide-description"
                className={classes.modalBody}
              >
                <Loader
                  closeModal={() => setLoaderModel(false)}
                  title={"Building Referal URL To Paypal"}
                />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      ) : (
        ""
      )}
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
                  <h4 className={classes.cardTitle}>Paypal Account</h4>
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
                          ? "Valid Paypal Email is required"
                          : null
                      }
                      className={classes.textField}
                      fullWidth={true}
                      label="Paypal Email"
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
                onClick={referalLink}
                style={{ float: "right" }}
              >
                Connect
              </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>
    </div>
  );
}
