import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
// @material-ui/core components
import CircularProgress from "@material-ui/core/CircularProgress";
// core components
import Button from "components/CustomButtons/Button.js";

import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";
import axios from "axios";
import {useSelector, useDispatch } from "react-redux";
import { setIsTokenExpired } from "actions";

export default function ImageUpload(props) {
  const [file, setFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  //Token
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    props.avatar
      ? defaultAvatar
      :  defaultImage
  );
  let fileInput = React.createRef();
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    props.handleImageChange(file, 1, props.name);
    setIsLoading(true);
    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
    
  };
  // eslint-disable-next-line
  const handleSubmit = () => {
    setIsUploading(true)
    var bodyFormData = new FormData();
    bodyFormData.append("displayImage", file);
    let msg = "";
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/user/updateProfileImage`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data", cooljwt: Token },
    })
      .then((response) => {
        handleRemove();
        let userImage = URL.createObjectURL(file);
        props.userData.level1.profileImg = userImage;
        props.updateUserData(props.userData);
        setIsUploading(false);
        msg = "Profile Image Updated Successfully!";
        props.successAlert(msg);
      })
      .catch((error) => {
        error.response.status && error.response.status == 401 && dispatch(setIsTokenExpired(true));
      setIsUploading(false);
        msg =
          typeof error.response != "undefined"
            ? error.response.data
            : error.message;
        props.errorAlert(msg);
      });
  };
  const handleClick = () => {
    fileInput.current.click();
  };
  const handleRemove = () => {
    setFile(null);
    props.handleImageChange(null, 2, props.name);
    setImagePreviewUrl(props.avatar ? defaultAvatar : defaultImage);
  };
  let {
    avatar,
    addButtonProps,
    changeButtonProps,
    removeButtonProps,
    uploadButtonProps,
  } = props;
  return (
    <div className="fileinput text-center">
      <input type="file" onChange={handleImageChange} ref={fileInput} />
      {isLoading ? (
        <CircularProgress disableShrink />
      ) : (
        <div className={"thumbnail" + (avatar ? " img-circle" : "")}>
          <img src={imagePreviewUrl} alt="..." />
        </div>
      )}

      <div>
        {file === null ? (
          <Button {...addButtonProps} onClick={() => handleClick()}>
            {avatar ? "Add Photo" : "Select image"}
          </Button>
        ) : (
          <span>
            <Button {...changeButtonProps} onClick={() => handleClick()}>
              Change
            </Button>
            {avatar ? <br /> : null}
            <Button {...removeButtonProps} onClick={() => handleRemove()}>
              <i className="fas fa-times" /> Remove
            </Button>
            <Button {...uploadButtonProps} onClick={() => handleSubmit()}>
              Upload
            </Button>
            {isUploading ? <CircularProgress disableShrink /> : ""}
          </span>
        )}
      </div>
    </div>
  );
}

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object,
};
