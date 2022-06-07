import { Select, OutlinedInput, MenuItem, Checkbox, ListItemText, Input } from "@mui/material";
import { numberWithDots } from "../util/stringFunctions";
import useTable from "../../hooks/useTable";
import { useState, useEffect } from "react";
import TableCustom from "../Table/TableCustom";
import TableHeadCustom from "../Table/TableHeadCustom";
import { TableCell, TableRow, TableBody } from "@mui/material";
import {API_CEGID, API_PLATEFORME} from "../..";
import axios from "axios";


const header = [
    { name: "Code Article", sort: false},
    { name: "Libelle", sort: false},
    { name: "Marque", sort: false},
    { name: "Gender", sort: false},
    { name: "Division", sort: false},
    { name: "Silhouette", sort: false},
    { name: "Prix Initial", sort: false},
    { name: "Prix de vente", sort: false},
    { name: "Categories", sort: false},
]

const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 400,
        width: 300,
      },
    },
};

const findTailles = async function(articles) {
    for(const code_article of Object.keys(articles)) {
        const article = await axios.get(`${API_CEGID}/articles/${code_article}`);
        articles[code_article].taille=article.data.body.taille;
        articles[code_article].prixActuel=article.data.body.info.prixActuel;
    }
    return articles

}

function TableChangeArticles({setSelectedCategories, selection, selectedCategories, setError, open, getCategories}) {
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState(selection);
    const [loading, setLoading] = useState(false);


    const {handleChangePage,sortHandeler} = useTable();

    const handleChangeCategorie = (event, code_article) => {
        const {
          target: { value },
        } = event;

        setSelectedCategories((prevState)=> {
            return {
                ...prevState,
                [code_article] : [...value]
            }
        })
      };
      useEffect(()=> {
        const neededData= async () => {
            if(open===true) {
                setLoading(true);
                setSelectedCategories({});
                try {
                    const data = await findTailles(selection);
                    const categorie = await getCategories();
                    setCategories(categorie);
                    setArticles(()=> data);
                    setLoading(false);
                } catch(error) {
                    console.log(error);
                    setError('Impossible de contacter le serveur');
                    setLoading(false);
                }
            }
        }
        neededData();
    }, [open])


    return (
    <TableCustom 
    tableData={articles} 
    totalSize={Object.keys(articles).length} 
    page={1} 
    handleChangePage={handleChangePage}
    loading={loading} 
    heightSkeleton={"30vh"} 
    sx={{maxHeight: "70vh"}}
    >

        <TableHeadCustom header={header} sortHandeler={sortHandeler} />
        <TableBody>

        {Object.keys(articles).map(code_article => {
        return <TableRow key={code_article}>
            <TableCell component="th" scope="row" sx={{maxWidth: "25px"}}>
                    {articles[code_article].GA_CODEARTICLE || articles[code_article].code_article } 
                    </TableCell>
                    <TableCell align="left" sx={{width: "300px"}}>
                        <Input fullWidth={true} color="primary" id={`${code_article}-libelle`} 
                        defaultValue={articles[code_article].GA_LIBELLE?.toLowerCase() || articles[code_article].libelle?.toLowerCase() } />
                    </TableCell>
                    <TableCell align="left" sx={{maxWidth: "50px"}}>{articles[code_article].marque?.toLowerCase()}</TableCell>
                    <TableCell align="left">{articles[code_article].gender}</TableCell>
                    <TableCell align="left">{articles[code_article].division}</TableCell>
                    <TableCell align="left">{articles[code_article].silhouette}</TableCell>
                    <TableCell align="center" sx={{maxWidth: "25px"}}>{numberWithDots(articles[code_article].GA_PVTTC || articles[code_article].prix_initial)}</TableCell>
                    <TableCell align="center" sx={{maxWidth: "25px"}}>
                        <Input color="primary" id={`${code_article}-prixVente`} 
                        defaultValue={
                        articles[code_article].prixActuel 
                        || articles[code_article].GA_PVTTC 
                        || articles[code_article].prix_vente} 
                        />                              
                    </TableCell>
                    <TableCell>
                        <Select id="categorie" multiple input={<OutlinedInput label="Tag" />} renderValue={() => 'Categorie'} MenuProps={MenuProps} onChange={event => handleChangeCategorie(event, code_article)} value={selectedCategories[code_article] || []} autoWidth label="Categorie">
                        {categories.map(categorie => <MenuItem key={categorie?.id} value={categorie?.id}>
                            <Checkbox checked={selectedCategories[code_article]?.some(cat => cat === categorie.id) || false} />
                            <ListItemText primary={categorie?.slug} />
                            </MenuItem>)}
                        </Select>

                    </TableCell>
                    {/* <TableCell align="center" sx={{maxWidth: "25px"}}><button onClick={()=>{removeSelection(code_article)}}>X</button></TableCell> */}
                </TableRow>;
        })
    }        
    </TableBody>
    </TableCustom>
    );
}

export default TableChangeArticles