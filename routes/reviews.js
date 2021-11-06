//подключаем роутер из экспресса
const {Router} = require('express')
//создаем объект роутера, вызвав функцию роуетр
const router = Router()
//Определяем модель курсов
const Review = require('../models/review')
//подключаем midleware auth
const auth = require('../middleware/auth')


router.get('/', async (req, res) => {
    const reviews = await Review.find().populate('userId', 'name')
    res.render('reviews', {
        title: 'Отзывы',
        isReview: true,
        reviews
    })
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
      }

    const review = await Review.findById(req.params.id)
    res.render('review-edit',{
        title: `Редактировать ${review.title}`,
        review
    })
})

router.post('/edit', auth, async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Review.findByIdAndUpdate(id, req.body)
    res.redirect('/reviews')
  })

  router.post('/remove', auth, async(req, res) =>{
      try{
        await Review.deleteOne({
            //укажем условие, какой отзыв нужно удалить
            _id:req.body.id
        })
        //указыаем редирект на страницу отзывов, потому, что тот отзыв мы удалили
        res.redirect('/reviews')
      }catch(e){
          console.log(e)
      }
  })

  // роутер отвечающий за открытие отзыва в отдельном окне
  router.get('/:id', async (req, res) => {
    const review = await Review.findById(req.params.id).populate('userId', 'name')
    res.render('review',{ 
        title:`${review.userId.name}`,
        review
    })
})

module.exports = router