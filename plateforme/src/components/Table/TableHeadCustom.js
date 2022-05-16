import { TableSortLabel,TableCell, TableHead, TableRow, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const TableHeadCustom = function(props) {
    
    const [searchParams] =  useSearchParams({});

    const sort = searchParams.get('sort');
    return (
        <TableHead>
        <TableRow>
            {props.header.map(head => {
                if (!head.sort) {
                    return <TableCell align="center">{head.name}</TableCell>
                }
                return (
                    <TableCell  align="center"
                        sortDirection={sort?.startsWith("+") ? "asc" : "desc"}>
                        <TableSortLabel
                            active={sort?.slice(1)===head.trueName}
                            direction={sort?.startsWith("+") ? "asc" : "desc"}
                            onClick={(event)=> props.sortHandeler(event, head.trueName)}
                            >
                            {head.name}
                        </TableSortLabel>
                    </TableCell>
                )
            })}
        </TableRow>
    </TableHead>
    )
}

export default TableHeadCustom