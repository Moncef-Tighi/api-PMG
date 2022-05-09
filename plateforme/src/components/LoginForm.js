import classes from "./LoginForm.module.css";
import {InputLabel, OutlinedInput, InputAdornment,IconButton, Button} from '@mui/material';
import {Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material'
import { useState } from "react";
import axios from 'axios';

const LoginForm = function() {
    const [showPassword, setPasswordVisibility]=useState(false);
    const [error, setError] = useState("");

    const handleClickShowPassword = () => {
        setPasswordVisibility(!showPassword);
      };
    
    const handleMouseDownPassword = (event) => {
    event.preventDefault();
    };

    const login = async (event)=> {
        event.preventDefault();
        const {password, email}= event.currentTarget.elements

        if(password.value.trim()==="" || email.value.trim()==="") return setError("L'email et le mot de passe ne peuvent pas être vide");

        try {
            const response = await axios.post('http://localhost:4001/api/v1/connexion', {
                email: email.value,
                password: password.value
            })
            console.log(response);        
            setError("");
        } catch(error) {
            if (error.response) {
                if (error.response.status===401) setError(error.response.data.message);
            } else {
                setError("Impossible de se connecter au serveur");
            }
        }
    }
    

    return (
        <main className={classes.wrapper}>
            <div className={classes.positionning}>
                <img src="logo-pmg.png"></img>
                <h1>S'identifier</h1>
                <h3>{error}</h3>
                <form onSubmit={login}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <OutlinedInput
                    id="email"
                    fullWidth={true}
                    placeholder="a.email@pmg.dz"
                    endAdornment={<InputAdornment position="end"> <AccountCircle /></InputAdornment>}
                    />

                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
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
            
                    <Button color="primary" variant="contained" 
                    size="large" sx={ {marginTop: "40px", backgroundColor: "#E92129"}} type="submit">
                        Confirmer</Button>
                </form>


            </div> 
        </main>
        )
}

export default LoginForm