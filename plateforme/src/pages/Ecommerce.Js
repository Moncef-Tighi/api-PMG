import Page from "./Page"
import { Button, InputLabel, TextField, NativeSelect, FormControl } from "@mui/material"
import classes from './Ecommerce.module.css';
import ListeArticle from "../components/ListeArticle";
import { useState } from "react";


const Ecommerce = function() {
    const [query, setQuery] = useState("");

    const basicSearch= function(event) {

        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        setQuery(`&${select.value}[like]=${recherche.value}`)
    }
    
    return (
        <Page>
            <aside>
                <form className={classes.form} onSubmit={basicSearch}>
                    <NativeSelect id="select" variant='outlined'>
                        <option value="GA_CODEARTICLE">Code Article</option>
                        <option value="marque">Marque</option>
                        <option value="type">Type</option>
                        <option value="GA_LIBELLE">Libelle</option>
                    </NativeSelect>
                    <TextField id='recherche' size="small" required variant="outlined" sx={{display: "block", marginLeft: "10px", width:"100%"}} />
                    <Button color="primary" size="small" variant="contained" type="submit">
                    Confirmer
                    </Button>
                </form>
            </aside>

            <ListeArticle query={query}/>
            
        </Page>

        )
}

export default Ecommerce