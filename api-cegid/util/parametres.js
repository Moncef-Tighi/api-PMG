import * as qs from 'qs';

class Query {

    constructor(allowedFields) {
        this.operators = {
            //Dictionnaire qui transforme les paramètres de querry en opérateur
            "gt" : ">",
            "gte" : ">=",
            "lt" : '<',
            "lte" : '<=',
            "like" : '' 
        }
        this.allowedFields = allowedFields;
        this.queryString="";
        //On sauvgarde les inputs dans cet attribut pour pouvoir les sanetize après
        this.inputs={};
    }

    _parse(queryString) {
        this.queryString = qs.parse(queryString,{ 
            ignoreQueryPrefix: true 
        });
    }

    _conditions(start) {

        if (Object.keys(this.queryString).length === 0) return "Empty";
        let result = start;
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
                    if (!fields[param]) return `Erreur de syntax, aucune valuer n'a été trouvé pour ${field}[${param}]`
                    if (param === 'like') result +=`${field} LIKE '%${fields[param]}%'`;
                    //TODO: Remplacer la vraie value par le @ du prepared statement
                    else result+=`${field} ${this.operators[param]} ${fields[param]}`;
                    this.inputs[i]= fields[param];
                }
                else {
                    console.log(this.queryString[field]);
                    if (typeof this.queryString[field] === 'object') return "Erreur de syntax : La querry n'est pas valide"

                    try {
                        if (this.queryString[field].split(",").length>1) {
                            //TODO: Remplacer la vraie value par le @ du prepared statement
                            result+=`${field} IN (${this.queryString[field]})`;
                        }
                        else {
                            //TODO: Remplacer la vraie value par le @ du prepared statement
                            result+=`${field}=${this.queryString[field]}`;
                        }    
                    } catch(Err) {
                        //Si l'opérateur est invalide, le code au dessus throw une erreur qu'on catch ici.
                        return "Opérateur invalide"
                    }
                    this.inputs[field]=this.queryString[field];
                    result+=" AND ";
                    break;
                }
                result+= " AND ";

            }
        }
        return result.slice(0,-4);
    }

    where(queryString) {
        this._parse(queryString);
        return this._conditions("WHERE ");
    }

    having(queryString) {
        this._parse(queryString);
        return this._conditions("HAVING ");
    }

    sort() {

    }

    sanitize(request) {
        for (const [key, value] of Object.entries(this.inputs)) {
            request.input(key, value);
        }
    }

}

const query1= new Query(["marque", "b"]);

const query2= new Query(["marque","stock", "a", "b", "c"]);


console.log(query1.where("marque=nike&b[gt]=10"))
// console.log(query2.where("marque[like]=adi"));
// console.log(query2.having("marque=adidas,nike&stock[gt]=10&stock[lte]=20"));
//console.log(query2.sanitize(query2.having("marque=adidas,nike&stock[gt]=10&stock[lte]=20")));

//Différentes erreurs possibles : 
// console.log(query2.where('stock[a]=test'));
// console.log(query2.where(""));
// console.log(query2.where(["a", "b", 'c']));
// console.log(query2.where("InvalidField[gt]=5"));
// console.log(query2.where("stock=&stock[gt]=5"));

export default Query;