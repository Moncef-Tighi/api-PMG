import Navigation from "../components/Navigation"
import Header from "../components/Header"
import { ThemeProvider } from "@emotion/react"
import theme  from "../theme"

const Ecommerce = function() {

    return (
        <ThemeProvider theme={theme}>
            <Header/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>Ecommerce</section>
            </div>
        </ThemeProvider>
        )
}

export default Ecommerce