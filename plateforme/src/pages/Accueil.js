import Navigation from "../components/Navigation"
import Layout from "../components/Layout"

const Accueil = function() {

    return (
        <>
            <Layout/>
            <div class='container'>
                <Navigation/>
                <section class='main_page'>Accueil</section>
            </div>
        </>
        )
}

export default Accueil