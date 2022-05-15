import { Button, TextField, NativeSelect } from "@mui/material"
import classes from './EmployesListe.module.css';
import { useState } from "react";
import {Search} from '@mui/icons-material';
import { InputAdornment, Snackbar, Alert } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddEmployes from "../components/Employés/AddEmployes";
import axios from "axios";
import { useContext } from 'react';
import AuthContext from '../state/AuthContext';
import { API_PLATEFORME } from '../index';

const EmployesListe = function() {
    const [query, setQuery] = useState("");
    const [openModal, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const authContext = useContext(AuthContext);
    const [openNotif, setNotif] = useState(false);
    const [error, setError] = useState("");


    const basicSearch= function(event) {

        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        setQuery(`${select.value}[like]=${recherche.value}`)
    }
    const closeNotif = (event, reason) => {
        setNotif(false);
        setError("");
    };
  

    const createEmploye =async  function(event) {
        event.preventDefault();
        const {nom, prenom, email, poste ,password}= event.currentTarget.elements

        try {
            await axios.post(`${API_PLATEFORME}/employes/creation`, {
                nom : nom.value,
                prenom: prenom.value,
                email: email.value,
                poste: poste.value,
                password: password.value
            }, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            setNotif(true);
            setOpen(false);
        } catch(error) {
            console.log(error);
            if (error.response.data.message.startsWith("La création a échouée")) return setError("L'utilisateur ou l'email fournit existe déjà");
            if (error.code==="ERR_BAD_REQUEST") return setError("Impossible de créer cet utilisateur");
        }
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

                    <AddEmployes open={openModal} onClose={handleClose} createEmploye={createEmploye}/>
                    <Snackbar open={openNotif} autoHideDuration={3000} onClose={closeNotif}>
                        <Alert onClose={closeNotif} severity="success" sx={{ width: '100%' }}>
                            L'employé a bien été créé
                        </Alert>
                    </Snackbar>
                    <Snackbar open={error!==""} autoHideDuration={3000} onClose={closeNotif}>
                        <Alert onClose={closeNotif} severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
            </aside>

        </>  


        )
}

export default EmployesListe