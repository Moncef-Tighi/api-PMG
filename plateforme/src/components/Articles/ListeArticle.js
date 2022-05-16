import { useEffect, useState } from "react";


import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TableSortLabel } from '@mui/material';
import { TableHead } from '@mui/material';

import { useSearchParams } from 'react-router-dom';
import classes from './ListeArticle.module.css';
import { Link } from 'react-router-dom';

import axios from 'axios';
import TableCustom from "../Table/TableCustom";
import { render } from "react-dom";


import useGet from "../../hooks/useGet";
import { API_CEGID } from "../../index";
import TableHeadCustom from "../Table/TableHeadCustom";

function dateToYMD(dateString) {
    const date = new Date(dateString);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y ;
}

/*
  SORTING
*/

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
function getComparator(order, orderBy) {
return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

  

const emptyTable= {
    body: {
        articles : []
    },
    totalSize: 0,
    page : 1
}

const readURL = function(searchParams) {
    let output="";
    for (const [key, value] of searchParams.entries()) {
        output+=`&${key}=${value}`
    }
    return output;
}

const readURLObject = function(searchParams) {
    let output={};
    for (const [key, value] of searchParams.entries()) {
        output[key]=value
    }
    return output;
}

const ListeArticle = function(props) {

    const [searchParams, setSearchParams] = useSearchParams({});
    const [url, setUrl] = useState(readURL(searchParams));
    const {data: tableData, loading, error} = useGet(`${API_CEGID}/articles?${url}`, emptyTable);
    const article = tableData.body.articles

    useEffect( ()=> {
        setUrl(() => readURL(searchParams))
    }, [searchParams] )
    
    useEffect( ()=> {
        const key = props.query.key;
        let param={}
        param[key] = props.query.value
        if (props.query.value) setSearchParams(param)
    }, [props.query])

    const handleChangePage = async (event, newPage) => {
        let param=readURLObject(searchParams);
        param["page"] = newPage;
        setSearchParams(param);
    };

    const sortHandeler = function(event, key) {
        let param=readURLObject(searchParams);
        let order = "-"
        if (param["sort"]===`-${key}`) order ="+"
        param["sort"] = `${order}${key}`;
        setSearchParams(param);
    }

    const header = [
        { name: "Code Article", sort: false},
        { name: "Marque", sort: false},
        { name: "Type", sort: false},
        { name: "Libelle", sort: false},
        { name: "Stock", sort: true, trueName : "stock"},
        { name: "Date Modification", sort: true , trueName : "GA_DATEMODIF"},
        { name: "Prix Initial", sort: true , trueName : "GA_PVTTC"} ,
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
            {article.map((row) => (
            <TableRow
                key={row.GA_CODEARTICLE}
            >
                <TableCell component="th" scope="row" sx={{maxWidth: "25px"}}>
                <Link to={`${row.GA_CODEARTICLE}`}>{row.GA_CODEARTICLE}</Link>
                </TableCell>
                <TableCell align="right" sx={{maxWidth: "50px"}}>{row.marque?.toLowerCase()}</TableCell>
                <TableCell align="right" sx={{maxWidth: "50px"}}>{row.type?.toLowerCase()}</TableCell>
                <TableCell align="right" sx={{maxWidth: "100px"}}>{row.GA_LIBELLE?.toLowerCase()}</TableCell>
                <TableCell align="right" sx={{maxWidth: "25px"}}>{row.stock}</TableCell>
                <TableCell align="right" sx={{maxWidth: "40px"}}>{dateToYMD(row.GA_DATEMODIF)}</TableCell>
                <TableCell align="right" sx={{maxWidth: "25px"}}>{row.GA_PVTTC}</TableCell>

            </TableRow>
            ))}
        </TableBody>
        </TableCustom>
        </>
    )
}

export default ListeArticle