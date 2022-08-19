const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config()
const morgan = require('morgan');
const app = express();
const cors = require('cors');

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(morgan("dev"));
app.use(cors());

var corsOptions = {
    origin: '*', 
    optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));

mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))


const authRoutes = require('./routes/auth');

app.use('/api/user', authRoutes);

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'Hit!'
    })
});

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor corriendo en: http://localhost:${PORT}`)

})