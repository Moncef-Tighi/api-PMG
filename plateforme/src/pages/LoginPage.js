import LoginForm from "../components/LoginForm"
import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: red,
      PMG : {
        main : ""
      }
    },
  });
  

const LoginPage = function() {
    return (<ThemeProvider theme={theme}>
        <LoginForm/>
        </ThemeProvider>
        )
}

export default LoginPage