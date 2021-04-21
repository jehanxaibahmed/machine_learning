import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
// @material-ui/core components
import CircularProgress from "@material-ui/core/CircularProgress";
// core components
import Button from "components/CustomButtons/Button.js";

import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";
import {useSelector, useDispatch } from "react-redux";

import axios from "axios";
import jwt from "jsonwebtoken";
import { setIsTokenExpired } from "actions";
import { used } from "@amcharts/amcharts4/.internal/core/utils/Utils";
export default function ImageUpload(props) {
  const [file, setFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();

  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    props.avatar
      ? defaultAvatar
      :  defaultImage
  );
 
  React.useEffect(() => {
    if (typeof props.signImg.level3.signatureURL != "undefined") {
      //if (typeof props.signImg.level3.eSignature != "undefined") {
        var preImage = props.signImg.level3.eSignature;
        var base64Flag = `data:${props.signImg.level3.eSignatureT};base64,`;
        let profileImage = base64Flag + preImage;
        setImagePreviewUrl(props.signImg.level3.signatureURL);
      // } else {
      //   setImagePreviewUrl(defaultAvatar);
      // }
    } else {
      setImagePreviewUrl(defaultAvatar);
    }
  },[]);
  
  
  let fileInput = React.createRef();
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file.type == "image/png") {
      setIsLoading(true);
      reader.onloadend = () => {
        setFile(file);
        setImagePreviewUrl(reader.result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setImagePreviewUrl(defaultAvatar);
      props.errorAlert("Only PNG format is accepted");
    }
  };
  // eslint-disable-next-line
  const handleSubmit = () => {
    setIsUploading(true)
    let decoded = jwt.decode(Token);
    var bodyFormData = new FormData();
    bodyFormData.append("signatureImg", file);
    bodyFormData.append("email", props.signImg.level3.email);
    let msg = "";
    
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/user/updateUserSignature`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data", cooljwt: Token },
    })
      .then((response) => {
        handleRemove();
        let userImage = URL.createObjectURL(file);
        setIsUploading(false);
        msg = "Signature Image Updated Successfully!";
        props.successAlert(msg);
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
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
    //setImagePreviewUrl(props.avatar ? defaultAvatar : defaultImage);
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
      <input
        type="file"
        onChange={handleImageChange}
        ref={fileInput}
        accept=".png"
      />
      {isLoading ? (
        <CircularProgress disableShrink />
      ) : (
        <div className={"thumbnail" + (avatar ? " " : "")}>
          <img src={imagePreviewUrl} alt="..." />
        </div>
      )}
      {!props.disabledCheck ?
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
        : ""}
    </div>
  );
}

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object,
};
