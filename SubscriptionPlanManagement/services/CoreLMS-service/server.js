const sequelize = require('./src/config/db.js');
const app = require('./src/app.js');


const PORT = process.env.PORT || 8001;
const startServer = async () => {
    try{
        //Check db connection 
        await sequelize.authenticate();
        console.log('Connect db successfully!');
        app.listen(PORT, () => {
            console.log('Core service run at: http:127.0.0.1:8001');
        });
    }catch(error){
        console.log('Cannot connect to db:',error.message);
        process.exit(1);
    }
}

startServer();