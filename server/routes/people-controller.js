const express = require('express');
const router = express.Router();

const{createPeople, readPeople, updatePeople, deletePeople} = require("../controllers/people");

router.get('/', readPeople);
router.post('/', createPeople);
router.put('/:email', updatePeople);
router.delete('/:userID', deletePeople);

module.exports = router;