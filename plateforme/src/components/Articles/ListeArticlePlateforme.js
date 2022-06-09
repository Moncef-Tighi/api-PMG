import {useContext, useState} from "react";
import classes from './ListeArticle.module.css';
import { Link } from 'react-router-dom';
import { API_PLATEFORME } from "../../index";
import {TableBody, TableCell, TableRow,Checkbox, MenuItem} from '@mui/material'
import TableCustom from "../Table/TableCustom";
import TableHeadCustom from "../Table/TableHeadCustom";
import Notification from "../util/Util";
import useGet from "../../hooks/useGet";
import useTable from "../../hooks/useTable";
import useSelection from '../../hooks/useSelection.js';
import { capitalize, numberWithDots } from '../util/stringFunctions.js';
import AuthContext from "../../state/AuthContext";
import moment from "moment";
import ModalUpdateArticle from "./ModalUpdateArticle";
import { Edit } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateArticleButton from "./UpdateArticleButton";
import { useLocation } from "react-router-dom";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";


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
    const location = useLocation().pathname
    const [open, setModal] = useState(false);
    const closeModal= ()=> setModal(()=>false);
    const openModal= ()=> setModal(()=> true);
    const [openWarn, setWarn] = useState("");
    const [openNotif, setNotif] = useState("");
    const {selection, selectionHandeler, deselectionHadeler, removeSelection}=useSelection(setWarn);

    const closeNotif = (event, reason) => {
        setWarn("");
        setNotif("");
    };

    const corbeille = async function(selection, status) {
        try {   
            await axios.patch(`${API_PLATEFORME}/articles/corbeille`, {
                code_article : Object.keys(selection),
                status,
            }, {
                headers : {
                    "Authorization" : `Bearer ${authContext.token}`
                }
            })
            setNotif(status ? "L'article a été rétablis" : "L'article a bien été mis à la corbeille" )
            deselectionHadeler();
            handleChangePage(null, 0);
        } catch(error) {
            console.log(error);
            setWarn("L'opération a échouée")
        }
    }
    const header = [
        { name: "", sort: false},
        { name: "Code Article", sort: false},
        { name: "Libelle", sort: false},
        { name: "Marque", sort: true, trueName : "marque"},
        { name: "Gender", sort: true, trueName : "gender"},
        { name: "Division", sort: true, trueName : "division"},
        { name: "Silhouette", sort: true, trueName : "silhouette"},
        { name: "Stock", sort: true, trueName : "stock"},
        { name: "Date d'ajout", sort: true , trueName : "date_ajout"},
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
            <UpdateArticleButton taille={taille} deselectionHadeler={deselectionHadeler} openModal={openModal}>
                {location==='/article/plateforme' ?
                <><MenuItem disableRipple onClick={openModal}>
                    <Edit/>
                    Modifier
                </MenuItem>
                <MenuItem disableRipple onClick={()=>corbeille(selection, false) }>
                    <DeleteIcon/>
                    Corbeille
                </MenuItem>        
                </> 
                :<><MenuItem disableRipple onClick={()=>corbeille(selection, true) }>
                    <SettingsBackupRestoreIcon/>
                    Rétablir
                </MenuItem>
                <MenuItem disableRipple>
                    <CloseIcon/>
                    Supprimer
                </MenuItem>        
                </>}
            </UpdateArticleButton>
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
                <TableCell align="center" >{moment(Date.parse(row.date_ajout)).fromNow()}</TableCell>
                <TableCell align="center" >{numberWithDots(row.prix_vente)}</TableCell>

            </TableRow>)})}
        </TableBody>
        </TableCustom>

        <ModalUpdateArticle open={open} onClose={closeModal} selection={selection} deselectionHadeler={deselectionHadeler} handleChangePage={handleChangePage}/>
        <Notification closeNotif={closeNotif} message={openWarn} status="warning"  />
        <Notification closeNotif={closeNotif} message={openNotif} status="success"  />

        </>
    )
}


  export default ListeArticlePlateforme