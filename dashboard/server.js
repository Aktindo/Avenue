const express = require('express');
const cookies = require('cookies')
const commands = require('../index')

const authRoutes = require('./routes/auth-routes')
const rootRoutes = require('./routes/root-routes')

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');



app.use(express.static(`${__dirname}/assets`));
app.locals.basedir = `${__dirname}/assets`;

app.use('/', rootRoutes, authRoutes)

app.get('*', (req, res) => res.render('errors/404', {
    subtitle: '404'
}))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is live on port ${port}`));