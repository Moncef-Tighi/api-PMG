import {Button} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import classes from './ListeArticle.module.css';

function InsertionArticle({taille, deselectionHadeler, openModal}) {
    return (<aside className={classes.aside}>
              <p>{taille} articles sélectionnés</p>
              <div>    
                  <Button color='primary' sx={{
    maginRight: "25px"
  }} onClick={deselectionHadeler}>
                      Tout Déselectionner
                  </Button>    
                  <Button variant="contained" size='small' startIcon={<AddCircleOutlineIcon />} onClick={openModal}>
                      Insérer
                  </Button>
              </div>
          </aside>);
  }

export default InsertionArticle