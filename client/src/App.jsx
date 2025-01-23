import { Header } from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/protected/admin/Dashboard";
import { Home } from "./pages/Home";
import { ProtectedRoutes } from "./components/ProtectedRoutes/ProtectedRoutes";
import { BillTicket } from "./pages/protected/admin/BillTicket";
import { AuthProvider } from "./utils/AuthContext";
import { Movies } from "./pages/protected/admin/Movies";
import { ProtectedRoutesAdmin } from "./components/ProtectedRoutes/ProtectedRoutesAdmin";
import { ClientAdmin } from "./pages/protected/admin/Client";
import { HomeClient } from "./pages/protected/client/HomeClient";
import { BillMovie } from "./pages/protected/client/BillMovie";
import { Invoices } from "./pages/protected/admin/Invoices";
import { CurrencyProviderWraper } from "./contexts/CurrencyContext";


export default function App() {
  return (
    <>
    <CurrencyProviderWraper>
    <AuthProvider>
      <Header />
      <div className="flex flex-col gap-0 p-0  m-0 w-full h-full ">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/dashboard" element={<ProtectedRoutesAdmin> <Dashboard/> </ProtectedRoutesAdmin>}></Route>
          <Route
            path="/inicio"
            element={<ProtectedRoutes> <HomeClient/> </ProtectedRoutes>}
          ></Route>
          <Route
            path="/pelicula/:id"
            element={<ProtectedRoutes> <BillMovie/> </ProtectedRoutes>}
          ></Route>
          <Route
            path="/peliculas"
            element={<ProtectedRoutesAdmin children={<Movies/>} />}
          ></Route>
          <Route
            path="/clientes"
            element={<ProtectedRoutesAdmin children={<ClientAdmin/>} />}
          ></Route>
           <Route
            path="/historial"
            element={<ProtectedRoutesAdmin children={<Invoices/>} />}
          ></Route>
          <Route
            path="/facturar"
            element={<ProtectedRoutesAdmin children={<BillTicket/>} />}
          ></Route>
        </Routes>
      </div>
      </AuthProvider>
      </CurrencyProviderWraper>
    </>
  );
}
