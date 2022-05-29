import AuthContext from "./state/AuthContext";
import { useContext, useEffect } from "react";
import React from 'react';

import {Route, Routes, useNavigate} from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import Page from './pages/Page'
import Restrict from './components/restrict';
import ProtectRoute from './components/ProtectRoute';

const FicheEmploye = React.lazy(() => import('./pages/FicheEmploye'));
const Accueil = React.lazy(() => import('./pages/Accueil'));
const Ecommerce = React.lazy(() => import('./pages/Ecommerce'));
const EmployesListe = React.lazy(() => import('./pages/EmployesListe'));
const Permissions = React.lazy(() => import('./pages/Permissions'));
const Historique = React.lazy(() => import('./pages/Historique'));
const FicheArticle = React.lazy(() => import('./pages/FicheArticle'));

function App() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
      const check = authContext.checkLogin();
      if (check===false) navigate("/connexion");
  }, [authContext]  )
  const permissions = authContext.permissions;
  const login = authContext.isLoggedIn;
  return (
    <Routes>
      <Route path='' element={<LoginPage />} />
      <Route path='connexion' element={<LoginPage />} />
      <Route element={<ProtectRoute login={login}/>}>
        <Route element={<Page/>}>
          <Route path="me" element={<FicheEmploye id={authContext?.employe?.id_employe}/>} />
          <Route path='ecommerce' element={<Accueil />} />
          <Route element={<Restrict permissions={permissions} allow={["modification", "admin"]}/>}>
            <Route path='ecommerce/article/:code_article' element={<FicheArticle />}/>
            <Route path='ecommerce/article' element={<Ecommerce />}/>
          </Route>
          <Route path='ecommerce/fiche/:article' element={<Ecommerce />}/>
          <Route path='ecommerce/commande' element={<Ecommerce />}/>
          <Route path='ecommerce/prix' element={<Ecommerce />}/>
          <Route path='ecommerce/dimension' element={<Ecommerce />}/>
          <Route element={<Restrict permissions={permissions} allow={["admin"]}/>}>
            <Route path='admin/employes' element={<EmployesListe />} />
            <Route path="admin/employes/:id" element={<FicheEmploye />} />
            <Route path='admin/permissions' element={<Permissions />}/>
            <Route path='admin/historique' element={<Historique />}/>
          </Route>
        </Route>          
      </Route>
      <Route path='*' element={<div>ERREUR 404</div>}/>
    </Routes>
  );
}

export default App;
