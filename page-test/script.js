

const mainPage = document.querySelector('#main');
const emptyPage = document.querySelector('#empty');
const errorText=document.querySelector('#textError');
const form = document.querySelector('#form');
const codeArticle = document.querySelector('#codeArticle');
const table = document.querySelector('#table');
const sousTitre = document.querySelector('label');

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
    mainPage.style.display="flex";
    label.innerText= `Libelle : ${tailles[0].GA_LIBELLE}`
    tailles.forEach((taille => {
        table.insertAdjacentHTML('afterbegin', 
        `<tr>
            <td>${taille.GA_CODEBARRE}</td>
            <td>${taille.GDI_LIBELLE[0]}</td>
            <td>${taille.QTE_STOCK_NET}</td>
        </tr>`)
    }))

})