import logo from './logo.svg';
import './App.css';

import LoginPage from './pages/LoginPage';
import Accueil from './pages/Accueil';
import Ecommerce from './pages/Ecommerce.Js';
import EmployesListe from './pages/EmployesListe';
import EmployesListe from './pages/EmployesListe';
import AddEmployes from './pages/AddEmployes';
import Permissions from './pages/Permissions';
import Historique from './pages/Historique';

function App() {
  return (
    <Routes>
        <Route path='connexion' element={<LoginPage />} />
        <Route path='/' element={<Accueil />} />
        <Route path='ecommerce/liste' element={<Ecommerce />}/>
        <Route path='ecommerce/fiche/:articleId' element={<Ecommerce />}/>
        <Route path='ecommerce/commande' element={<Ecommerce />}/>
        <Route path='ecommerce/prix' element={<Ecommerce />}/>
        <Route path='ecommerce/dimension' element={<Ecommerce />}/>

        <Route path='admin/employes' element={<EmployesListe />}>
            <Route path='admin/employes/ajout' element={<AddEmployes />} />
        </Route>
        <Route path='admin/permissions' element={<Permissions />}/>
        <Route path='admin/historique' element={<Historique />}/>

        
    </Routes>
  );
}

export default App;
