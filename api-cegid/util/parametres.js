import * as qs from 'qs';

class Query {
    constructor(fields) {
        this.operators = {
            "gt" : ">",
            "gte" : ">=",
            "lt" : '<',
            "lt" : '<=',
            "like" : '%' 
        }
        this.fields = fields || [];
        this.queryString="";
    }

    _parse(queryString) {
        this.queryString = qs.parse(queryString,{ 
            ignoreQueryPrefix: true 
        });
    }

    where(queryString) {
        this._parse(queryString);
        if (!this.queryString) return "";
        let result = 'WHERE ';
        console.log(this.queryString);
        for (const field of Object.keys(this.queryString)) {

            if (!field in this.fields) {
                return `Erreur : le field ${field} n'est pas autorisé`;
            }

            for (const param of Object.keys(this.queryString[field]))
            if (param[0] in this.operators) {
                result+=`${param[0]} ${this.operators[param[0]]} @${param[0]}` 
            }
            else {
                result+=`${param}=@${param}`
            }
            result+= " AND "
        }
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

const query1= new Query(["erreur"])

const query2= new Query(["a"])

//console.log(query1.where("a=c&a=d&a=e"))
console.log(query2.where("a=c&b[gt]=10"))


export default Query;