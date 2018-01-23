'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongodb = require('mongodb');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _graphqlServerExpress = require('graphql-server-express');

var _graphqlTools = require('graphql-tools');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var DB_HOST = process.env.DB_HOST,
    DB_MONGO_URL = process.env.MONGODB_URI,
    SERVER_PORT = process.env.PORT || process.env.SERVER_PORT;

var start = exports.start = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var Articles, db, prepare, typeDefs, resolvers, schema, app;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        Articles = void 0;
                        _context3.next = 4;
                        return _mongodb.MongoClient.connect(DB_MONGO_URL, function (error, database) {
                            console.log('Connected to DB');
                            Articles = database.db('syntax').collection('articles');
                        });

                    case 4:
                        db = _context3.sent;

                        prepare = function prepare(o) {
                            o._id = o._id.toString();
                            return o;
                        };

                        typeDefs = ['\n            type Article{\n                _id:String,\n                title:String,\n                content:String,\n                tags:String,\n                creationdate:String\n            }\n            type Query{\n                articles:[Article]\n            }\n            type Mutation {\n                createArticle(title: String, content: String,tags:String): Article\n            }\n            schema {\n                query:Query,\n                mutation:Mutation\n            }\n        '];
                        resolvers = {
                            Query: {
                                articles: function () {
                                    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return Articles.find({}).toArray();

                                                    case 2:
                                                        _context.t0 = prepare;
                                                        return _context.abrupt('return', _context.sent.map(_context.t0));

                                                    case 4:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, undefined);
                                    }));

                                    return function articles() {
                                        return _ref2.apply(this, arguments);
                                    };
                                }()
                            },
                            Mutation: {
                                createArticle: function () {
                                    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(root, args, context, info) {
                                        var res;
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        args.creationdate = new Date().getTime(); //inserting date
                                                        _context2.next = 3;
                                                        return Articles.insert(args);

                                                    case 3:
                                                        res = _context2.sent;
                                                        _context2.t0 = prepare;
                                                        _context2.next = 7;
                                                        return Articles.findOne({
                                                            _id: res.insertedIds[0]
                                                        });

                                                    case 7:
                                                        _context2.t1 = _context2.sent;
                                                        return _context2.abrupt('return', (0, _context2.t0)(_context2.t1));

                                                    case 9:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, undefined);
                                    }));

                                    return function createArticle(_x, _x2, _x3, _x4) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }()
                            }
                        };
                        schema = (0, _graphqlTools.makeExecutableSchema)({
                            typeDefs: typeDefs,
                            resolvers: resolvers
                        });
                        app = (0, _express2.default)();

                        app.use((0, _cors2.default)());
                        app.use(_bodyParser2.default.text({ type: 'application/graphql' }));
                        app.use('/api', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)({
                            schema: schema
                        }));

                        app.use('/graphiql', (0, _graphqlServerExpress.graphiqlExpress)({
                            endpointURL: '/api'
                        }));
                        app.use('/medium', function (parentRequest, parentResponse) {
                            var configJson = {
                                url: process.env.MEDIUM_URL,
                                method: 'get',
                                headers: {
                                    'Authorization': 'Bearer ' + process.env.MEDIUM_ACCESS_TOKEN
                                }
                            };
                            parentResponse.send({
                                message: "API is no Longer Active"
                            });
                            (0, _axios2.default)(configJson).then(function (response) {
                                parentResponse.send({
                                    status: 'success',
                                    data: response.data.data
                                });
                            }).catch(function (error) {
                                parentResponse.send({
                                    status: 'error',
                                    data: []
                                });
                            });
                        });
                        app.listen(SERVER_PORT, function () {
                            console.log('Server running on ' + SERVER_PORT);
                        });
                        _context3.next = 21;
                        break;

                    case 18:
                        _context3.prev = 18;
                        _context3.t0 = _context3['catch'](0);

                        console.log(_context3.t0);

                    case 21:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined, [[0, 18]]);
    }));

    return function start() {
        return _ref.apply(this, arguments);
    };
}();