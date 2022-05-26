import { Button, Modal, Box, InputLabel, OutlinedInput,IconButton, InputAdornment } from "@mui/material"
import classes from './ChangePassword.module.css';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const ChangePassword = function({id}) {
    const [openModal, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [showPassword, setPasswordVisibility]=useState(false);
    const [error, setError] = useState("");

    const handleClickShowPassword = () => {
        setPasswordVisibility(!showPassword);
      };
    
    const handleMouseDownPassword = (event) => {
    event.preventDefault();
    };

    const editPassword = function(event) {
        event.preventDefault();
    }

    return (
        <>
        <Button onClick={handleOpen} sx={{marginTop: "10px"}}>Change Password</Button>
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
                    
                </Box>
                {/* <Notification closeNotif={closeNotif} message={err} status="error"  />
                <Notification closeNotif={closeNotif} message={openNotif} status="success"  /> */}
            </Modal>
        </>
    )
}

export default ChangePassword