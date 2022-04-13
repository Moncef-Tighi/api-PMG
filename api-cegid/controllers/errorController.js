import createError from 'http-errors'

export const catchAsync= function(func){
    /*
        Tout les MIDDELWARE asynchrones doivent être placés à l'intérieur de cette fonction.
        ça permet de throw une erreur en cas de problème dans l'opération asynchrone sans
        devoir entourner toute les opérations asynchrones avec un bloc try/catch
    */
    return (request, response, next) => {
        func(request, response, next).catch(error => {
            console.log(error);
            if (error.code==="badQuery") {
                return next(createError(400, 'query invalide : ' + error));
            }
            if (error.code==="EREQUEST") {
                return next(createError(500, 'erreur base de donnée : ' + error))
            }
            if (error.code==="ETIMEOUT") {
                return next(createError(500, "La base de donnée n'a pas répondu assez vite, veuillez réessayer plus tard"))
            }
            return next(createError(500, `La requête asynchrone a échouée avec le message : ${error}`))
        });
    }
}


const logError = function(err) {
    if (err.status!=404) {
        console.error(err);
    }
}



export const errorHandeler = function(err, request, response, next) {
    
    err.status= err.status || 500;
    err.message = err.message || "erreur interne";
    logError(err);
    if (process.env.NODE_ENV==='production') {
        return response.status(err.status).json( {
            status : "error",
            statusCode : err.status,
            message : err.message,
        });    

    } else if (process.env.NODE_ENV==='development') {
        return response.status(err.status).json( {
            status: "error",
            statusCode : err.status,
            message : err.message,
            stack : err.stack
        });    
    }
}