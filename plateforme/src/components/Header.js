import LogoutIcon from '@mui/icons-material/Logout';
import { useContext, useEffect, useState } from 'react';
import classes from './Header.module.css';
import icon from './pmg-icon.svg'
import AuthContext from '../state/AuthContext';

const Header = function() {
    const [nom, setNom] = useState(null)
    const [prenom, setPrenom] = useState(null)
    const [poste, setPoste] = useState(null)

    const authContext = useContext(AuthContext)
    const employe = authContext.employe;
    useEffect(()=> {
        setNom(employe.nom)
        setPrenom(employe.prenom)
        setPoste(employe.poste)
    }, [employe] )

    return (
        <header>
            <div>
                <img className={classes.icon} src={icon}></img>
                <div className={classes.name}>
                    <h2>{nom} {prenom}</h2>
                    <h4>{poste}</h4>
                </div>
            </div>
            <LogoutIcon/>
        </header>
    )
}

export default Header