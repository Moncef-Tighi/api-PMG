import { Modal, Box } from "@mui/material"
import { useEffect } from "react";
import classes from './ModalAddArticles.module.css';
import axios from "axios";
import { API_CEGID } from "../..";

const findTailles = async function(articles) {
    for(const code_article of Object.keys(articles)) {
        const article = await axios.get(`${API_CEGID}/articles/${code_article}`);
        articles[code_article].taille=article.data.body.taille;
    }
    return articles

}

const ModalAddArticles = function({open, onClose, selection}) {

    useEffect(()=> {
        const neededData= async () => {
            if(open===true) {
                const articles = await findTailles(selection);

            }
        }
        neededData();
    }, [open])

    return (
        <>
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box className={classes.modal}>

            </Box>
        </Modal>

        </>
    )

}

export default ModalAddArticles