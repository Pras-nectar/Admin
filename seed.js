require("dotenv").config();
const mongoose = require("mongoose");

const UserDB=require("./models/User");
const ProductDB = require("./models/Product")
const CategoryDB = require("./models/Category")
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MONGOOSE CONNECTED")
});

Users =[
    {
        email: "nectars.jai@gmail.com",
        password: "nectars@123",
        role: "Admin",
        phoneNo: 9987273240,
        username: "Jai joshi"
    },
    {
        email: "nectars.akash@gmail.com",
        password: "nectars@123",
        role: "Doctor",
        phoneNo: 111122222,
        username: "Akash yadav"
    },
    {
        email: "nectars.ceo@gmail.com",
        password: "nectars@123",
        role: "SuperAdmin",
        phoneNo: 1238361381,
        username: "Suyash gupta"
    },
    {
        email: "customer@gmail.com",
        password: "123",
        role: "Customer",
        phoneNo: 1391799812,
        username: "Customer"
    },
    {
        email: "doc@gmail.com",
        password: "nectars@123",
        role: "Doctor",
        phoneNo: 111122222,
        username: "Doc saab",
        doctor: {
            doctorName: "Dr Lol",
            picture: "image",
            specialization: "Kuch nai",
            rating: 10,
            comments: [ "lol","lol1"],
            consultations: 10, 
            experience: "0 years",
            about: " kuch nai aata meko",
            documents: ["lol.pdf"]
        }
    },
    {
        email: "doc1231@gmail.com",
        password: "nectars@123",
        role: "Doctor",
        phoneNo: 111122222,
        username: "Bade doc saab",
        doctor: {
            doctorName: "Dr lmao",
            picture: "image",
            specialization: "bohot kuch",
            rating: 10,
            comments: [ "mast hai"],
            consultations: 10, 
            experience: "69 years",
            about: " bahut kuch aata hai meko",
            documents: ["lmao.pdf"]
        }
    }
]

/*
610d45b63608f8530c14de76 - Gel Aloevera Himalaya 
610d45b63608f8530c14de78 - Gel Aloevera Dabur 
610d45b63608f8530c14de7a - Gel Aloevera Dettol
610d45b63608f8530c14de7c - Gel Aloevera Khadi
610d45b63608f8530c14de7e - Cream Aloevera Himalaya
610d45b63608f8530c14de80 - Soap Mint Himalaya
610d45b63608f8530c14de82 - Soap Mint Dettol
610d45b73608f8530c14de84 - Soap Tulsi Dettol
610d45b73608f8530c14de86 - Soap Tulsi Himalaya
610d45b73608f8530c14de88 - Soap Tulsi Dabur
610d45b73608f8530c14de8a - Cream Almond Himalaya
*/

Products= [
    {
        name: "Himalaya Aloevera Gel SPF50",
        rating: 9,
        category: "610d45b63608f8530c14de76"
    },
    {
        name: "Himalaya Gel SuperCool",
        rating: 9,
        category: "610d45b63608f8530c14de76"
    },
    {
        name: "Dettol mint soap",
        rating: 8,
        category: "610d45b63608f8530c14de82"
    },
    {
        name: "Dettol Cool50",
        rating: 8,
        category: "610d45b63608f8530c14de82"
    },
    {
        name: "Dettol Energizer",
        rating: 8,
        category: "610d45b63608f8530c14de82"
    },
    {
        name: "Dabur Aloevera gel",
        rating: 8.5,
        category: "610d45b63608f8530c14de78"
    },
    {
        name: "Dabur Aloegizer",
        rating: 8.5,
        category: "610d45b63608f8530c14de78"
    },
    {
        name: "Dabur Fresh50",
        rating: 8.5,
        category: "610d45b63608f8530c14de78"
    },
    {
        name: "Dabur HealUltra",
        rating: 8.5,
        category: "610d45b63608f8530c14de78"
    },
    {
        name: "Himalaya mint soap",
        rating: 9,
        category: "610d45b63608f8530c14de80",
    },
    {
        name: "Mintiness ultra",
        rating: 9,
        category: "610d45b63608f8530c14de80",
    },
    {
        name: "Himalaya freezeFresh50",
        rating: 9,
        category: "610d45b63608f8530c14de80",
    },
    {
        name: "Khadi Aloevera gel",
        rating: 10,
        category: "610d45b63608f8530c14de7c"
    },
    {
        name: "Khadi Naturals ultrAloe",
        rating: 10,
        category: "610d45b63608f8530c14de7c"
    },
    {
        name: "Cream Himalaya",
        rating: 10,
        category: "610d45b63608f8530c14de7e"
    },
    {
        name: "SkinFriendly Himalaya",
        rating: 10,
        category: "610d45b63608f8530c14de7e"
    },
    {
        name: "Dettol tulsi soap 100 ",
        rating: 10,
        category: "610d45b73608f8530c14de84"
    },
    {
        name: "Dettol tulsi soap - Family pack",
        rating: 10,
        category: "610d45b73608f8530c14de84"
    },
    {
        name: "Himalaya tulsi soap",
        rating: 10,
        category: "610d45b73608f8530c14de86"
    },
    {
        name: "Himalaya tulsi Family pack 10",
        rating: 10,
        category: "610d45b73608f8530c14de86"
    },
    {
        name: "Himalaya tulsi premium soap (Extra Fragrance)",
        rating: 10,
        category: "610d45b73608f8530c14de86"
    },
    {
        name: "Dabur tulsi soap (Extra Fragrance)",
        rating: 10,
        category: "610d45b73608f8530c14de88"
    },
    {
        name: "Himalaya Almond cream",
        rating: 10,
        category: "610d45b73608f8530c14de8a"
    },
    {
        name: "Himalaya Almond premium cream",
        rating: 10,
        category: "610d45b73608f8530c14de8a"
    },
    {
        name: "Dettol Aloevera gel",
        rating: 10,
        category: "610d45b63608f8530c14de7a"
    },
    {
        name: "Dettol Aloevera gel premium",
        rating: 10,
        category: "610d45b63608f8530c14de7a"
    },//---------------------------------------------------------------------------
]

Categories = [
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Gel",
        category4: "Aloevera",
        category5: "Himalaya"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Gel",
        category4: "Aloevera",
        category5: "Dabur"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Gel",
        category4: "Aloevera",
        category5: "Dettol"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Gel",
        category4: "Aloevera",
        category5: "Khadi"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Cream",
        category4: "Aloevera",
        category5: "Himalaya"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Soap",
        category4: "Mint",
        category5: "Himalaya"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Soap",
        category4: "Mint",
        category5: "Dettol"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Soap",
        category4: "Tulsi",
        category5: "Dettol"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Soap",
        category4: "Tulsi",
        category5: "Himalaya"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Soap",
        category4: "Tulsi",
        category5: "Dabur"
    },
    {
        category1: "Cosmetics",
        category2: "Beauty",
        category3: "Cream",
        category4: "Almond",
        category5: "Himalaya"
    }
]


//NOTE:  It will delete the existing users first!!!!!!
const seedDbUsers = async() =>{
    await UserDB.deleteMany({});
    for(let user of Users){
        const new_user = new UserDB(user);
        await new_user.save();
    }
}

const seedDbProducts = async() =>{
    await ProductDB.deleteMany({});
    for(let product of Products){
        const catg = CategoryDB.findById(product.category);
        const new_product = new ProductDB({...product,catg});
        await new_product.save();
    }
}

const seedDbCategories = async() =>{
    await CategoryDB.deleteMany({});
    for(let category of Categories){
        const new_catg = new CategoryDB(category);
        await new_catg.save();
    }
}

const seedDbCategories2 = async() =>{
    
    for(let category of Categories){
        const {name,code,parent} = category
        let parentC={};
        try{
            if(parent){
                parentC = await CategoryDB.findOne({code: parent});
            }
            const parentCategory = parentC._id;
            const new_catg = new CategoryDB({name,code,parentCategory});
            await new_catg.save();
        }catch(e){
            console.log(`ERROR AT ${name} : ${code}`);
        }
        
    }
}

seedDbUsers().then(()=>{console.log(`seeded ${Users.length} users`);mongoose.connection.close();});
//seedDbProducts().then(()=>{console.log(`seeded ${Products.length} products`);mongoose.connection.close();});
//seedDbCategories().then(()=>{console.log(`seeded ${Categories.length} categories`);mongoose.connection.close();});
// {
//     "productName":"patanjali",
//     "manufacturer":"XYZ",
//     "description":"high quality product",
//     "ingredient":"plant,herbs",
//     "categoryID":"6110c397f03ecfd3d850a751",
//     "sku":[
//         {
//             "length":50,
//             "breadth":6,
//             "height":2,
//             "quantity":4,
//             "price":450,
//             "offer":"30%",
//             "deliveryCharge":50,
//              "numberOfUnit":5,
//              "lotNumber":"five",
//              "images":["image"]
//         }
//     ]
// }