const express = require('express')
const Article = require('./../models/articles')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("In articles")
})

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {

    const article = await Article.findById(req.params.id)

    try {
        return res.json({
            status: true,
            article: article
        })
    } catch (e) {
        res.json({
            status: false,
            error: e
        })
    }
})

router.get('/view/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if(article == null) return "Wrong Route"
    return res.render('articles/show', { article: article })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug }) 
    if(article == null) return res.json({
        status: false,
        error: "Blog ID Does not exist"
    })
    res.json({
        article: article
    })
})

router.post('/', async(req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))


router.put('/edit/:id', async (req, res, next) =>{
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))


router.delete('/:id', async (req, res) => {
    try {
        await Article.findById(req.params.id)
        return res.json({
            status: true,
            message: "successfully deleted the blog."
        })

    } catch (e) {
        return res.json({
            status: false,
            error: e
        })
    }
})


function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.author = req.body.author
        
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (error) {
            console.log(error)
            res.render(`articles/${path}`, {article: article})
        }
    }
}

module.exports = router