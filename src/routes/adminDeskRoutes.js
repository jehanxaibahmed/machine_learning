//Material icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ErrorIcon from '@material-ui/icons/Error';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import ContactsIcon from '@material-ui/icons/Contacts';
import QueueIcon from '@material-ui/icons/Queue';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import PeopleIcon from '@material-ui/icons/People';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

//Components
import UsersList from "views/LDocs/Users/UsersList";
import BuildNetwork from "views/LDocs/BuidNetwork/BuildNetwork";
import Dashboard from "views/LDocs/Dashboard/Dashboard";
import Notifications from "views/LDocs/Notifications/Notifications";
import Titles from "views/LDocs/Title/TitleForm";
import Workflow from "views/LDocs/Workflow/Workflow";
import SignatureStamp from "views/LDocs/SignatureStamp/SignatureStamp";
import  Warnings from "views/LDocs/Warnings/Warnings";
import  Vendor from "views/LDocs/Vendor/Vendor";
import Verify from "views/LDocs/Verify/Verify";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';




var adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Admin Desk",
    rtlName: "صفحات",
    icon: ContactsIcon,
    state: "adminCollapse",
    views: [
      {
        path: "/buildNetwork",
        name: "Build Network",
        icon: QueueIcon,
        component: BuildNetwork,
        layout: "/admin",
      },
      {
        path: "/invoiceWorkflows",
        name: "Invoice Workflows",
        icon: DeviceHubIcon,
        component: Workflow,
        layout: "/admin",
      },
      {
        path: "/vendor",
        name: "Vendors",
        icon: PeopleIcon,
        component: Vendor,
        layout: "/admin",
      },
      {
        path: "/users",
        name: "Users",
        icon: SupervisedUserCircleIcon,
        component: UsersList,
        layout: "/admin",
      },
      {
        path: "/warnings",
        name: "Warnings",
        icon: ErrorIcon,
        component: Warnings,
        layout: "/admin",
      }
    ],
  },
    {
    path: "/verifier",
    name: "Tracking & Validate",
    rtlName: "أشكال عادية",
    rtlMini: "صو",
    icon: VerifiedUserIcon,
    component: Verify,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "لوحة القيادة",
    icon: NotificationsActiveIcon,
    component: Notifications,
    layout: "/admin",
  }
];
export default adminRoutes;
