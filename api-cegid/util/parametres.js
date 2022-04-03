import * as qs from 'qs';

class Query {
    constructor(allowedFields) {
        this.operators = {
            //Dictionnaire qui transforme les paramètres de querry en opérateur
            "gt" : ">",
            "gte" : ">=",
            "lt" : '<',
            "lte" : '<=',
            "like" : '%' 
        }
        this.allowedFields = allowedFields;
        this.queryString="";
        this.inputs={};
    }

    _parse(queryString) {
        this.queryString = qs.parse(queryString,{ 
            ignoreQueryPrefix: true 
        });
    }

    _sanitize() {

    }

    where(queryString) {
        this._parse(queryString);
        if (!this.queryString) return "";
        let result = 'WHERE ';
        for (const field of Object.keys(this.queryString)) {

            if (!this.allowedFields.includes(field)) {
                return `Erreur : le field ${field} n'est pas autorisé`;
            }
            const fields = this.queryString[field]
            
            let i=0;
            //Le i est nécessaire pour protéger les inputs contre les attaques SQL
            //le i sert de nom aux inputs dans le cas ou le même attribut a plusieurs condition
            //Exemple : b>@b AND b<@b ne fonctionnerait pas. Mais b>@1 AND b<@2 (les chiffres sont la valeur de i)fonctionnee
            
            for (const param of Object.keys(fields)) {
                i++;
                if (param in this.operators) {
                    //TODO: Remplacer la vraie value par le @ du prepared statement
                    result+=`${field} ${this.operators[param]} ${fields[param]}` 
                    this.inputs[i]= fields[param];
                }
                else {
                    if (this.queryString[field].constructor === Array || this.queryString[field].split(",").length>1) {
                        //TODO: Remplacer la vraie value par le @ du prepared statement
                        result+=`${field} IN (${this.queryString[field]})`
                    }
                    else {
                        //TODO: Remplacer la vraie value par le @ du prepared statement
                        result+=`${field}=@${this.queryString[field]}`
                    }
                    this.inputs[field]=this.queryString[field];
                    result+=" AND ";
                    break;
                }
                result+= " AND "

            }
        }
        return result.slice(0,-4);
    }

    sort() {

    }
}

const query1= new Query(["marque", "b"])

const query2= new Query(["marque","stock"])

//console.log(query1.where("marque=adidas,nike&marque=coca&b[gt]=10"))
console.log(query2.where("marque=nike&marque=adidas&stock[gt]=10&stock[lte]=20"))


export default Query;