const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')

const path = require('path')
const {
    error
} = require('console')

const app = express()

const Posts = require('./posts.js')

mongoose.connect('mongodb+srv://root:NVVjgZ7o3LWZiOjo@nodejs.wtq0cz9.mongodb.net/peterson?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () {
    console.log('Conectado com sucesso!')
}).catch(function () {
    console.log(error.message)
})

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}))

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/pages'))

app.get('/', async (req, res) => {
    try {
        if (req.query.busca == null) {
            const posts = await Posts.find({}).sort({'_id': -1}).exec()
            
            const mappedPosts = posts.map(function(val) {
                return {
                    titulo: val.titulo,
                    img: val.img,
                    descricao: val.descricao || '',
                    descricaoCurta: val.descricaoCurta,
                    categoria: val.categoria,
                    slug: val.slug
                }
            })

            const postsTop = await Posts.find({}).sort({'views': -1}).limit(3).exec()

            const mappedPostsTop = postsTop.map(function(val){
                return {
                    titulo: val.titulo,
                    img: val.img,
                    descricao: val.descricao || '',
                    descricaoCurta: val.descricaoCurta,
                    categoria: val.categoria,
                    slug: val.slug,
                    views: val.views
                }
            })
            
            res.render('home', { posts: mappedPosts, postsTop: mappedPostsTop })
        } else {

            const postsBusca = await Posts.find({titulo: {$regex: req.query.busca, $options: 'i'}})

            if (postsBusca != null){
                console.log(postsBusca)
                res.render('busca', {postsBusca: postsBusca})
            }
        }
    } catch (error) {
        res.redirect('/')
    }
})

app.get('/:slug', async (req, res) => {
    try {
        const slug = req.params.slug
        const posts = await Posts.findOneAndUpdate({slug: slug}, {$inc: {views: 1}})

        if (posts != null){

            const postsTop = await Posts.find({}).sort({'views': -1}).limit(3).exec()

            const mappedPostsTop = postsTop.map(function(val){
                return {
                    titulo: val.titulo,
                    img: val.img,
                    descricao: val.descricao || '',
                    descricaoCurta: val.descricaoCurta,
                    categoria: val.categoria,
                    slug: val.slug,
                    views: val.views
                }
            })

            res.render('single', { posts: posts, postsTop: mappedPostsTop })
        }else{
            res.redirect('/')    
        }
    } catch (error) {
        res.redirect('/')
    }
})

app.listen(5000, () => {
    console.log('server rodando!')
})