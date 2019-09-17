import fs from 'fs';


function write(file, data){
    return new Promise((resolved, reject) => {
        fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8' , (err) => {
            if(err) return reject(err);
            resolved();
        });
    });
}

function read(file, callBack){
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if(err) return reject(err);
            callBack(JSON.parse(data));
            resolve();
        });
    }); 
}

async function readFile(file, callBack){
    try{
      await read(file, callBack);
    } catch(err){
      throw new Error(err);
    }
  }
  
  async function writeFile(file, data){
    try{
      await write(file, data);
      return 'written';
    }catch(err){
      throw new Error(err);
    }
  }

export { writeFile, readFile};