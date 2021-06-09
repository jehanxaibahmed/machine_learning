// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import VendorDashboard from "views/LDocs/Dashboard/VendorDashboard";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FilesList from "views/LDocs/Invoices/RecieveInvoice/FilesList";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CreateInvoice from "views/LDocs/Invoices/CreateInvoice/CreateInvoice";
import VendorPayment from "views/LDocs/VendorPayment/VendorPayment";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import Customers from "views/LDocs/Customers/Customers";
import Payable from "views/LDocs/Payable/Payable";

var vendorRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: VendorDashboard,
    layout: "/vendor",
  },
  {
    path: "/create",
    name: "Create Invoice",
    rtlName: "عالتسعير",
    icon:NoteAddIcon,
    rtlMini: "ع",
    component: CreateInvoice,
    layout: "/vendor",
  },
  {
    path: "/invoices",
    name: "Invoices",
    rtlName: "لوحة القيادة",
    icon: InsertDriveFileIcon,
    component: FilesList,
    layout: "/vendor",
  },
  {
    path: "/customers",
    name: "Customers",
    rtlName: "لوحة القيادة",
    icon: PeopleOutlineIcon,
    component: Customers,
    layout: "/vendor",
  },
  {
    path: "/Receivables",
    name: "Receivables",
    rtlName: "لوحة القيادة",
    icon: LocalAtmIcon,
    component: Payable,
    layout: "/vendor",
  },
  {
    path: "/PaymentChannels ",
    name: "Payment Channels",
    rtlName: "لوحة القيادة",
    icon: LocalAtmIcon,
    component: VendorPayment,
    layout: "/vendor",
  },
  
];

export default vendorRoutes;
