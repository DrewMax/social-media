/api/users

GET all users

GET a single user by its _id and populated thought and friend data

POST a new user:

// example data
{
"username": "lernantino",
"email": "lernantino@gmail.com"
}
PUT to update a user by its _id

DELETE to remove user by its _id

BONUS: Remove a user's associated thoughts when deleted.

/api/users/:userId/friends/:friendId

POST to add a new friend to a user's friend list

DELETE to remove a friend from a user's friend list

/api/thoughts

GET to get all thoughts

GET to get a single thought by its _id

POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)

// example data
{
"thoughtText": "Here's a cool thought...",
"username": "lernantino",
"userId": "5edff358a0fcb779aa7b118b"
}
PUT to update a thought by its _id

DELETE to remove a thought by its _id

/api/thoughts/:thoughtId/reactions

POST to create a reaction stored in a single thought's reactions array field

DELETE to pull and remove a reaction by the reaction's reactionId value.

Here's the updated code:

const router = require('express').Router();
const User = require('../models/user.model');
const Thought = require('../models/thought.model');

// GET all users
router.route('/users').get((req, res) => {
User.find()
.populate('thoughts')
.populate('friends')
.exec((err, users) => {
if (err) {
res.status(400).json('Error: ' + err);
} else {
res.json(users);
}
});
});

// GET a single user by its _id and populated thought and friend data
router.route('/users/:id').get((req, res) => {
User.findById(req.params.id)
.populate('thoughts')
.populate('friends')
.exec((err, user) => {
if (err) {
res.status(400).json('Error: ' + err);
} else {
res.json(user);
}
});
});

// POST a new user
router.route('/users/add').post((req, res) => {
const username = req.body.username;
const email = req.body.email;
const newUser = new User({ username, email });

newUser.save()
.then(() => res.json('User added!'))
.catch(err => res.status(400).json('Error: ' + err));
});

// PUT to update a user by its _id
router.route('/users/update/:id').put((req, res) => {
User.findByIdAndUpdate(req.params.id, req.body, { new: true })
.then(updatedUser => res.json(updatedUser))
.catch(err => res.status(400).json('Error: ' + err));
});

// DELETE to remove user by its _id
router.route('/users/:id').delete((req, res) => {
User.findByIdAndDelete(req.params.id)
.then(() => res.json('User deleted!'))
.then(() => {
Thought.deleteMany({ username: req.params.id })
.then(() => res.json('Thoughts deleted!'))
.catch(err => res.status(400).json('Error: ' + err));
})
.catch