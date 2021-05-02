import 'reflect-metadata';
import { uploadResolver } from './resolver/uploadResolvers';
import { movieResolvers } from './resolver/movieResolvers';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { accessToken } from './token';
import { User } from './entity/User';
import { verify } from 'jsonwebtoken';
import { MovieContext } from './MovieContext';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { genreResolvers } from './resolver/genreResolvers';
import { userResolvers } from './resolver/userResolvers';
import { sendRefreshToken } from './sendRefreshToken';
import { graphqlUploadExpress } from 'graphql-upload';
import cors from 'cors';

(async () => {
  dotenv.config();
  const app = express();

  app.use(cookieParser());
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10000000,
      maxFiles: 20,
    })
  );
  app.get('/', (_req, res) => res.send('Hello'));

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.send({ ok: false, accessToken: '' });

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return res.send({ ok: false, accessToken: '' });
    }

    const user = await User.findOne({ id: payload.userId });
    if (!user) return res.send({ ok: false, accessToken: '' });

    sendRefreshToken(res, accessToken(user));

    return res.send({ ok: true, accessToken: accessToken(user) });
  });

  try {
    await createConnection();

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [
          userResolvers,
          genreResolvers,
          movieResolvers,
          uploadResolver,
        ],
      }),
      context: ({ req, res }): MovieContext => ({ req, res }),
      uploads: false,
    });

    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    app.listen(8000, () => {
      console.log('Express server stated');
    });
  } catch (err) {
    console.log(err);
  }
})();
