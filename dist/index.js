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
const characterResolvers_1 = require("./resolver/characterResolvers");
const commentResolvers_1 = require("./resolver/commentResolvers");
const genreResolvers_1 = require("./resolver/genreResolvers");
const movieInfoResolvers_1 = require("./resolver/movieInfoResolvers");
const movieResolvers_1 = require("./resolver/movieResolvers");
const movieStateResolvers_1 = require("./resolver/movieStateResolvers");
const ratingResolvers_1 = require("./resolver/ratingResolvers");
const uploadResolvers_1 = require("./resolver/uploadResolvers");
const userResolvers_1 = require("./resolver/userResolvers");
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
        yield typeorm_1.createConnection({
            type: 'postgres',
            host: 'ec2-54-205-183-19.compute-1.amazonaws.com',
            port: 5432,
            username: 'joytkawnlpwdcq',
            password: '546c039124795af20e024347182ea9b8b280a28bf281714bae1fc2b42748b6ee',
            database: 'ddrgs892vhn6ak',
            synchronize: false,
            logging: false,
            entities: ['dist/entity/**/*.js'],
            migrations: ['dist/migration/**/*.js'],
            subscribers: ['dist/subscriber/**/*.js'],
            ssl: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        });
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: yield type_graphql_1.buildSchema({
                resolvers: [
                    characterResolvers_1.characterResolvers,
                    commentResolvers_1.commentResolvers,
                    genreResolvers_1.genreResolvers,
                    movieInfoResolvers_1.movieInfoResolvers,
                    movieResolvers_1.movieResolvers,
                    movieStateResolvers_1.movieStateResolvers,
                    ratingResolvers_1.ratingResolvers,
                    uploadResolvers_1.uploadResolver,
                    userResolvers_1.userResolvers,
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