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
    DB_USER = process.env.DB_USER,
    DB_PASS = process.env.DB_PASS,
    DB_MONGO_URL = process.env.DB_MONGO_URL,
    SERVER_PORT = process.env.SERVER_PORT,
    SERVER_HOST = process.env.SERVER_HOST;

var start = exports.start = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var Articles, db, prepare, typeDefs, resolvers, schema, app;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        Articles = void 0;
                        _context2.next = 4;
                        return _mongodb.MongoClient.connect(DB_MONGO_URL, function (error, database) {
                            Articles = database.db('syntax').collection('articles');
                        });

                    case 4:
                        db = _context2.sent;

                        prepare = function prepare(o) {
                            o._id = o._id.toString();
                            return o;
                        };

                        typeDefs = ['\n            type Article{\n                _id:String,\n                title:String,\n                content:String\n            }\n            type Query{\n                articles:[Article]\n            }\n\n            schema {\n                query:Query\n            }\n        '];
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
                            }
                        };
                        schema = (0, _graphqlTools.makeExecutableSchema)({
                            typeDefs: typeDefs,
                            resolvers: resolvers
                        });
                        app = (0, _express2.default)();

                        app.use((0, _cors2.default)());
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
                            parentResponse.send({ message: "API is no Longer Active" });
                            (0, _axios2.default)(configJson).then(function (response) {
                                parentResponse.send({ status: 'success', data: response.data.data });
                            }).catch(function (error) {
                                parentResponse.send({ status: 'error', data: [] });
                            });
                        });
                        app.listen(SERVER_PORT, function () {
                            console.log('Running @ ' + SERVER_HOST + ':' + SERVER_PORT);
                        });
                        _context2.next = 20;
                        break;

                    case 17:
                        _context2.prev = 17;
                        _context2.t0 = _context2['catch'](0);

                        console.log(_context2.t0);

                    case 20:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[0, 17]]);
    }));

    return function start() {
        return _ref.apply(this, arguments);
    };
}();