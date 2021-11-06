//подключаем роутер из экспресса
const {Router} = require('express')
//создаем объект роутера, вызвав функцию роуетр
const router = Router()
const Review = require('../models/review')
//подключаем midleware auth
const auth = require('../middleware/auth')

router.get('/', auth, (req, res)=>{
    res.render('add',{
        title: 'Добавить отзыв',
        isAdd: true
    })
})

//для обработки формы, формируется новый отзыв
router.post('/', auth, async (req, res)=>{
    const review = new Review({
        otzyv: req.body.otzyv,
        date: req.body.date,
        userId: req.user._id,
    })

    try{
        await review.save()
        //если отсутствовала ошибка
        res.redirect('/reviews')
    }catch(e){
        console.log(e)
    }   
})


module.exports = router