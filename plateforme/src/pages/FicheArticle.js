import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import TailleTable from "../components/Articles/TailleTable";
import classes from './FicheArticle.module.css';

const query = async function(code_article) {

    const article = await axios.get(`http://localhost:5000/api/v1/articles/${code_article}`);
    const detail_stock = await axios.get(article.data.details_stock);
    return {article : article.data.body.info, taille : article.data.body.taille ,stock : detail_stock.data.body.depots}
}

const emptyArticle = {
        "GA_LIBELLE" : "",
        "GA2_LIBREARTE": "",
        "GA_DATECREATION": "",
        "GA_LIBELLE": "",
        "GFM_NATURETYPE": "",
        "GFM_PERTARIF": "",
        "GFM_TYPETARIF": "",
        "GF_DATEDEBUT": "",
        "GF_DATEFIN": "",
        "dernierTarif": "",
        "descriptionTarif": "",
        marque: "",
        prixActuel: 0,
        prixInitial: 0,
        type: ""
}

const FicheArticle = function() {
    const {code_article} = useParams();
    const [error, setError] = useState("loading");
    const [article, setArticle] =  useState(emptyArticle);
    const [stock, setStock] =  useState([]);
    const [taille, setTaille] =  useState([]);

    useEffect(()=> {
        const fetch = async () => {
            try {
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
                <h4>Prix Initial : {article.prixInitial } DA</h4>
                <h2>Prix Actuel : {article.prixActuel } DA</h2>
                <img style={{width:"300px", height:"300px", backgroundColor: "lightgrey"}}></img>
            </div>
            <div>
                <h3>Informations Article : </h3>
                <ul>
                    <li><b>Marque : </b>{article.marque  }</li>
                    <li><b>Type : </b>{article.type  }</li>
                    <li><b>Date création : </b>{article.GA_DATECREATION.toLocaleString()  }</li>
                    <li><b>LibreARTE : </b>{article.GA2_LIBREARTE  }</li>
                </ul>
                <h3>Informations Tarif :</h3>
                <ul>
                    <li><b>Date du Tarif : </b>{ article.dernierTarif }</li>
                    <li><b>Description Tarif : </b>{ article.descriptionTarif }</li>
                    <li><b>Début Tarif : </b>{ article.GF_DATEDEBUT.toLocaleString() }</li>
                    <li><b>Fin Tarif : </b>{ article.GF_DATEFIN.toLocaleString() }</li>
                    <li><b>Type Tarif : </b>{ article.GFM_TYPETARIF }</li>
                    <li><b>Nature Tarif : </b>{ article.GFM_NATURETYPE }</li>
                    <li><b>PerTarif : </b>{ article.GFM_PERTARIF }</li>
                </ul>
            </div>

                <TailleTable tailles={taille} stock={stock}/>

            </section>
        </>
        )
}

export default FicheArticle