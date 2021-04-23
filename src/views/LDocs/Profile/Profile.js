import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDataAction } from "../../../actions";
// @material-ui/core components
import { makeStyles, CircularProgress } from "@material-ui/core";
// @material-ui/icons
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardAvatar from "components/Card/CardAvatar.js";
import ImageUpload from "./ImageUpload.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { Animated } from "react-animated-css";
import Level1Profile from "./Level1Profile.js";
import PasswordChange from "./PasswordChange";
import jwt from "jsonwebtoken";
import SignatureStamp from "../SignatureStamp/SignatureStamp";

const sweetAlertStyle = makeStyles(styles2);

export default function UserProfile() {
  const [userData, setUserData] = useState();
  const [avatar, setAvatar] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  const updateUserData = (userObject) => {
    dispatch(setUserDataAction(userObject));
    setAvatar(userObject.level1.profileImg);
    setUserData(userObject);
  };

  const user = useSelector((state) => state.userReducer.userListData);
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  useEffect(() => {
    let image = typeof user.level1 != "undefined" ? user.level1.profileImg : "";
    setUserData(user);
    setAvatar(image);

    if (typeof user.level1 == "undefined") {
      setIsLoaded(false);
    } else {
      setIsLoaded(true);
    }
  }, [user]);

  const [profileImage, setProfileImage] = useState(null);
  const handleImageChange = (file, status, imageName) => {
    if (status == 1) {
      setProfileImage(file);
    } else {
      setProfileImage(null);
    }
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
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg}
        <br />
        Unable To Upload Image Please Contact{" "}
        {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={true}
    >
      {alert}
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card profile>
              <CardAvatar profile>
                {isLoaded ? (
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img src={avatar} alt="..." />
                  </a>
                ) : (
                  <CircularProgress disableShrink />
                )}
              </CardAvatar>
              <CardBody profile>
                <legend>Update Profile Image</legend>
                <ImageUpload
                  addButtonProps={{
                    color: "info",
                    round: true,
                  }}
                  changeButtonProps={{
                    color: "warning",
                    round: true,
                  }}
                  removeButtonProps={{
                    color: "danger",
                    round: true,
                  }}
                  uploadButtonProps={{
                    color: "success",
                    round: true,
                  }}
                  name="profileImage"
                  handleImageChange={handleImageChange}
                  avatar
                  successAlert={successAlert}
                  errorAlert={errorAlert}
                  userData={userData}
                  updateUserData={updateUserData}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <PasswordChange
              successAlert={successAlert}
              errorAlert={errorAlert}
            />
          </GridItem>
          {!jwt.decode(Token).isTenant ? (
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">Profile Information</CardIcon>
                </CardHeader>
                <CardBody>
                  {isLoaded ? (
                    <Level1Profile
                      userData={userData}
                      updateUserData={updateUserData}
                    />
                  ) : (
                    <CircularProgress disableShrink />
                  )}
                </CardBody>
              </Card>
            </GridItem>
          ) : (
            ""
          )}
          <GridItem  xs={12} sm={12} md={12} lg={12} >
            <SignatureStamp />
          </GridItem>
        </GridContainer>
      </div>
    </Animated>
  );
}
