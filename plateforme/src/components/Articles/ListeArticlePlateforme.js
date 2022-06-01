import {useContext, useState} from "react";
import classes from './ListeArticle.module.css';
import { Link } from 'react-router-dom';
import { API_PLATEFORME } from "../../index";

import {TableBody, TableCell, TableRow,Checkbox} from '@mui/material'

import TableCustom from "../Table/TableCustom";
import TableHeadCustom from "../Table/TableHeadCustom";
import ModalAddArticles from "./ModalAddArticles";
import InsertionArticle from "./InsertionArticle.js"

import Notification from "../util/Util";
import useGet from "../../hooks/useGet";
import useTable from "../../hooks/useTable";
import useSelection from '../../hooks/useSelection.js';

import { capitalize, dateToYMD, numberWithDots } from '../util/stringFunctions.js';
import AuthContext from "../../state/AuthContext";

const emptyTable= {
    body: [],
    totalSize: 0,
    page : 1
}

const ListeArticlePlateforme = function(props) {

    const {url, handleChangePage,sortHandeler} = useTable(props.query);
    const authContext = useContext(AuthContext);
    const active= props.activé ? "&activé=false" : ""
    const {data: tableData, loading, error} = useGet(`${API_PLATEFORME}/articles/liste?${url}${active}`, emptyTable, authContext.token);
    const article = tableData.body
    const [open, setModal] = useState(false);
    const closeModal= ()=> setModal(()=>false);
    const openModal= ()=> setModal(()=> true);
    const [openWarn, setWarn] = useState("");
    const {selection, selectionHandeler, deselectionHadeler, removeSelection}=useSelection(setWarn);

    const closeNotif = (event, reason) => {
        setWarn("");
    };

    const header = [
        { name: "", sort: false},
        { name: "Code Article", sort: false},
        { name: "Libelle", sort: false},
        { name: "Marque", sort: true, trueName : "marque"},
        { name: "Gender", sort: true, trueName : "gender"},
        { name: "Division", sort: true, trueName : "division"},
        { name: "Silhouette", sort: true, trueName : "silhouette"},
        { name: "Stock", sort: true, trueName : "stock"},
        { name: "Date Modification", sort: true , trueName : "date_modification"},
        { name: "Prix vente", sort: true , trueName : "prix_vente"} ,
    ]
    if (!props.modification) header.shift();

    const isSelected = (row) => {if (selection) return row.code_article in selection};
    if (selection) var taille = Object.keys(selection).length
    else var taille = 0
    return (

        <>
        {error ? <aside className={classes.error}>{error}</aside>: "" }
        {taille>0 && props.modification ? 
        <InsertionArticle   taille={taille} deselectionHadeler={deselectionHadeler} openModal={openModal}  />        
        : ""}
        {article.length===0 && !loading ? <div>Aucun article n'a été trouvé</div> : ""}

        <TableCustom
            tableData={tableData.body.articles}
            totalSize={tableData.totalSize}
            page={tableData.page}
            handleChangePage={handleChangePage}
            loading={loading}
            sx={{
            boxShadow: "#3c40434d 0px 1px 2px 0px,#3c404326 0px 1px 3px 1px"}}
        >
        <TableHeadCustom header={header} sortHandeler={sortHandeler}/>

        <TableBody>
            {article?.map((row) => {
                const isItemSelected= isSelected(row)
                return (
                <TableRow
                key={row.code_article}
                aria-checked={isItemSelected}
                selected={isItemSelected}
                >
                {props.modification ? 
                    <TableCell padding="checkbox" >
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => selectionHandeler(event, row)}
                        inputProps={{
                        'article': row.code_article,
                        }}
                    />
                </TableCell>            
                : ""}

                <TableCell component="th" scope="row">
                <Link to={`/article/${row.code_article}`}>{row.code_article}</Link>
                </TableCell>
                <TableCell align="left">{row.libelle?.toLowerCase()}</TableCell>
                <TableCell align="left" >{capitalize(row.marque?.toLowerCase())}</TableCell>
                <TableCell align="left" >{row.gender || ""}</TableCell>
                <TableCell align="left" >{row.division || ""}</TableCell>
                <TableCell align="left" >{row.silhouette || ""}</TableCell>
                <TableCell align="center" >{row.stock}</TableCell>
                <TableCell align="center" >{dateToYMD(row.date_modification)}</TableCell>
                <TableCell align="center" >{numberWithDots(row.prix_vente)}</TableCell>

            </TableRow>)})}
        </TableBody>
        </TableCustom>


        <ModalAddArticles open={open} onClose={closeModal} selection={selection} removeSelection={removeSelection}/>
        <Notification closeNotif={closeNotif} message={openWarn} status="warning"  />

        </>
    )
}


  export default ListeArticlePlateforme