import fs from 'fs';



function writeFile(file, data){
    return new Promise((resolved, reject) => {
        fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8' , (err) => {
            if(err) reject(err);
            resolved();
        });
    });
}

function readFile(file, callBack){
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if(err) return reject(err);
            callBack(JSON.parse(data))
            resolve();
        });
    }); 
}

export { writeFile, readFile};