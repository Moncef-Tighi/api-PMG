import Navigation from "../components/Navigation"
import Header from "../components/Header"
import { ThemeProvider } from "@emotion/react"
import theme from "../theme"

const Historique = function() {

    return (
        <ThemeProvider theme={theme}>
            <Header/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>Historique</section>
            </div>
        </ThemeProvider>
        )
}

export default Historique