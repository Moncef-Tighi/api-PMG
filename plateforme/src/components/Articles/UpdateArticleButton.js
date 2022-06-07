import StyledMenu from "../util/StyledMenu";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import {Button} from '@mui/material'
import classes from './ListeArticle.module.css';
import { useState } from "react";

const UpdateArticleButton = function(props) {
    const [anchor, setAnchor] = useState(null);

    const handleCloseMenu = ()=> setAnchor(null);
    const handleOpenMenu = (event)=>  setAnchor(event.currentTarget);
    const openMenu=Boolean(anchor);

    return (
        <aside className={classes.aside}>
        <p>{props.taille} articles sélectionnés</p>
        <div>    
        <Button color='primary' sx={{
                maginRight: "25px"
            }} onClick={props.deselectionHadeler}>
                  Tout Déselectionner
              </Button>    
            <Button onClick={handleOpenMenu}
            aria-controls={openMenu ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            variant="contained"
            disableElevation
            endIcon={<KeyboardArrowDown />}
            >
                Actions
            </Button>
            <StyledMenu open={openMenu} onClose={handleCloseMenu} MenuListProps={{'aria-labelledby': 'button'}} anchorEl={anchor} >
                {props.children}
            </StyledMenu>
        </div>
        </aside>

    )
}

export default UpdateArticleButton;