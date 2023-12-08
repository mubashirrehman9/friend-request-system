const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
    info: {
        title: 'Blog API Documentation',
        description: '',
    },
    tags: [ ],
    host: 'localhost:3000/social',
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
