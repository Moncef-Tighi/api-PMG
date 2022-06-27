import {TableBody, TableCell, TableRow,Checkbox} from '@mui/material'
import moment from 'moment';
import {useState} from "react";
import useGet from "../../hooks/useGet";
import useTable from "../../hooks/useTable";
import useSelection from '../../hooks/useSelection.js';
import { Link } from 'react-router-dom';
import { API_PLATEFORME } from "../../index";
import TableCustom from "../Table/TableCustom";
import TableHeadCustom from "../Table/TableHeadCustom";
import Notification from "../util/Util";
import classes from '../Articles/ListeArticle.module.css';

const emptyTable= {
    commandes : [],
    totalSize: 0,
    page : 1
}

const ListeCommande = function(props) {

    const {url, handleChangePage,sortHandeler} = useTable(props.query);
    const {data: commandes, loading, error} = useGet(`${API_PLATEFORME}/woocommerce/commandes?${url}`, emptyTable);

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
        { name: "Numero", sort: false},
        { name: "Status", sort: false},
        { name: "Prix Total", sort: false},
        { name: "Dernière modification", sort: false},
        { name: "Ville", sort: false},
        { name: "Prix Total", sort: false} ,
        { name: "Nom", sort: false},
        { name: "Prenom", sort: false},
        // { name: "Email", sort: false},
        { name: "Telephone", sort: false},

    ]
    if (!props.modification) header.shift();

    const isSelected = (row) => {if (selection) return row.numero_commande in selection};
    if (selection) var taille = Object.keys(selection).length
    else var taille = 0
    return (

        <>
        {error ? <aside className={classes.error}>{error}</aside>: "" }
        {taille>0 && props.modification ? 
        // <InsertionArticle   taille={taille} deselectionHadeler={deselectionHadeler} openModal={openModal}  /> 
        ""       
        : ""}
        {commandes.length===0 && !loading ?<div>Aucune commande n'a été trouvé</div> : ""}
        <TableCustom
            tableData={commandes.commandes}
            totalSize={commandes.totalSize}
            page={commandes.page}
            handleChangePage={handleChangePage}
            loading={loading}
            sx={{
            boxShadow: "#3c40434d 0px 1px 2px 0px,#3c404326 0px 1px 3px 1px"}}
        >
        <TableHeadCustom header={header} sortHandeler={sortHandeler}/>

        <TableBody>
            {commandes.commandes.map((row) => {
                const isItemSelected= isSelected(row)
                return (
                <TableRow
                key={row.numero_commande}
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
                        'commande': row.numero_commande,
                        }}
                    />
                </TableCell>            
                : ""}
                <TableCell component="th" scope="row">
                <Link to={`${row.numero_commande}`}>{row.numero_commande}</Link>
                </TableCell>
                <TableCell align="left">{row.status}</TableCell>
                <TableCell align="left" >{row.prix_total}</TableCell>
                <TableCell align="left" >{moment(Date.parse(row.date_modification)).fromNow()}</TableCell>
                <TableCell align="center" >{row.informations_client.ville}</TableCell>
                <TableCell align="left" >{row.prix_total}</TableCell>
                <TableCell align="left" >{row.informations_client.nom}</TableCell>
                <TableCell align="center" >{row.informations_client.prenom}</TableCell>
                {/* <TableCell align="center" >{row.informations_client.email}</TableCell> */}
                <TableCell align="center" >{row.informations_client.numero_telephone}</TableCell>

            </TableRow>)})}
        </TableBody>
        </TableCustom>


        <Notification closeNotif={closeNotif} message={openWarn} status="warning"  />

        </>
    )
}

export default ListeCommande;