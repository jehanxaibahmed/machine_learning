import jwt from "jsonwebtoken";

export const checkIsTenant = () => {
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
              if (decoded.isTenant !== undefined || 'undefined' || null) {
                if (decoded.isTenant) {
                    return true;
                }
                else
                {
                    return false;
                }
              }
              else{
                return false;
              }
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


export const checkIsAdminDesk = () => {
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
              if (decoded.role !== undefined || 'undefined' || null) {
                if (decoded.role.isAdmin) {
                    return true;
                }
                else
                {
                    return false;
                }
              }
              else
              { 
                return false;
              }
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


export const checkIsInvoiceDesk = () => {
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
              if (decoded.role !== undefined || 'undefined' || null) {
                if (decoded.role == 'Invoice Desk') {
                    return true;
                }
                else
                {
                    return false;
                }
              }
              else{
                return false;
              }
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



export const checkIsFinanceDesk = () => {
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
              if (decoded.role !== undefined || 'undefined' || null) {
                if (decoded.role == 'Finance Desk') {
                    return true;
                }
                else
                {
                    return false;
                }
              }
              else{
                return false;
              }
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

export const checkIsActionDesk = () => {
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
              if (decoded.role !== undefined || 'undefined' || null) {
                if (decoded.role == 'Action Desk') {
                    return true;
                }
                else
                {
                    return false;
                }
              }
              else{
                return false;
              }
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


export const checkIsAVPDesk = () => {
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
              if (decoded.role !== undefined || 'undefined' || null) {
                if (decoded.role == 'AVP Desk') {
                    return true;
                }
                else
                {
                    return false;
                }
              }
              else{
                return false;
              }
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


export const checkIsVendorDesk = () => {
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
              if (decoded.isVendor !== undefined || 'undefined' || null) {
                if (decoded.isVendor == true || 'true') {
                    return true;
                }
                else
                {
                    return false;
                }
              }
              else{
                return false;
              }
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

