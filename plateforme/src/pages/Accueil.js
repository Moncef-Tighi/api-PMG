import Navigation from "../components/Navigation"
import Layout from "../components/Layout"
import { ThemeProvider } from "@emotion/react"
import theme from "../theme"

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