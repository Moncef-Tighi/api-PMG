import Navigation from "../components/Navigation"
import Header from "../components/Header"
import { ThemeProvider } from "@emotion/react"
import theme  from "../theme"

const Page = function(props) {

    return (
        <ThemeProvider theme={theme}>
            <Header/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>
                    {props.children}
                </section>
            </div>
        </ThemeProvider>
        )
}

export default Page