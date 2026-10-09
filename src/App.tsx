import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";

import { Layout } from "./components";
import { useAuth } from "./auth";

import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Done from "./pages/Done";

import {
  ProfileLayout,
  ProfileData,
  Wallets,
} from "./pages/Profile";

function ProtectedProfile() {
  const { user, openAuth } = useAuth();

  if (!user) {
    return (
      <div className="panel p-6 text-center">
        <p className="mb-3">
          Entre para acessar seu perfil.
        </p>
        <button className="btn" onClick={openAuth}>
          Entrar
        </button>
      </div>
    );
  }

  return <ProfileLayout />;
}

const rootRoute = createRootRoute({
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$id",
  component: Detail,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carrinho",
  component: Cart,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pagamento",
  component: Checkout,
});

const doneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmacao",
  component: Done,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/perfil",
  component: ProtectedProfile,
});

const profileIndexRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/",
  component: ProfileData,
});

const walletsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/carteiras",
  component: Wallets,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  detailRoute,
  cartRoute,
  checkoutRoute,
  doneRoute,
  profileRoute.addChildren([
    profileIndexRoute,
    walletsRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}