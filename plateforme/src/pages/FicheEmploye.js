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
import ChangePassword from "../components/Employés/ChangePassword";

const FicheEmploye = function(props) {
    const authContext = useContext(AuthContext);
    let { id } = useParams();
    if (props.id) {
        id = props.id 
        var url =`${API_PLATEFORME}/employes/profile`
    } else {
        var url = `${API_PLATEFORME}/employes/${id}`
    }
    var {data: employe, loading, error} = useGet(url,null,authContext.token);

    const [openModal, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [openNotif, setNotif] = useState("");
    const [err, setError] = useState("");
    const closeNotif = (event, reason) => {
        setNotif("");
        setError("");
    };

    const editEmploye =async  function(event) {
        event.preventDefault();

        const {nom, prenom, email, poste ,active}= event.currentTarget?.elements

        const data = {
            id_employe : id,
            nom : nom.value,
            prenom: prenom.value,
            email: email.value,
            poste: poste.value,
        }
        
        try {
            if (props.id) {
                await axios.put(`${API_PLATEFORME}/employes/editProfile`, data, {
                    headers : {
                        "Authorization" : `Bearer ${authContext.token}`
                    }
                })    
            }else {
                data.active = active.value==="oui" ? true : false 

                await axios.put(`${API_PLATEFORME}/employes/modifier`, data, {
                    headers : {
                        "Authorization" : `Bearer ${authContext.token}`
                    }
                })
            }
            setNotif("L'employé a bien été modifié");
        } catch(error) {
            console.log(error);
            console.log(error.code);
            if (error.code==="ERR_BAD_REQUEST") return setError("Impossible de modifier cet utilisateur");
            if (error.code==="ERR_NETWORK") return setError("Erreur de connexion : Le serveur n'est pas accessible");
        }
    }



    return (
            <>

                <Box className={classes.page}>
                    <h1>{props.id ? "Modifier vos informations" : "Modifier un employé"}</h1>
                    <form onSubmit={editEmploye}> 

                        <InputLabel htmlFor="nom">Nom</InputLabel>
                        <OutlinedInput id='nom' color='primary' size='small' fullWidth={true} required
                        defaultValue={employe?.body?.nom} key={employe?.body?.nom+'nom'}  />
                        <InputLabel htmlFor="prenom">prenom</InputLabel>
                        <OutlinedInput id='prenom' color='primary' size='small' fullWidth={true} required
                        defaultValue={employe?.body?.prenom} key={employe?.body?.prenom+'prenom'} />
                        <InputLabel htmlFor="email">E-Mail</InputLabel>
                        <OutlinedInput id='email' color='primary' size='small' fullWidth={true} required
                        defaultValue={employe?.body?.email} key={employe?.body?.email+'email'} />
                        
                    {props.id ? "" :
                    <>
                        <InputLabel htmlFor="poste">Poste</InputLabel>
                        <OutlinedInput id='poste' color='primary' size='small' fullWidth={true} required
                        defaultValue={employe?.body?.poste} key={employe?.body?.poste+'poste'} />
                        <InputLabel htmlFor="active">Activé ?</InputLabel>
                        <NativeSelect variant='outlined'
                            color='primary' sx={{marginTop : "15px"}}
                            defaultValue={"true"}
                            inputProps={{name: 'active',id: 'active',}}
                            >
                                <option value={"oui"}>Oui</option>
                                <option value={"non"}>Non</option>
                        </NativeSelect>
                    </>}
                    <br/>
                    <Button onClick={handleOpen} sx={{marginTop: "10px"}}>Change Password</Button>

                    <div className={classes.flex}>
                    <Button color="primary" variant="contained" fullWidth={true}
                    size="large" type="submit">
                    Confirmer</Button>
                    </div>
                </form>
                <ChangePassword id={id} link={props.id ? "my_password" : "password"} openModal={openModal} handleClose={handleClose}/>
                
            </Box>
            <Notification closeNotif={closeNotif} message={err} status="error"  />
            <Notification closeNotif={closeNotif} message={openNotif} status="success"  />

            </>
        )
}

export default FicheEmploye