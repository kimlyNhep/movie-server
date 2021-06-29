import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { MovieContext } from './MovieContext';
import { createConnection, getConnectionOptions } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { uploadResolver } from './resolver/uploadResolvers';
import { genreResolvers } from './resolver/genreResolvers';
import { userResolvers } from './resolver/userResolvers';
import { movieResolvers } from './resolver/movieResolvers';
import { ratingResolvers } from './resolver/ratingResolvers';
import { characterResolvers } from './resolver/characterResolvers';
import { movieInfoResolvers } from './resolver/movieInfoResolvers';
import { commentResolvers } from './resolver/commentResolvers';
import { movieStateResolvers } from './resolver/movieStateResolvers';

const app = async () => {
  dotenv.config();
  const app = express();

  const allowedDomains = [
    'http://localhost:3000',
    'https://elegant-turing-5a0a50.netlify.app',
    'https://studio.apollographql.com',
  ];
  app.use(cookieParser());
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedDomains.indexOf(origin) === -1) {
          var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
    })
  );
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10000000,
      maxFiles: 20,
    })
  );
  app.use(express.static('public'));
  app.use('/images', express.static('images'));
  app.get('/', (_req, res) => res.send('Hello'));

  try {
    let connectionOptions = await getConnectionOptions();

    if (process.env.NODE_ENV === 'production')
      connectionOptions = await getConnectionOptions('production');
    else connectionOptions = await getConnectionOptions('default');
    connectionOptions = await getConnectionOptions('default');

    await createConnection(connectionOptions);

    const apolloServer = new ApolloServer({
      introspection: true,
      schema: await buildSchema({
        resolvers: [
          userResolvers,
          genreResolvers,
          movieResolvers,
          uploadResolver,
          ratingResolvers,
          characterResolvers,
          movieInfoResolvers,
          commentResolvers,
          movieStateResolvers,
        ],
      }),
      context: ({ req, res }): MovieContext => ({ req, res }),
      uploads: false,
    });

    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    app.listen(process.env.PORT, () => {
      console.log('Express server stated');
    });
  } catch (err) {
    console.log(err);
  }
};

app().catch((err) => console.warn(err));
