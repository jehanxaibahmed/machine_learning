import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components
import Lottie from 'react-lottie-player';

import lottieJson from './my-lottie.json'



export default function Card(props) {
return (
    <Lottie
        loop
        animationData={lottieJson}
        play
        style={{ width: 300, height: 300, margin:'auto'}}
    />
  );
}

