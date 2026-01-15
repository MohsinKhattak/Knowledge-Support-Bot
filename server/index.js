const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { authRoute } = require('./routes/authRoutes');
const cors = require('cors');
const connectDB = require('./utils/dbConnet');
dotenv.config();

const app = express();
//cors setup
cors.options = {
    origin: '*',
};
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoute);



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${process.env.PORT || 3000}/api-docs`);
    connectDB()
});