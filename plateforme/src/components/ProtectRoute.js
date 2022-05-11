// import { useNavigate } from "react-router-dom";

import { useEffect, useRef} from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectRoute = function(props) {
    const navigate = useNavigate();
    const firstRender= useRef(true);
    useEffect( ()=> {
        if (firstRender.current) firstRender.current = false; 
        else {
            if (!props.login) navigate("/connexion");
        } 
    }, [firstRender, navigate, props.login])

    return (
        <><Outlet/></>
    )

}

export default ProtectRoute;