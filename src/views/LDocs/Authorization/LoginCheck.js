import jwt from "jsonwebtoken";

const checkLogin = () => {
  let token = localStorage.getItem("cooljwt");
  try {
    if (
      typeof token !== "undefined" &&
      token !== false &&
      token !== "false" &&
      token !== "" &&
      token !== null
    ) {
      let decoded = jwt.decode(token);
        if (typeof decoded.otp !== "undefined") {
            if (decoded.otp) {
                return true;
            }
            else {
                return false;
            }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }catch(e){
    return false;
  }
};
export default checkLogin;
