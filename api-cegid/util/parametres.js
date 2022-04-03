import * as qs from 'qs';

class Query {
    constructor(allowedFields) {
        this.operators = {
            "gt" : ">",
            "gte" : ">=",
            "lt" : '<',
            "lt" : '<=',
            "like" : '%' 
        }
        this.allowedFields = allowedFields;
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
        for (const field of Object.keys(this.queryString)) {

            if (!this.allowedFields.includes(field)) {
                return `Erreur : le field ${field} n'est pas autorisé`;
            }
            const fields = this.queryString[field]
            console.log(fields);
            for (const param of Object.keys(fields)) {
                if (param in this.operators) {
                    result+=`${field} ${this.operators[param]} ${fields[param]}` 
                }
                else {
                    if (this.queryString[field].constructor === Array || this.queryString[field].split(",").length>1) {
                        result+=`${field} IN (${this.queryString[field]})`
                    }
                    else {
                        result+=`${field}=@${this.queryString[field]}`
                    }
                    result+=" AND "
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

//console.log(qs.parse('foo[gt]=bar&bar=a,b,c'))

// console.log(qs.parse('a=c&a=d&a=e'))

// console.log(qs.parse('a=c&a[ne]=b'));

// console.log(qs.parse('a[gt]=c&a[ne]=b'));

// console.log(qs.parse('a=c&a[ne]=b'));

const query1= new Query(["marque", "b"])

const query2= new Query(["marque"])

console.log(query1.where("marque=adidas,nike&marque=coca&b[gt]=10"))
//console.log(query2.where("a=c&a=d&b[gt]=10&b[lte]=20"))


export default Query;