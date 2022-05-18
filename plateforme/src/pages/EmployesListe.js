import { Button, TextField, NativeSelect } from "@mui/material"
import classes from './EmployesListe.module.css';
import { useState } from "react";
import {Search} from '@mui/icons-material';
import { InputAdornment } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddEmployes from "../components/Employés/AddEmployes";
import axios from "axios";
import { useContext } from 'react';
import AuthContext from '../state/AuthContext';
import { API_PLATEFORME } from '../index';
import Notification from "../components/util/Util";
import ListeEmploye from "../components/Articles/ListeEmploye";

const EmployesListe = function() {
    const [query, setQuery] = useState({});
    const [openModal, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const authContext = useContext(AuthContext);
    const [openNotif, setNotif] = useState("");
    const [error, setError] = useState("");


    const basicSearch= function(event) {

        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        setQuery( {
            key : `${select.value}[like]`,
            value : recherche.value
        })
    }
    const closeNotif = (event, reason) => {
        setNotif("");
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
            setNotif("Le nouvel employé a bien été créé");
            setOpen(false);
        } catch(error) {
            console.log(error);
            console.log(error.code);
            if (error.code==="ERR_BAD_REQUEST") return setError("Impossible de créer cet utilisateur");
            if (error.code==="ERR_NETWORK") return setError("Erreur de connexion : Le serveur n'est pas accessible");
            if (error.response.data?.message.startsWith("La création a échouée")) return setError("L'utilisateur ou l'email fournit existe déjà");
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

                    <ListeEmploye query={query}/>

                    <AddEmployes open={openModal} onClose={handleClose} createEmploye={createEmploye}/>
                    <Notification closeNotif={closeNotif} message={error} status="error"  />
                    <Notification closeNotif={closeNotif} message={openNotif} status="success"  />

            </aside>

        </>  


        )
}

export default EmployesListe