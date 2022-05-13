import './App.css';
import AuthContext from "./state/AuthContext";
import { useContext, useEffect } from "react";
import React from 'react';

import {Route, Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import Page from './pages/Page'
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

  useEffect(() => {
      authContext.checkLogin();
  }, [authContext]  )
  const permissions = authContext.permissions;
  const login = authContext.isLoggedIn;
  return (
    <Routes>
      <Route path='' element={<LoginPage />} />
      <Route path='connexion' element={<LoginPage />} />
      <Route element={<ProtectRoute login={login}/>}>
        <Route element={<Page/>}>
          <Route path='ecommerce' element={<Accueil />} />
          <Route element={<Restrict permissions={permissions} allow={["modification"]}/>}>
            <Route path='ecommerce/article' element={<Ecommerce />}/>
          </Route>
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
      </Route>
      <Route path='*' element={<div>ERREUR 404</div>}/>
    </Routes>
  );
}

export default App;
