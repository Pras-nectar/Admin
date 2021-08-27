const mongoose= require("mongoose");
const db = process.env.DB_URL
mongoose.connect(db,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log(`mongo connection established`);
}).catch((err)=>console.log(err));