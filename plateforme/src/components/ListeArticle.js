import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableSortLabel } from '@mui/material';
import classes from './ListeArticle.module.css';
import { useSearchParams } from 'react-router-dom';
import { TableHead } from '@mui/material';

import { useEffect, useState } from "react";
import axios from 'axios';
import { TablePaginationActions } from './TablePaginationActions';

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

  



const ListeArticle = function(props) {
    const [searchParams, setSearchParams] = useSearchParams({});
    
    const [tableData, updateTable] = useState({body : {articles : []}, totalSize: 0, page : 1})
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);



    const query= async function(params, page=1) {
        console.log(`http://localhost:5000/api/v1/articles?pagesize=50&page=${page}${params}`)
        const response = await axios.get(`http://localhost:5000/api/v1/articles?pagesize=50&page=${page}&${params}`)
        return response.data
    }
    

    useEffect(()=> {
        const fetch = async () => {
            try {
                const data = await query(props.query, page)
                updateTable(data);
                setError(null);
            } catch(error) {
                console.log(error);
                updateTable({
                    body: {
                        articles : []
                    },
                    totalSize: 0,
                    page : 1
                })
                if (error.code==="ERR_NETWORK") return setError(`Impossible de se connecter au serveur`);
                if (error.code==="ERR_BAD_RESPONSE") return setError(`La base de donnée de CEGID mets trop de temps à répondre`);
                setError(`Erreur : ${error.message}`);
            }
        }
        fetch();
    }, [page, props.query]);
    console.log(tableData);
    const article = tableData.body.articles
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    return (
        <>
        {error ? <aside className={classes.error}>{error}</aside>: "" }
        <TableContainer component={Paper} sx={{marginTop: "30px", marginBottom: "30px"}} className="shadow">
        <Table stickyHeader size="small" className="shadow">
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
                {row.GA_CODEARTICLE}
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
        <TableFooter>
          <TableRow>
            <TablePagination
              count={tableData.totalSize}
              page={tableData.page - 1}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
              rowsPerPage={50}
              labelRowsPerPage=""
              rowsPerPageOptions={-1}
            />
          </TableRow>
        </TableFooter>
        </Table>
        </TableContainer>
        </>
    )
}

export default ListeArticle



// console.log(props);
// const columns = [
//     { field: 'GA_CODEARTICLE', headerName: 'Code Article', width: 50 },
//     { field: 'marque', headerName: 'Marque', width: 50 },
//     { field: 'type', headerName: 'Type', width: 50 },
//     { field: 'GA_LIBELLE', headerName: 'Libelle', width: 100 },
//     { field: 'GA_PVTTC', headerName: 'Prix initial', width: 25 },
//     { field: 'stock', headerName: 'Stock', width: 25 },
//     { field: 'GA_DATEMODIF', headerName: 'Date Modificaiton', width: 50},
//   ];
  
// console.log(props);
// const article = props.data.body.articles
// return(
//     <DataGrid
//     rows={article}
//     columns={columns}
//     pageSize={100}
//   />
//   )