// import { useNavigate } from "react-router-dom";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDidMountEffect from "../hooks/useDidMountEffect";

const ProtectRoute = function(props) {
    const navigate = useNavigate();
    useEffect( ()=> {
        //ATTENTION ! Plus tard il faudra une page "unAuthorized" plutôt que de dévier vers l'accueil    
        if (!props.login) navigate("/connexion");
    }, [])
    
    return (
        <>{props.children}</>
    )

}

export default ProtectRoute;