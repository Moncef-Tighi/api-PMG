import Navigation from "../components/Navigation"
import Header from "../components/Header"
import { ThemeProvider } from "@emotion/react"
import theme  from "../theme"
import { Outlet } from "react-router-dom"

const Page = function() {

    return (
        <ThemeProvider theme={theme}>
            <Header/>
            <div className='container'>
                <Navigation/>
                <section className='main_page'>
                    <Outlet/>
                </section>
            </div>
        </ThemeProvider>
        )
}

export default Page