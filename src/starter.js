import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import cors from 'cors'
require('dotenv').config();

const DB_HOST = process.env.DB_HOST,
    DB_USER = process.env.DB_USER,
    DB_PASS = process.env.DB_PASS,
    DB_MONGO_URL = process.env.DB_MONGO_URL,
    SERVER_PORT = process.env.SERVER_PORT,
    SERVER_HOST = process.env.SERVER_HOST;

export const start = async() => {

    try {
        let Articles;
        const db = await MongoClient.connect(DB_MONGO_URL, (error, database) => {
            Articles = database.db('syntax').collection('articles');
        });
        const prepare = (o) => {
            o._id = o._id.toString()
            return o
        };
        const typeDefs = [`
            type Article{
                _id:String,
                title:String,
                content:String
            }
            type Query{
                articles:[Article]
            }

            schema {
                query:Query
            }
        `];
        const resolvers = {
            Query: {
                articles: async() => {
                    return (await Articles.find({}).toArray()).map(prepare);
                }
            }
        };
        const schema = makeExecutableSchema({
            typeDefs,
            resolvers
        });
        const app = express();
        app.use(cors());
        app.use('/api', bodyParser.json(), graphqlExpress({ schema }));

        app.use('/graphiql', graphiqlExpress({
            endpointURL: '/api'
        }));
        /*
        app.use('/medium', bodyParser.json(), async()=>{
            
        });
        */
        app.listen(SERVER_PORT, () => {
            console.log(`Running @ ${SERVER_HOST}:${SERVER_PORT}`)
        })
    } catch (e) {
        console.log(e);
    }
}