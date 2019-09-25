# This is warehouse-manager API.
To run this app, first, you need to install all dependencies by running `npm install`. Then transpile the ES6 code to node.js executable ES5 code by running the command `npm run build`. Once transpiled, you can then execute the transpiled code by running `npm run server`.
Alternatively, this last two operations can be done at once just by running `npm start` which will build and execute the code at the same time.
Make sure to copy the data folder into the root of the compiled code -the `dist` folder- before executing or the program may log some error to the console (without crashing though).
The program is hosted at [https://warehouse-manager-api.herokuapp.com](https://warehouse-manager-api.herokuapp.com) which first sends a redirect to the swagger [documentation](https://app.swaggerhub.com/apis-docs/TundeMercy/warehouse-manager-doc/1.0.0) file.
