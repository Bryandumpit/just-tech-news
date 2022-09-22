const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//turn on routes
app.use(routes)//access the imported routes from ./routes packages as one module.
//router in routes/index.js collected everything and packaged them up for server.js to use i.e. dont have to call app.use multiple time for each route

//turn on connection to db and server
sequelize.sync({force:false}).then(()=>{
    app.listen(PORT, ()=> console.log('Now listening'));
});
