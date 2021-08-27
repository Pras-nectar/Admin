const {Category,Product} = require("../models")

const start = (startTime) => {
    startTime = new Date();
};

const end = (startTime) => {
    endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds 
    var seconds = Math.round(timeDiff);
    return seconds;
}



const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    return track[str2.length][str1.length];
};



const capitalize = ([first, ...rest]) => (first.toUpperCase() + rest.join('').toLowerCase());

const containsItem = function (result, list) {
    return list.some(function (item) {
        return item == result;
    })
}

const containsProduct = function (prod, list) {
    return list.some(function (item) {
        //console.log(typeof(item._id),String(prod._id),item.name===prod.name)
        return String(item._id) === String(prod._id);
    })
}

const getRecommCategories = async (q) => {
    const keywords = q.split(' ');
    console.log(keywords)
    let Categories = await Category.find({})
    let Recomm = [[], [], [], [], []];
    let Results, min, result, minCatg;
    for (let key of keywords) {
        if (key.length >= 1) {
            key = capitalize(key);
            min = Number.MAX_SAFE_INTEGER;
            minCatg = 0;
            //console.log("\n------------------\nKEY=",key);
            Results = Categories
                .map(obj =>
                ({
                    ...obj._doc,
                    LEVD5: levenshteinDistance(key, obj._doc.category5),
                    LEVD4: levenshteinDistance(key, obj._doc.category4),
                    LEVD3: levenshteinDistance(key, obj._doc.category3),
                    LEVD2: levenshteinDistance(key, obj._doc.category2),
                    LEVD1: levenshteinDistance(key, obj._doc.category1),
                }))
            //console.log(Results);                    
            console.log(`${key} \n====================\n`)
            Results.sort((a, b) => (a.LEVD5 - b.LEVD5));
            min = Math.min(min, Results[0].LEVD5)
            result = Results[0].category5;
            minCatg = 5;
            //console.log(`Category 5: ${result} : ${max}\n`);

            Results.sort((a, b) => (a.LEVD4 - b.LEVD4));
            min = Math.min(min, Results[0].LEVD4)
            result = (Results[0].LEVD4 == min ? Results[0].category4 : result);
            minCatg = (Results[0].LEVD4 == min ? 4 : minCatg)
            //console.log(`Category 4: ${result} : ${max}\n`);

            Results.sort((a, b) => (a.LEVD3 - b.LEVD3));
            min = Math.min(min, Results[0].LEVD3)
            result = (Results[0].LEVD3 == min ? Results[0].category3 : result);
            minCatg = (Results[0].LEVD3 == min ? 3 : minCatg)
            //console.log(`Category 3: ${result} : ${max}\n`);

            Results.sort((a, b) => (a.LEVD2 - b.LEVD2));
            min = Math.min(min, Results[0].LEVD2)
            result = (Results[0].LEVD2 == min ? Results[0].category2 : result);
            minCatg = (Results[0].LEVD2 == min ? 2 : minCatg)
            //console.log(`Category 2: ${result} : ${max}\n`);

            Results.sort((a, b) => (a.LEVD1 - b.LEVD1));
            min = Math.min(min, Results[0].LEVD1)
            result = (Results[0].LEVD1 == min ? Results[0].category1 : result);
            minCatg = (Results[0].LEVD1 == min ? 1 : minCatg)
            console.log(`Category ${minCatg} : ${result} : ${min}\n`);

            if (minCatg >= 1 && minCatg <= 5) {
                (!containsItem(result, Recomm[minCatg - 1]) && Recomm[minCatg - 1].push(result))
            }
        }
    }
    return Recomm;
}

const permutations = (arrays, i) => {
    if (i == arrays.length)
        return [[]];
    let res_next = permutations(arrays, i + 1)
    res = []
    arrays[i].forEach(
        (item, index) => {
            res_next.forEach(
                (arr, ind) => {
                    let n = [item];
                    res.push(n.concat(arr));
                }
            )
        });
    return res
}

// const comb = (inp)=>{                          
//       let subsets = []
//       let s = [];                  
//       for(let k=1;k<=inp.length;k++){
//       if (k <= inp.length) {
//           for (var i = 0; (s[i] = i) < k - 1; i++);  
//           subsets.push(getSubset(inp, s));
//           for(;;) {
//               let i;
//               // find position of item that can be incremented
//               for (i = k - 1; i >= 0 && s[i] == inp.length - k + i; i--); 
//               if (i < 0) {
//                   break;
//               }
//               s[i]++;                    // increment this item
//               for (++i; i < k; i++) {    // fill up remaining items
//                   s[i] = s[i - 1] + 1; 
//               }
//               subsets.push(getSubset(inp, s));
//           }
//       }}
//       return subsets;
//   }

const comb = (inp, START_LIMIT) => {
    let subsets = []
    let s = [];
    for (let k = START_LIMIT; k <= inp.length; k++) {
        if (k <= inp.length) {
            for (var i = 0; (s[i] = i) < k - 1; i++);
            subsets.push(getSubset(inp, s));
            for (; ;) {
                let i;
                // find position of item that can be incremented
                for (i = k - 1; i >= 0 && s[i] == inp.length - k + i; i--);
                if (i < 0) {
                    break;
                }
                s[i]++;                    // increment this item
                for (++i; i < k; i++) {    // fill up remaining items
                    s[i] = s[i - 1] + 1;
                }
                subsets.push(getSubset(inp, s));
            }
        }
    }
    return subsets;
}
// generate actual subset by index sequence
const getSubset = (input, subset) => {
    let result = [];
    for (let i = 0; i < subset.length; i++)
        result.push(input[subset[i]])
    return result;
}

const getProductsByQuery = async function (q, MAX_PROD_SIZE) {
    var startTime = new Date();
    q = q.trim();
    const Recomm = await getRecommCategories(q);
    let Recomm2 = [];
    let products = []//new Set();
    for (let i = 4; i >= 0; i--) {
        if (Recomm[i].length > 0) {
            let list = [];
            list.push(i)
            list.push(Recomm[i])
            Recomm2.push(list)
        }
    }
    let combA = comb(Recomm2, 1);
    for (let j = combA.length - 1; j >= 0; j--) {
        let Indexes = [], Arrays = [];
        for (let k = 0; k < combA[j].length; k++) {
            Indexes.push(combA[j][k][0]);
            Arrays.push(combA[j][k][1]);
        }
        //console.log(Arrays,Indexes);
        let Permutes = permutations(Arrays, 0);
        let FinalObj = [];
        Permutes.forEach(
            (item, index) => {
                let obj = {};
                item.forEach(
                    (str, i) => {
                        let indx = (Indexes[i] + 1).toString();
                        obj[`category${indx}`] = str;
                    }
                )
                FinalObj.push(obj);
            }
        )

        //console.log(FinalObj)
        for (let i = 0; i < FinalObj.length; i++) {
            let catgRecomm = await Category.find({ ...FinalObj[i] }).populate({ path: "productsOfCatg" });
            for (let m = 0; m < catgRecomm.length; m++) {
                let p = await catgRecomm[m].populate({ path: "productsOfCatg" });
                if (p) {
                    for (let l = 0; l < p.productsOfCatg.length; l++) {
                        (!containsProduct(p.productsOfCatg[l], products) && products.push(p.productsOfCatg[l]))
                        //(!products.has(p.productsOfCatg[l]) && products.add(p.productsOfCatg[l]));
                        if (products.size >= MAX_PROD_SIZE) {
                            // const productsArr = Array.from(products)
                            console.log("Products size = ", products.length)
                            var endTime = new Date();
                            var timeDiff = endTime - startTime; //in ms
                            console.log(`Time Taken = ${timeDiff} milli-seconds`);
                            return products;
                        }
                    }
                }
            }
        }

    }
    // const productsArr = Array.from(products)
    var endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
    console.log(`Time Taken = ${timeDiff} milli-seconds`);
    console.log("Products size = ", products.length)
    return products;
}

const getProductsByTitle = async (q, THRESHOLD_VALUE) => {
    const products = await Product.find({});
    q = q.trim();
    const keywords = q.split(' ');
    for (let i = 0; i < products.length; i++) {
        let min = Number.MAX_SAFE_INTEGER;
        let sum = 0;
        if (products[i].productName) {
            const keywords1 = products[i].productName.split(' ');
            for (let key of keywords) {
                key = key.toLowerCase();
                for (let key1 of keywords1) {
                    //min = Math.min(min,levenshteinDistance(key,key1.toLowerCase()));
                    sum += levenshteinDistance(key, key1.toLowerCase());
                }
            }
            products[i] = { ...products[i]._doc, LEVD: sum };
        }
    }
    const result = products
        .sort((a, b) => (a.LEVD - b.LEVD))
        .filter(prod => prod.LEVD <= THRESHOLD_VALUE);
    return result;
}

const getRecommProducts = async (categories, MAX_PROD_SIZE) => {
    let { category1, category2, category3, category4, category5 } = categories;
    let categoryArr = [["1", category1], ["2", category2], ["3", category3], ["4", category4], ["5", category5]], products = [];
    let combA = comb(categoryArr, 4);
    for (let i = combA.length - 1; i >= 0; i--) {
        if (combA[i].length >= 4) {
            let obj = {};
            combA[i].forEach(
                (arr, i) => {
                    obj[`category${arr[0]}`] = arr[1];
                }
            )
            let catgRecomm = await Category.find({ ...obj }).populate({ path: "productsOfCatg" });
            for (let m = 0; m < catgRecomm.length; m++) {
                let p = await catgRecomm[m].populate({ path: "productsOfCatg" });
                if (p) {
                    for (let l = 0; l < p.productsOfCatg.length; l++) {
                        (!containsProduct(p.productsOfCatg[l], products) && products.push(p.productsOfCatg[l]))
                        if (products.length >= MAX_PROD_SIZE) {
                            console.log("Products size = ", products.length)
                            return products;
                        }
                    }
                }
            }
        } else
            break
    }
    console.log("Products size = ", products.length)
    return products;
}

const getProductsByCategory = async(category,MAX_PROD_SIZE) => {
    let products = [],obj={}
    for(const catg in category){
        if(category[catg] && (catg==='category1' || catg==='category2' ||catg==='category3' ||catg==='category4' ||catg==='category5'))
            obj[catg] = category[catg];
    }
    let catgRecomm = await Category.find({...obj}).populate({ path: "productsOfCatg" });
    for (let m = 0; m < catgRecomm.length; m++) {
        let p = await catgRecomm[m].populate({ path: "productsOfCatg" });
        if (p) {
            for (let l = 0; l < p.productsOfCatg.length; l++) {
                (!containsProduct(p.productsOfCatg[l], products) && products.push(p.productsOfCatg[l]))
                if (products.length >= MAX_PROD_SIZE) {
                    console.log("Products size = ", products.length)
                    return products;
                }
            }
        }
    }
    console.log("Products size = ", products.length)
    return products;
}

module.exports = {
    getProductsByQuery,
    getProductsByTitle,
    getProductsByCategory,
    getRecommProducts
}