import Redis from 'ioredis';
import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import path from 'path';

let port = process.env.PORT || 3000;

const redis = new Redis();
const app = new express();

// View engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.get('/', (req, res, next) => res.render('searchusers'));

app.post('/users/search', (req, res, next) => {
  let id = req.body.id;
  redis.hgetall(id, (err, obj) => {
    if (err) {
      res.render('searchusers', { error: 'No users found' });
    } else {
      res.render('details', { users: obj });
    }
  });
});

redis.set('name', 'Siddu');
redis.get('name', (err, name) => {
  console.log(`name is ${name}`);
});

app.listen(port, err => {
  console.log(`Server is running at port ${port}`);
});
