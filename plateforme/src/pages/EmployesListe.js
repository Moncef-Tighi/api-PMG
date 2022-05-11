import Navigation from "../components/Navigation"
import Layout from "../components/Layout"
import { ThemeProvider } from "@emotion/react"
import theme from "../theme"

const EmployesListe = function() {

    return (
        <ThemeProvider theme={theme}>
            <Layout/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>EmployesListe</section>
            </div>
        </ThemeProvider>
        )
}

export default EmployesListe