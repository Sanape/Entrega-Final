//Imports
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import productRoute from './routes/product.routes.js';
import cartRoute from './routes/cart.routes.js';
import sessionRoute from './routes/session.routes.js';
import userRoute from './routes/user.routes.js';
import ratingRoute from './routes/rating.routes.js';
import developerRoute from './routes/developer.routes.js';
import viewsRoute from './routes/views.routes.js';
import customRoute from './routes/customRoutes.routes.js';
import categoryRoute from './routes/category.routes.js';
import errorHandlerMiddleware from './middlewares/error.middleware.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import {
  getAllProductsHandler,
  messagesHandler,
  getRandomBuy,
  getAllCategoriesHandler,
  getAllDevelopersHandler,
} from './handlers/handlers.js';
import { Database } from './config/database.connection.js';
import passport from 'passport';
import logger from './utils/winston.config.js';
import { openapiSpecification } from './utils/swaggerSpecs.js';
import swaggerUi from 'swagger-ui-express';
import { __dirname } from './utils/utils.js';
import config from './config.js';

//Variables
const app = express();

//Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser(config.COOKIE_SECRET));
app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(
  session({
    secret: config.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl: config.MONGO_DB_URI,
      ttl: 15,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/carts', cartRoute);
app.use('/api/products', productRoute);
app.use('/api/sessions', sessionRoute);
app.use('/api/users', userRoute);
app.use('/api/ratings', ratingRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/developers', developerRoute);
app.use('/api', customRoute);
app.use('/', viewsRoute);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
//Global middlewares
app.use(errorHandlerMiddleware);

//Servers
const httpServer = app.listen(config.PORT, async () => {
  await Database.databaseConnection();
  logger.info(`Listening on port ${config.PORT}`);
});

const socketServer = new Server(httpServer);

const onConnection = async (socket) => {
  await getAllProductsHandler(socketServer, socket);
  await messagesHandler(socketServer, socket);
  await getRandomBuy(socketServer, socket);
  await getAllCategoriesHandler(socketServer, socket);
  await getAllDevelopersHandler(socketServer, socket);
};

socketServer.on('connection', onConnection);

//exports
export default app;
export { __dirname };
