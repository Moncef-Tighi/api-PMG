// import { useNavigate } from "react-router-dom";

import { useEffect, useLayoutEffect, useRef } from "react";
import useDidMountEffect from "../hooks/useDidMountEffect";

const ProtectRoute = function(props) {
    const firstUpdate = useRef(true);
    console.log("ah");
    useLayoutEffect(() => {
        console.log(firstUpdate);
      if (firstUpdate.current) {
        firstUpdate.current = false;
      } else {
       console.log(props.login);
      }
    });    //ATTENTION ! Plus tard il faudra une page "unAuthorized" plutôt que de dévier vers l'accueil    
    return (
        <>{props.children}</>
    )

}

export default ProtectRoute;