//task
//1 apply get request on coderbyte api
//2 find data with age 32
//3 get the key of such value
//4 apply sha1 to it
//write it to file
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const { json } = require('stream/consumers');

https.get('https://coderbyte.com/api/challenges/json/age-counting',(res)=>{
    let data = '';
    res.on('data',(chunk)=>{
        data += chunk;
    })


//   "data": "key=1, age=32, key=2, age=30, key=3, age=32, key=4, age=45"}

    res.on('end',()=>{
        try{
            const parsedData = JSON.parse(data);
            const ageDataString = parsedData.data;
         
            const items = ageDataString.split(',');

//     items would look like :
//    [
//   "key=1", " age=32",
//   " key=2", " age=30",
//   " key=3", " age=32",
//   " key=4", " age=45"
// ]

   const resKeys = [];

   for(let i = 0 ; i < items.length    ; i+=2){
    const item = items[i].trim();
    const ageItem = items[i+1].trim();
    //remove white space from both

    if(ageItem && ageItem.includes("age=32")){
        const keyPair = item.split('=');
        const key = keyPair[1];
        resKeys.push(key);
        
        //resKeys = ["1", "3"];
    }
    
   }
   console.log("resKeys : " + resKeys);
    const fileContent = resKeys.join('\n')+'\n';
    fs.writeFile('output.txt', fileContent,(err)=>{
         if (err) throw err;

         //generate sha1
         const hash = crypto.createHash('sha1');
         
         hash.update(fileContent);
         
         console.log(hash.digest('hex'));
    });
        }catch (e) {
      console.log('Error parsing JSON:', e);
    }
    });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
