const authResolver = require('./auth');
const eventResolver = require('./event');
const orderResolver = require('./order');

const rootResolver = {
    ...authResolver,
    ...eventResolver,
    ...orderResolver
};

module.exports = rootResolver;