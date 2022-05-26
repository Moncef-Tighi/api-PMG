import { Button, Modal, Box, InputLabel, OutlinedInput,IconButton, InputAdornment } from "@mui/material"
import classes from './ChangePassword.module.css';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useContext, useState } from "react";
import AuthContext from "../../state/AuthContext";
import axios from "axios";
import Notification from "../util/Util";
import { API_PLATEFORME } from "../..";

const ChangePassword = function({id, openModal, handleClose}) {

    const authContext= useContext(AuthContext);

    const [showPassword, setPasswordVisibility]=useState(false);
    const [openNotif, setNotif] = useState("");
    const [err, setError] = useState("");
    const closeNotif = (event, reason) => {
        setNotif("");
        setError("");
    };
    const handleClickShowPassword = () => {
        setPasswordVisibility(!showPassword);
      };
    
    const handleMouseDownPassword = (event) => {
    event.preventDefault();
    };

    const editPassword = async function(event) {
        event.preventDefault();
        const {password}= event.currentTarget.elements

        try {
            const response = await axios.patch(`${API_PLATEFORME}/employes/password`, {
                id_employe : id,
                password: password.value
            }, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            setNotif("Le mot de passe de l'employé a bien été modifié");
        } catch(error) {
            if (error.code==="ERR_BAD_REQUEST") return setError("Impossible de modifier le mot de passe");
            if (error.code==="ERR_NETWORK") return setError("Erreur de connexion : Le serveur n'est pas accessible");
        }
    }

    return (
        <>
            <Modal open={openModal} onClose={handleClose}>
                    <Box className={classes.modal}>
                        <h1>Changer le mot de passe</h1>
                        <form onSubmit={editPassword}> 
                            <InputLabel htmlFor="password">Nouveau mot de passe</InputLabel>
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
                        />
                        <div className={classes.flex}>
                        <Button color="primary" variant="contained" fullWidth={true}
                        size="large" type="submit">
                        Confirmer</Button>
                        <Button color="grey" variant="contained"
                        size="large" onClick={handleClose} sx={{marginRight: "10px"}}>
                        Annuler</Button>
                        </div>
                    </form>
                    
                <Notification closeNotif={closeNotif} message={err} status="error"  />
                <Notification closeNotif={closeNotif} message={openNotif} status="success"  />
                </Box>
            </Modal>
        </>
    )
}

export default ChangePassword