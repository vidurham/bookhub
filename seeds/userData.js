const {User} = require('../models');

const userdata = [
    {
        first_name: "Vince",
        last_name: "Durham",
        email:"theman@theman.com",
        password: "loko"
    },
    {
        first_name: "Tommy",
        last_name: "Looms",
        email:"theguy@guy.com",
        password: "root"
    },
    {
        first_name: "Groot",
        last_name: "Anderson",
        email:"groot@theman.com",
        password: "root"
    },
];

const seedUser = () => User.bulkCreate(userdata);

module.exports = seedUser;