import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { MovieContext } from './MovieContext';
import { createConnection } from 'typeorm';
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
    await createConnection({
      type: 'postgres',
      host: 'ec2-54-205-183-19.compute-1.amazonaws.com',
      port: 5432,
      username: 'joytkawnlpwdcq',
      password:
        '546c039124795af20e024347182ea9b8b280a28bf281714bae1fc2b42748b6ee',
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

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [
          characterResolvers,
          commentResolvers,
          genreResolvers,
          movieInfoResolvers,
          movieResolvers,
          movieStateResolvers,
          ratingResolvers,
          uploadResolver,
          userResolvers,
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

app().catch((err) => console.log(err));
