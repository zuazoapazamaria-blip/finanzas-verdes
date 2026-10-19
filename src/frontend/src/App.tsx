import { Layout } from "@/components/Layout";
import { AnalisisPage } from "@/pages/Analisis";
import { RegistroPage } from "@/pages/Registro";
import { ResumenPage } from "@/pages/Resumen";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: Layout,
});

const resumenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ResumenPage,
});

const registroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/registro",
  component: RegistroPage,
});

const analisisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analisis",
  component: AnalisisPage,
});

const routeTree = rootRoute.addChildren([
  resumenRoute,
  registroRoute,
  analisisRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
