import React from 'react';
import ReactDOM from 'react-dom';
// import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
import { AuthContextProvider } from './state/AuthContext';

// export const API_PLATEFORME = 'http://192.168.0.81/plateforme/api/v1';
// export const API_CEGID = 'http://192.168.0.81/cegid/api/v1';

export const API_PLATEFORME = 'http://192.168.0.45:4001/plateforme/api/v1';
export const API_CEGID = 'http://192.168.0.45:5000/cegid/api/v1';

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </AuthContextProvider>
,  document.getElementById('root'));


//REACT 18

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <AuthContextProvider>
//       <BrowserRouter>
//           <App />
//       </BrowserRouter>
//     </AuthContextProvider>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
