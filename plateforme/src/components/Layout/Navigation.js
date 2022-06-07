import classes from './Navigation.module.css'

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {Article, ContactPhone, LocalOffer, Person, ManageAccounts, History} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from "../../state/AuthContext";

const Navigation = function() {
    const authContext= useContext(AuthContext);
    return (
        <nav>
            <h1>Menu</h1>
            <List
            sx={{ width: '100%'}}
            component="ul">
                <NavLink to="/article" className={({ isActive }) =>isActive ? classes.activeLink : classes.navLink}>
                <ListItemButton sx={{ width: '100%', height: "60px"}} color="primary" >
                    <ListItemIcon><Article  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/> </ListItemIcon>
                    <ListItemText primary="Articles" className={classes.textLink}/>
                </ListItemButton>
              </NavLink> 
                <NavLink  to="/commande" className={({ isActive }) =>isActive ? classes.activeLink : classes.navLink}>
                    <ListItemButton sx={{ width: '100%', height: "60px"}}>
                        <ListItemIcon>
                        <ContactPhone  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                        </ListItemIcon>
                        <ListItemText primary="Commandes" className={classes.textLink}/>
                    </ListItemButton>
                </NavLink>
                {/* <NavLink to="/prix" className={({ isActive }) =>isActive ? classes.activeLink : classes.navLink}> 
                    <ListItemButton sx={{ width: '100%', height: "60px"}}>
                        <ListItemIcon>
                        <LocalOffer  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                        </ListItemIcon>
                        <ListItemText primary="Prix" className={classes.textLink} />
                    </ListItemButton>
                </NavLink> */}
                {authContext.permissions.find(permission => permission==="admin" ) ?
                <>
                <NavLink to="/admin/employes" className={({ isActive }) =>isActive ? classes.activeLink : classes.navLink}>
                    <ListItemButton sx={{ width: '100%', height: "60px"}}>
                        <ListItemIcon>
                        <Person  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                        </ListItemIcon>
                        <ListItemText primary="Employés" className={classes.textLink} />
                    </ListItemButton>
                </NavLink>
                <NavLink to="/admin/permissions" className={({ isActive }) =>isActive ? classes.activeLink : classes.navLink}>
                    <ListItemButton sx={{ width: '100%', height: "60px"}}>
                        <ListItemIcon>
                        <ManageAccounts  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                        </ListItemIcon>
                        <ListItemText primary="Permissions" className={classes.textLink}/>
                    </ListItemButton>
                </NavLink>
                <NavLink  to="/admin/historique" className={({ isActive }) =>isActive ? classes.activeLink : classes.navLink}>
                    <ListItemButton sx={{ width: '100%', height: "60px"}}>
                        <ListItemIcon>
                        <History  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                        </ListItemIcon>
                        <ListItemText primary="Historique" className={classes.textLink}/>
                    </ListItemButton>
                </NavLink></>
                 : ""}
            </List>

        </nav>
    )
}

export default Navigation