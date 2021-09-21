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
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupSharpIcon from '@material-ui/icons/PhonelinkSetupSharp';
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
import  Client from "views/LDocs/Clients/Client";
import Verify from "views/LDocs/Verify/Verify";
import Currency from "views/LDocs/Currency/Currency";
import GeneralConfigrations from "views/LDocs/Configrations/GeneralConfigrations";
import DescriptionIcon from '@material-ui/icons/Description';
import InvoiceConfigrations from "views/LDocs/Configrations/InvoiceConfigration";
import Permissions from "views/LDocs/Permissions/Permissions";
import Roles from "views/LDocs/Roles/RolesForm";


var adminRoutes = [
  {
    path: "/dashboard/ad",
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
        path: "/buildNetwork/ad",
        name: "Build Network",
        icon: QueueIcon,
        component: BuildNetwork,
        layout: "/admin",
      },
      {
        path: "/invoiceWorkflows/ad",
        name: "Invoice Workflows",
        icon: DeviceHubIcon,
        component: Workflow,
        layout: "/admin",
      },
      {
        path: "/supplier/ad",
        name: "Supplier",
        icon: PeopleIcon,
        component: Vendor,
        layout: "/admin",
      },
      {
        path: "/client/ad",
        name: "Customer",
        icon: PeopleIcon,
        component: Client,
        layout: "/admin",
      },
      {
        path: "/users/ad",
        name: "Users",
        icon: SupervisedUserCircleIcon,
        component: UsersList,
        layout: "/admin",
      }
    ],
  },
    {
    path: "/verifier/ad",
    name: "Tracking & Validate",
    rtlName: "أشكال عادية",
    rtlMini: "صو",
    icon: VerifiedUserIcon,
    component: Verify,
    layout: "/admin",
  },
  {
    path: "/notifications/ad",
    name: "Notifications",
    rtlName: "لوحة القيادة",
    icon: NotificationsActiveIcon,
    component: Notifications,
    layout: "/admin",
  },
  // {
  //   path: "/logs",
  //   name: "logs",
  //   icon: ErrorIcon,
  //   component: Warnings,
  //   layout: "/admin",
  // },
  {
    collapse: true,
    name: "Configration",
    rtlName: "صفحات",
    icon: SettingsIcon,
    state: "configCollapse",
    views: [
      {
        path: "/generalconfigration/ad",
        name: "General Configrations",
        icon: PhonelinkSetupSharpIcon,
        component: GeneralConfigrations,
        layout: "/admin",
      },
      {
        path: "/invoiceconfigration/ad",
        name: "Invoice Configrations",
        icon: DescriptionIcon,
        component: InvoiceConfigrations,
        layout: "/admin",
      },
      {
        path: "/currency/ad",
        name: "Currency",
        icon: MonetizationOnIcon,
        component: Currency,
        layout: "/admin",
      },
      {
        path: "/permissions/ad",
        name:"Permissions",
        icon:SettingsIcon,
        component:Permissions,
        layout:"/admin"
      },
      {
        path: "/roles/ad",
        name:"Roles",
        icon:SettingsIcon,
        component:Roles,
        layout:"/admin"
      }
    ]
  }
];
export default adminRoutes;
