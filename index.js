import Redis from 'ioredis';
import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import path from 'path';

let port = process.env.PORT || 3000;

const redis = new Redis();
const app = new express();

// Static assets
app.use('/public', express.static('public'));

// View engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

// Handling get requests
app.get('/', (req, res, next) => res.render('searchusers'));
app.get('/users/add', (req, res, next) => res.render('adduser'));

// Search the user
app.post('/users/search', (req, res, next) => {
  let id = req.body.id;
  redis.hgetall(id, (err, obj) => {
    if (err) {
      res.render('searchusers', { error: 'No users found' });
    } else {
      res.render('details', { user: obj });
    }
  });
});

// Adding the user
app.post('/users/add', (req, res, next) => {
  let { id, first_name, last_name, email, phone } = req.body;
  redis.hmset(
    id,
    [
      'first_name',
      first_name,
      'last_name',
      last_name,
      'email',
      email,
      'phone',
      phone
    ],
    (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        res.render('searchusers');
      }
    }
  );
});

// Listening on the port
app.listen(port, err => {
  console.log(`Server is running at port ${port}`);
});
