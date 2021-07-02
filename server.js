if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const Article = require('./models/articles')
const articleRouter = require('./routes/articles')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    }, ()=>console.log("connected to Db!"))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('view engine', 'ejs')

app.use('/articles', articleRouter)

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

app.listen(5000)