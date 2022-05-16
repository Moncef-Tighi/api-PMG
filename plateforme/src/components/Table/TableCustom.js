import { Table, TableFooter, TableRow, Skeleton, TableContainer, Paper } from "@mui/material"
import { TablePagination } from "@mui/material"
import { TablePaginationActions } from "./TablePaginationActions"

const TableCustom = function(props) {


    return (
        <>        
            {!props.loading ? (<TableContainer component={Paper} sx={{marginTop: "30px", marginBottom: "30px"}} className="shadow">
            <Table stickyHeader size="small" className="shadow">


                {props.children}
            
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        count={props.totalSize}
                        page={props.page - 1}
                        onPageChange={props.handleChangePage}
                        ActionsComponent={TablePaginationActions}
                        rowsPerPage={50}
                        labelRowsPerPage=""
                        rowsPerPageOptions={-1}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
            </TableContainer>
            ) : (<>
                <Skeleton animation='pulse' width="100%" height={75} sx={{marginTop : '15px', bgcolor: 'grey.200' }} />
                <Skeleton variant="rectangular"  animation="wave" width="100%" height="75vh" sx={{ bgcolor: 'grey.200' }} /> 
                </>)
                } 

        </>

    )

}

export default TableCustom