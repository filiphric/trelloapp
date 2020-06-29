module.exports = (req, res, next, db) => {

  if (req.method === 'POST' && req.path === '/boards') {
    let request = req.body
    let id = randomId()
    let fullBody = { id, ...request }

    db.get('boards').push(fullBody).write();
    let response = res.status(201).jsonp(fullBody)
    
    return response
  }
  next()
    
};