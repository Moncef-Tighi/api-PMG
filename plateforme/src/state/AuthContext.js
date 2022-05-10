import React from "react"
import { Navigate } from "react-router-dom";
import { useState } from "react";

//Empty context 

// const AuthContext= React.createContext({
//     //On initialise avec des data par défaut pour avoir une meilleure autocomplétion
//     token : '',
//     isLoggedIn : '',
//     login : (token) => {}, 
//     logout : ()=> {},
//     permission : []
// })

// const AuthContextProvider = (props) => {
//     //C'est ce component qui gère la state     


        // const contextValue = objet avec les values du context
//     //Normalement faut wrap avec ce component, mais on a créé notre propre version du template.
//     return <AuthContext.Provider VALUE={contextValue}>{props.children}</AuthContext.Provider>
// }

const AuthContext= React.createContext({
    //On initialise avec des data par défaut pour avoir une meilleure autocomplétion
    token : '',
    isLoggedIn : '',
    login : (token) => {},
    checkLogin: ()=>{},
    logout : ()=> {},
    permissions : []
})

export const AuthContextProvider = (props) => {
    //C'est ce component qui gère la state     

    const [token, setToken] = useState(null);
    const [permissions, setPermissions]= useState([]);
    const [isLoggedIn, setLogin]= useState(null);

    const loginHandeler = (token)=> {
        localStorage.setItem('token', token);
        setToken(token);
        setPermissions(JSON.parse(atob(token.split(".")[1])).permissions);
        setLogin(true);
    } 

    const logoutHandeler = () => {
        setToken(null);
        localStorage.setItem("token", "");
        setLogin(false);
        Navigate('/connexion');
    } 

    const checkLogin = () => {
        const token = localStorage.getItem('token');
        
        if (!token) return false;
        loginHandeler(token);
        setLogin(true);
        return true;
    }

    const contextValue = {
        token,
        isLoggedIn,
        login : loginHandeler,
        logout : logoutHandeler,
        permissions,
        checkLogin,
    }

    //Normalement faut wrap avec ce component, mais on a créé notre propre version du template.
    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}


//On export le Provider pour l'utiliser une fois pour wrap l'app. On export le Context par défaut pour l'utiliser
//Autant de fois qu'on a besoin du context. Pour cela on utilise useContext et on lui passe le context en param
export default AuthContext