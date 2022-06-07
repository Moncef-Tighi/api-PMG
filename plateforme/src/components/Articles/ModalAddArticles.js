import { Modal, Box, Button } from "@mui/material"
import { useContext, useReducer, useState } from "react";
import classes from './ModalAddArticles.module.css';
import axios from "axios";
import {  API_PLATEFORME } from "../..";
import Notification from "../util/Util";
import AuthContext from "../../state/AuthContext";
import TableChangeArticles from "./TableChangeArticle";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress } from "@mui/material"

const getCategories = async function() {
    const categories = await axios.get(`${API_PLATEFORME}/woocommerce/categorie`);
    return categories.data.body
}

const initialState= {plateforme : false, wooCommerce : false, variation : false, activation : false}

const reducer = function(state, {type, payload}) {
    let newState= {...state}
    switch(type) {
        case 'plateforme' :
            newState.plateforme= true
            return newState
        case 'wooCommerce' : 
            newState.wooCommerce= true;
            return newState
        case 'variation' :
            newState.variation=true;
            return newState
        case 'activation' :
            newState.activation=true;
            return newState
        case 'reset':
            newState= {...initialState};
            return newState
    }
    return newState
}

const ModalAddArticles = function({open, onClose, selection}) {

    const [selectedCategories, setSelectedCategories] = useState({});
    const authContext = useContext(AuthContext);
    const [sending, setSending] = useState(false);
    const [openNotif, setNotif] = useState("");
    const [openError, setError] = useState("");
    const [loadingStatus, dispatch] = useReducer(reducer, initialState);

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
            for (const code_article of Object.keys(selection)) {
                article.push({
                    "code_article" : code_article,
                    "marque" : selection[code_article].marque,
                    "gender" : selection[code_article].gender,
                    "division" : selection[code_article].division,
                    "silhouette" : selection[code_article].silhouette,
                    "libelle" : inputs[`${code_article}-libelle`].value,
                    "date_modification" : selection[code_article].GA_DATEMODIF,
                    "prix_initial" : selection[code_article].GA_PVTTC,
                    "prix_vente" : inputs[`${code_article}-prixVente`].value,
                    "description" : "",
                    tailles : [],
                    categorie : selectedCategories[code_article],
                })
                selection[code_article].taille.forEach(taille=> {
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
            dispatch({type: 'plateforme', payload: plateforme})
            console.log(plateforme);
            const wooCommerce = await axios.post(`${API_PLATEFORME}/woocommerce/ajout`, {articles : article}, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            dispatch({type: 'wooCommerce', payload: wooCommerce})
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
            dispatch({type: 'variation', payload: wooCommerceVariation})
            console.log(wooCommerceVariation);
            const activation = await axios.patch(`${API_PLATEFORME}/articles/batch/activation`, {
                code_article : plateforme.data.body?.articles?.map(article=> article.code_article),
                id: wooCommerce.data.body?.insertion?.map(article=> article.id)
            },{headers : {
                "Authorization" : `Bearer ${authContext.token}`
            }})
            console.log(activation);
            dispatch({type: 'activation', payload: true})
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
                <br/>
                <ul>
                    <li>{loadingStatus.plateforme ? <CheckCircleIcon  style={{ color: 'green' }}/> 
                    : <CircularProgress size="1.4rem"/>} Ajout des articles sur la plateforme
                    </li>
                    <li>{loadingStatus.wooCommerce ? <CheckCircleIcon style={{ color: 'green' }}/> 
                    : <CircularProgress size="1.4rem"/>} Ajout des articles sur WooCommerce
                    </li>
                    <li>{loadingStatus.variation ? <CheckCircleIcon style={{ color: 'green' }}/> 
                    : <CircularProgress size="1.4rem"/>} Ajout des variations sur WooCommerce
                    </li>
                    <li>{loadingStatus.activation ? <CheckCircleIcon style={{ color: 'green' }}/> 
                    : <CircularProgress size="1.4rem"/>} Vérification finale
                    </li>
                </ul>
                </>
                : ""}
                {(open === true && selection && sending===false) ? <>
                <form onSubmit={insertion}>
                <h1>Insertion</h1>
                <p>Les articles sélectionnés seront ajoutés à la plateforme E-Commerce et au site pmg.dz</p>
                <h3>Attention ! Si un article a déjà été mis en vente, il sera automatiquement modifié.</h3>
                <TableChangeArticles  selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} 
                selection={selection} setError={setError} open={open} getCategories={getCategories}/>
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