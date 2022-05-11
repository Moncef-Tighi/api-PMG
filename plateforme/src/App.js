import './App.css';
import AuthContext from "./state/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import {Route, Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import Accueil from './pages/Accueil';
import Ecommerce from './pages/Ecommerce.js';
import EmployesListe from './pages/EmployesListe';
import AddEmployes from './pages/AddEmployes';
import Permissions from './pages/Permissions';
import Historique from './pages/Historique';
import Restrict from './components/restrict';
import ProtectRoute from './components/ProtectRoute';

function App() {

  const authContext = useContext(AuthContext);
  authContext.checkLogin();
  const permissions = authContext.permissions;
  const login = authContext.isLoggedIn;
  console.log(login);
  return (
    <Routes>
        <Route path='' element={<LoginPage />} />
        <Route path='connexion' element={<LoginPage />} />
        <Route element={<ProtectRoute login={login}/>}>
          <Route path='accueil' element={<Restrict permissions={permissions}><Accueil /></Restrict>} />
          <Route path='ecommerce' element={<Restrict allow={['modification']}><Ecommerce /></Restrict>}/>
          <Route path='ecommerce/liste' element={<Ecommerce />}/>
      
          <Route path='ecommerce/fiche/:article' element={<Ecommerce />}/>
          <Route path='ecommerce/commande' element={<Ecommerce />}/>
          <Route path='ecommerce/prix' element={<Ecommerce />}/>
          <Route path='ecommerce/dimension' element={<Ecommerce />}/>

          <Route path='admin/employes' element={<EmployesListe />}>
              <Route path='ajout' element={<AddEmployes />} />
          </Route>
          <Route path='admin/permissions' element={<Permissions />}/>
          <Route path='admin/historique' element={<Historique />}/>
          
        </Route>
    </Routes>
  );
}

export default App;
