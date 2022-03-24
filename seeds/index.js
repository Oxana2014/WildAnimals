const express = require("express");
const mongoose = require("mongoose");
const Animal = require('../models/animal');
const animals = require("../seedhelper");

mongoose.connect('mongodb://localhost:27017/wild-animals', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const seedDB = async () => {
    await Animal.deleteMany({});
    for(let animal of animals)  {
        const a = new Animal(animal);
      a.images =  [
        {
          url: 'https://res.cloudinary.com/dswqbj1l9/image/upload/v1646902227/WildAnimals/nhmkwy3mwlcnf6ymcvir.jpg',
          filename: 'WildAnimals/nhmkwy3mwlcnf6ymcvir'
        },
        {
          url: 'https://res.cloudinary.com/dswqbj1l9/image/upload/v1646902228/WildAnimals/bbrlwbkobzrdm8y2eq6n.jpg',
          filename: 'WildAnimals/bbrlwbkobzrdm8y2eq6n'
        },
        {
          url: 'https://res.cloudinary.com/dswqbj1l9/image/upload/v1646902229/WildAnimals/bkhyd6qm4hayfxfuknn6.jpg',
          filename: 'WildAnimals/bkhyd6qm4hayfxfuknn6'
        },
        {
          url: 'https://res.cloudinary.com/dswqbj1l9/image/upload/v1646902230/WildAnimals/orut1fdo1j4lic6cu013.jpg',
          filename: 'WildAnimals/orut1fdo1j4lic6cu013'
        }
      ],
        a.author = "621756190a01990ba1557c15",
        a.geometry = { type: 'Point', coordinates: [ Math.random()*350 - 180, Math.random()*178-90 ] },
        await a.save();
    };
    
   
}

seedDB();