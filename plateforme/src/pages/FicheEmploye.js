import { API_PLATEFORME } from "..";
import useGet from "../hooks/useGet"
import { useParams } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from '../state/AuthContext';
import classes from 'FicheEmploye.module.css';
import { Box } from "@mui/system";
import { InputLabel, OutlinedInput, Button } from "@mui/material";
const FicheEmploye = function() {
    const authContext = useContext(AuthContext);

    const { id } = useParams();
    console.log(id);
    const {data, loading, error} = useGet(`${API_PLATEFORME}/employes/${id}`,null,{ headers : {
        "Authorization" : `Bearer ${authContext.token}`
    }});
    console.log(data);
    const employe = data?.body;
    return (
            <>
                <ul>
                    <li>{employe?.nom}</li>
                    <li>{employe?.prenom}</li>
                    <li>{employe?.email}</li>
                    <li>{employe?.poste}</li>
                </ul>

                <Box className={classes.page}>
                    <h1>Ajouter un Employé</h1>
                    <form onSubmit={createEmploye}> 
                        <InputLabel htmlFor="nom">Nom</InputLabel>
                        <OutlinedInput id='nom' color='primary' size='small' fullWidth={true} required/>
                        <InputLabel htmlFor="prenom">prenom</InputLabel>
                        <OutlinedInput id='prenom' color='primary' size='small' fullWidth={true} required/>
                        <InputLabel htmlFor="email">E-Mail</InputLabel>
                        <OutlinedInput id='email' color='primary' size='small' fullWidth={true} required/>
                        
                        <InputLabel htmlFor="poste">Poste</InputLabel>
                        <OutlinedInput id='poste' color='primary' size='small' fullWidth={true} required/>

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
                    <div className={classes.flex}>
                    <Button color="primary" variant="contained" fullWidth={true}
                    size="large" type="submit">
                    Confirmer</Button>

                    <Button variant="contained" color='primaryLighter'
                    size="large" onClick={onClose} sx={{marginLeft: "10px"}}>
                    Annuler</Button>

                    </div>
                </form>
                
            </Box>

            </>
        )
}

export default FicheEmploye