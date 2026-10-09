import { Route, Routes } from "react-router-dom";
import { Layout } from "./components";
import { ProtectedRoute } from "./auth";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Done from "./pages/Done";
import { ProfileLayout, ProfileData, Wallets } from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="nft/:id" element={<Detail />} />
        <Route path="carrinho" element={<Cart />} />
        <Route path="pagamento" element={<Checkout />} />
        <Route path="confirmacao" element={<Done />} />
        <Route element={<ProtectedRoute />}>
          <Route path="perfil" element={<ProfileLayout />}>
            <Route index element={<ProfileData />} />
            <Route path="carteiras" element={<Wallets />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
