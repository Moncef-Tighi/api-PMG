import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import classes from './ListeArticle.module.css';
import { Link } from 'react-router-dom';
import TableCustom from "../Table/TableCustom";
import useGet from "../../hooks/useGet";
import { API_CEGID } from "../../index";
import TableHeadCustom from "../Table/TableHeadCustom";
import useTable from "../../hooks/useTable";

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });

function numberWithDots(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function dateToYMD(dateString) {
    const date = new Date(dateString);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y ;
}
const emptyTable= {
    body: {
        articles : []
    },
    totalSize: 0,
    page : 1
}

const ListeArticle = function(props) {

    const {url, handleChangePage,sortHandeler} = useTable(props.query);
    const {data: tableData, loading, error} = useGet(`${API_CEGID}/articles?${url}`, emptyTable);
    const article = tableData.body.articles



    const header = [
        { name: "Code Article", sort: false},
        { name: "Libelle", sort: false},
        { name: "Marque", sort: true, trueName : "marque"},
        { name: "Division", sort: true, trueName : "division"},
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
                <TableCell align="left" sx={{maxWidth: "100px"}}>{row.GA_LIBELLE?.toLowerCase()}</TableCell>
                <TableCell align="left" sx={{maxWidth: "50px"}}>{row.marque?.toLowerCase().capitalize()}</TableCell>
                <TableCell align="left" sx={{maxWidth: "50px"}}>{row.division}</TableCell>
                <TableCell align="center" sx={{maxWidth: "25px"}}>{row.stock}</TableCell>
                <TableCell align="center" sx={{maxWidth: "40px"}}>{dateToYMD(row.GA_DATEMODIF)}</TableCell>
                <TableCell align="center" sx={{maxWidth: "25px"}}>{numberWithDots(row.GA_PVTTC)}</TableCell>

            </TableRow>
            ))}
        </TableBody>
        </TableCustom>
        </>
    )
}

export default ListeArticle