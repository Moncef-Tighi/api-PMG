/*
    Wrapper component qui vérifie si l'utilisateur est connecté, et si il a le droit d'accéder à la page
*/

import AuthContext from "../state/AuthContext";
import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const Restrict = function(props) {

    console.log(props.login);
    console.log(props.permissions);

    //ATTENTION ! Plus tard il faudra une page "unAuthorized" plutôt que de dévier vers l'accueil    
    return (
        <>{props.children}</>
    )

}

export default Restrict;