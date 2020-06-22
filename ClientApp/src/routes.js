import Dashboard from "./Views/Auto-Gen.tsx";
import Doctor from "./Views/DoctorClient.tsx";
import Patient from "./Views/PatientClient.tsx";

const dashboardRoutes = [
  {
    path: "/auto-gen",
    name: "Auto-gen",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/tools"
  },
  {
    path: "/doctor",
    name: "Doctor",
    icon: "pe-7s-graph",
    component: Doctor,
    layout: "/tools"
  },
  {
    path: "/patient",
    name: "Patient",
    icon: "pe-7s-graph",
    component: Patient,
    layout: "/tools"
  },

];

export default dashboardRoutes;
