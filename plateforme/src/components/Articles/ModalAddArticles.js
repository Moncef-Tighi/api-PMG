import { Modal, Box, Input, Button } from "@mui/material"
import { useEffect, useState } from "react";
import classes from './ModalAddArticles.module.css';
import axios from "axios";
import { API_CEGID, API_PLATEFORME } from "../..";
import TableCustom from "../Table/TableCustom";
import TableHeadCustom from "../Table/TableHeadCustom";
import useTable from "../../hooks/useTable";
import { TableCell, TableRow, TableBody } from "@mui/material";
import Notification from "../util/Util";
import { Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from "@mui/material";

function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const findTailles = async function(articles) {
    for(const code_article of Object.keys(articles)) {
        const article = await axios.get(`${API_CEGID}/articles/${code_article}`);
        articles[code_article].taille=article.data.body.taille;
        articles[code_article].prixActuel=article.data.body.info.prixActuel;
    }
    return articles

}

const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 400,
        width: 300,
      },
    },
  };
  

const getCategories = async function() {
    const categories = await axios.get(`${API_PLATEFORME}/woocommerce/categorie`);
    return categories.data.body
}

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
    { name: "Retirer", sort: false},
]


const ModalAddArticles = function({open, onClose, selection}) {

    const [articles, setArticles] = useState(selection);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState({});
    
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [received, setReceived] = useState(0);
    const {handleChangePage,sortHandeler} = useTable();
    const [openNotif, setNotif] = useState("");
    const [openError, setError] = useState("");

    const closeNotif = (event, reason) => {
        setNotif("");
        setError("");
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
                    setError('Impossible de contacter le serveur');
                    onClose();
                    setLoading(false);
                }
            }
        }
        neededData();
    }, [open])

    const insertion = async function(event) {
        event.preventDefault();
        const inputs=event.currentTarget.elements;
        setSending(true);
        try {
        for (const code_article of Object.keys(articles)) {
                let article = {
                    "code_article" : code_article,
                    "marque" : articles[code_article].marque,
                    "gender" : articles[code_article].gender,
                    "division" : articles[code_article].division,
                    "silhouette" : articles[code_article].silhouette,
                    "libelle" : inputs[`${code_article}-libelle`].value,
                    "date_modification" : articles[code_article].GA_DATEMODIF,
                    "prix_initial" : articles[code_article].GA_PVTTC,
                    "prix_vente" : inputs[`${code_article}-prixVente`].value,
                    "description" : "",
                    taille : [],
                    categorie : selectedCategories[code_article],
                }
                articles[code_article].taille.forEach(taille=> {
                    article.taille.push({
                        stock: taille.stockNet,
                        code_barre: taille.GA_CODEBARRE,
                        dimension: taille.dimension 
                    })
                })
    
                const response = await axios.post(`${API_PLATEFORME}/articles/insertion`, article)
                setReceived(()=> received+1);
            }
            setNotif(`Tout les articles ont étés inséré avec succès`);
            setSending(false);
            setReceived(0);
        } catch(error) {
            if (error.response.data.statusCode===500) return setError("La plateforme E-Commerce OU le site pmg.dz n'a pas répondu.");
            setError(`L'insertion a échouée ! Veuillez réessayer plus tard.`);
            onClose();
        }
    }

    const handleChangeCategorie = (event, code_article) => {
        const {
          target: { value },
        } = event;

        setSelectedCategories((prevState)=> {
            return {
                ...prevState,
                [code_article] : [...value]}
        })
      };
    

    return (
        <>
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box className={classes.modal}>
                {sending===true? 
                <>
                <h2>Sauvgarde des articles en cours...</h2>
                <div>{received} articles sauvgardés / {Object.keys(articles).length} articles total</div>
                </>
                : ""}
                {(open === true && articles && sending===false) ? <>
                <form onSubmit={insertion}>
                <h1>Insertion</h1>
                <p>Les articles sélectionnés seront ajoutés à la plateforme E-Commerce et au site pmg.dz</p>
                <h3>Attention ! Si un article a déjà été mis en vente, il sera automatiquement modifié.</h3>
                <TableCustom
                    tableData={articles}
                    totalSize={Object.keys(articles).length}
                    page={1}
                    handleChangePage={handleChangePage}
                    loading={loading}
                    heightSkeleton={{height: "400px"}}
                >
                <TableHeadCustom header={header} sortHandeler={sortHandeler}/>
                <TableBody>

                {Object.keys(articles).map((code_article) => {
                    
                    return (
                        <TableRow
                        key={code_article}
                        >
                            <TableCell component="th" scope="row" sx={{maxWidth: "25px"}}>
                            {articles[code_article].GA_CODEARTICLE}
                            </TableCell>
                            <TableCell align="left" sx={{width: "300px"}}>
                                <Input fullWidth={true} color="primary" id={`${code_article}-libelle`}  defaultValue={articles[code_article].GA_LIBELLE?.toLowerCase()}/>
                            </TableCell>
                            <TableCell align="left" sx={{maxWidth: "50px"}}>{articles[code_article].marque?.toLowerCase()}</TableCell>
                            <TableCell align="left">{articles[code_article].gender}</TableCell>
                            <TableCell align="left">{articles[code_article].division}</TableCell>
                            <TableCell align="left">{articles[code_article].silhouette}</TableCell>
                            <TableCell align="center" sx={{maxWidth: "25px"}}>{numberWithDots(articles[code_article].GA_PVTTC)}</TableCell>
                            <TableCell align="center" sx={{maxWidth: "25px"}}>
                                <Input color="primary" id={`${code_article}-prixVente`} defaultValue={articles[code_article].prixActuel}/>                              
                            </TableCell>
                            <TableCell>
                                <Select
                                id="categorie"
                                multiple
                                input={<OutlinedInput label="Tag" />}
                                renderValue={()=> 'Categorie'}
                                MenuProps={MenuProps}
                                onChange={(event) => handleChangeCategorie(event, code_article)}
                                value={selectedCategories[code_article] || []}
                                autoWidth
                                label="Categorie"
                                >
                                {categories.map((categorie) => (
                                    <MenuItem key={categorie?.id} value={categorie?.id}>
                                    <Checkbox checked={selectedCategories[code_article]?.some(cat => cat===categorie.id)|| false } />
                                    <ListItemText primary={categorie?.slug}/>
                                    </MenuItem>
                                ))}
                                </Select>

                            </TableCell>
                            <TableCell align="center" sx={{maxWidth: "25px"}}>X</TableCell>
                        </TableRow>        
                    )
                })}        
                </TableBody>
                </TableCustom>
                <div className={classes.flex}>
                    <Button color='primary' type="submit" variant="contained" sx={{width : "250px"}}>Confirmer</Button>
                    <Button variant="contained" color='primaryLighter'
                    size="large" onClick={onClose} sx={{marginRight: "15px"}}>
                    Annuler</Button>

                </div>
                </form>
                </> : ""}
            </Box>
        </Modal>
        <Notification closeNotif={closeNotif} message={openNotif} status="success"  />
        <Notification closeNotif={closeNotif} message={openError} status="error"  />

        </>
    )

}

export default ModalAddArticles