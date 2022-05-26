import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import classes from './AddEmployes.module.css'
import { OutlinedInput, IconButton, InputAdornment, InputLabel, Button } from '@mui/material';
import { useState } from 'react';
import {Visibility, VisibilityOff} from '@mui/icons-material'
import { NativeSelect } from "@mui/material";

const AddEmployes = function({open, onClose, createEmploye}) {
    const [showPassword, setPasswordVisibility]=useState(false);

    const handleClickShowPassword = () => {
        setPasswordVisibility(!showPassword);
      };
    
    const handleMouseDownPassword = (event) => {
    event.preventDefault();
    };  

    return (
        <>
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box className={classes.modal}>
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

                        <InputLabel htmlFor="password">Password</InputLabel>
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
                        <InputLabel htmlFor="poste">Poste</InputLabel>
                        <NativeSelect variant='outlined' id='poste'
                            color='primary' sx={{marginTop : "15px"}}
                            defaultValue={"modification"}
                            inputProps={{name: 'permission',id: 'permission',}}
                            >
                                <option value={"modification"}>Employé</option>
                                <option value={"admin"}>Admin</option>
                        </NativeSelect>




                    <div className={classes.flex}>
                    <Button variant="contained" color='grey'
                    size="large" onClick={onClose} sx={{marginRight: "10px"}}>
                    Annuler</Button>

                    <Button color="primary" variant="contained" fullWidth={true}
                    size="large" type="submit">
                    Confirmer</Button>


                    </div>
                </form>
                
            </Box>
        </Modal>

        </>
        )
}

export default AddEmployes