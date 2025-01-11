const express = require("express");
const logger = require("morgan");

const app = express();
const Recipe = require("./models/Recipe.model"); // Import the Recipe model
// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES

// Example Route for the Root
app.get("/", (req, res) => {
  res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});
// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/recipes", async (req, res) => {
    try {
      // Extract recipe data from the request body
      const { title, instructions, level, ingredients, image, duration, isArchived } = req.body;
  
      // Create a new recipe document in the database
      const newRecipe = await Recipe.create({
        title,
        instructions,
        level,
        ingredients,
        image,
        duration,
        isArchived,
      });
  
      // Respond with status 201 (Created) and the created recipe
      res.status(201).json({
        message: "Recipe successfully created!",
        recipe: newRecipe,
      });
    } catch (error) {
      // Respond with status 500 (Internal Server Error) and the error message
      res.status(500).json({
        message: "Error creating recipe",
        error: error.message,
      });
    }
  });

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get('/recipes', async (req, res) => {
    try {
        // Fetch all recipes from the database
        const recipes = await Recipe.find();

        // Send the recipes as a JSON response
        res.status(200).json(recipes);
    } catch (error) {
        // In case of an error, return status 500
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route

app.get("/recipes/:id", async (req, res) => {
    try {
      const { id } = req.params; // Extract the ID from the route parameters
  
      // Find the recipe document by its ID
      const recipe = await Recipe.findById(id);
  
      if (!recipe) {
        // If no recipe is found, send a 404 response
        return res.status(404).json({
          message: "Recipe not found",
        });
      }
  
      // Send a 200 response with the recipe data
      res.status(200).json({
        message: "Recipe successfully retrieved!",
        recipe: recipe,
      });
    } catch (error) {
      // Handle errors and send a 500 response
      res.status(500).json({
        message: "Error retrieving the recipe",
        error: error.message,
      });
    }
  });
//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.put("/recipes/:id", async (req, res) => {
    try {
      const { id } = req.params; // Extract the recipe ID from the route parameters
      const updatedData = req.body; // Extract the updated data from the request body
  
      // Find the recipe by ID and update it with the provided data
      const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      });
  
      if (!updatedRecipe) {
        // If no recipe is found, return a 404 response
        return res.status(404).json({
          message: "Recipe not found",
        });
      }
  
      // Respond with status 200 and the updated recipe
      res.status(200).json({
        message: "Recipe successfully updated!",
        recipe: updatedRecipe,
      });
    } catch (error) {
      // Handle errors and send a 500 response
      res.status(500).json({
        message: "Error updating the recipe",
        error: error.message,
      });
    }
  });
//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete("/recipes/:id", async (req, res) => {
    try {
      const { id } = req.params; // Extract the recipe ID from the route parameters
  
      // Find the recipe by ID and delete it
      const deletedRecipe = await Recipe.findByIdAndDelete(id);
  
      if (!deletedRecipe) {
        // If no recipe is found, return a 404 response
        return res.status(404).json({
          message: "Recipe not found",
        });
      }
  
      // Respond with status 204 (No Content) if the recipe is successfully deleted
      res.status(204).send();
    } catch (error) {
      // Handle errors and send a 500 response
      res.status(500).json({
        message: "Error deleting the recipe",
        error: error.message,
      });
    }
  });

// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
