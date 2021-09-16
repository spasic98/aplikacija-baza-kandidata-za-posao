const mysql = require('mysql');

// povezivanje baze
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// pregled user
exports.view = (req: any, res: any) => {
  //konekcija user
  connection.query('SELECT * FROM user WHERE status = "active"', (err: any, rows: any) => {
    
    if (!err) {
      let removedUser = req.query.removed;
      res.render('home', { rows, removedUser });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// pretraga korisnika
exports.find = (req: any, res: any) => {
  let searchTerm = req.body.search;
  // konekcija user
  connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err: any, rows: any) => {
    if (!err) {
      res.render('home', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

exports.form = (req: any, res:any) => {
  res.render('add-user');
}

// dodavanje user
exports.create = (req:any, res:any) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  let searchTerm = req.body.search;

  
  connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err:any, rows:any) => {
    if (!err) {
      res.render('add-user', { alert: 'User added successfully.' });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


// izmena user
exports.edit = (req:any, res:any) => {
  // konekcija
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err:any, rows:any) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


// azuriranje user
exports.update = (req:any, res:any) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  
  connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err:any, rows:any) => {

    if (!err) {
      
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err:any, rows:any) => {
      
        
        if (!err) {
          res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// brisanje user
exports.delete = (req:any, res:any) => {


  connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err:any, rows:any) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    console.log('The data from beer table are: \n', rows);
  });

}

// View users
exports.viewall = (req:any, res:any) => {

  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err:any, rows:any) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });

}