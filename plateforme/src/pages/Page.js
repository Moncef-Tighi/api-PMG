import Navigation from "../components/Navigation"
import Header from "../components/Header"
import { ThemeProvider } from "@emotion/react"
import theme  from "../theme"
import { Outlet } from "react-router-dom"
import { Suspense } from "react"
import { CircularProgress } from "@mui/material"
import classes from './Page.module.css'
const Page = function() {

    return (
        <ThemeProvider theme={theme}>
            <Header/>
            <div className='container'>
                <Navigation/>
                <section className='main_page'>
                <Suspense fallback={<CircularProgress className={classes.centerSpinner}/>}><Outlet/></Suspense>
                </section>
            </div>
        </ThemeProvider>
        )
}

export default Page