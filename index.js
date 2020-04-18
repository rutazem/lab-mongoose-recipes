const mongoose = require('mongoose');


// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model.js');

// Import of the data from './data.json'
const data = require('./data.json');


//require goes into the file (recipe/aksjkl/) and happens to be a model of mongoose

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

//const MONGODB_URI = ‘mongodb://localhost/recipe-app’;


// Connection to the database "recipe-app"- it's apromise to connect to the database and then do something
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })

  .then(() => {
    // Run your code here, after you have insured that the connection was made
    Recipe.create(data[0]).then((title) =>
      console.log(title)),


      Recipe.insertMany(data).then((recipesFromDatabase) => {

        //update, first paramater finds it, second parameter changes it
        let promise1 = Recipe.findOneAndUpdate({ title: 'Rigatoni alla Genovese' }, { duration: 100 }, { new: true }).then(result => {
          console.log("update is ======> ", result)
        })

        //// we don't need to wait until we need to modify to delete another recipe - they don't depend on each other. we can do it samultaneously - in paralel. they both only DEPEND on insert many.

        // you need to think what depends on each other.

        // delete things
        let promise2 = Recipe.findOneAndDelete({ title: 'Carrot Cake' }).then(() => { })


        //// closing the databse, and it depends on two promises above: promise1 and promise2

        Promise.all([promise1, promise2]).then(() => {
          mongoose.connection.close()
        })


      });



  })




  .catch(error => {
    console.error('Error connecting to the database', error);
  });


