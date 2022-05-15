import { Button, TextField, NativeSelect } from "@mui/material"
import classes from './EmployesListe.module.css';
import { useState } from "react";
import {Search} from '@mui/icons-material';
import { InputAdornment } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddEmployes from "../components/Employés/AddEmployes";

const EmployesListe = function() {
    const [query, setQuery] = useState("");
    const [openModal, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  


    const basicSearch= function(event) {

        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        setQuery(`${select.value}[like]=${recherche.value}`)
    }

    return (
        <>
            <aside>
                <form className={classes.form} onSubmit={basicSearch}>
                    <NativeSelect id="select" variant='outlined'>
                        <option value="nom">Nom de famille</option>
                        <option value="prenom">Prenom</option>
                        <option value="poste">Poste</option>
                        <option value="email">E-Mail</option>
                    </NativeSelect>
                    <TextField id='recherche' size="small" required variant="outlined" sx={{display: "block", marginLeft: "10px", width:"100%"}} 
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <Search />
                            </InputAdornment>
                        ),
                        }}
                    >
                    </TextField>                    
                    <Button color="primary" size="small" variant="contained" type="submit">
                        Rechercher
                    </Button>
                </form>

                    <Button color="primary" size="small" variant="contained"
                     startIcon={<AddCircleOutlineIcon />} onClick={handleOpen}> 
                        Ajouter
                    </Button>

                    <AddEmployes open={openModal} onClose={handleClose}/>

            </aside>

        </>  


        )
}

export default EmployesListe