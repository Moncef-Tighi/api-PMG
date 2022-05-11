import classes from './Navigation.module.css'

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {Article, ContactPhone, LocalOffer, Height, Person, ManageAccounts, History} from '@mui/icons-material';

const Navigation = function() {

    return (
        <nav>
            <h1>Menu</h1>
            <List
            sx={{ width: '100%'}}
            component="ul">
                <ListItemButton sx={{ width: '100%', height: "60px"}} color="primary" >
                    <ListItemIcon><Article  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/> </ListItemIcon>
                    <ListItemText primary="Articles" />
                </ListItemButton>
                <ListItemButton sx={{ width: '100%', height: "60px"}}>
                    <ListItemIcon>
                    <ContactPhone  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Commandes" />
                </ListItemButton>
                <ListItemButton sx={{ width: '100%', height: "60px"}}>
                    <ListItemIcon>
                    <LocalOffer  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Prix" />
                </ListItemButton>

                <ListItemButton sx={{ width: '100%', height: "60px"}}>
                    <ListItemIcon>
                    <Height  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Dimension" />
                </ListItemButton>

                <ListItemButton sx={{ width: '100%', height: "60px"}}>
                    <ListItemIcon>
                    <Person  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Employés" />
                </ListItemButton>

                <ListItemButton sx={{ width: '100%', height: "60px"}}>
                    <ListItemIcon>
                    <ManageAccounts  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Permissions" />
                </ListItemButton>

                <ListItemButton sx={{ width: '100%', height: "60px"}}>
                    <ListItemIcon>
                    <History  sx={{width:'1.3em', height: '1.3em', color: '#262626'}}/>
                    </ListItemIcon>
                    <ListItemText primary="Historique" />
                </ListItemButton>

            </List>

        </nav>
    )
}

export default Navigation