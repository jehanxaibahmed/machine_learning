// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Dashboard from "views/LDocs/Dashboard/Dashboard";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FilesList from "views/LDocs/Invoices/RecieveInvoice/FilesList";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CreateInvoice from "views/LDocs/Invoices/CreateInvoice/CreateInvoice";


var vendorRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: ()=>{return('WELCOME TO VENDOR PORTAL')},
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
  
];

export default vendorRoutes;
