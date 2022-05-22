import { Modal, Box } from "@mui/material"
import { useEffect, useState } from "react";
import classes from './ModalAddArticles.module.css';
import axios from "axios";
import { API_CEGID } from "../..";
import TableCustom from "../Table/TableCustom";
import TableHeadCustom from "../Table/TableHeadCustom";
import useTable from "../../hooks/useTable";

const findTailles = async function(articles) {
    for(const code_article of Object.keys(articles)) {
        const article = await axios.get(`${API_CEGID}/articles/${code_article}`);
        articles[code_article].taille=article.data.body.taille;
    }
    console.log(articles);
    return articles

}

const header = [
    { name: "", sort: false},
    { name: "Code Article", sort: false},
    { name: "Libelle", sort: false},
    { name: "Marque", sort: false},
    { name: "Prix Initial", sort: false},
    { name: "Prix de vente", sort: false},
    { name: "Stock", sort: false},
    { name: "Retirer", sort: false} ,
]


const ModalAddArticles = function({open, onClose, selection}) {
    const [articles, setArticles] = useState(selection);
    const [loading, setLoading] = useState(false);
    const {handleChangePage,sortHandeler} = useTable();

    useEffect(()=> {
        const neededData= async () => {
            console.log(open);
            if(open===true) {
                setLoading(true);
                const data = await findTailles(selection);
                setArticles(()=> data);
                setLoading(false);
            }
        }
        neededData();
    }, [open])

    console.log(articles);

    return (
        <>
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box className={classes.modal}>
                {(open === true && articles) ? <>
                    <TableCustom
                        tableData={articles}
                        totalSize={Object.keys(articles).length}
                        page={1}
                        handleChangePage={handleChangePage}
                        loading={loading}
                    >
              <TableHeadCustom header={header} sortHandeler={sortHandeler}/>

                        
                    </TableCustom>
                
                </> : ""}
            </Box>
        </Modal>

        </>
    )

}

export default ModalAddArticles