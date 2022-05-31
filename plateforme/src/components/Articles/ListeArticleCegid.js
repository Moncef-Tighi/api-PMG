import {useState} from "react";
import classes from './ListeArticle.module.css';
import { Link } from 'react-router-dom';
import { API_CEGID } from "../../index";

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

const emptyTable= {
    body: {
        articles : []
    },
    totalSize: 0,
    page : 1
}

const ListeArticleCegid = function(props) {

    const {url, handleChangePage,sortHandeler} = useTable(props.query);
    const {data: tableData, loading, error} = useGet(`${API_CEGID}/articles?${url}`, emptyTable);
    const article = tableData.body.articles
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
        { name: "Date Modification", sort: true , trueName : "GA_DATEMODIF"},
        { name: "Prix Initial", sort: true , trueName : "GA_PVTTC"} ,
    ]
    if (!props.modification) header.shift();

    const isSelected = (row) => {if (selection) return row.GA_CODEARTICLE in selection};
    if (selection) var taille = Object.keys(selection).length
    else var taille = 0
    return (

        <>
        {error ? <aside className={classes.error}>{error}</aside>: "" }
        {taille>0 && props.modification ? 
        <InsertionArticle   taille={taille} deselectionHadeler={deselectionHadeler} openModal={openModal}  />        
        : ""}
        {article.length===0 && !loading ?<div>Aucun article n'a été trouvé</div> : ""}
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
            {article.map((row) => {
                const isItemSelected= isSelected(row)
                return (
                <TableRow
                key={row.GA_CODEARTICLE}
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
                        'article': row.GA_CODEARTICLE,
                        }}
                    />
                </TableCell>            
                : ""}

                <TableCell component="th" scope="row">
                <Link to={`${row.GA_CODEARTICLE}`}>{row.GA_CODEARTICLE}</Link>
                </TableCell>
                <TableCell align="left">{row.GA_LIBELLE?.toLowerCase()}</TableCell>
                <TableCell align="left" >{capitalize(row.marque?.toLowerCase())}</TableCell>
                <TableCell align="left" >{row.gender || ""}</TableCell>
                <TableCell align="left" >{row.division || ""}</TableCell>
                <TableCell align="left" >{row.silhouette || ""}</TableCell>
                <TableCell align="center" >{row.stock}</TableCell>
                <TableCell align="center" >{dateToYMD(row.GA_DATEMODIF)}</TableCell>
                <TableCell align="center" >{numberWithDots(row.GA_PVTTC)}</TableCell>

            </TableRow>)})}
        </TableBody>
        </TableCustom>


        <ModalAddArticles open={open} onClose={closeModal} selection={selection} removeSelection={removeSelection}/>
        <Notification closeNotif={closeNotif} message={openWarn} status="warning"  />

        </>
    )
}


  export default ListeArticleCegid