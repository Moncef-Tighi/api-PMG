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
import {Checkbox, Button} from '@mui/material';
import {useState} from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ModalAddArticles from "./ModalAddArticles";


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
    const [selection, setSelection] = useState({});
    const article = tableData.body.articles
    const [open, setModal] = useState(false);
    const closeModal= ()=> setModal(()=>false);
    const openModal= ()=> setModal(()=> true);

    const selectionHandeler = function(event, article) {
        const code_article= article.GA_CODEARTICLE;

        if (!event.target.checked) {
            const newSelection = {...selection};
            delete newSelection[code_article]
            return setSelection(newSelection);
        }
        let newArticle= {}
        newArticle[code_article]= article;

        setSelection({
            ...selection,
            ...newArticle
        })
        
    }

    const deselectionHadeler= function() {
        setSelection( ()=> {})
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
        { name: "Date Modification", sort: true , trueName : "GA_DATEMODIF"},
        { name: "Prix Initial", sort: true , trueName : "GA_PVTTC"} ,
    ]

    const isSelected = (row) => {if (selection) return row.GA_CODEARTICLE in selection};
    
    if (selection) var taille = Object.keys(selection).length
    else var taille = 0
    return (

        <>
        {error ? <aside className={classes.error}>{error}</aside>: "" }
        {taille>0 ? 
            <aside className={classes.aside}>
                <p>{taille} articles sélectionnés</p>
                <div>    
                    <Button color='primary'sx={{maginRight: "25px"}} onClick={deselectionHadeler}>
                        Tout Déselectionner
                    </Button>    
                    <Button variant="contained" size='small'
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={openModal}
                    >
                        Insérer
                    </Button>
                </div>
            </aside>
        : ""}

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
                <TableCell padding="checkbox" >
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => selectionHandeler(event, row) || false}
                        inputProps={{
                        'article': row.GA_CODEARTICLE,
                        }}
                    />
                </TableCell>

                <TableCell component="th" scope="row">
                <Link to={`${row.GA_CODEARTICLE}`}>{row.GA_CODEARTICLE}</Link>
                </TableCell>
                <TableCell align="left">{row.GA_LIBELLE?.toLowerCase()}</TableCell>
                <TableCell align="left" >{row.marque?.toLowerCase().capitalize()}</TableCell>
                <TableCell align="left" >{row.gender || ""}</TableCell>
                <TableCell align="left" >{row.division || ""}</TableCell>
                <TableCell align="left" >{row.silhouette || ""}</TableCell>
                <TableCell align="center" >{row.stock}</TableCell>
                <TableCell align="center" >{dateToYMD(row.GA_DATEMODIF)}</TableCell>
                <TableCell align="center" >{numberWithDots(row.GA_PVTTC)}</TableCell>

            </TableRow>
            )})}
        </TableBody>
        </TableCustom>


        <ModalAddArticles open={open} onClose={closeModal} selection={selection}/>


        </>
    )
}

export default ListeArticle