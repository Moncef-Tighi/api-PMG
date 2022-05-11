import LogoutIcon from '@mui/icons-material/Logout';
import classes from './Layout.module.css';
import icon from './pmg-icon.svg'
const Header = function() {

    return (
        <header>
            <div>
                <img className={classes.icon} src={icon}></img>
                <div className={classes.name}>
                    <h2>Moncef Tighiouart</h2>
                    <h4>WebDev</h4>
                </div>
            </div>
            <LogoutIcon/>
        </header>
    )
}

export default Header