import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';


const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors())

// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch(error => {
//     console.error('Error connecting to MongoDB:', error);
//   });


app.get('/api/content', (req, res) => {
    res.send({ message: 'Hello World' })
})

app.listen(3001, () => {
    console.log('Server is listening on port 3001')
})