import { TableSortLabel,TableCell, TableHead, TableRow } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const TableHeadCustom = function(props) {
    
    const [searchParams] =  useSearchParams({});

    const sort = searchParams.get('sort');
    console.log(sort);
    return (
        <TableHead>
        <TableRow>
            {props.header.map(head => {
                if (!head.sort) {
                    return <TableCell>{head.name}</TableCell>
                }
                return (
                    <TableCell 
                        sortDirection={sort.startsWith("+") ? "asc" : "desc"}>
                        {head.name}
                        <TableSortLabel
                            active={sort.substring(1)===head.name}
                            direction={sort.startsWith("+") ? "asc" : "desc"}
                            onClick={(event)=> props.sortHandeler(event, head.trueName)}
                        />
                    </TableCell>
                )
            })}
        </TableRow>
    </TableHead>
    )
}

export default TableHeadCustom