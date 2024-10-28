const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema({
   // id: {type: String, required: [true, 'id is required']},
    type: {type: String, required: [true, 'type is required']},
    name: {type: String, required: [true, 'name is required']},
    game: {type: String, required: [true, 'game is required']},
    platform: {type: String, required: [true, 'platform is required']},
    host: {type: String, required: [true, 'host is required']},
    details: {type: String, required: [true, 'details is required']},
    location: {type: String, required: [true, 'location is required']},
    date: {type: String, required: [true, 'date is required']},
    startTime: {type: String, required: [true, 'startTime is required']},
    endTime: {type: String, required: [true, 'endTime is required']},
    imageFlyer: {type: String, required: [false, 'imageFlyer is not required']}

},
{timestamps: true}
);

module.exports = mongoose.model('Event', eventSchema);


/*
const { DateTime } = require("luxon");
const {v4: uuidv4} = require('uuid');

const events = [
    {
        id: '1',
        type: 'tournament',
        name: 'Super Smash Tournament',
        game: 'Super Smash Bros',
        platform: 'Nintendo Switch',
        host: 'Jacob Niner',
        details: 'Fun Super Smash Bros tournament for all skill levels. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '10/25/2024',
        startTime: '2:00pm',
        endTime: '5:00pm',
        imageFlyer: '/images/smashbros.webp',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)

    },
    {
        id: '2',
        type: 'Tournament',
        name: 'Mario Party Tournament',
        game: 'Mario Party',
        platform: 'Nintendo Switch',
        host: 'Jacob Niner',
        details: 'Fun Mario Party tournament for all skill levels. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '11/1/2024',
        startTime: '4:00pm',
        endTime: '7:00pm',
        imageFlyer: '/images/marioparty.png',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '3',
        type: 'Tournament',
        name: 'Pokemon X&Y Tournament',
        game: 'Pokemon X&Y',
        platform: 'Nintendo DS',
        host: 'Jacob Niner',
        details: 'Exciting Pokemon X&Y tournament for all skill levels. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '10/19/2024',
        startTime: '9:00am',
        endTime: '12:00pm',
        imageFlyer: '/images/pokemon.png',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '4',
        type: 'free-play',
        name: 'Party Game Night',
        game: 'Jackbox',
        platform: 'Mobile',
        host: 'Jacob Niner',
        details: 'Fun night playing Jackbox games!. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '10/25/2024',
        startTime: '2:00pm',
        endTime: '5:00pm',
        imageFlyer: '/images/jackbox-five.png',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '5',
        type: 'free-play',
        name: 'Animal Crossing Night',
        game: 'Animal Crossing',
        platform: 'Nintendo Switch',
        host: 'Jacob Niner',
        details: 'Fun night playing Animal Crossing!. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '10/25/2024',
        startTime: '2:00pm',
        endTime: '5:00pm',
        imageFlyer: '/images/animalCrossing.jpg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '6',
        type: 'free-play',
        name: 'Animal Crossing Furniture Trade',
        game: 'Animal Crossing',
        platform: 'Nintendo Switch',
        host: 'Jacob Niner',
        details: 'Fun night playing Animal Crossing and trading furniture!. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '10/25/2024',
        startTime: '2:00pm',
        endTime: '5:00pm',
        imageFlyer: '/images/animalCrossing.jpg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    }
];

exports.find = ()=> events;

exports.findById = id => events.find(event=>event.id === id);

exports.save = function(event) {
    event.id = uuidv4();
    event.createdAt = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
    events.push(event);
}

exports.updateById = function(id, newEvent) {
    let event = events.find(event=>event.id === id);
    if (event) {
        event.type = newEvent.type;
        event.name = newEvent.name;
        event.game = newEvent.game;
        event.platform = newEvent.platform;
        event.host = newEvent.host;
        event.details = newEvent.details;
        event.location = newEvent.location;
        event.date = newEvent.date;
        event.startTime = newEvent.startTime;
        event.endTime = newEvent.endTime;
        event.imageFlyer = newEvent.imageFlyer;
        return true;
    } else {
        return false;
    }
}
exports.deleteById = function(id) {
    let index = events.findIndex(event => event.id === id);
    if (index !== -1) {
        events.splice(index, 1);
        return true;
    } else {
        return false;
    }
}

*/