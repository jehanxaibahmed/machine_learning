import axios from "axios";
import jwt, { decode } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import defaultAvatar from "assets/img/avatar-2.png";

const calculateMd5 = (file, callback) => {
  try {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function() {
      var wordArray = CryptoJS.lib.WordArray.create(reader.result),
        hash = CryptoJS.MD5(wordArray).toString();
      // or CryptoJS.SHA256(wordArray).toString(); for SHA-2
      callback(hash);
    };
  } catch (err) {
    callback(err);
  }
}

export const setToken = (tk) => {
  let data = {
    token : tk,
    userData: jwt.decode(tk)
  };
  return (dispatch) => { 
    dispatch({ type: "SET_TOKEN", response: data });
  }
};

export const setDarkMode = (isDark) => {
  return (dispatch) => { 
    dispatch({ type: "DARKMODE", response: isDark });
  }
};

export const setUserDataAction = (userData) => {
  return (dispatch) => { 
    dispatch({ type: "CHANGE", response: userData });
  }
};
export const logoutUserAction = () => {
  return (dispatch) => { 
    dispatch({ type: "LOGOUT", response: {} });
  }
};
export const getUserDataAction = () => {
  console.log("IN");
    return (dispatch) => {
      let Token = localStorage.getItem("cooljwt");
      let decoded = jwt.decode(Token);
      let email = decoded.loginName;
      axios({
        method: "get",
        url: decoded.isVendor ? `${process.env.REACT_APP_LDOCS_API_URL}/vendor/verifyLogin` :`${process.env.REACT_APP_LDOCS_API_URL}/user/getUserDetail`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          if (typeof response.data.isVendor.level1 != "undefined") {
            if (
              response.data.isVendor.level1.profileImg == "" ||
              typeof response.data.isVendor.level1.profileImg == "undefined"
            ) {
              response.data.isVendor.level1.profileImg = defaultAvatar;
              dispatch({ type: "GET_USER_DATA", response: response.data.isVendor });
            } else {
              var base64Flag = `data:${response.data.userDetail.isVendor.profileImgT};base64,`;
              let profileImage = base64Flag + response.data.isVendor.level1.profileImg;
              response.data.level1.isVendor.profileImg = profileImage;
              dispatch({ type: "GET_USER_DATA", response: response.data.isVendor });
            }
          }
          else if (typeof response.data.userDetail.level1 != "undefined") {
            if (
              response.data.userDetail.level1.profileImg == "" ||
              typeof response.data.userDetail.level1.profileImg == "undefined"
            ) {
              response.data.userDetail.level1.profileImg = defaultAvatar;
              dispatch({ type: "GET_USER_DATA", response: response.data.userDetail });
            } else {
              var base64Flag = `data:${response.data.userDetail.level1.profileImgT};base64,`;
              let profileImage = base64Flag + response.data.userDetail.level1.profileImg;
              response.data.level1.profileImg = profileImage;
              dispatch({ type: "GET_USER_DATA", response: response.data.userDetail });
            }
          } else {
            let data = {
              level1: {
                profileImg: defaultAvatar,
                displayName: "",
                lastName: "",
              },
            };
            dispatch({ type: "GET_USER_DATA", response: data });
          }
        })
        .catch((error) => {
          let data = {
            level1: {
              profileImg: defaultAvatar,
              displayName: "",
              lastName: "",
            },
          };
          
          console.log(
            typeof error.response != "undefined"
              ? error.response.data
              : error.message
          );
          dispatch({ type: "GET_USER_DATA", response: data });
        });
    };
};

export const getOrganizations = () => {
    return (dispatch) => {
      let Token = localStorage.getItem("cooljwt");
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/orglistwoi`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
            dispatch({ type: "GET_ORGANIZATIONS", response: response.data });
        })
        .catch((error) => {
          let msg = typeof error.response != "undefined"
          ? error.response.data
          : error.message;
          dispatch({ type: "GET_ORGANIZATIONS", response: [] });
        });
    };
}
export const getCompanies = () => {
    return (dispatch) => {
      let Token = localStorage.getItem("cooljwt");
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/comlistwoi`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
            dispatch({ type: "GET_COMPANIES", response: response.data });
        })
        .catch((error) => {
          let msg = typeof error.response != "undefined"
          ? error.response.data
          : error.message;
          dispatch({ type: "GET_COMPANIES", response: [] });
        });
    };
}
export const getDepartments = () => {
    return (dispatch) => {
      let Token = localStorage.getItem("cooljwt");
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/deplist`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
            dispatch({ type: "GET_DEPARTMENTS", response: response.data });
        })
        .catch((error) => {
          let msg = typeof error.response != "undefined"
          ? error.response.data
          : error.message;
          dispatch({ type: "GET_DEPARTMENTS", response: [] });
        });
    };
}
export const getTeam = () => {
    return (dispatch) => {
      let Token = localStorage.getItem("cooljwt");
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/tealist`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
            dispatch({ type: "GET_TEAM", response: response.data });
        })
        .catch((error) => {
          let msg = typeof error.response != "undefined"
          ? error.response.data
          : error.message;
          dispatch({ type: "GET_TEAM", response: [] });
        });
    };
}
export const getTitles = () => {
    return (dispatch) => {
      let Token = localStorage.getItem("cooljwt");
      axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/titlelist`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
            dispatch({ type: "GET_TITLES", response: response.data });
        })
        .catch((error) => {
          let msg = typeof error.response != "undefined"
          ? error.response.data
          : error.message;
          dispatch({ type: "GET_TITLES", response: [] });
        });
    };
}

export const getNotification = () => {
  return (dispatch) => {
    let Token = localStorage.getItem("cooljwt");
    let decoded = jwt.decode(Token);
    if (decoded) {
    let email = decoded.email;
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/getSysNotifyTo/${email}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
          dispatch({ type: "GET_USER_NOTIFICATIONS", response: response.data });
      })
      .catch((error) => {
        let msg = typeof error.response != "undefined"
        ? error.response.data
        : error.message;
        console.log(msg);
        dispatch({ type: "GET_USER_NOTIFICATIONS", response: [] });
      });
    }
  };
}

export const getEvents = () =>{
  return (dispatch) => {
    let Token = localStorage.getItem("cooljwt");
    // let decoded = jwt.decode(Token);
    // let loginName = decoded.loginName;
    // axios({
    //   method: "get",
    //   url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/getEventLogs`,
    //   headers: { cooljwt: Token },
    // })
    //   .then((response) => {
    //       dispatch({ type: "GET_EVENTS", response: response.data });
    //   })
    //   .catch((error) => {
    //     let msg = typeof error.response != "undefined"
    //     ? error.response.data
    //     : error.message;
    //     console.log(msg);
    //     dispatch({ type: "GET_EVENTS", response: [] });
    //   });
  };
}
export const getNotificationAndTasks = () =>{
  return (dispatch) => {
    let Token = localStorage.getItem("cooljwt");
    // let decoded = jwt.decode(Token);
    // let loginName = decoded.loginName;
    // axios({
    //   method: "get",
    //   url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/getSysNotifyTo/${loginName}`,
    //   headers: { cooljwt: Token },
    // })
    //   .then((response) => {
    //       dispatch({ type: "GET_USER_NOTIFICATIONS", response: response.data.filter(notification=> notification.notificationAction !== 'deleted') });
    //       axios({
    //         method: "get",
    //         url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/getUserTasks/${loginName}`,
    //         headers: { cooljwt: Token },
    //       })
    //         .then((response) => {
    //             dispatch({ type: "GET_USER_TASKS", response: response.data.filter(task=> task.taskStatus !== 'deleted') });
    //         })
    //         .catch((error) => {
    //           let msg = typeof error.response != "undefined"
    //           ? error.response.data
    //           : error.message;
    //           console.log(msg);
    //           dispatch({ type: "GET_USER_TASKS", response: [] });
    //         });
    //     })
    //   .catch((error) => {
    //     let msg = typeof error.response != "undefined"
    //     ? error.response.data
    //     : error.message;
    //     console.log(msg);
    //     dispatch({ type: "GET_USER_NOTIFICATIONS", response: [] });
    //   });
  };
}

export const sendNotification = (notificationItem, notifyTo) =>{
  return (dispatch) => {
    let Token = localStorage.getItem("cooljwt");
    // let decoded = jwt.decode(Token);
    // let loginName = decoded.loginName;
    // var bodyFormData = {
    // 'notifiedBy': loginName,
    // 'notifiedTo': notifyTo,
    // 'notificationDate': Date.now(),
    // 'notifiedDate':'',
    // 'notificationAction':'un-seen',
    // 'notificationItem':notificationItem
    // }
    // axios({
    //   method: "post",
    //   url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/saveSysNotify`,
    //   data: bodyFormData,
    //   headers: { "Content-Type": "application/json", cooljwt: Token},
    // })
    //   .then((response) => {
    //       dispatch({ type: "NOTIFICATIONS_SENT", response: response.data });
    //   })
    //   .catch((error) => {
    //     let msg = typeof error.response != "undefined"
    //     ? error.response.data
    //     : error.message;
    //     console.log(msg);
    //     dispatch({ type: "NOTIFICATIONS_SENT", response: [] });
    //   });
  };
}

export const sendEventLog = (Item, event) =>{
  return (dispatch) => {
    // let Token = localStorage.getItem("cooljwt");
    // let decoded = jwt.decode(Token);
    // let loginName = decoded.loginName;
    // var bodyFormData = {
    // 'eventModule': 'File System',
    // 'eventBy': loginName,
    // 'eventTime': Date.now(),
    // 'eventType':event.eventTitle,
    // 'eventDescription':event.Description,
    // 'fileId':Item.fileId,
    // 'fileType':'',
    // 'fileOwner':Item.fileOwner,
    // 'comments':'',
    // 'status':'un-seen',
    // }
    // axios({
    //   method: "post",
    //   url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/saveEventLogs`,
    //   data: bodyFormData,
    //   headers: { "Content-Type": "application/json", cooljwt: Token},
    // })
    //   .then((response) => {
    //       dispatch({ type: "LOG_INSERTED", response: response.data });
    //   })
    //   .catch((error) => {
    //     let msg = typeof error.response != "undefined"
    //     ? error.response.data
    //     : error.message;
    //     console.log(msg);
    //     dispatch({ type: "LOG_INSERTED", response: [] });
    //   });
  };
}

export const getTasks = () =>{
  return (dispatch) => {
    let Token = localStorage.getItem("cooljwt");
    let decoded = jwt.decode(Token);
    if (decoded) {
      let email = decoded.email;
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/user/getUserTasks`,
        data:{email:email},
        headers: { cooljwt: Token },
      })
        .then((response) => {
            dispatch({ type: "GET_USER_TASKS", response: response.data.filter(task=> task.taskStatus !== 'deleted') });
        })
        .catch((error) => {
          let msg = typeof error.response != "undefined"
          ? error.response.data
          : error.message;
          dispatch({ type: "GET_USER_TASKS", response: [] });
        });  
    }
  };
}



export const downloadFile = (file, cabinate, drawer, isTemp, isPublic) =>{
  return (dispatch) => {

    // let Token = localStorage.getItem("cooljwt");
    // let decoded = jwt.decode(Token);
    // let loginName = decoded.loginName;
    // let getFolderName = file.name.split("-");
    // let folderName = getFolderName[getFolderName.length - 1].split('.')[0];
    // var bodyData = {
    //   'userName':loginName,
    //   'isTemplate':isTemp,
    //   'isPublic':isPublic,
    //   'cname':cabinate,
    //   'dname':drawer,
    //   'folderName':folderName,
    //   'fileName':file.name
    // };
    // console.log(bodyData);
    // axios({
    //   method: "post",
    //   url: `${process.env.REACT_APP_LDOCS_API_FILE_URL}/api/downloadFile`,
    //   data: bodyData,
    //   headers: { "Content-Type": "application/json", cooljwt: Token},
    //   responseType: 'blob', //important
    // })
    //   .then(({ data }) => {
    //     const downloadUrl = window.URL.createObjectURL(new Blob([data]));
    //     console.log(downloadUrl);
    //     const link = document.createElement('a');
    //     link.href = downloadUrl;
    //     link.setAttribute('download', getFolderName[getFolderName.length - 1]); //any other extension
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
    //     dispatch({ type: "FILE_DOWNLOAD", response: downloadUrl });
    //   })
    //   .catch((error) => {
    //     let msg = typeof error.response != "undefined"
    //     ? error.response.data
    //     : error.message;
    //     dispatch({ type: "FILE_DOWNLOAD", response: [] });
    //   });
  };
}


// export const deleteFile = (name, cabinate, drawer, isTemp, isPublic) =>{
//   return (dispatch) => {
//     let Token = localStorage.getItem("cooljwt");
//     let decoded = jwt.decode(Token);
//     let loginName = decoded.loginName;
//     let getFolderName = name.split("-");
//     let folderName = getFolderName[getFolderName.length - 1].split('.')[0];
//     var bodyData = {
//       'userName':loginName,
//       'isTemplate':isTemp,
//       'isPublic':isPublic,
//       'cname':cabinate,
//       'dname':drawer,
//       'folderName':folderName,
//       'fileName':name
//     };
//     axios({
//       method: "delete",
//       url: `${process.env.REACT_APP_LDOCS_API_FILE_URL}/api/deleteFile`,
//       data: bodyData,
//       headers: { "Content-Type": "application/json", cooljwt: Token},
//     })
//       .then(({ data }) => {
//         console.log(data);
//         axios({
//           method: "put",
//           url: `${process.env.REACT_APP_LDOCS_API_URL}/files/markFileDeleted/${name}`,
//           headers: {cooljwt: Token},
//         })
//           .then(({ data }) => {
//            //console.log(data);
//             dispatch({ type: "FILE_DELETE", response: [] });
//           })
//           .catch((error) => {
//              let msg = typeof error.response != "undefined"
//              ? error.response.data
//              : error.message;
//              //dispatch({ type: "FILE_DOWNLOAD", response: [] });
//           });
//         //dispatch({ type: "FILE_DELETE", response: downloadUrl });
//       })
//       .catch((error) => {
//          let msg = typeof error.response != "undefined"
//          ? error.response.data
//          : error.message;
//          //dispatch({ type: "FILE_DOWNLOAD", response: [] });
//       });
//   };
// }

