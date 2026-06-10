const express= require('express')
const cors= require('cors')
const helmet= require('helmet');
const pool = require('./config/postgress');
const PORT= process.env.PORT || 3000;
const connectMongo= require('./config/mongodb.js')

const app = express();

// Definning the middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/health', (req,res)=>{
    return res.status(200).json({
        success: true,
        message: "Server is running"
    });
})

async function startServer(){
    try{
        await pool.query('Select NOW()');
        console.log("PostgreSQL Connected");
        await connectMongo();

        app.listen(PORT, ()=>{
            console.log("Server is running on the PORT", PORT);
        })
    }   
    catch(err){
        console.log("Server Start Failed: ", err);
        process.exit(1);
    }
}

startServer();

module.exports= app;
