import * as qs from 'qs';


class Query {
    
    constructor(defaultSort, excluedFields=[]) {
        this.defaultSort = defaultSort;
        this.excluedFields = excluedFields;
        this.queryString={};
        //On sauvgarde les inputs dans cet attribut pour pouvoir les sanetize après
        this.inputs={};
    }
    
    errorHandeler = function(message, status="badQuery") {
        const error = new Error(message);
        error.code = status;
        return error;
    }

    reservedKeyWords = ["sort", "projection", 'page', "pagesize"]
    

    operators = {
        //Dictionnaire qui transforme les paramètres de querry en opérateur
        "gt" : ">",
        "gte" : ">=",
        "lt" : '<',
        "lte" : '<=',
        "like" : '' ,
    }  

    _splitInTwo = (xs, index=2) => [xs.slice(0, index), xs.slice(index)]

    _or(queryString) {
        //L'implémentation du OR n'est pas facile. Voici l'Algorithme que j'ai trouvé : 
        //1-Split le queryString selon là ou on trouve les [or] tout en les enlevant.
        //2-Faire passer chaque morceau dans la méthode _conditions comme si c'était des querry à part
        //3-Modifier _conditions pour ignorer les parenthéses là ou il faut et juste les output normal dans le SQL
        //4-Réassembler les morceaux avec un " OR " entre eux.
        if (string.includes("[or]")) {
            const [before, after] = this._splitInTwo(current, current.search(field));
            return `${before}(${ after.replace("[or]", " OR ") })`;            
        }
        return
    }

    _parsing(queryString) {
        this.queryString = queryString        
        if (Object.keys(this.queryString).length === 0) return "";
        const regex = /\[([^\]]+)\]/g
        const string = qs.stringify(queryString, { encode: false, indices: false  })
        const operators = string.match(regex);

        if (operators!=null) {
            for (const operator of operators) {
                if (!(operator.slice(1,-1) in this.operators)) throw this.errorHandeler("Opérateur Invalide");
                if (operator === '[or]') this._or(queryString);
            }
        }

    }

    _conditions(start) {
        let result = start;
        for (const field of Object.keys(this.queryString)) {
            if (this.reservedKeyWords.includes(field)) continue;
            
            const fields = this.queryString[field]
            if (this.excluedFields.includes(field)) {
                throw this.errorHandeler(`le field ${field} n'est pas autorisé`);
            }
            let i=0;
            //Le i est nécessaire pour protéger les inputs contre les attaques SQL
            //le i sert de nom aux inputs dans le cas ou le même attribut a plusieurs condition
            //Exemple : b>@b AND b<@b ne fonctionnerait pas. Mais b>@1 AND b<@2 fonctionne (les chiffres sont la valeur de i)
            //IDEE : MSSQL fait la sanitization auto avec param1, param2...
            for (const param of Object.keys(fields)) {
                i++;
                if (param in this.operators) {
                    if (!fields[param]) throw this.errorHandeler( `Erreur de syntax, aucune valeur n'a été trouvé pour ${field}[${param}]`);
                    if (param === 'like') {
                        result +=`${field} LIKE @${i} `;
                        //On est obligé d'inclure les " % " Après parce que le parser de MSSQL ne les gère pas
                        this.inputs[i]= "%" +fields[param]+ "%";
                    }
                    else {
                        result+=`${field} ${this.operators[param]} @${i}`; 
                        this.inputs[i]= fields[param];
                    }
                }
                else {
                        const params = this.queryString[field]
                        if (typeof params === 'string' || params instanceof String) {
                            result+=`${field}=@${field}`;
                            this.inputs[field]=params;
                        }else{
                            //TODO: Remplacer la vraie value par le @ du prepared statement
                            let inOperator = "";
                            for (let y=0; y<params.length;y++) {
                                inOperator+= `@${i},`;
                                this.inputs[i]=params[y];
                                i++;
                            }
                            result+=`${field} IN (${inOperator.slice(0,-1)})`;
                        }
                    result+=" AND ";
                    break;
                }
                result+= " AND ";
            }
        }
        if (result===" WHERE ") return ""
        return result.slice(0,-4);
    }

    where(queryString, and = false) {
        this._parsing(queryString);
        if (and) return this._conditions(" AND ");
        return this._conditions(" WHERE ");
    }

    having(queryString) {
        this._parsing(queryString);
        return this._conditions(" HAVING ");
    }

    paginate(queryString) {
        // ATTENTION ! Impossible de paginé avec cette méthode sans Order By
        if (!queryString.sort) return "";
        const page=Number(queryString.page) || 1
        let pageSize = Number(queryString.pagesize) || 10;
        if (pageSize>1000) pageSize=1000
        return ` OFFSET ${(page-1) * pageSize} ROWS FETCH NEXT ${pageSize} ROWS ONLY `
    }

    seekPaginate(lastResult) {
        //Cette méthode utilise une pagination plus rapide, mais l'inconvenient c'est qu'on doit passer d'une page à la suivante
        //Impossible de passer de la page 1 à la page 5 sans connaitre le dernier élément de la page 4 et ainsi de suite
        //La pagination normal est BigO(n), la Seek pagination est BigO(1)

        //Une bonne idée pour faire fonctionner le seekPaginate : 
        //Envoyer un attribut next dans la réponse qui contient le lien vers la prochaine page

    }

    sort(queryString) {
        this.queryString=queryString;
        if (!this.queryString['sort']) {
            if(this.defaultSort) this.queryString.sort=this.defaultSort
            else return '';
        }
        try {
            const fields = this.queryString.sort.split(',');
            let result = "ORDER BY "
            fields.forEach(field=>{
                if (this.excluedFields.includes(field)) throw this.errorHandeler(`le field ${field} n'est pas autorisé`);
                if (field[0] === "-") return result+= `${field.slice(1)} DESC,`
                else if (field[0]==="+") return result+= `${field.slice(1)} ASC,`
                else return result+= `${field} ASC,`
            })
            return result.slice(0,-1);
        } catch {
            throw this.errorHandeler("Le tri n'est pas valide");
        }
    }

    sanitize(request) {
        if (this.inputs) {
            for (const [key, value] of Object.entries(this.inputs)) {
                request.input(String(key), value);
            }
        }  
    }

}

const query1= new Query("GA_CODEARTICLE",["b"]);

const query2= new Query("",["invalidField"]);

// console.log(query1.where(qs.parse(""))
// + query1.sort(qs.parse("")) 
// + query1.paginate(qs.parse("")));


//Des querry qui doivent être valides pour WHERE: 

// console.log(query1.where(qs.parse("marque=nike&marque=adidas&a[gt]=10")))
// console.log(query2.having(qs.parse("marque=adidas,nike&stock[gt]=10&stock[lte]=20")));
// console.log(query2.where(qs.parse("stock[lt]=10&b=20&a[gt]=10")));
// console.log(query1.where(qs.parse("GA_CODEARTICLE= 000I-0HZ&GA_CODEARTICLE=000I-0HZ&GA_CODEARTICLE=000I-0HZ&GA_CODEARTICLE=000I-0HZ&GA_CODEARTICLE=000I-0HZ&GA_CODEARTICLE=000I-0HZ&GA_CODEARTICLE=000I-0HZ&GA_CODEARTICLE=000I-0HZ&GA_CODEARTICLE=000I-0HZ&GA_CODEARTICLE=000I-0HZv")))


// console.log(query2.where("stock[lt]=10&[or]&stock[gt]=20"));
// console.log(query2.where("stock=10[or]stock=20[or]a>10"));
// console.log(query2.where("marque=adidas&stock[lt]=10[or]stock[gt]=20"));



//Des querry qui devraient être valide pour SORT : 

// console.log(query1.sort(qs.parse("sort=-marque,+stock")));
// console.log(query2.where(qs.parse("marque=adidas,nike&stock[gt]=10&stock[lte]=20")) + query1.sort(qs.parse("sort=-marque,+stock")) );

//Des querry qui devraient être valide pour Paginate : 

// console.log(query1.where(qs.parse("marque=adidas,nike&stock[gt]=10&stock[lte]=20"))
// + query1.sort(qs.parse("sort=-marque,+stock")) 
// + query1.paginate(qs.parse("page=2,pageSize=800")));


//Des querry qui doivent être invalides : 

// console.log(query2.where(qs.parse('stock[a]=test')));
// console.log(query2.where(qs.parse('')));
// console.log(query2.where(qs.parse(["a", "b", 'c'])));
// console.log(query2.where(qs.parse("InvalidField[gt]=5")));
// console.log(query2.where(qs.parse("stock=&stock[gt]=5")));


//Des querry vides : 

// console.log(query1.paginate(qs.parse("page=4,pageSize=200"))) //Impossible de paginer sans sort d'abord


export default Query;