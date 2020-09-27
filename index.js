const restify = require('restify');
const dayjs = require('dayjs');
const corsMiddleware = require('restify-cors-middleware');

require('dayjs/locale/tr');

dayjs.locale('tr');

const cors = corsMiddleware({
  origins: ["*"],
});

const server = restify.createServer();

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

const dateFormat = 'YYYY-MM-DD HH:mm:SS';

let books = [
  {
    id: 1,
    key: 'bookName',
    bookName: 'Foundation',
    author: 'Isaac Asimov',
    price: 12,
    isbn: 'ISBN 22222222',
    createdAt: dayjs().format(dateFormat),
    updatedAt: dayjs().format(dateFormat),
  },
];

server.get('/', function(req, res, next) {
  res.send(200, {
    data: {
      books,
    },
  });
});

server.post('/create', function(req, res, next) {
  const lastBookId = books.length > 0 ? books[books.length - 1].id : 0;
  const newBook = {
    id: lastBookId + 1,
    key: req.body.bookName,
    bookName: req.body.bookName,
    author: req.body.author,
    price: req.body.price,
    createdAt: dayjs().format(dateFormat),
    updatedAt: dayjs().format(dateFormat),
  };

  books.push(newBook);

  res.send(200, {
    data: {
      books,
    },
  });
});

server.post('/delete', function(req, res, next) {
  const { id } = req.body;

  books = books.filter(book => book.id !== parseInt(id));

  res.send(200, {
    data: {
      books,
    },
  });
});

server.post('/update', function(req, res, next) {
  const bookIndex = books.findIndex(book => book.id === parseInt(req.body.id));

  const updatedBook = {
    bookName: req.body.bookName,
    updatedAt: dayjs().format(dateFormat),
  };

  books[bookIndex] = { ...books[bookIndex], ...updatedBook };

  res.send(200, {
    data: {
      books,
    },
  });
});

server.listen(process.env.PORT || 8080, function() {
  console.log(server.name, server.url);
});