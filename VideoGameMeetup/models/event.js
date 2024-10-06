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
        date: '',
        startTime: '',
        endTime: '',
        imageFlyer: '',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)

    },
    {
        id: '2',
        name: 'Super Smash Tournament',
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
    },
    {
        id: '3',
        name: 'Super Smash Tournament',
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
    },
    {
        id: '4',
        name: 'Super Smash Tournament',
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