import React, { useState } from "react";
// @material-ui/core components
import {
  IconButton,
  Typography,
} from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AttachmentRounded from "@material-ui/icons/AttachmentRounded";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CardFooter from "components/Card/CardFooter";



export default function Attachments(props) {
  let {attachments} = props;
  let fileInput = React.createRef();

  return (
    <GridContainer>
      {attachments.map((file, index) => (
        <GridItem key={index} xs={12} sm={3} md={2} lg={2}>
          <Card>
            <CardBody
              style={{
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <AttachmentRounded
                onClick={() => props.viewFileHandler(file)}
                style={{
                  alignSelf: "center",
                  width: 50,
                  height: 70,
                  marginBottom: 10,
                }}
                fontSize="large"
              />
              <Typography variant="body1" component="h6">
                {file.attachmentTitle.substring(0, 7)}<br />{" "}
                <sub>({file.type})</sub>
              </Typography>
            </CardBody>
            <CardFooter>
              <IconButton
                onClick={() => props.viewFileHandler(file)}
                style={{
                  float: "right",
                  color: "orange",
                }}
                fontSize="small"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => props.removeAttachment(index)}
                style={{
                  float: "right",
                  color: "red",
                }}
                fontSize="small"
              >
                <HighlightOffIcon fontSize="small" />
              </IconButton>
            </CardFooter>
          </Card>
        </GridItem>
      ))}
      <GridItem key={"addAttachment"} xs={12} sm={3} md={2} lg={2}>
        <Card
          onClick={() => {
            fileInput.current.click();
          }}
          style={{
            padding: "10px",
            textAlign: "center",
            cursor: "pointer",
            background: "#f5f5f5",
          }}
        >
          <AddCircleOutlineIcon
            style={{
              alignSelf: "center",
              width: 50,
              height: 125,
              marginBottom: 10,
            }}
            fontSize="large"
          />
          <Typography variant="body1" component="h6">
            Attachments
          </Typography>
        </Card>
      </GridItem>
      <GridItem
              style={{
                marginTop: "20px",
              }}
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
              <div className="fileinput text-center">
                <input
                  type="file"
                  accept="image/png, image/jpeg ,application/pdf "
                  onChange={props.handleAttachmentChange}
                  ref={fileInput}
                />
              </div>
            </GridItem>
    </GridContainer>
  );
}
