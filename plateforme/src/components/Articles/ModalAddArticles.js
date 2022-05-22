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

const header = [
    { name: "Code Article", sort: false},
    { name: "Libelle", sort: false},
    { name: "Marque", sort: false},
    { name: "Prix Initial", sort: false},
    { name: "Prix de vente", sort: false},
    { name: "Retirer", sort: false},
]


const ModalAddArticles = function({open, onClose, selection}) {
    const [articles, setArticles] = useState(selection);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [received, setReceived] = useState(0);
    const {handleChangePage,sortHandeler} = useTable();
    const [openNotif, setNotif] = useState("");

    const closeNotif = (event, reason) => {
        setNotif("");
    };


    useEffect(()=> {
        const neededData= async () => {
            if(open===true) {
                setLoading(true);
                const data = await findTailles(selection);
                setArticles(()=> data);
                setLoading(false);
            }
        }
        neededData();
    }, [open])

    const insertion = async function(event) {
        event.preventDefault();
        const inputs=event.currentTarget.elements;
        setSending(true);
        for (const code_article of Object.keys(articles)) {
            let article = {
                "code_article" : code_article,
                "marque" : articles[code_article].marque,
                "libelle" : inputs[`${code_article}-libelle`].value,
                "date_modification" : new Date(),
                "prix_initial" : articles[code_article].GA_PVTTC,
                "prix_vente" : inputs[`${code_article}-prixVente`].value,
                "description" : "",
                taille : []
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
    }


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
                <TableCustom
                    tableData={articles}
                    totalSize={Object.keys(articles).length}
                    page={1}
                    handleChangePage={handleChangePage}
                    loading={loading}
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
                            <TableCell align="left" sx={{width: "350px"}}>
                                <Input fullWidth={true} color="primary" id={`${code_article}-libelle`}  defaultValue={articles[code_article].GA_LIBELLE?.toLowerCase()}/>
                            </TableCell>
                            <TableCell align="left" sx={{maxWidth: "50px"}}>{articles[code_article].marque?.toLowerCase()}</TableCell>
                            <TableCell align="center" sx={{maxWidth: "25px"}}>{numberWithDots(articles[code_article].GA_PVTTC)}</TableCell>
                            <TableCell align="center" sx={{maxWidth: "25px"}}>
                                <Input color="primary" id={`${code_article}-prixVente`} defaultValue={articles[code_article].prixActuel}/>                              
                            </TableCell>
                            <TableCell align="center" sx={{maxWidth: "25px"}}>X</TableCell>
                        </TableRow>        
                    )
                })}        
                </TableBody>
                </TableCustom>
                <Button color='primary' type="submit" variant="contained">Confirmer</Button>
                </form>
                </> : ""}
            </Box>
        </Modal>
        <Notification closeNotif={closeNotif} message={openNotif} status="success"  />

        </>
    )

}

export default ModalAddArticles