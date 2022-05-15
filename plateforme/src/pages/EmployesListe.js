import { Button, TextField, NativeSelect } from "@mui/material"
import classes from './Ecommerce.module.css';
import { useState } from "react";

const EmployesListe = function() {
    const [query, setQuery] = useState("");

    const basicSearch= function(event) {

        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        setQuery(`${select.value}[like]=${recherche.value}`)
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
                    <TextField id='recherche' size="small" required variant="outlined" sx={{display: "block", marginLeft: "10px", width:"100%"}} />
                    <Button color="primary" size="small" variant="contained" type="submit">
                    Confirmer
                    </Button>
                </form>
            </aside>

        </>  


        )
}

export default EmployesListe