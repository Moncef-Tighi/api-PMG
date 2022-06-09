import LogoutIcon from '@mui/icons-material/Logout';
import { useContext, useEffect, useState } from 'react';
import classes from './Header.module.css';
import AuthContext from '../../state/AuthContext';
import { IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import React from 'react';
import { Button, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Tooltip } from '@mui/material';

const Header = function() {
    const [nom, setNom] = useState(null)
    const [prenom, setPrenom] = useState(null)
    const [poste, setPoste] = useState(null)
    const navigate= useNavigate();
    const [menu, setMenu] = useState(false);
    const toggleDrawer = (openMenu) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setMenu(!menu);
      };

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
                
                <React.Fragment key={"left"}>
                    <Tooltip title="Menu de navigation" arrow>
                        <Button onClick={toggleDrawer(true)}><MenuIcon sx={{fontSize : "2.5em", marginRight: "10px"}}/></Button>
                    </Tooltip>
                    <Drawer
                    anchor={"left"}
                    open={menu}
                    onClose={toggleDrawer(false)}
                    transitionDuration={{appear: 200, enter: 400, exit: 200} }
                    >
                            <Navigation toggleDrawer={toggleDrawer} menu={menu}/>
                    </Drawer>
                </React.Fragment>
                <div className={classes.dividerHead}></div>
                <img className={classes.icon} src="logo-pmg.png" alt="small-logo"></img>
            </div>

            <div>
            <div className={classes.name}>
            <Link to='/me'>
            <h2>{nom} {prenom}</h2>
            </Link>
                <h4>{poste}</h4>
            </div>
            <Tooltip title="Afficher les notifications" arrow>
            <NotificationsIcon sx={{color: "grey", fontSize: '1.6em', marginRight: '8px'}}/>
            </Tooltip>

            <Tooltip title="Déconnexion" arrow>
                <IconButton onClick={logoutHandeler}><LogoutIcon sx={{fontSize: '1.3em'}}/></IconButton>
            </Tooltip>
            </div>
        </header>
    )
}

export default Header