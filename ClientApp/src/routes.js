import AutoGenView from "./Views/Auto-Gen-View.tsx";
import DoctorView from "./Views/Doctor-View.tsx";
import PatientView from "./Views/Patient-View.tsx";
import { ControlSyncView } from "./Views/ControlSync";

const dashboardRoutes = [
  {
    path: "/auto-gen",
    name: "Auto-gen",
    icon: "pe-7s-graph",
    component: AutoGenView,
    layout: "/tools"
  },
  {
    path: "/doctor",
    name: "Doctor",
    icon: "pe-7s-graph",
    component: DoctorView,
    layout: "/tools"
  },
  {
    path: "/patient",
    name: "Patient",
    icon: "pe-7s-graph",
    component: PatientView,
    layout: "/tools"
  },
  {
    path: "/sandbox",
    name: "Sandbox",
    icon: "pe-7s-graph",
    component: ControlSyncView,
    layout: "/tools"
  },

];

export default dashboardRoutes;
