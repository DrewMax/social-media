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
.catch (err => res.status(400).json('Error: ' + err));
});

// POST to add a new friend to a user's friend list
router.route('/users/:userId/friends/:friendId').post((req, res) => {
User.findByIdAndUpdate(
req.params.userId,
{ $addToSet: { friends: req.params.friendId } },
{ new: true }
)
.then(updatedUser => res.json(updatedUser))
.catch(err => res.status(400).json('Error: ' + err));
});

// DELETE to remove a friend from a user's friend list
router.route('/users/:userId/friends/:friendId').delete((req, res) => {
User.findByIdAndUpdate(
req.params.userId,
{ $pull: { friends: req.params.friendId } },
{ new: true }
)
.then(updatedUser => res.json(updatedUser))
.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;