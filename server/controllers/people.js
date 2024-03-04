// let {people} = require('../data');
const People = require('../models/user');

// get function for all people
const readPeople = async(req,res)=>{
    // res.json({success:true, data:people});
    try {
        let people = await People.find({});
        // console.log(answer);
        res.json(people);
    } catch (error) {
        console.log(error)
    }
}

// post function for creating people
const createPeople = async(req,res)=>{
    try {
        let allPeople = await People.find({});
        let {username, email, password} = req.body;

        let newPerson = await People.create({username:username, email:email, password:password, userID:allPeople.length});
        allPeople = await People.find({});
        res.json(allPeople);

    } catch (error) {
        console.log(error);
    }
}

// put function for update people
const updatePeople = async(req,res)=>{
    try {
        let {userID} = req.params;
        let {score} = req.body;
        let changePerson = await People.findOne({ userID: userID });
        console.log(userID)
        console.log(score)
        console.log(changePerson.overallScore);
        console.log(changePerson.bestScore);

        let all = changePerson.overallScore;
        let overallScore = all + score;
        let best = changePerson.bestScore;
        if(score >= changePerson.bestScore){
            best = score;
        }

        let people = await People.findOneAndUpdate({userID:userID}, {score:score, overallScore:overallScore, bestScore:best});
        res.json(people);
    } catch (error) {
        console.log(error);
    }
}

// delete function for delete people
const deletePeople = async(req,res)=>{
    try {
        const {userID} = req.params;
        let person = await People.findOneAndDelete({userID:userID});
        res.json(person);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {readPeople, createPeople, updatePeople, deletePeople};