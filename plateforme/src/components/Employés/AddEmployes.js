import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import classes from './AddEmployes.module.Css'
const AddEmployes = function({open, onClose}) {

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.modal}>
                <form>
                    
                </form>
            </Box>
        </Modal>
        )
}

export default AddEmployes