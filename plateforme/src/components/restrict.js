/*
    Wrapper component qui vérifie si l'utilisateur est connecté, et si il a le droit d'accéder à tel page
*/

import AuthContext from "../state/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Restrict = function(props) {

    const authContext= useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(()=> {
        authContext.checkLogin();
    } )
    
    useEffect( ()=> {
        if (authContext.isLoggedIn===false) navigate('/connexion');
    }, [authContext.isLoggedIn, navigate])

    return (
        <>{props.children}</>
    )
}

export default Restrict;