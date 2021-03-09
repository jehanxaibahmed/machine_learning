// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Dashboard from "views/LDocs/Dashboard/Dashboard";


var vendorRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/vendor",
  }
];
export default vendorRoutes;
