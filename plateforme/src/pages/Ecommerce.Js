import Page from "./Page"
import { Button, InputLabel, TextField, NativeSelect, FormControl } from "@mui/material"
import { useEffect, useState } from "react";
import axios from 'axios';
import classes from './Ecommerce.module.css';
import ListeArticle from "../components/ListeArticle";

const query= async function(params="") {
    try {
        const response = await axios.get(`http://localhost:5000/api/v1/articles?${params}`)
        return response.data
    }
    catch(error) {
        console.log(error);
    }
}

const Ecommerce = function() {

    const [tableData, updateTable] = useState({body : {articles : []}})

    const basicSearch= function(event) {
        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        console.log(select.value);
        console.log(recherche.value)
    }
    
    useEffect(()=> {
        const fetch = async () => {
            const data = await query()
            updateTable(data);
        }
        fetch();
    }, []);


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

            <ListeArticle data={tableData}/>
            
        </Page>

        )
}

export default Ecommerce