import Navigation from "../components/Navigation"
import Layout from "../components/Layout"
import { ThemeProvider } from "@emotion/react"
import theme  from "../theme"

const Ecommerce = function() {

    return (
        <ThemeProvider theme={theme}>
            <Layout/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>Ecommerce</section>
            </div>
        </ThemeProvider>
        )
}

export default Ecommerce