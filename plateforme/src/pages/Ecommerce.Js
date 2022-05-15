import { Button, InputLabel, TextField, NativeSelect, FormControl } from "@mui/material"
import classes from './Ecommerce.module.css';
import ListeArticle from "../components/Articles/ListeArticle";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";


const Ecommerce = function() {
    const [query, setQuery] = useState("");
    const [sortBy, changeSort] = useState("");
    const navigate = useNavigate();
    const basicSearch= function(event) {

        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        setQuery(`${select.value}[like]=${recherche.value}`)
    }

    const SortHandler = function(event, field) {
        if (field===sortBy) {
            const newQuery= query.replace('-', '+')
            console.log(newQuery);
            return setQuery(newQuery);
        }
        setQuery(query+`&sort=-${field}`);
        changeSort(field);
    }
    
    return (
        <>
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

            <ListeArticle query={query} SortHandler={SortHandler} sortBy={sortBy} />
        </>  
        )
}

export default Ecommerce