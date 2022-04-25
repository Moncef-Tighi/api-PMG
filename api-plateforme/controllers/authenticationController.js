import { catchAsync } from './errorController.js';
import * as model from '../models/employe.js';


export const add = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});

