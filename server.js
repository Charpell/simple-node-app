const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://posts:posts1@ec2-18-225-37-200.us-east-2.compute.amazonaws.com:27017/posts', {useNewUrlParser: true} )
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('Err', err));



const Post = mongoose.model('Post', new mongoose.Schema({
  postText: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  postTimestamp: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
}));



app.get('/', (req, res) => {
  res.send('Node.js sample task')
})

app.get('/api/posts', async (req, res) => {
  try {
    const author = req.query.user
    if (!author) return res.status(400).json({ 'error': 'Provide an author name' })
    
    const posts = await Post.find({ author });
    res.send(posts)
  } catch(error) {
    res.status(400).send({ 'error': 'Network error' });
  }
})

app.post('/api/posts', async (req, res) => {
  try {
    const { postText, postTimestamp, author } = req.body

    const post = new Post({
      postText,
      postTimestamp,
      author
    })

    const result = await post.save();
    res.send(result)
  } catch (error) {
    res.status(400).json({ 'error': error.message})
  }
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})