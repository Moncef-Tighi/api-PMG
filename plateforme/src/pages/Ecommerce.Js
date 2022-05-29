import { Button, TextField, NativeSelect } from "@mui/material"
import classes from './Ecommerce.module.css';
import ListeArticle from "../components/Articles/ListeArticle";
import { useState } from "react";
import {Search} from '@mui/icons-material';
import { InputAdornment } from "@mui/material";

const Ecommerce = function() {
    const [query, setQuery] = useState("");
    const [sortBy] = useState("");
    const basicSearch= function(event) {
        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        setQuery(()=> {return {
            key : recherche.value ? `${select.value}[like]` : ` `,
            value :  recherche.value || ' '
        }})
    }

    return (
        <>
            <aside style={{marginBottom: "25px"}}>
                <form className={classes.form} onSubmit={basicSearch}>
                    <NativeSelect id="select" variant='outlined'>
                        <option value="GA_CODEARTICLE">Code Article</option>
                        <option value="marque">Marque</option>
                        <option value="silhouette">Silhouette</option>
                    </NativeSelect>
                    <TextField id='recherche' size="small" variant="outlined" sx={{display: "block", marginLeft: "10px", width:"100%"}} 
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <Search />
                            </InputAdornment>
                        ),
                        }}
                    >
                    </TextField>
                    <Button color="primary" size="small" variant="contained" type="submit">
                        Rechercher
                    </Button>
                </form>
            </aside>
            <ListeArticle query={query} sortBy={sortBy} />
        </>  
        )
}

export default Ecommerce