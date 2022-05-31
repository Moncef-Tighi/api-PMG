import { Button, TextField, NativeSelect } from "@mui/material"
import classes from './Ecommerce.module.css';
import ListeArticleCegid from "../components/Articles/ListeArticleCegid";
import { useContext, useState } from "react";
import {Search} from '@mui/icons-material';
import { InputAdornment } from "@mui/material";
import AuthContext from "../state/AuthContext";
import ListeArticlePlateforme from "../components/Articles/ListeArticlePlateforme";

const Ecommerce = function(props) {
    const [query, setQuery] = useState("");
    const [sortBy] = useState("");
    const authContext = useContext(AuthContext);
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
            {/* <ListeArticleCegid query={query} sortBy={sortBy} 
            modification={authContext.permissions.some(permission => (permission === "admin" || permission=== "modification") ) } /> */}
            <ListeArticlePlateforme query={query} sortBy={sortBy} 
            modification={authContext.permissions.some(permission => (permission === "admin" || permission=== "modification") ) } />

        </>  
        )
}

export default Ecommerce