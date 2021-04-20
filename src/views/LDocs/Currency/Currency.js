import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, TextField, Switch } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icon
import VisibilityIcon from "@material-ui/icons/Visibility";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import SweetAlert from "react-bootstrap-sweetalert";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
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
  statusImage: {
    width: 50,
    height: 50,
  },
};

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Currency() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(true);
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [data, setData] = React.useState();
  const [animateTableView, setAnimateTableView] = React.useState(true);
  const [animateTable, setAnimateTable] = React.useState(true);
  const [state, setState] = React.useState({
    currencies: []
  });

  React.useEffect(() => {
    let userDetail = jwt.decode(Token);
    getOrganizations(userDetail);
  }, []);

  const setFilters = (org) => {
    setOrganizationFilter(org);
  };

  const sweetClass = sweetAlertStyle();
  const [alert, setAlert] = React.useState(null);
  const successAlert = (msg) => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.success}
      >
        {msg}
      </SweetAlert>
    );
  };
  const errorAlert = (msg) => {
    setAlert(
      <SweetAlert
        error
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => hideErrorAlert()}
        onCancel={() => hideErrorAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg}
        <br />
        {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
      </SweetAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };
  const hideErrorAlert = () => {
    setAlert(null);
  };

  const handleOrgFilter = (event) => {
    const orgDetail = organizations.find(
      (org) => org.organizationName == event.target.value
    );
    setOrganizationFilter(orgDetail);
    getCurrency(orgDetail._id);
  };

  const getOrganizations = (user) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/getAllOrgBytenant`,
      headers: { cooljwt: Token },
    }).then((response) => {
      if (response.data.length > 0) {
        if (user.isTenant) {
          const orgs = response.data;
          setOrganizations(orgs);
          setOrganizationFilter(orgs[0]);
          getCurrency(orgs[0]._id);
        } else {
          const orgs = response.data.filter(
            (org) => org._id == user.orgDetail.organizationId
          );
          setOrganizations(orgs);
          getCurrency(orgs[0]._id);
          setOrganizationFilter(orgs[0]);
        }
      }
    }, 500);
  };

  const handleChange = (event) => {
    let currencies = state.currencies;
    if (event.target.name == "rate") {
      currencies[event.target.id].conversionRate = parseFloat(event.target.value);
      setState({
        ...state,
        currencies: currencies,
      });
    }
    if (event.target.name == "status") {
      currencies[event.target.id].isEnabled = !currencies[event.target.id].isEnabled;
      setState({
        ...state,
        currencies: currencies,
      });
    }
  };

  const getCurrency = (org) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorsByOrganization/${org}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
       setState({
         ...state,
          currencies:[{
            organizationId: '123',
            currencyId: '123',
            name: 'Doller',
            symbol: '$',
            code: 'USD',
            conversionRate: 123,
            isEnabled: true
          },
        ] 
       })
        setIsLoading(false);
      })
      .catch((error) => {
        error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsLoading(false);
      });
  };


  const saveCurrencies = () => {
    setIsLoading(true);
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/saveCurrencies`,
      data: state.currencies,
      headers: { cooljwt:Token},
    })
      .then((response) => {
        setIsLoading(false);
        successAlert('Currencies Updated Sucessfully');
      }).catch((error)=>{
        setIsLoading(false);
        error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));
        errorAlert('Error in Saving Currencies');
      })
  }

  return (
    <div>
      {alert}
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitleText}>Filter</h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <TextField
                  className={classes.textField}
                  fullWidth={true}
                  label="Select Organization To See Currencies"
                  name="organizationFilter"
                  onChange={(event) => {
                    handleOrgFilter(event);
                  }}
                  select
                  value={organizationFilter.organizationName || ""}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    Choose Organization
                  </MenuItem>
                  {/* {userDetails.isTenant ? (
                    <MenuItem value={'SHOW ALL'}>
                      SHOW ALL
                    </MenuItem>) : ''} */}
                  {organizations.map((org, index) => {
                    return (
                      <MenuItem key={index} value={org.organizationName}>
                        {org.organizationName}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </GridItem>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {animateTableView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateTable}
        >
          <GridContainer>
            <GridItem xs={12}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>Currencies</h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <CircularProgress disableShrink />
                  ) : (
                    <ReactTable
                      data={state.currencies.map((prop, index) => {
                        return {
                          name: prop.name || "",
                          code: prop.code || "",
                          rate: (
                            <div className="actions-right">
                              <TextField
                                variant="outlined"
                                id={index}
                                onChange={handleChange}
                                name="rate"
                                type="number"
                                value={parseFloat(prop.conversionRate) || 0.00}
                              />
                            </div>
                          ),
                          symbol: prop.symbol || "",
                          active: (
                            <Switch
                              checked={prop.isEnabled}
                              id={index}
                              onChange={handleChange}
                              color="primary"
                              name="status"
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />
                          ),
                        };
                      })}
                      sortable={false}
                      columns={[
                        {
                          Header: "Name",
                          accessor: "name",
                        },
                        {
                          Header: "Symbol",
                          accessor: "symbol",
                        },
                        {
                          Header: "Code",
                          accessor: "code",
                        },
                        {
                          Header: "Active",
                          accessor: "active",
                        },
                        {
                          Header: "",
                          accessor: "rate",
                        },
                      ]}
                      defaultPageSize={state.currencies.length}
                      showPaginationTop={false}
                      showPaginationBottom={false}
                      className="-striped -highlight"
                    />
                  )}
                </CardBody>
              </Card>
              <Button
                color="danger"
                round
                className={classes.marginRight}
                style={{ float: "right" }}
                onClick={saveCurrencies}
              >
                Save
              </Button>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
    </div>
  );
}
