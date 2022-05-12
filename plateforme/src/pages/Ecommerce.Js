import Page from "./Page"
import { Button, InputLabel, TextField, NativeSelect, FormControl } from "@mui/material"
import { useState } from "react";
import classes from './Ecommerce.module.css';

const Ecommerce = function() {

    const basicSearch= function() {
        
    }
    
    return (
        <Page>
            <aside>
                <form className={classes.form} onSubmit={basicSearch}>
                    <NativeSelect id="select" variant='outlined'>
                        <option value="code_article">Code Article</option>
                        <option value="marque">Marque</option>
                        <option value="type">Type</option>
                        <option value="libelle">Libelle</option>
                    </NativeSelect>
                    <TextField size="small" required variant="outlined" sx={{display: "block", marginLeft: "10px", width:"100%"}} />
                    <Button color="primary" size="small" variant="contained" type="submit">
                    Confirmer
                    </Button>
                </form>
            </aside>
            
        </Page>

        )
}

export default Ecommerce