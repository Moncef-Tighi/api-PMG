import Navigation from "../components/Navigation"
import Header from "../components/Header"
import { ThemeProvider } from "@emotion/react"
import theme from "../theme"

const Permissions = function() {

    return (
        <ThemeProvider theme={theme}>
            <Header/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>Permissions</section>
            </div>
        </ThemeProvider>
        )
}

export default Permissions