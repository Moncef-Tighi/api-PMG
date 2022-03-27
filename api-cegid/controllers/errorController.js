
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
            status : err.status,
            message : err.message,
        });    

    } else if (process.env.NODE_ENV==='development') {
        return response.status(err.status).json( {
            status : err.status,
            message : err.message,
            stack : err.stack
        });    
    }
}