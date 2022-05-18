import { useEffect, useState } from "react";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSearchParams } from 'react-router-dom';
import classes from './ListeArticle.module.css';
import { Link } from 'react-router-dom';
import TableCustom from "../Table/TableCustom";
import useGet from "../../hooks/useGet";
import { API_PLATEFORME } from "../../index";
import TableHeadCustom from "../Table/TableHeadCustom";
import useTable from "../../hooks/useTable";

const emptyTable= {
    body: [],
    totalSize: 0,
    page : 1
}

const ListeEmploye = function(props) {

    const [searchParams, setSearchParams] = useSearchParams({});
    const {readURL, handleChangePage,sortHandeler} = useTable();
    const [url, setUrl] = useState(readURL(searchParams));
    const {data: tableData, loading, error} = useGet(`${API_PLATEFORME}/employes?${url}`, emptyTable);
    const employes = tableData.body

    useEffect( ()=> {
        setUrl(() => readURL(searchParams))
    }, [searchParams] )
    
    // useEffect( ()=> {
    //     const key = props.query.key;
    //     let param={}
    //     param[key] = props.query.value
    //     if (props.query.value) setSearchParams(param)
    // }, [props.query])

    const header = [
        { name: "id_employe", sort: false},
        { name: "E-Mail", sort: false},
        { name: "Nom", sort: true, trueName : "Nom"},
        { name: "Prenom", sort: true, trueName : "prenom"},
        { name: "Poste", sort: true, trueName : "poste"},
        { name: "Permissions"},
        { name: "Activé"} ,
    ]
    
    return (
        <>
        {error ? <aside className={classes.error}>{error}</aside>: "" }
        <TableCustom
            tableData={tableData.body.articles}
            totalSize={tableData.totalSize}
            page={tableData.page}
            handleChangePage={handleChangePage}
            loading={loading}
        >
        <TableHeadCustom header={header} sortHandeler={sortHandeler}/>

        <TableBody>
            {employes.map((row) => (
            <TableRow
                key={row.id_employe}
            >
                <TableCell component="th" scope="row" sx={{maxWidth: "25px"}}>
                <Link to={`${row.id_employe}`}>{row.id_employe}</Link>
                </TableCell>
                <TableCell align="left" sx={{maxWidth: "100px"}}>{row.email}</TableCell>
                <TableCell align="left" sx={{maxWidth: "50px"}}>{row.nom}</TableCell>
                <TableCell align="left" sx={{maxWidth: "50px"}}>{row.prenom}</TableCell>
                <TableCell align="center" sx={{maxWidth: "25px"}}>{row.poste}</TableCell>
                <TableCell align="center" sx={{maxWidth: "40px"}}>{row.permissions?.toString()}</TableCell>
                <TableCell align="center" sx={{maxWidth: "25px"}}>{row.active ? "Oui" : "Non" }</TableCell>

            </TableRow>
            ))}
        </TableBody>
        </TableCustom>
        </>
    )
}

export default ListeEmploye