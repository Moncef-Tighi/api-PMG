import './App.css';


import {Route, Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import Accueil from './pages/Accueil';
import Ecommerce from './pages/Ecommerce.js';
import EmployesListe from './pages/EmployesListe';
import AddEmployes from './pages/AddEmployes';
import Permissions from './pages/Permissions';
import Historique from './pages/Historique';
import Restrict from './components/restrict';

function App() {
  return (
    <Routes>
        <Route path='' element={<LoginPage />} />
        <Route path='connexion' element={<LoginPage />} />
        <Route path='accueil' element={<Restrict><Accueil /></Restrict>} />

        <Route path='ecommerce' element={<Ecommerce />}/>
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
        
    </Routes>
  );
}

export default App;
