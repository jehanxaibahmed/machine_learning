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
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert } from "views/LDocs/Functions/Functions";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import { setIsTokenExpired } from "actions";
import PermissionsTreeView from "./TreeView";

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

export default function Permissions() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const userDetails = jwt.decode(Token);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(true);
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [data, setData] = React.useState();
  const [animateTableView, setAnimateTableView] = React.useState(true);
  const [animateTable, setAnimateTable] = React.useState(true);
  const [state, setState] = React.useState({
    roles: [],
    selectedRole: "",
    permissions_role: ""
  });

  React.useEffect(() => {
    let userDetail = jwt.decode(Token);
    getRoles()
  }, []);

  const handleChange = (event) => {
    if (event.target.name == "role") {
      setState({
        ...state,
        selectedRole: event.target.value
      });
      getPermissions(event.target.value);
    }
  };



  const getRoles = () => {
    setIsLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/user/getRoles`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setIsLoading(false);
        setState((state) => ({
          ...state,
          roles: response?.data.filter(role => !role.isAdmin)
        }));
      }).catch((error) => {
        setIsLoading(false);
        if (error.response) { error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        errorAlert('Error in Fetching Roles');
      })
  }

  const getPermissions = (id) => {
    let userDetail = jwt.decode(Token);
    let tenatID = userDetail.tenantId;
    setIsLoading(true);
    let obj = {
      tenantId: tenatID,
      roleId: id
    };
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/user/getPermissionsByRoleId`,
      data: obj,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setIsLoading(false);
        setState((state) => ({
          ...state,
          permissions_role: response?.data
        }));
      }).catch((error) => {
        setIsLoading(false);
        if (error.response) { error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        errorAlert('Error in Fetching Permissions');
      })
  }

  const handleCheckboxChange = (key1, key2, key3) => {
    setState((state) => ({
      ...state,
      permissions_role: {
        ...state.permissions_role,
        [key1]: {
          ...state.permissions_role[key1],
          [key2]: {
            ...state.permissions_role[key1][key2],
            [key3]: {
              ...state.permissions_role[key1][key2][key3],
              enable: !state.permissions_role[key1][key2][key3]?.enable
            }
          }
        }
      }
    }));
    console.log(state.permissions_role[key1][key2][key3]);
  }


  const handleSelectAll = (key_1, key_2) => {
    Object.keys(state.permissions_role).map((key1) => {
      if (key_1) { key1 = key_1 }
      Object.keys(state.permissions_role[key1]).map((key2) => {
        if (key_2) { key2 = key_2 }
        Object.keys(state.permissions_role[key1][key2]).map((key3) => {
          if (key3 != "name" && key3 != "enable" && key3.length > 1) {
            console.log(key3)
            setState((state) => ({
              ...state,
              permissions_role: {
                ...state.permissions_role,
                [key1]: {
                  ...state.permissions_role[key1],
                  [key2]: {
                    ...state.permissions_role[key1][key2],
                    [key3]: {
                      ...state.permissions_role[key1][key2][key3],
                      enable: true
                    }
                  }
                }
              }
            }))
          }
        })
      })
    })

  }

  const savePermissions = () => {
    let userDetail = jwt.decode(Token);
    let tenatID = userDetail.tenantId;
    setIsLoading(true);
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/user/savePermissions`,
      data: {
        permissions: {
          ...state.permissions_role,
          tenantId: tenatID,
          roleId: state.selectedRole
        }
      },
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setIsLoading(false);
        successAlert('Updated Permissions Sucessfully');
      }).catch((error) => {
        setIsLoading(false);
        if (error.response) { error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        errorAlert('Error in Saving Permissions');
      })
  }

  return (
    <div>

      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitleText}>Roles</h4>
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
                  label="Select Role to see Permissions"
                  name="role"
                  onChange={(event) => {
                    handleChange(event);
                  }}
                  select
                  value={state.selectedRole || ""}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    Choose Role
                  </MenuItem>
                  {/* {userDetails.isTenant ? (
                    <MenuItem value={'SHOW ALL'}>
                      SHOW ALL
                    </MenuItem>) : ''} */}
                  {state.roles.map((role, index) => {
                    return (
                      <MenuItem key={index} value={role._id}>
                        {role.roleName}
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
                    <h4 className={classes.cardTitleText}>Permissions</h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  <PermissionsTreeView handleSelectAll={handleSelectAll} handleCheckboxChange={handleCheckboxChange} permissions={state.permissions_role} />
                </CardBody>
              </Card>
              <Button
                color="danger"
                round
                className={classes.marginRight}
                style={{ float: "right" }}
                onClick={savePermissions}
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
