import swaggerJSDOC from "swagger-jsdoc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Digital Gaming API',
        version: '1.0.0',
      },
    },
    apis: [`${__dirname}/docs/*.yaml`],
  };
  
  export const openapiSpecification = swaggerJSDOC(options);