import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import withDB from './withDB'

const app = express();

app.use(bodyParser.json());

app.get('/api/articles/:name', async (req, res) => {
    const articleName = req.params.name;

    try {
        const client = await MongoClient.connect(
            'mongodb://localhost:27017',
            { userNewUrlParser: true, useUnifiedTopology: true}
        );
    
        const db = client.db('react-blog-db');
    
        const articleInfo = await db.collection('articles')
            .findOne({ name: articleName});
    
        res.status(200).json(articleInfo);
        client.close();       
    } catch (e) {
        res.status(500).json(e);
    }

});

app.post('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;

    try {
        const client = await MongoClient.connect(
            'mongodb://localhost:27017',
            { userNewUrlParser: true, useUnifiedTopology: true}
        );
    
        const db = client.db('react-blog-db');
    
        const articleInfo = await db.collection('articles')
            .findOne({ name: articleName});
    
        await db.collection('articles').updateOne(
            { name: articleName},
            { '$set': { upvotes: articleInfo.upvotes + 1}}
        );
    
        const updatedArticleInfo = await db.collection('articles')
            .findOne({ name: articleName });
    
        res.status(200).json(updatedArticleInfo);
        client.close();       
    } catch (e) {
        res.status(500).json(e);
    }
    
});

app.post('/api/articles/:name/add-comment', async (req, res) => {
    const articleName = req.params.name;
    const newComment = req.body.comment;

    try {
        const client = await MongoClient.connect(
            'mongodb://localhost:27017',
            { userNewUrlParser: true, useUnifiedTopology: true}
        );
    
        const db = client.db('react-blog-db');
    
        const articleInfo = await db.collection('articles')
            .findOne({ name: articleName});
    
        await db.collection('articles').updateOne(
            { name: articleName},
            { '$set': { comments: articleInfo.comments.concat(newComment) }}
        );
    
        const updatedArticleInfo = await db.collection('articles')
            .findOne({ name: articleName });
    
        res.status(200).json(updatedArticleInfo);
        client.close();       
    } catch (e) {
        res.status(500).json(e);
    }
})

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})