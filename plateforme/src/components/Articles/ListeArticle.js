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

const ListeArticle = function(props) {
    //const [page, setPage] = useState(1);
    const readURL = function() {
        let output="";
        for (const [key, value] of searchParams.entries()) {
            output+=`&${key}=${value}`
        }
        return `${API_CEGID}/articles?${output}`;
    }
    let [searchParams, setSearchParams] = useSearchParams({});
    let [url, setUrl] = useState(readURL());
    const {data: tableData, loading, error} = useGet(url, emptyTable);
    const article = tableData.body.articles

    useEffect( ()=> {
        setUrl(() => readURL())
    }, [searchParams] )
    
    const handleChangePage = async (event, newPage) => {
        const page = {page : newPage};
        setSearchParams({...page});
      };
    
    return (
        <>
        {error ? <aside className={classes.error}>{error}</aside>: "" }
        <TableCustom
            tableData={tableData.body.articles}
            totalSize={tableData.totalSize}
            page={tableData.page}
            handleChangePage={handleChangePage}
        >
        <TableHead>
            <TableRow>
            <TableCell color='primary'>Code Article</TableCell>
            <TableCell align="right">Marque</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Libelle</TableCell>
            <TableCell align="right" sortDirection={props.sortBy==='stock' ? props.orderBy : "asc"}>
                Stock
                <TableSortLabel
                    active={props.sortBy === 'stock'}
                    direction={props.sortBy === 'stock' ? props.orderBy : 'asc'}
                    onClick={(event)=> props.SortHandler(event, 'stock')}
                    >
                    {props.sortBy === 'stock' ? (
                        <Box component="span" sx={ props.sortBy === 'stock' ? {display : "none"}: {}}>
                        {props.orderBy === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                    ) : null}
                </TableSortLabel>

            </TableCell>
            <TableCell align="right" sortDirection={props.sortBy==='GA_DATEMODIF' ? props.orderBy : "asc"}>
                Date modification
                <TableSortLabel
                    active={props.sortBy === 'GA_DATEMODIF'}
                    direction={props.sortBy === 'GA_DATEMODIF' ? props.orderBy : 'asc'}
                    onClick={(event)=> props.SortHandler(event, 'GA_DATEMODIF')}
                    >
                    {props.sortBy === 'GA_DATEMODIF' ? (
                        <Box component="span" sx={ props.sortBy === 'GA_DATEMODIF' ? {display : "none"}: {}}>
                        {props.orderBy === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                    ) : null}
                </TableSortLabel>
    
            </TableCell>
            <TableCell align="right" sortDirection={props.sortBy==='GA_PVTTC' ? props.orderBy : "asc"}>
                Prix initial
                <TableSortLabel
                    active={props.sortBy === 'GA_PVTTC'}
                    direction={props.sortBy === 'GA_PVTTC' ? props.orderBy : 'asc'}
                    onClick={(event)=> props.SortHandler(event, 'GA_PVTTC')}
                    >
                    {props.sortBy === 'GA_PVTTC' ? (
                        <Box component="span" sx={ props.sortBy === 'GA_PVTTC' ? {display : "none"}: {}}>
                        {props.orderBy === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                    ) : null}
                </TableSortLabel>

            </TableCell>

            </TableRow>
        </TableHead>
        <TableBody>
            {article.map((row) => (
            <TableRow
                key={row.GA_CODEARTICLE}
            >
                <TableCell component="th" scope="row" sx={{maxWidth: "25px"}}>
                <Link to={`${row.GA_CODEARTICLE}`}>{row.GA_CODEARTICLE}</Link>
                </TableCell>
                <TableCell align="right" sx={{maxWidth: "50px"}}>{row.marque.toLowerCase()}</TableCell>
                <TableCell align="right" sx={{maxWidth: "50px"}}>{row.type.toLowerCase()}</TableCell>
                <TableCell align="right" sx={{maxWidth: "100px"}}>{row.GA_LIBELLE.toLowerCase()}</TableCell>
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