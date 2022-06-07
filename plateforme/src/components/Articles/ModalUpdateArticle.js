import { Modal, Box, Button } from "@mui/material"
import { useContext, useReducer, useState } from "react";
import classes from './ModalUpdateArticle.module.css';
import axios from "axios";
import {  API_PLATEFORME } from "../..";
import Notification from "../util/Util";
import AuthContext from "../../state/AuthContext";
import TableChangeArticles from "./TableChangeArticle";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress } from "@mui/material"
import loadingReducer from "../../reducers/loadingReducer.js"

const getCategories = async function() {
    const categories = await axios.get(`${API_PLATEFORME}/woocommerce/categorie`);
    return categories.data.body
}

const initialState= {plateforme : false, wooCommerce : false, variation : false, activation : false}

const ModalUpdateArticle = function({open, onClose, selection}) {

    const [selectedCategories, setSelectedCategories] = useState({});
    const authContext = useContext(AuthContext);
    const [sending, setSending] = useState(false);
    const [openNotif, setNotif] = useState("");
    const [openError, setError] = useState("");
    const [loadingStatus, dispatch] = useReducer(loadingReducer, initialState);

    const closeNotif = (event, reason) => {
        setNotif("");
        setError("");
    };



    const update = async function(event) {
        event.preventDefault();
        const inputs=event.currentTarget.elements;
        setSending(true);
        try {
            let article= []

            const plateforme = await axios.post(`${API_PLATEFORME}/articles/batch/insert`, {articles : article}, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            dispatch({type: 'plateforme'})

            dispatch({type: 'wooCommerce'})

            dispatch({type: 'variation'})

            dispatch({type: 'activation'})

            setNotif(`Tout les articles ont étés modifiés avec succès`);
        } catch(error) {
            console.log(error);
            if (error.response.data.statusCode===403) setError("Le serveur a refusé d'effectuer cette opération, essayez de vous reconnecter");
            if (error.response.data.statusCode===500) setError("La plateforme E-Commerce OU le site pmg.dz n'a pas répondu.");
            else {
                setError(`L'insertion a échouée ! Veuillez réessayer plus tard.`);   
            }
        }
        onClose();
        setSending(false);
        dispatch({type : 'reset'})
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
                <h2>Sauvgarde des modifications effectuées..</h2>
                <br/>
                <ul>
                    <li>{loadingStatus.plateforme ? <CheckCircleIcon  style={{ color: 'green' }}/> 
                    : <CircularProgress size="1.4rem"/>} Modification des articles sur la plateforme
                    </li>
                    <li>{loadingStatus.wooCommerce ? <CheckCircleIcon style={{ color: 'green' }}/> 
                    : <CircularProgress size="1.4rem"/>} Modification des articles sur WooCommerce
                    </li>
                    <li>{loadingStatus.variation ? <CheckCircleIcon style={{ color: 'green' }}/> 
                    : <CircularProgress size="1.4rem"/>} Modification des variations sur WooCommerce
                    </li>
                    <li>{loadingStatus.activation ? <CheckCircleIcon style={{ color: 'green' }}/> 
                    : <CircularProgress size="1.4rem"/>} Vérification finale
                    </li>
                </ul>
                </>
                : ""}
                {(open === true && selection && sending===false) ? <>
                <form onSubmit={update}>
                <h1>Modification</h1>
                <p>Les articles modifiés verront leurs informations modifiés sur la plateforme E-Commerce et sur le site pmg.dz</p>

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

export default ModalUpdateArticle