// import Buttons from "views/Components/Buttons.js";
import Calendar from "views/Calendar/Calendar.js";
// import Charts from "views/Charts/Charts.js";
// import Dashboard from "views/Dashboard/Dashboard.js";
// import ErrorPage from "views/Pages/ErrorPage.js";
// import ExtendedForms from "views/Forms/ExtendedForms.js";
// import ExtendedTables from "views/Tables/ExtendedTables.js";
// import FullScreenMap from "views/Maps/FullScreenMap.js";
// import GoogleMaps from "views/Maps/GoogleMaps.js";
// import GridSystem from "views/Components/GridSystem.js";
// import Icons from "views/Components/Icons.js";
// import LockScreenPage from "views/Pages/LockScreenPage.js";
// import LoginPage from "views/Pages/LoginPage.js";
// import Notifications from "views/Components/Notifications.js";
// import Panels from "views/Components/Panels.js";
// import PricingPage from "views/Pages/PricingPage.js";
// import RTLSupport from "views/Pages/RTLSupport.js";
// import ReactTables from "views/Tables/ReactTables.js";
// import RegisterPage from "views/Pages/RegisterPage.js";
// import RegularForms from "views/Forms/RegularForms.js";
// import RegularTables from "views/Tables/RegularTables.js";
// import SweetAlert from "views/Components/SweetAlert.js";
// import TimelinePage from "views/Pages/Timeline.js";
// import Typography from "views/Components/Typography.js";
// import UserProfile from "views/Pages/UserProfile.js";
// import ValidationForms from "views/Forms/ValidationForms.js";
// import VectorMap from "views/Maps/VectorMap.js";
// import Widgets from "views/Widgets/Widgets.js";
// import Wizard from "views/Forms/Wizard.js";

// @material-ui/icons
import {checkTenant, checkPbr} from "./views/LDocs/Authorization/checkAuthority";
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import WidgetsIcon from "@material-ui/icons/Widgets";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ErrorIcon from '@material-ui/icons/Error';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import WrapTextIcon from '@material-ui/icons/WrapText';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import ContactsIcon from '@material-ui/icons/Contacts';
import QueueIcon from '@material-ui/icons/Queue';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import PeopleIcon from '@material-ui/icons/People';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

// LDocs Routes
import Organization from "views/LDocs/Organization/OrganizationForm";
import Department from "views/LDocs/Department/DepartmentForm";
import Company from "views/LDocs/Company/CompanyForm";
import UsersList from "views/LDocs/Users/UsersList";
import BuildNetwork from "views/LDocs/BuidNetwork/BuildNetwork";
import FilesList from "views/LDocs/Invoices/RecieveInvoice/FilesList";
import Dashboard from "views/LDocs/Dashboard/Dashboard";
import Notifications from "views/LDocs/Notifications/Notifications";
import Titles from "views/LDocs/Title/TitleForm";
import Workflow from "views/LDocs/Workflow/Workflow";
import Requested from "views/LDocs/Reviews/Requested";
import MyReviews from "views/LDocs/Reviews/MyReviews";
import ApprovalRequested from "views/LDocs/Approvals/Requested";
import MyApprovals from "views/LDocs/Approvals/MyApprovals";
import SignatureStamp from "views/LDocs/SignatureStamp/SignatureStamp";
import  Warnings from "views/LDocs/Warnings/Warnings";
import  Vendor from "views/LDocs/Vendor/Vendor";
//Templates Components
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Verify from "views/LDocs/Verify/Verify";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CreateInvoice from "views/LDocs/Invoices/CreateInvoice/CreateInvoice";
import InvoiceTracking from "views/LDocs/Invoices/InvoiceTracking/InvoiceTracking";
import InvoiceAge from "views/LDocs/Invoices/InvoiceAge/InvoiceAge";




var dashRoutes = [
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
      }
      ,
      // {
      //   path: "/organization",
      //   name: "Organization",
      //   icon: "content_paste",
      //   component: Organization,
      //   layout: "/admin",
      // }
      // ,
      // {
      //   path: "/company",
      //   name: "Company",
      //   icon: DateRange,
      //   component: Company,
      //   layout: "/admin",
      // },
      // {
      //   path: "/department",
      //   name: "Department",
      //   icon: GridOn,
      //   component: Department,
      //   layout: "/admin",
      // },
      {
        path: "/designation",
        name: "Designation",
        icon: PersonAddIcon,
        component: Titles,
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
  }
  // :{}
  ,
  {
    collapse: true,
    name: "Invoice Desk",
    rtlName: "المكونات",
    icon: InsertDriveFileIcon,
    state: "InvoiceDeskCollapse",
    views: [
      {
        path: "/create",
        name: "Create Invoice",
        rtlName: "عالتسعير",
        icon:NoteAddIcon,
        rtlMini: "ع",
        component: CreateInvoice,
        layout: "/admin",
      },
      {
        path: "/received", 
        name: "Received Invoice",
        rtlName: "عالتسعير",
        icon:SystemUpdateIcon,
        rtlMini: "ع",
        component: FilesList,
        layout: "/admin",
      },
      {
        path: "/tracking",
        name: "Invoice Tracking",
        rtlName: "عالتسعير",
        icon:WrapTextIcon,
        rtlMini: "ع",
        component: InvoiceTracking,
        layout: "/admin",
      },
      {
        path: "/aging",
        name: "Invoice Aging",
        rtlName: "عالتسعير",
        icon:DescriptionIcon,
        rtlMini: "ع",
        component: InvoiceAge,
        layout: "/admin",
      }
    ]
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
      layout: "/admin",
      icon: AssignmentLateIcon,
    },
    {
      path: "/approvals",
      name: "Approval Tasks",
      rtlName: "انهيار متعدد المستويات",
      rtlMini: "ر",
      icon: AssignmentTurnedInIcon,
      component: ApprovalRequested,
      layout: "/admin",
        }
      ]
    }
  ,
    {
    path: "/verifier",
    name: "Verifier",
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
  },
  {
    collapse: true,
    name: "Signatures",
    rtlName: "إستمارات",
    icon: FingerprintIcon,
    state: "formsCollapse",
    views: [
      {
        path: "/signature-stamp",
        name: "Signature / Stamp",
        rtlName: "أشكال عادية",
        rtlMini: "صو",
        component: SignatureStamp,
        layout: "/admin",
      },
    ],
  },

  // {
  //   path: "/calendar",
  //   name: "Support",
  //   rtlName: "التقويم",
  //   icon: DateRange,
  //   component: Calendar,
  //   layout: "/admin",
  // },
];
export default dashRoutes;
