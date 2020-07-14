const moment = require('moment');
const sendmail = require('sendmail')();
const path = require('path'); // used for file path
const fs = require('fs-extra');

function randomId() {
  return Math.floor(100000 * Math.random() * 900000);
}

module.exports = (req, res, next) => {
  const unauthorized = function () {
    return res.status(403).jsonp({
      error: 'User not authorized to access resource',
    });
  };

  const userNotFound = function () {
    return res.status(404).jsonp({
      error: 'User not found',
    });
  };

  const parseJWT = function () {
    if (req.headers.hasOwnProperty('authorization')) {
      const base64Url = req.headers.authorization.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(Buffer.from(base64, 'base64'));
    }

    return false;
  };

  const { db } = req.app;

  if (req.method === 'POST' && req.path === '/boards') {
    req.body.id = randomId();
    req.body.starred = false;
    req.body.created = moment().format('YYYY-MM-DD');
  }

  if (req.method === 'GET' && req.path.match(/\/boards\/\d*/g)) {
    const id = parseInt(req.path.replace('/boards/', ''));
    const board = db.get('boards').find({ id }).value();
    const lists = db.get('lists').filter({ boardId: id }).sortBy('order').value();
    const tasks = db.get('tasks').filter({ boardId: id }).sortBy('order').value();

    const result = { ...board, lists, tasks };

    const response = res.status(200).jsonp(result);

    return response;
  }

  if (req.method === 'POST' && req.path === '/lists') {
    req.body.id = randomId();
    req.body.created = moment().format('YYYY-MM-DD');
  }

  if (req.method === 'POST' && req.path === '/tasks') {
    req.body.id = randomId();
    req.body.created = moment().format('YYYY-MM-DD');
    req.body.deadline = moment().add(3, 'days').format('YYYY-MM-DD');
  }

  if (req.method === 'POST' && req.path === '/upload') {
    const name = req.headers.taskid;

    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename) => {
      fstream = fs.createWriteStream(`${__dirname}/public/uploaded/${name}_${filename}`);
      file.pipe(fstream);
      fstream.on('close', () => {
        res.status(201).jsonp({ path: `/public/uploaded/${name}_${filename}` });
      });
    });

    return;
  }

  if (req.method === 'POST' && req.path === '/reset') {
    db
      .setState({
        boards: [],
        tasks: [],
        users: [],
        lists: [],
      })
      .write();

    return res.sendStatus(204);
  }

  if (req.method === 'GET' && req.path === '/users') {
    
    const userData = parseJWT();
    if (!userData) return unauthorized();

    const id = parseInt(userData.sub);
    const user = db.get('users').find({ id }).value();
    const result = { user };
    
    if (!user) return userNotFound();

    const response = res.status(200).jsonp(result);

    return response;
  }

  if (req.method === 'POST' && req.path === '/welcomeemail') {

    // send welcome email if header is true
    sendmail({
      from: 'trelloapp@filiphric.sk',
      to: req.body.email,
      subject: 'Welcome to Trello app',
      html: 'Your account was successfully created!\nIn the meantime, subscribe to my <a href="https://www.youtube.com/channel/UCDOCAVIhSh5VpJMEfdak1OA">YouTube channel for Cypress tips!</a>',
    }, function(err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
    });

    let response = res.status(201).jsonp(req.body);
    return response;

  }

  next();
};
