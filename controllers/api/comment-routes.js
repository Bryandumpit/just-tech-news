const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', (req,res) => {
    Comment.findAll(
        {
            attributes: [
                'id',
                'comment_text',
                'post_id',
                'user_id'
            ]
        }
    )
        .then(dbCommentsData => res.json(dbCommentsData))
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        })
});

router.post('/', (req,res)=> {
    if(req.session){
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,

            //use the id from the session
            user_id: req.body.user_id,
        })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err=>{
                console.log(err);
                res.status(400).json(err);
            })
    }
    
})

router.put('/:id', (req,res)=>{
    Comment.update(
        {
        comment_text: req.body.comment_text
        },
        {where: {
            id:req.params.id
            }
        }
    )
        .then(updatedCommentsData => {
            if(!updatedCommentsData){
                res.status(404).json({error: 'No comment found with this id'})
                return;
            }
            res.json(updatedCommentsData)
        })
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        })
})

router.delete('/:id', (req,res)=> {
    Comment.destroy({
        where: {
            id: req.params.id
        },
    })
        .then(deletedCommentData => {
            if (!deletedCommentData) {
                res.status(404).json({error: 'No comment found with this id'});
                return;
            }
            res.json(deletedCommentData)
        })
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        })
})

module.exports = router;