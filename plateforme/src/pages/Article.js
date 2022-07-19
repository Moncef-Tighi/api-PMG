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
import { Tooltip } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



const Article = function(props) {
    const [query, setQuery] = useState("");
    const [sortBy] = useState("");
    const [old, checkBoxChange] = useState(false);
    const navigate= useNavigate();
    const authContext = useContext(AuthContext);
    const checkLocation= useLocation().pathname==='/article'
    const basicSearch= function(event) {
        event.preventDefault();
        const {select, recherche}= event.currentTarget.elements

        const newQuery = {
            key : recherche.value ? `${select.value}[like]` : ` `,
            value :  recherche.value || ' ',
        }
        if (checkLocation) newQuery.old=old
        setQuery(()=> newQuery)
    }

    const [tab, setTab] = useState(useLocation().pathname || '/article');

    //C'est un petit hack qui place la tab au bon endroit si on refresh dans la corbeille
    //Ce hack est nécessaire parce qu'une tab ne peut pas avoir deux value
    if (tab==='/article/plateforme/corbeille')  setTab('/article/plateforme')
    
    
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
                    {useLocation().pathname==='/article' ? 
                    <FormGroup>
                        <FormControlLabel control={<Checkbox 
                        id="old"
                        checked={old}
                        onChange={()=> checkBoxChange(!old)}                  
                        />} label="Anciens articles ?" />
                    </FormGroup>
                    : ""}
                    <Button color="primary" size="small" variant="contained" type="submit">
                        Rechercher
                    </Button>
                </form>
            </aside>
            <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginLeft: 6, marginRight: 6}}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tooltip title='Liste des articles extraite de CEGID' value="/article" arrow> 
                    <Tab label="Cegid" value="/article" sx={{fontSize: 20 }} /> 
                </Tooltip>
                <Tooltip title='Liste des articles stockés sur la plateforme E-Commerce' value="/article/plateforme" arrow> 
                    <Tab label="Plateforme" value="/article/plateforme" sx={{fontSize: 20 }}/>  
                </Tooltip>  
                <Tooltip title='Article en vente sur le site PMG.DZ' value="/article/pmg" arrow> 
                    <Tab label="PMG.dz" value="/article/pmg" sx={{fontSize: 20 }}/>   
                </Tooltip>
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
            </TabContext>


        </>  
        )
}

export default Article