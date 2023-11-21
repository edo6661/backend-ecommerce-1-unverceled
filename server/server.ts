import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDb from './config/connectDb';
import corsOptions from './config/corsOption';
import errorHandler from './middlewares/errorHandler';
import authRoute from './routes/authenticationRoute';
import cartRoute from './routes/cartRoute';
import historyPaymentRoute from './routes/historyPaymentRoute';
import orderRoute from './routes/orderRoute';
import paymentRoute from './routes/paymentRoute';
import productRoute from './routes/productRoute';
import reviewRoute from './routes/reviewRoute';
import userRoute from './routes/usersRoute';
dotenv.config();

const app = express();
app.use(cors(corsOptions));
app.use(errorHandler);
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

connectDb();

app.get('/', (req, res) => {
	res.send('hy bruh!');
});

app.use('/auth', authRoute);
app.use('', userRoute);
app.use('', productRoute);
app.use('', cartRoute);
app.use('', orderRoute);
app.use('', reviewRoute);
app.use('', paymentRoute);
app.use('', historyPaymentRoute);

app.listen(process.env.PORT, () => {
	console.log(`server running on port ${process.env.PORT}`);
});

export default app;
