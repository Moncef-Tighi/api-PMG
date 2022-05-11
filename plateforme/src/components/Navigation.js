import classes from './Navigation.module.css'

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';


const Navigation = function() {

    return (
        <nav>
            <h1>Menu</h1>
            <List
            sx={{ width: '100%'}}
            component="nav"
            aria-labelledby="nested-list-subheader">
            <ListItemButton sx={{ width: '100%', maxHeight: "60px"}}>
                <ListItemIcon><SendIcon  sx={{width:'1.4em', height: '1.4em', color: '#262626'}}/> </ListItemIcon>
                <ListItemText primary="send email" />
            </ListItemButton>
            <ListItemButton sx={{ width: '100%', maxHeight: "60px"}}>
                <ListItemIcon>
                <DraftsIcon  sx={{width:'1.4em', height: '1.4em', color: '#262626'}}/>
                </ListItemIcon>
                <ListItemText primary="Drafts" />
            </ListItemButton>
            <ListItemButton sx={{ width: '100%', maxHeight: "60px"}}>
                <ListItemIcon>
                <InboxIcon  sx={{width:'1.4em', height: '1.4em', color: '#262626'}}/>
                </ListItemIcon>
                <ListItemText primary="Inbox" />
            </ListItemButton>
            </List>

        </nav>
    )
}

export default Navigation