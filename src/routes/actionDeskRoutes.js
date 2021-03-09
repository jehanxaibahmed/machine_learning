
// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FingerprintIcon from '@material-ui/icons/Fingerprint';

//Components
import Dashboard from "views/LDocs/Dashboard/Dashboard";
import Notifications from "views/LDocs/Notifications/Notifications";
import Requested from "views/LDocs/Reviews/Requested";
import ApprovalRequested from "views/LDocs/Approvals/Requested";
import SignatureStamp from "views/LDocs/SignatureStamp/SignatureStamp";
import Verify from "views/LDocs/Verify/Verify";




var actionRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/action",
  },
  {
    collapse: true,
    name: "Action Desk",
    rtlName: "المكونات",
    icon: AssignmentIndIcon,
    state: "ActionDeskCollapse",
    views: [
    {
      path: "/my-requests",
      name: "Review Tasks",
      rtlName: "انهيار متعدد المستويات",
      rtlMini: "ر",
      component: Requested,
      layout: "/action",
      icon: AssignmentLateIcon,
    },
    {
      path: "/approvals",
      name: "Approval Tasks",
      rtlName: "انهيار متعدد المستويات",
      rtlMini: "ر",
      icon: AssignmentTurnedInIcon,
      component: ApprovalRequested,
      layout: "/action",
        }
      ]
    }
  ,
    {
    path: "/verifier",
    name: "Tracking & Validate",
    rtlName: "أشكال عادية",
    rtlMini: "صو",
    icon: VerifiedUserIcon,
    component: Verify,
    layout: "/action",
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "لوحة القيادة",
    icon: NotificationsActiveIcon,
    component: Notifications,
    layout: "/action",
  },
  {
    path: "/signature-stamp",
    name: "Signature / Stamp",
    rtlName: "أشكال عادية",
    rtlMini: "صو",
    icon: FingerprintIcon,
    component: SignatureStamp,
    layout: "/action",
  },
];
export default actionRoutes;
