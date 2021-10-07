const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const securityApp = require('helmet');
const cors = require('cors');

// setup connect mongodb by mongo
mongoose.connect('mongodb+srv://admin:admin123@cluster0.51c2x.mongodb.net/database_slack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true  
})
.then(()=>{
    console.log('database connected sucessfully');
}).catch((err)=>{
    console.log(`connecte db error ${err} `);
})

const app = express();
app.use(securityApp());
app.use(cors());
const server = require('http').Server(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log(socket.id , " is connected");
    socket.on("disconnect", () => {
        console.log(socket.id, " is disconnected");
    })
});


// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', './');
app.set('view engine', 'ejs');
// routes

// routes
app.get('/', cors(), (req, res, next)=>{
    // return res.render("index");
    res.send("Game on!!!");
})
// cacth 
app.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

// error
app.use((err, req, res, next)=>{
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500
    //res to client
    return res.status(status).json({
        error:{
            message: error.message
        }
    })
})
// start server
const port = app.get("port") || 3100;
// const port = process.env.PORT || 3100;
server.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
