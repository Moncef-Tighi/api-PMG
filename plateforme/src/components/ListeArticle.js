import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TableHead } from '@mui/material';

import { useEffect, useState } from "react";
import axios from 'axios';

const query= async function(params="", page=1) {
    try {
        console.log(`http://localhost:5000/api/v1/articles?pagesize=50&page=${page}&${params}`)
        const response = await axios.get(`http://localhost:5000/api/v1/articles?pagesize=50&page=${page}&${params}`)
        return response.data
    }
    catch(error) {
        console.log(error);
    }
}


function dateToYMD(dateString) {
    const date = new Date(dateString);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y ;
}

function TablePaginationActions(props) {
    const theme = useTheme();

    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page);
    };
  
    const handleNextButtonClick = (event) => {
        console.log(page);
      onPageChange(event, page + 2);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }






const ListeArticle = function(props) {
    const [tableData, updateTable] = useState({body : {articles : []}})
    const [page, setPage] = useState(1);

    useEffect(()=> {
        const fetch = async () => {
            const data = await query(props.query, page)
            updateTable(data);
        }
        fetch();
    }, [page]);
    console.log(tableData);
    const article = tableData.body.articles
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    


    
    return (
        <TableContainer component={Paper} sx={{marginTop: "30px", marginBottom: "30px"}} className="shadow">
        <Table stickyHeader size="small" className="shadow">
        <TableHead>
            <TableRow>
            <TableCell>Code Article</TableCell>
            <TableCell align="right">Marque</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Libelle</TableCell>
            <TableCell align="right">Prix initial</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell align="right">Date modification</TableCell>
            </TableRow>
        </TableHead>
        <TableBody  className="shadow">
            {article.map((row) => (
            <TableRow
                key={row.GA_CODEARTICLE}
            >
                <TableCell component="th" scope="row"  sx={{maxWidth: "25px"}}>
                {row.GA_CODEARTICLE}
                </TableCell>
                <TableCell align="right" sx={{maxWidth: "50px"}}>{row.marque}</TableCell>
                <TableCell align="right" sx={{maxWidth: "50px"}}>{row.type}</TableCell>
                <TableCell align="right" sx={{maxWidth: "100px"}}>{row.GA_LIBELLE}</TableCell>
                <TableCell align="right" sx={{maxWidth: "25px"}}>{row.GA_PVTTC}</TableCell>
                <TableCell align="right" sx={{maxWidth: "25px"}}>{row.stock}</TableCell>
                <TableCell align="right" sx={{maxWidth: "40px"}}>{dateToYMD(row.GA_DATEMODIF)}</TableCell>

            </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={6}
              count={tableData.totalSize}
              page={tableData.page - 1}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
              rowsPerPage={50}
            />
          </TableRow>
        </TableFooter>
        </Table>
        </TableContainer>
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