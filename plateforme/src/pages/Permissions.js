import Navigation from "../components/Navigation"
import Layout from "../components/Layout"
import { ThemeProvider } from "@emotion/react"
import theme from "../theme"

const Permissions = function() {

    return (
        <ThemeProvider theme={theme}>
            <Layout/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>Permissions</section>
            </div>
        </ThemeProvider>
        )
}

export default Permissions