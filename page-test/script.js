

const mainPage = document.querySelector('#main');
const emptyPage = document.querySelector('#empty');
const errorText=document.querySelector('#textError');
const form = document.querySelector('#form');
const codeArticle = document.querySelector('#codeArticle');
const table = document.querySelector('#table');
const sousTitre = document.querySelector('#label');

/*
    Span de la partie détails article
*/

const prix_initial = document.querySelector('#prix_initial');
const prix_acutel = document.querySelector('#prix_acutel');
const famille_niv1 = document.querySelector('#famille_niv1');
const famille_niv2 = document.querySelector('#famille_niv2');
const date_creation = document.querySelector('#date_creation');
const libre_art = document.querySelector('#libre_art');
const date_tarif = document.querySelector('#date_tarif');
const description_tarif = document.querySelector('#description_tarif');
const date_debut = document.querySelector('#date_debut');
const date_fin = document.querySelector('#date_fin');
const type_tarif = document.querySelector('#type_tarif');
const nature_tarif = document.querySelector('#nature_tarif');
const pertarif = document.querySelector('#pertarif');

//---------------------------------------


const pageCleanup= function() {
    emptyPage.style='none';
    mainPage.style='none';
    label.innerText="";
    table.innerText="";

}

form.addEventListener('submit', async (event)=> {
    event.preventDefault();
    pageCleanup();
    const code = codeArticle.value
    if (!code) codeArticle.style.border='1px solid red'
    const response = await fetch(`http://localhost:3000/api/v1/articles/${code}`, {
        headers: {
          'Accept': 'application/json'
        }
    });

    if (response.status===404) {
        errorText.innerText="Le code article fournit n'a pas été trouvé";
        return emptyPage.style.display="flex"
    } else if (response.status===500) {
        errorText.innerText="Une erreur serveur a eu lieu, veuillez réessayer plus tard";
        return emptyPage.style.display="flex"

    };
    const data = await response.json();
    const tailles = data.body.taille;
    const details = data.body.details;
    mainPage.style.display="grid";
    label.innerText= `Libelle : ${details.GA_LIBELLE}`
    tailles.forEach((taille => {
        table.insertAdjacentHTML('afterbegin', 
        `<tr>
            <td>${taille.GA_CODEBARRE}</td>
            <td>${taille.Dimension}</td>
            <td>${taille["Stock Net"]}</td>
            <td>${taille.Vendu}</td>
            <td>${taille.Transfert}</td>

        </tr>`)
    }))

    prix_acutel.innerText = details.prixActuel;
    prix_initial.innerText = details.prixInitial;
    famille_niv1.innerText = details.GA_FAMILLENIV1;
    famille_niv2.innerText = details.GA_FAMILLENIV2;
    date_tarif.innerText = details.dernierTarif.split("T")[0];
    description_tarif.innerText = details.descriptionTarif;
    date_creation.innerText = details.GA_DATECREATION.split("T")[0];
    libre_art.innerText = details.GA2_LIBREARTE;
    date_debut.innerText = details.GF_DATEDEBUT.split("T")[0];
    date_fin.innerText = details.GF_DATEFIN.split("T")[0];
    type_tarif.innerText = details.GFM_TYPETARIF;
    nature_tarif.innerText = details.GFM_NATURETYPE;
    pertarif.innerText = details.GFM_PERTARIF;
})