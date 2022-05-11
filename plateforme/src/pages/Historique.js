import Navigation from "../components/Navigation"
import Layout from "../components/Layout"
import { ThemeProvider } from "@emotion/react"
import theme from "../theme"

const Historique = function() {

    return (
        <ThemeProvider theme={theme}>
            <Layout/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>Historique</section>
            </div>
        </ThemeProvider>
        )
}

export default Historique