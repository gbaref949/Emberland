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
        let {name, age, task} = req.body;

        if(task == ''){
            task = 'none';
        }

        let newPerson = await People.create({name:name, age:age, userID:allPeople.length+1, task:task});
        allPeople = await People.find({});
        res.json(allPeople);

    } catch (error) {
        console.log(error);
    }
}

// put function for update people
const updatePeople = async(req,res)=>{
    try {
        let {email} = req.params;
        let {balance, cart} = req.body;
        let changePerson = People.findById(email)

        let bal = Number(changePerson.balance);
        bal += Number(balance)
        let car = changePerson.cart
        car.push(cart);

        let people = await People.findOneAndUpdate({email:email}, {balance: bal, cart:car});
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