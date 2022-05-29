import LogoutIcon from '@mui/icons-material/Logout';
import { useContext, useEffect, useState } from 'react';
import classes from './Header.module.css';
import icon from './pmg-icon.svg'
import AuthContext from '../../state/AuthContext';
import { IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Header = function() {
    const [nom, setNom] = useState(null)
    const [prenom, setPrenom] = useState(null)
    const [poste, setPoste] = useState(null)
    const navigate= useNavigate();


    const authContext = useContext(AuthContext)
    const employe = authContext.employe;
    useEffect(()=> {
        setNom(employe.nom)
        setPrenom(employe.prenom)
        setPoste(employe.poste)
    }, [employe.nom,employe.prenom, employe.poste] )

    const logoutHandeler = function() {
        authContext.logout()
        navigate('/connexion');
    };

    return (
        <header>
            <div>
                <img className={classes.icon} src={icon} alt="small-logo"></img>
                <div className={classes.name}>
                <Link to='/me'><h2>{nom} {prenom}</h2></Link>
                    <h4>{poste}</h4>
                </div>
            </div>
            <IconButton onClick={logoutHandeler}><LogoutIcon/></IconButton>
        </header>
    )
}

export default Header