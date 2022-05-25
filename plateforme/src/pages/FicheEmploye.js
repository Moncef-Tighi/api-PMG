import { API_PLATEFORME } from "..";
import useGet from "../hooks/useGet"
import { useParams } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from '../state/AuthContext';
import classes from './FicheEmploye.module.css';
import { Box } from "@mui/system";
import { InputLabel, OutlinedInput, Button, NativeSelect } from "@mui/material";
const FicheEmploye = function() {
    const authContext = useContext(AuthContext);

    const { id } = useParams();

    const {data: employe, loading, error} = useGet(`${API_PLATEFORME}/employes/${id}`,null,authContext.token);

    return (
            <>

                <Box className={classes.page}>
                    <h1>Modifier un employé</h1>
                    <form> 
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
                            <option value={"true"}>Oui</option>
                            <option value={"false"}>Non</option>
                    </NativeSelect>
                    <div className={classes.flex}>
                    <Button color="primary" variant="contained" fullWidth={true}
                    size="large" type="submit">
                    Confirmer</Button>

                    </div>
                </form>
                
            </Box>

            </>
        )
}

export default FicheEmploye