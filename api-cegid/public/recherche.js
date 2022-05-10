const form = document.querySelector('#recherche');
const form_article = document.querySelector('#code_article');

function numberSearch(field, value) {
    const dictionary = {
        ">" : "[gt]",
        "<" : "[lt]",
        ">=" : "[gte]",
        "<=" : "[lte]",
    }
    let operator="";
    for (key of Object.keys(dictionary)) {
        if (value.includes(key)) {
            value = value.replaceAll(key, '')
            operator = dictionary[key];
            break
        }
    }
    return `${field}${operator}=${value}&`;
}

form.addEventListener('submit',event => {
    event.preventDefault();
    const libelle = document.querySelector('#libelle').value;
    const familleNiv = document.querySelector('#familleNiv').value;
    const PVTTC = document.querySelector('#PVTTC').value;
    const stock = document.querySelector('#stock').value;
    const pageSize = document.querySelector('#pageSize').value;
    const page = document.querySelector('#page').value;
    const ordre = document.querySelector('#ordre').value;
    const sort = document.querySelector('#sort').value;

    let result = ''
    if (libelle) result+= `GA_LIBELLE[like]=${libelle}&`
    if (familleNiv) result+= `GA_FAMILLENIV1[like]=${familleNiv}&`
    if (PVTTC) result+=numberSearch("GA_PVTTC", PVTTC);
    if (stock) result+=numberSearch("stock", stock);
    if (pageSize) result+= `pagesize=${pageSize}&`
    if (page) result+= `page=${page}&`
    result+=`sort=${ordre}${sort}`
    
    window.location.href = decodeURI(`${window.location.href.split('?')[0]}?${result}`);

})


form_article.addEventListener('submit',event => {
    event.preventDefault();
    const codeArticle = document.querySelector('#codeArticle').value
    window.location.href = decodeURI(`${window.location.href.split('?')[0]}/${codeArticle}`);
})