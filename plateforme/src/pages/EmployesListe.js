import Navigation from "../components/Navigation"
import Header from "../components/Header"
import { ThemeProvider } from "@emotion/react"
import theme from "../theme"

const EmployesListe = function() {

    return (
        <ThemeProvider theme={theme}>
            <Header/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>EmployesListe</section>
            </div>
        </ThemeProvider>
        )
}

export default EmployesListe