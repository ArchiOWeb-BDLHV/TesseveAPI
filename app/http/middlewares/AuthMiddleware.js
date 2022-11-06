import createDebugger from 'debug';
import Jwt from "jsonwebtoken";
import config from "../../../config.js";
import User from "../../models/user.js";

const debug = createDebugger('express-api:testing');

export function authenticated(req, res, next) { //authenticated est un middleware qui vérifie si l'utilisateur est authentifié
    const authHeader = req.headers['authorization']; // on récupère le header sous la forme "Bearer {token}"
    const token = authHeader && authHeader.split(' ')[1]; // on récupère le token

    if (token == null) return res.status(401).json({ message: "Unauthorized. Please login." }); // si le token est null, on renvoie une erreur

    Jwt.verify(token, config.jwt.secret, async(err, res) => {
        if (err) return res.status(403).json({ message: "Forbidden. Invalid token." }); // si le token est invalide, on renvoie une erreur
        const _user = await User.findById(res.id) // on ajoute l'utilisateur à la requête
        req.user = _user;
        next() // on passe à la suite
    })
}

export function tokenToUser(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    return new Promise((resolve, reject) => {
        Jwt.verify(token, config.jwt.secret, async(err, res) => {
            if (err) reject(err);
            const _user = await User.findById(res.id)
            resolve(_user);
        })
    })
}