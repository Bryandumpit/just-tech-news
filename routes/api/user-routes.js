const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// GET /api/users THINK read all
router.get('/', (req,res) => {
    //access our User model and run .findAll() method
    User.findAll({
        attributes: {exclude: ['password']}//sets an attribute key and instructs the query to exclude the password column from being displayed.
    }) //findAll() method lets us query all of the users from the user table in the db
    //THINK: SELECT * FROM users;
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET /api/user/1 THINK read one user based on id specified req.params.id
router.get('/:id', (req,res)=>{
    User.findOne({//we can actually pass an argument through the findOne() method to help specify the query
        //instead of building a long SQL query SELECT * FROM users WHERE id = 1;
        include: [
            {
                model: Post,
                attributes: ['id','title','post_url','created_at']
            },
            {
                model: Comment,
                attributes: ['id','comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ],
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData=> {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err=>{
            console.log(err);
            res,status(500).json(err);
        })
});

//POST /api/users THINK create
router.post('/', (req,res)=> {
    //expects {username: 'string', email: '<string>@<string>.<string>', password: 'string'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    //SQL equivalent:
        //INSERT INTO users
        //  (username, email, password)
        //VALUES
        // ('username', 'email@email.com', 'password')
});

router.post('/login',(req,res)=>{
    //Query operation
    User.findOne({
        where:{
            email: req.body.email
        }
    })
    .then(dbUserData=>{
        if(!dbUserData){
            res.status(400).json({message: 'No user with that email address!'});
            return;
        }

        //res.json({user: dbUserData});

        //Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        
        if (!validPassword) {
            res.status(400).json({message: 'Incorrect password!'});
            return;
        }

        res.json({user: dbUserData, message: 'You are now logged in!'})
    })
})

//PUT /api/users/1 THINK update
router.put('/:id', (req,res)=>{
    //expects {username,email,password}
    //if req.body has exact key/value pairs to match the model, you can just use req.body instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData[0]) { // index[0] is the id(auto-populated in User model)
                res.status(404)
            }
            res.json(dbUserData);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
        /*
        THINK: UPDATE users
        SET username = 'username', email = 'email@email.com', password='password'
        WHERE id =1 (actually its :id) but example route is /api/users/1;
        */
});

//DELETE /api/users/1 THINK delete
router.delete('/:id', (req,res)=>{
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id'})
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
});

module.exports = router;