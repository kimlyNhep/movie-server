"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const movieStateResolvers_1 = require("./resolver/movieStateResolvers");
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const token_1 = require("./token");
const User_1 = require("./entity/User");
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const sendRefreshToken_1 = require("./sendRefreshToken");
const graphql_upload_1 = require("graphql-upload");
const uploadResolvers_1 = require("./resolver/uploadResolvers");
const genreResolvers_1 = require("./resolver/genreResolvers");
const userResolvers_1 = require("./resolver/userResolvers");
const movieResolvers_1 = require("./resolver/movieResolvers");
const ratingResolvers_1 = require("./resolver/ratingResolvers");
const characterResolvers_1 = require("./resolver/characterResolvers");
const movieInfoResolvers_1 = require("./resolver/movieInfoResolvers");
const commentResolvers_1 = require("./resolver/commentResolvers");
const app = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const app = express_1.default();
    const allowedDomains = [
        'http://localhost:3000',
        'https://elegant-turing-5a0a50.netlify.app',
    ];
    app.use(cookie_parser_1.default());
    app.use(cors_1.default({
        origin: function (origin, callback) {
            if (!origin)
                return callback(null, true);
            if (allowedDomains.indexOf(origin) === -1) {
                var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    }));
    app.use(graphql_upload_1.graphqlUploadExpress({
        maxFileSize: 10000000,
        maxFiles: 20,
    }));
    app.use(express_1.default.static('public'));
    app.use('/images', express_1.default.static('images'));
    app.get('/', (_req, res) => res.send('Hello'));
    app.post('/refresh_token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.cookies.token;
        if (!token)
            return res.send({ ok: false, accessToken: '' });
        let payload = null;
        try {
            payload = jsonwebtoken_1.verify(token, process.env.REFRESH_TOKEN_SECRET);
        }
        catch (err) {
            return res.send({ ok: false, accessToken: '' });
        }
        const user = yield User_1.User.findOne({ id: payload.userId });
        if (!user)
            return res.send({ ok: false, accessToken: '' });
        sendRefreshToken_1.sendRefreshToken(res, token_1.accessToken(user));
        return res.send({ ok: true, accessToken: token_1.accessToken(user) });
    }));
    try {
        let connectionOptions = yield typeorm_1.getConnectionOptions();
        console.log(process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'production')
            connectionOptions = yield typeorm_1.getConnectionOptions('production');
        else
            connectionOptions = yield typeorm_1.getConnectionOptions('default');
        yield typeorm_1.createConnection(connectionOptions);
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: yield type_graphql_1.buildSchema({
                resolvers: [
                    userResolvers_1.userResolvers,
                    genreResolvers_1.genreResolvers,
                    movieResolvers_1.movieResolvers,
                    uploadResolvers_1.uploadResolver,
                    ratingResolvers_1.ratingResolvers,
                    characterResolvers_1.characterResolvers,
                    movieInfoResolvers_1.movieInfoResolvers,
                    commentResolvers_1.commentResolvers,
                    movieStateResolvers_1.movieStateResolvers,
                ],
            }),
            context: ({ req, res }) => ({ req, res }),
            uploads: false,
        });
        apolloServer.applyMiddleware({
            app,
            cors: false,
        });
        app.listen(process.env.PORT, () => {
            console.log('Express server stated');
        });
    }
    catch (err) {
        console.log(err);
    }
});
app().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map