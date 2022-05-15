import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DepotTable } from './DepotTable';


const TailleTable = function({tailles, stock}) {

    return ( <>
        <TableContainer component={Paper} sx={{width: "fit-content",marginTop: "30px", fontSize: "2em"}}>
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

