import AutoGenView from "./Views/Auto-Gen-View.tsx";
import SandboxView  from "./Views/Sandbox-View";

const dashboardRoutes = [
  {
    path: "/auto-gen",
    name: "Auto-gen",
    icon: "pe-7s-graph",
    component: AutoGenView,
    layout: "/tools"
  },
  {
    path: "/sandbox",
    name: "Sandbox",
    icon: "pe-7s-graph",
    component: SandboxView,
    layout: "/tools"
  },

];

export default dashboardRoutes;
