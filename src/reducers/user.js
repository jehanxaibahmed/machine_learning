import { checkSelectAll } from "views/LDocs/Functions/Functions";

const initialState = {
  Token : null,
  isTokenExpired: false,
  userListData: {},
  organizations: [],
  companies: [],
  departments: [],
  teams: [],
  titles: [],
  notifications:[],
  unreadedNotifications:0,
  tasks:[],
  unreadedTasks:0,
  events:[],
  darkmode:false,
  isAr:false,
  tabVal:0,
  permissions:null,
  isApEnable:false,
  isArEnable:false
};

const userReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {

    case "SET_PERMISSIONS": {
      let isAp = checkSelectAll(action.response, "ap");
      let isAr = checkSelectAll(action.response, "ar");
      console.log("permission", checkSelectAll(action.response, "ap"));

      return { ...state, permissions: action.response, isArEnable: isAr, isApEnable: isAp};
    }

    case "SET_IS_AR": {
      return { ...state, isAr: action.response};
    }

    case "SET_TAB_VAL": {
      return { ...state, tabVal: action.response};
    }
   
    case "SET_TOKEN": {
      return { ...state, Token: action.response.token , userData : action.response.userData};
    }
    case 'SET_IS_TOKEN_EXPIRE' : {
      return { ...state, isTokenExpired: action.response};
    }
    case "CHANGE": {
      return { ...state, userListData: action.response };
    }
    case "DARKMODE":{
      return { ...state, darkmode: action.response };
    }
    case "GET_USER_DATA": {
      return { ...state, userListData: action.response };
    }
    case "GET_ORGANIZATIONS": {
      return { ...state, organizations: action.response };
    }
    case "GET_COMPANIES": {
      return { ...state, companies: action.response };
    }
    case "GET_DEPARTMENTS": {
      return { ...state, departments: action.response };
    }
    case "GET_TEAM": {
      return { ...state, teams: action.response };
    }
    case "GET_TITLES": {
      return { ...state, titles: action.response };
    }
    case "LOGOUT": {
      return { ...state, userListData: action.response };
    }
    case "GET_USER_NOTIFICATIONS": {
      return { ...state, notifications: action.response.reverse(), unreadedNotifications:action.response.filter(item=>item.status === 'un-seen').length};
    }
    case "NOTIFICATIONS_SENT": {
      console.log('NOTIFICATIONS_SENT');
    }
    case "LOG_INSERTED": {
      console.log('LOG_INSERTED');
    }
    case "FILE_DOWNLOAD": {
      console.log('FILE_DOWNLOAD');
    }
    case "GET_EVENTS": {
      return { ...state, events: action.response.reverse()};
    }
    // case "FILE_DELETE": {
    //   console.log('FILE_DELETE');
    // }
    case "GET_USER_TASKS": {
      return { ...state, tasks: action.response, unreadedTasks:action.response.filter(item=>item.taskStatus === 'to-do').length };
    }
    default:
      return { ...state };
  }
};
export default userReducer;
