/*
    Wrapper component qui vérifie si l'utilisateur est connecté, et si il a le droit d'accéder à la page
*/

import AuthContext from "../state/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Restrict = function(props) {

    const authContext= useContext(AuthContext);
    const [allowed, setAllowed] = useState(false);
    const navigate = useNavigate();
    useEffect(()=> {
        authContext.checkLogin();
    } )
    
    const permissions = authContext.permissions;
    console.log(permissions);
    useEffect( ()=> {
        if (authContext.isLoggedIn===false) navigate('/connexion');
        if (props.allow===undefined || permissions.includes("admin")) setAllowed(true);
        else if (permissions.find(permission => props.allow.includes(permission)))  setAllowed(true);
        return  ()=> {if (!allowed) return navigate('/accueil')} 
    }, [authContext.isLoggedIn, navigate, permissions, props.allow, allowed])


    //ATTENTION ! Plus tard il faudra une page "unAuthorized" plutôt que de dévier vers l'accueil    
    console.log(allowed);

    return (
        <>{props.children}</>
    )

}

export default Restrict;