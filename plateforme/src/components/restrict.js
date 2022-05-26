/*
    Wrapper component qui vérifie si l'utilisateur est connecté, et si il a le droit d'accéder à la page
*/

import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
const Restrict = function(props) {
    const navigate=useNavigate();
    const firstRender= useRef(true);
    useEffect( ()=> {

        if (firstRender.current) firstRender.current = false; 
        else {
            //ATTENTION ! Plus tard il faudra une page "unAuthorized" plutôt que de dévier vers l'accueil   
            if ( !(props.permissions.find(permission => props.allow.includes(permission))) ) navigate('/connexion');
        }
    })

    return (
        <><Outlet/></>
    )

}

export default Restrict;