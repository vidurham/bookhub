const router = require('express').Router();
const { writeToJSONsearch} = require('../../lib/account-data');
const search = require('../../data/search');

//POST /api/search/
router.post('/', (req, res) => {
    // write to file json account data
    console.log(req.body)
    if (!req.body) {
      res.status(400).send("The account info is missing or not formatted correctly.");
    } else {
      writeToJSONsearch(req.body);
      console.log(req.body);
      res.json({message: " info submitted"});
    }
});


module.exports = router;
  