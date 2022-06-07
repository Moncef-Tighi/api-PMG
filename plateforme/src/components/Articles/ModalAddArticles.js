import { Modal, Box, Button } from "@mui/material"
import { useContext, useState } from "react";
import classes from './ModalAddArticles.module.css';
import axios from "axios";
import {  API_PLATEFORME } from "../..";
import Notification from "../util/Util";
import AuthContext from "../../state/AuthContext";
import TableChangeArticles from "./TableChangeArticle";





const ModalAddArticles = function({open, onClose, selection}) {

    const [articles, setArticles] = useState(selection);
    const [selectedCategories, setSelectedCategories] = useState({});
    
    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [received, setReceived] = useState(0);
    const [openNotif, setNotif] = useState("");
    const [openError, setError] = useState("");

    const closeNotif = (event, reason) => {
        setNotif("");
        setError("");
    };



    const insertion = async function(event) {
        event.preventDefault();
        const inputs=event.currentTarget.elements;
        setSending(true);
        try {
            let article= [];
            for (const code_article of Object.keys(articles)) {
                article.push({
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
                    tailles : [],
                    categorie : selectedCategories[code_article],
                })
                articles[code_article].taille.forEach(taille=> {
                    article[article.length-1].tailles.push({
                        stock: taille.stockNet,
                        code_barre: taille.GA_CODEBARRE,
                        dimension: taille.dimension 
                    })
                })
            }

            const plateforme = await axios.post(`${API_PLATEFORME}/articles/batch/insert`, {articles : article}, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            console.log(plateforme);
            const wooCommerce = await axios.post(`${API_PLATEFORME}/woocommerce/ajout`, {articles : article}, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            console.log(wooCommerce);
            const wooCommerceVariation = await axios.post(`${API_PLATEFORME}/woocommerce/ajout/taille`, {
                variations : article,
                insertion: wooCommerce.data.body.insertion,
                update: wooCommerce.data.body.update
            }, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            console.log(wooCommerceVariation);
            const activation = await axios.patch(`${API_PLATEFORME}/articles/batch/activation`, {
                code_article : plateforme.data.body?.articles?.map(article=> article.code_article),
                id: wooCommerce.data.body?.insertion?.map(article=> article.id)
            },{headers : {
                "Authorization" : `Bearer ${authContext.token}`
            }})
            console.log(activation);
            setReceived(()=> received+1);
            setNotif(`Tout les articles ont étés insérés avec succès`);
        } catch(error) {
            console.log(error);
            if (error.response.data.statusCode===403) setError("Le serveur a refusé d'effectuer cette opération, essayer de vous reconnecter");
            if (error.response.data.statusCode===500) setError("La plateforme E-Commerce OU le site pmg.dz n'a pas répondu.");
            else {
                setError(`L'insertion a échouée ! Veuillez réessayer plus tard.`);   
            }
        }
        onClose();
        setSending(false);
        setReceived(0);
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
                <h1>Insertion</h1>
                <p>Les articles sélectionnés seront ajoutés à la plateforme E-Commerce et au site pmg.dz</p>
                <h3>Attention ! Si un article a déjà été mis en vente, il sera automatiquement modifié.</h3>
                <TableChangeArticles   articles={articles} loading={loading} setLoading={setLoading}
                setArticles={setArticles} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} 
                onClose={onClose} selection={selection} setError={setError} open={open}/>
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