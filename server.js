const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({helpers});//adds helpers we imported from /utils to built-in helpers like if or each
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const sess={
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
}


const app = express();
const PORT = process.env.PORT || 3001;
//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sess));

//turn on routes
app.use(routes)//access the imported routes from ./routes packages as one module.
//router in routes/index.js collected everything and packaged them up for server.js to use i.e. dont have to call app.use multiple time for each route


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//turn on connection to db and server
sequelize.sync({force:false}).then(()=>{
    app.listen(PORT, ()=> console.log('Now listening'));
});
