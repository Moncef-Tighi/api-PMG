import { Button, TextField, NativeSelect, Box, Tab } from "@mui/material"
import {TabContext,TabList, TabPanel} from '@mui/lab';
import { useLocation, useNavigate } from "react-router-dom";
import classes from './Article.module.css';
import ListeArticleCegid from "../components/Articles/ListeArticleCegid";
import { useContext, useState } from "react";
import {Search} from '@mui/icons-material';
import { InputAdornment } from "@mui/material";
import AuthContext from "../state/AuthContext";
import ListeArticlePlateforme from "../components/Articles/ListeArticlePlateforme";

const Article = function(props) {
    const [query, setQuery] = useState("");
    const [sortBy] = useState("");
    const navigate= useNavigate();

    const authContext = useContext(AuthContext);
    const basicSearch= function(event) {
        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements
        setQuery(()=> {return {
            key : recherche.value ? `${select.value}[like]` : ` `,
            value :  recherche.value || ' '
        }})
    }

    const [tab, setTab] = useState(useLocation().pathname || '/article');

    const handleChange = (event, newValue) => {
        setTab(newValue);
        navigate(newValue);
        setQuery(()=> {});
      
    };
    return (
        <>
            <aside style={{marginBottom: "25px"}}>
                <form className={classes.form} onSubmit={basicSearch}>
                    <NativeSelect id="select" variant='outlined'>
                        {useLocation().pathname==='/article' ? 
                        <option value="GA_CODEARTICLE">Code Article</option>
                    :   <option value="code_article">Code Article</option>}
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
            <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginLeft: 6, marginRight: 6}}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Cegid" value="/article" sx={{fontSize: 20 }} /> 
                <Tab label="Plateforme" value="/article/plateforme" sx={{fontSize: 20 }}/>    
                <Tab label="PMG.dz" value="/article/pmg" sx={{fontSize: 20 }}/>   
                <Tab label="Corbeille" value="/article/corbeille" sx={{fontSize: 20 }} /> 
                </TabList>
            </Box>
            <TabPanel value="/article">
                <ListeArticleCegid query={query} sortBy={sortBy} 
                modification={authContext.permissions.some(permission => (permission === "admin" || permission=== "modification") ) } />
            </TabPanel>
            <TabPanel value="/article/plateforme">
                <ListeArticlePlateforme query={query} sortBy={sortBy} 
                modification={authContext.permissions.some(permission => (permission === "admin" || permission=== "modification") ) } />
            </TabPanel>
            <TabPanel value="/article/pmg">Soon...</TabPanel>
            <TabPanel value="/article/corbeille">
                <ListeArticlePlateforme query={query} activé={true} sortBy={sortBy} 
                modification={authContext.permissions.some(permission => (permission === "admin" || permission=== "modification") ) } />
            </TabPanel>
            </TabContext>


        </>  
        )
}

export default Article