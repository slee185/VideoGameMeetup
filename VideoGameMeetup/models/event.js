const { DateTime } = require("luxon");
const {v4: uuidv4} = require('uuid');

const events = [
    {
        id: '1',
        name: 'Super Smash Tournament',
        game: 'Super Smash Bros',
        platform: 'Nintendo Switch',
        host: 'Jacob Niner',
        details: 'Fun Super Smash Bros tournament for all skill levels. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '10/25/2024',
        startTime: '2:00pm',
        endTime: '5:00pm',
        imageFlyer: '',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)

    },
    {
        id: '2',
        name: 'Rocket League Tournament',
        game: 'Rocket League',
        platform: 'PC',
        host: 'Jacob Niner',
        details: 'Fun Rocket League tournament for all skill levels. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '11/1/2024',
        startTime: '4:00pm',
        endTime: '7:00pm',
        imageFlyer: '',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '3',
        name: 'Pokemon X&Y Tournament',
        game: 'Pokemon X&Y',
        platform: 'Nintendo DS',
        host: 'Jacob Niner',
        details: 'Exciting Pokemon X&Y tournament for all skill levels. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '10/19/2024',
        startTime: '9:00am',
        endTime: '12:00pm',
        imageFlyer: '',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '4',
        name: 'IDK Tournament',
        game: 'Super Smash Bros',
        platform: 'Nintendo Switch',
        host: 'Jacob Niner',
        details: 'Fun Super Smash Bros tournament for all skill levels. Come stop by and participate or watch all the action!',
        location: 'Woodward Hall 2nd Floor lounge',
        date: '',
        startTime: '',
        endTime: '',
        imageFlyer: '',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    }
];


exports.find = ()=> events;

exports.findById = function(id) {
    return events.find(event=>event.id === id);
};

exports.save = function(event) {
    event.id = uuidv4();
    event.createdAt = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
    events.push(event);
}

exports.updateById = function(id, newEvent) {
    let event = events.find(event=>event.id === id);
    if (event) {
        event.name = newEvent.name;
        event.game = newEvent.game;
        // event.game = newEvent.game;
        // event...
        // event...
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