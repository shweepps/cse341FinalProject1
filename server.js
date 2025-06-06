const express = require('express');
const mongodb = require('./db/connection')
const app = express();

const port = process.env.PORT || 3000

app.use ('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => console.log(`DB connected. Server running on port: ${port}`));
  }
});


app.listen(port, () => {console.log('Running on port ' + port)})

