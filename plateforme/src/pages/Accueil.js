import Navigation from "../components/Navigation"
import Layout from "../components/Layout"
import { ThemeProvider } from "@emotion/react"
import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: red,
      PMG : {
        main : ""
      },
      action: {
          active: "red"
      }
    },
  });
  

const Accueil = function() {

    return (
        <ThemeProvider theme={theme}>
            <Layout/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>Accueil</section>
            </div>
        </ThemeProvider>
        )
}

export default Accueil