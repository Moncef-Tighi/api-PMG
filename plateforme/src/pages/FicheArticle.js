import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import classes from './FicheArticle.module.css';

const query = async function(code_article) {

    const article = await axios.get(`http://localhost:5000/api/v1/articles/${code_article}`);
    const detail_stock = await axios.get(article.data.details_stock);
    console.log(detail_stock);
    return {article : article.data.body, stock : detail_stock.data.body}
}

const emptyArticle = {
    article: {     
        info: {        
        "GA2_LIBREARTE": "SP17",
        "GA_DATECREATION": "2017-04-02T09:06:10.000Z",
        "GA_LIBELLE": "Arizona BF SFB Desert Soil Black",
        "GFM_NATURETYPE": "VTE",
        "GFM_PERTARIF": "PRX",
        "GFM_TYPETARIF": "RETAIL",
        "GF_DATEDEBUT": "2017-03-01T00:00:00.000Z",
        "GF_DATEFIN": "2021-12-31T00:00:00.000Z",
        "dernierTarif": "2021-02-01T20:20:20.000Z",
        "descriptionTarif": "PRIX DE VENTE DETAILS-TARIF FIX",
        marque: "BIRKENSTOCK",
        prixActuel: 3300,
        prixInitial: 7400,
        type: "FOOTWEAR"
        },
        taille : []
    }
}

const FicheArticle = function() {
    const {code_article} = useParams();
    const [error, setError] = useState("loading");
    const [article, setArticle] =  useState(emptyArticle);
    console.log(article);
    useEffect(()=> {
        const fetch = async () => {
            try {
                const data = await query(code_article)
                setArticle(data);
                setError(null);
            } catch(error) {
                console.log(error);
                setArticle()
                setError(error)
                if (error.code==="ERR_NETWORK") return setError(`Impossible de se connecter au serveur`);
                if (error.code==="ERR_BAD_RESPONSE") return setError(`La base de donnée de CEGID mets trop de temps à répondre`);
                setError(`Erreur : ${error.message}`);
            }
        }
        fetch();
    }, [code_article]);


    return (
        <>
            {error === "loading" ? <div>Loading...</div> : "" }
            <section>Fiche Article</section>
        </>
        )
}

export default FicheArticle