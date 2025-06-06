const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Books API',
    description: 'API for managing book'
  },
  host: 'localhost:3000',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// This will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
