import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import axios from 'axios';

const query= async function(params="") {
    try {
        const response = await axios.get(`http://localhost:5000/api/v1/articles?${params}`)
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


const ListeArticle = function(props) {
    const [tableData, updateTable] = useState({body : {articles : []}})

    useEffect(()=> {
        const fetch = async () => {
            const data = await query(props.query)
            updateTable(data);
        }
        fetch();
    }, []);

    const article = tableData.body.articles
    
    return (
        <TableContainer component={Paper} sx={{marginTop: "20px"}} className="shadow">
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