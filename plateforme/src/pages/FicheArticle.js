import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { API_CEGID, WOOCOMMERCE_URL } from "..";
import TailleTable from "../components/Table/TailleTable";
import classes from './FicheArticle.module.css';

const query = async function(code_article) {

    const article = await axios.get(`${API_CEGID}/articles/${code_article}`);
    const detail_stock = await axios.get(article.data.details_stock);
    return {article : article.data.body.info, taille : article.data.body.taille ,stock : detail_stock.data.body.depots}
}

const emptyArticle = {
        "GA_LIBELLE" : "",
        "GA2_LIBREARTE": "",
        "GA_DATECREATION": "01/01/2000",
        "GFM_NATURETYPE": "",
        "GFM_PERTARIF": "",
        "GFM_TYPETARIF": "",
        "GF_DATEDEBUT": "",
        "GF_DATEFIN": "",
        "dernierTarif": "",
        "descriptionTarif": "",
        marque: "",
        prixActuel: "",
        prixInitial: "",
        type: ""
}

const FicheArticle = function() {
    const {code_article} = useParams();
    const [error, setError] = useState("loading");
    const [article, setArticle] =  useState(emptyArticle);
    const [stock, setStock] =  useState([]);
    const [taille, setTaille] =  useState([]);
    const [src, setSrc] =  useState("");

    useEffect(()=> {
        const fetch = async () => {
            try {
                const image = await axios.get(`${WOOCOMMERCE_URL}/wp-json/wp/v2/media?search=${code_article}`);
                if (image.data.length>0) setSrc(image.data[0].guid.rendered);
                const {article, taille, stock} = await query(code_article)
                setTaille(taille);
                setStock(stock);
                setArticle(article);
                setError(null);
            } catch(error) {
                console.log(error);
                setArticle(emptyArticle);
                if (error.code==="ERR_BAD_REQUEST") return setError(`Aucun Article avec ce code n'a été trouvé`);
                if (error.code==="ERR_NETWORK") return setError(`Impossible de se connecter au serveur`);
                if (error.code==="ERR_BAD_RESPONSE") return setError(`La base de donnée de CEGID mets trop de temps à répondre`);
                setError(`Erreur : ${error.message}`);
            }
        }
        fetch();
    }, [code_article]);


    return (
        <>
            {error  ? <div style={{color : "red"}}>{error}</div> : "" }
            <h1 style={{fontSize: "2.5em"}}>{article.GA_LIBELLE}</h1>
            <section className={classes.fiche}>
            <div>
                <h1 style={{marginLeft: '0px'}}>Code article : {code_article}</h1>
                <h2 className={article.prixActuel? classes.prixInitial : classes.prixUnique}>Prix Initial : {article.prixInitial} DA</h2>
                {article.prixActuel ? <h2>Prix Actuel : {article.prixActuel } DA</h2> : ""}
                <img 
                src={src}
                style={{minWidth:"200px", minHeight:"200px", maxWidth: "400px", maxHeight: "400px",
                 backgroundColor: "lightgrey", marginTop: "20px"}} alt="Aucune image trouvée"
                ></img>
            </div>
            <TailleTable tailles={taille} stock={stock}/>
            <div>
                <h3>Informations Article : </h3>
                <ul>
                    <li><b>Marque : </b>{article.marque  }</li>
                    <li><b>Silhouette : </b>{article.type  }</li>
                    <li><b>Date création : </b>{new Date(article.GA_DATECREATION).toLocaleDateString('fr-fr')  }</li>
                    {/* <li><b>LibreARTE : </b>{article.GA2_LIBREARTE  }</li> */}
                </ul>
                {article.prixActuel ?
                <>
                    <h3>Informations Tarif :</h3>
                    <ul>
                        <li><b>Date du Tarif : </b>{ new Date(article.dernierTarif).toLocaleDateString('fr-fr') }</li>
                        <li><b>Description Tarif : </b>{ article.descriptionTarif }</li>
                        <li><b>Début Tarif : </b>{ new Date(article.GF_DATEDEBUT).toLocaleDateString('fr-fr') }</li>
                        <li><b>Fin Tarif : </b>{ new Date(article.GF_DATEFIN).toLocaleDateString('fr-fr') }</li>
                        <li><b>Type Tarif : </b>{ article.GFM_TYPETARIF }</li>
                        <li><b>Nature Tarif : </b>{ article.GFM_NATURETYPE }</li>
                        <li><b>PerTarif : </b>{ article.GFM_PERTARIF }</li>
                    </ul>
                </> : <h3>Aucun Tarif trouvé</h3>
                 }
            </div>

            </section>
        </>
        )
}

export default FicheArticle