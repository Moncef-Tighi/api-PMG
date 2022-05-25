import { API_PLATEFORME } from "..";
import useGet from "../hooks/useGet"
import { useParams } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from '../state/AuthContext';
import classes from './FicheEmploye.module.css';
import { Box } from "@mui/system";
import { InputLabel, OutlinedInput, Button, NativeSelect } from "@mui/material";
import Notification from "../components/util/Util";
import { useState } from "react";
import axios from "axios";

const FicheEmploye = function() {
    const authContext = useContext(AuthContext);

    const { id } = useParams();
    const {data: employe, loading, error} = useGet(`${API_PLATEFORME}/employes/${id}`,null,authContext.token);

    const [openNotif, setNotif] = useState("");
    const [err, setError] = useState("");
    const closeNotif = (event, reason) => {
        setNotif("");
        setError("");
    };

    const editEmploye =async  function(event) {
        event.preventDefault();

        const {nom, prenom, email, poste ,active}= event.currentTarget.elements
        console.log(active.value)
        try {
            const response = await axios.put(`${API_PLATEFORME}/employes/modifier`, {
                id_employe : id,
                nom : nom.value,
                prenom: prenom.value,
                email: email.value,
                poste: poste.value,
                active: active.value==="oui" ? true : false 
            }, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            setNotif("L'employé a bien été modifié");
        } catch(error) {
            console.log(error);
            console.log(error.code);
            if (error.code==="ERR_BAD_REQUEST") return setError("Impossible de créer cet utilisateur");
            if (error.code==="ERR_NETWORK") return setError("Erreur de connexion : Le serveur n'est pas accessible");
        }
    }



    return (
            <>

                <Box className={classes.page}>
                    <h1>Modifier un employé</h1>
                    <form onSubmit={editEmploye}> 
                        <InputLabel htmlFor="nom">Nom</InputLabel>
                        <OutlinedInput id='nom' color='primary' size='small' fullWidth={true} required
                        value={employe?.body?.nom || ""} />
                        <InputLabel htmlFor="prenom">prenom</InputLabel>
                        <OutlinedInput id='prenom' color='primary' size='small' fullWidth={true} required
                        value={employe?.body?.prenom || ""}/>
                        <InputLabel htmlFor="email">E-Mail</InputLabel>
                        <OutlinedInput id='email' color='primary' size='small' fullWidth={true} required
                        value={employe?.body?.email || ""}/>
                        
                        <InputLabel htmlFor="poste">Poste</InputLabel>
                        <OutlinedInput id='poste' color='primary' size='small' fullWidth={true} required
                        value={employe?.body?.poste || ""}/>
                        {/* <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                        size='small'
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth={true}
                        endAdornment={<InputAdornment position="end">
                        
                        <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                        </InputAdornment>}
                    /> */}
                    <InputLabel htmlFor="active">Activé ?</InputLabel>
                    <NativeSelect variant='outlined'
                        color='primary' sx={{marginTop : "15px"}}
                        defaultValue={"true"}
                        inputProps={{name: 'active',id: 'active',}}
                        >
                            <option value={"oui"}>Oui</option>
                            <option value={"non"}>Non</option>
                    </NativeSelect>
                    <div className={classes.flex}>
                    <Button color="primary" variant="contained" fullWidth={true}
                    size="large" type="submit">
                    Confirmer</Button>

                    </div>
                </form>
                
            </Box>
            <Notification closeNotif={closeNotif} message={err} status="error"  />
            <Notification closeNotif={closeNotif} message={openNotif} status="success"  />

            </>
        )
}

export default FicheEmploye