var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema = new Schema({
    titulo: String,
    img: String,
    categoria: String,
    descricao: String,
    descricaoCurta: String,
    slug: String,
    autor: String,
    views: Number
}, {collection: 'posts'})

var Posts = mongoose.model('Posts', postSchema)

module.exports = Posts