// execute this file to seed data following model changes

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Course = require('../models/course');

mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch((err) => {
        console.log(err)
        console.log("OH NO, THERE'S BEEN AN ERROR")
    })


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Course.deleteMany({});  // delete existing data
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40) + 10
        const camp = new Course({
            author: "6300fa55352546bfc3c79f6f",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo laborum recusandae possimus laboriosam soluta reprehenderit tempora nihil expedita sed odit fuga eos, ipsum aut hic corporis harum rem? Excepturi, quasi!Iste, placeat. Voluptates nostrum eaque sint possimus, dolore architecto maiores, inventore commodi ipsum at placeat id, odit nesciunt eius reiciendis culpa. Harum voluptatibus id debitis aperiam vel voluptate saepe inventore.",
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] 
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dudxgdkl3/image/upload/v1661179132/YelpCamp/ktumwgcllaaidxduc8vl.jpg",
                    filename: "ktumwgcllaaidxduc8vl"
                }
            ]

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})