const withDB = async operations => {
    try {
        const client = await MongoClient.connect(
            'mongodb://localhost:27017',
            { userNewUrlParser: true, useUnifiedTopology: true}
        );
    
        const db = client.db('react-blog-db');
    
        await operations(db);

        client.close();       
    } catch (e) {
        console.log("DB error!");
    }
}

export default withDB;