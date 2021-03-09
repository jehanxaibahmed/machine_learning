
// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import FingerprintIcon from '@material-ui/icons/Fingerprint';

//Components
import Dashboard from "views/LDocs/Dashboard/Dashboard";
import Notifications from "views/LDocs/Notifications/Notifications";
import SignatureStamp from "views/LDocs/SignatureStamp/SignatureStamp";
import Verify from "views/LDocs/Verify/Verify";




var financeRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/finance",
  },
    {
    path: "/verifier",
    name: "Tracking & Validate",
    rtlName: "أشكال عادية",
    rtlMini: "صو",
    icon: VerifiedUserIcon,
    component: Verify,
    layout: "/finance",
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "لوحة القيادة",
    icon: NotificationsActiveIcon,
    component: Notifications,
    layout: "/finance",
  },
  {
    path: "/signature-stamp",
    name: "Signature / Stamp",
    rtlName: "أشكال عادية",
    rtlMini: "صو",
    icon: FingerprintIcon,
    component: SignatureStamp,
    layout: "/finance",
  },
];
export default financeRoutes;
