const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookies = require('cookies');
const express = require('express');
const middleware = require('./modules/middleware');
const rateLimit = require('./modules/rate-limiter');
const chalk = require('chalk')
const moment = require('moment')

const authRoutes = require('./routes/auth-routes');
const dashboardRoutes = require('./routes/dashboard-routes');
const rootRoutes = require('./routes/root-routes');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(rateLimit);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookies.express('a', 'b', 'c'));

app.use(express.static(`${__dirname}/assets`));
app.locals.basedir = `${__dirname}/assets`;

app.use('/',
  middleware.updateUser, rootRoutes,
  authRoutes,
  middleware.validateUser, middleware.updateGuilds, dashboardRoutes,
);

app.all('*', (req, res) => res.render('errors/404'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`${chalk.yellow(`[${moment(Date.now()).format()}]`)} Dashboard - Server is live on port ${port}`));