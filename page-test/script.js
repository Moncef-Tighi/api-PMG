

const mainPage = document.querySelector('#main');
const emptyPage = document.querySelector('#empty');
const form = document.querySelector('#form');
const codeArticle = document.querySelector('#codeArticle');
const table = document.querySelector('#table');
const sousTitre = document.querySelector('label');

console.log(table);

form.addEventListener('submit', async (event)=> {
    event.preventDefault();
    const code = codeArticle.value
    if (!code) codeArticle.style.border='1px solid red'
    const response = await fetch(`http://localhost:3000/api/v1/articles/${code}`, {
        headers: {
          'Accept': 'application/json'
        }
     });
    const data = await response.json();
    const tailles = data.body.taille;
    //if (taille.length===0) return emptyPage.style.display="flex";
    label.innerText="";
    table.innerText="";
    mainPage.style.display="flex";
    label.innerText= `Libelle : ${tailles[0].GA_LIBELLE}`
    tailles.forEach((taille => {
        table.insertAdjacentHTML('afterbegin', 
        `<tr>
            <td>${taille.GA_CODEBARRE}</td>
            <td>${taille.GDI_LIBELLE[0]}</td>
            <td>${taille.QTE_STOCK_NET >= 2 ? "D" : "R"}</td>
        </tr>`)
    }))

})