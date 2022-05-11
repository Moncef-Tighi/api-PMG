import LogoutIcon from '@mui/icons-material/Logout';
import classes from './Layout.module.css';

const Layout = function() {

    return (
        <header>
            <div>
                <img className={classes.icon} src='pmg-icon.svg'></img>
                <div>
                    <h2>Moncef Tighiouart</h2>
                    <h4>WebDev</h4>
                </div>
            </div>
            <LogoutIcon/>
        </header>
    )
}

export default Layout