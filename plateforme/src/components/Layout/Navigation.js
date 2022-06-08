import classes from './Navigation.module.css'

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/system';

import {Article, ContactPhone, Person, ManageAccounts, History} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from "../../state/AuthContext";
import { Divider } from '@mui/material';

const Navigation = function({toggleDrawer}) {
    const authContext= useContext(AuthContext);
    return (
        <Box
            sx={{ width: 'auto'}}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
        <nav>
            <h1>Menu</h1>
            <Divider />
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
        </Box>
    )
}

export default Navigation