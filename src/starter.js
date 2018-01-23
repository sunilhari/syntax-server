import {
    MongoClient,
    ObjectId
} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {
    graphqlExpress,
    graphiqlExpress
} from 'graphql-server-express'
import {
    makeExecutableSchema
} from 'graphql-tools'
import cors from 'cors';
import axios from 'axios';
require('dotenv').config();

const DB_HOST = process.env.DB_HOST,
    DB_USER = process.env.DB_USER,
    DB_PASS = process.env.DB_PASS,
    DB_MONGO_URL = process.env.MONGODB_URI,
    SERVER_PORT = process.env.PORT ||process.env.SERVER_PORT,
    SERVER_HOST = process.env.SERVER_HOST;

export const start = async() => {

    try {
        let Articles;
        const db = await MongoClient.connect(DB_MONGO_URL, (error, database) => {
            console.log('Connected to DB');
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
                content:String,
                tags:String,
                creationdate:String
            }
            type Query{
                articles:[Article]
            }
            type Mutation {
                createArticle(title: String, content: String,tags:String): Article
            }
            schema {
                query:Query,
                mutation:Mutation
            }
        `];
        const resolvers = {
            Query: {
                articles: async() => {
                    return (await Articles.find({}).toArray()).map(prepare);
                }
            },
            Mutation: {
                createArticle: async(root, args, context, info) => {
                    args.creationdate = new Date().getTime();//inserting date
                    const res = await Articles.insert(args);
                    return prepare(await Articles.findOne({
                        _id: res.insertedIds[0]
                    }))
                }
            }
        };
        const schema = makeExecutableSchema({
            typeDefs,
            resolvers
        });
        const app = express();
        app.use(cors());
        app.use(bodyParser.text({ type: 'application/graphql' }));
        app.use('/api', bodyParser.json(), graphqlExpress({
            schema
        }));

        app.use('/graphiql', graphiqlExpress({
            endpointURL: '/api'
        }));
        app.use('/medium', (parentRequest, parentResponse) => {
            let configJson = {
                url: process.env.MEDIUM_URL,
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + process.env.MEDIUM_ACCESS_TOKEN
                }
            };
            parentResponse.send({
                message: "API is no Longer Active"
            });
            axios(configJson)
                .then(response => {
                    parentResponse.send({
                        status: 'success',
                        data: response.data.data
                    });
                })
                .catch(error => {
                    parentResponse.send({
                        status: 'error',
                        data: []
                    });
                });
        });
        app.listen(SERVER_PORT, () => {
            console.log(`Running @ ${SERVER_HOST}`)
        })
    } catch (e) {
        console.log(e);
    }
}