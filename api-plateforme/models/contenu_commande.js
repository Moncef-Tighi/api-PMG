import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import createError from 'http-errors';
import apiWooCommerce from "../models/api.js";


export const oneCommande = catchAsync( async function(request, response, next) {


    return response.status(200).json({
        status: "ok",
    });
});