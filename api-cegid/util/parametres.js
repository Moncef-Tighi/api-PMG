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
        this.inputs=[];
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
            for (const param of Object.keys(fields)) {
                i++;
                if (param in this.operators) {
                    result+=`${field} ${this.operators[param]} ${fields[param]}` 
                    this.inputs.push(field)
                }
                else {
                    if (this.queryString[field].constructor === Array || this.queryString[field].split(",").length>1) {
                        result+=`${field} IN (${this.queryString[field]})`
                    }
                    else {
                        result+=`${field}=@${this.queryString[field]}`
                    }
                    this.inputs.push({field : this.queryString[field]});
                    result+=" AND ";
                    break;
                }
                result+= " AND "

            }
        }
        console.log(this.inputs);
        return result.slice(0,-4);
    }

    sort() {

    }
}

//console.log(qs.parse('foo[gt]=bar&bar=a,b,c'))

// console.log(qs.parse('a=c&a=d&a=e'))

// console.log(qs.parse('a=c&a[ne]=b'));

// console.log(qs.parse('a[gt]=c&a[ne]=b'));

// console.log(qs.parse('a=c&a[ne]=b'));

const query1= new Query(["marque", "b"])

const query2= new Query(["a","b"])

//console.log(query1.where("marque=adidas,nike&marque=coca&b[gt]=10"))
console.log(query2.where("a=c&a=d&b[gt]=10&b[lte]=20"))


export default Query;