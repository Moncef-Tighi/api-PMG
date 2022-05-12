import Navigation from "../components/Navigation"
import Layout from "../components/Header"
import { ThemeProvider } from "@emotion/react"
import theme from "../theme"

const Accueil = function() {

    return (
        <ThemeProvider theme={theme}>
            <Layout/>
            <div className='container'>
                <Navigation/>
                <section className='main_page'>Accueil</section>
            </div>
        </ThemeProvider>
        )
}

export default Accueil