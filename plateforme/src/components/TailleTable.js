import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const DepotTable = function ({taille, stock}) {
    console.log(taille);
    console.log(stock);
    const find = [];
    for (const depot of Object.keys(stock)) {
        const current = stock[depot].filter(depot => depot.dimension===taille.dimension)
        find[depot] = {dimension : current[0]?.dimension, stock : current[0]?.stockNet};
    }
    console.log(find)
    const [open, setOpen] = React.useState(false);

    return (

        <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
            {taille.GA_CODEBARRE}
            </TableCell>
            <TableCell align="right">{taille.dimension}</TableCell>
            <TableCell align="right">{taille.stockNet}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                    <TableRow>
                        <TableCell>Depot</TableCell>
                        <TableCell align="right">Stock</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                     {Object.keys(find).map( depot=> {
                         console.log(depot);
                         console.log(find[depot]);
                        return(<TableRow key={depot}>
                        <TableCell component="th" scope="row">
                            {depot}
                        </TableCell>
                        <TableCell align="right">{find[depot].stock}</TableCell>
                        </TableRow>)
                     }
                    )} 
                    </TableBody>
                </Table>
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
        </>
    )
}


const TailleTable = function({tailles, stock}) {

    return ( <>
        <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
        <TableHead>
            <TableRow>
            <TableCell />
                <TableCell>Code Barre</TableCell>
                <TableCell align="right">Dimension</TableCell>
                <TableCell align="right">Stock</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {tailles.map((taille) => (
            <DepotTable key={taille.GA_CODEBARRE} taille={taille} stock={stock} />
            ))}
        </TableBody>
        </Table>
        </TableContainer>
        </>
    )
}

export default TailleTable;

