import React from "react";

// core components
import Wizard from "./Wizard.js";

import Step1 from "./steps/level1.js";
import Step2 from "./steps/level2.js";
import Step3 from "./steps/level3.js";

export default function UpdateUser_old(props) {
  return (
    <Wizard
      validate
      steps={[
        {
          stepName: "Level 1",
          stepComponent: Step1,
          stepId: "about",
        },
        {
          stepName: "Level 2",
          stepComponent: Step2,
          stepId: "account",
        },
        {
          stepName: "Level 3",
          stepComponent: Step3,
          stepId: "address",
        },
      ]}
      title={props.disabledCheck ? "User Details":"Update User Data"}
      subtitle=""
      finishButtonClick={(e) => alert(e)}
      goBack={props.goBack}
      userData={props.userData}
      updateUserData={props.updateUserData}
      disabledCheck={props.disabledCheck}
    />
  );
}
