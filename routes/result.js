const {Router} = require ('express')
const router = Router()
const Mresult = require('../models/mresult')
//подключаем midleware auth
const auth = require('../middleware/auth')

router.get('/',auth, async (req, res) => {
    const mresults = await Mresult.find({"userId":req.user._id})
    res.render('result',{
        title:'результаты',
        isResult :true,
        mresults
        
    })
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
      }

    const mresult = await Mresult.findById(req.params.id)
    res.render('mresult-edit',{
        title: `Редактировать ${mresult.treename}`,
        mresult
    })
})

router.post('/edit', auth, async (req, res) => {
    const _id = req.body.id

    const result =  ({

        treename:req.body.treename,
        cols:req.body.cols,
        main_tab:req.body.inputtabvalue,
        titles:req.body.inputtabvalue1,
        rows:req.body.rows,
        key:req.body.key,
        ign_key:req.body.ign_key,
        atr_tab:req.body.inputtabvalue2,
        userId: req.user._id,
        
    })
    await Mresult.findByIdAndUpdate(_id, result)
    res.redirect('/result')
  })

router.post('/remove', auth, async(req, res) =>{
    try{
      await Mresult.deleteOne({
          //укажем условие, какой курс нужно удалить
          _id:req.body.id
      })
      //указыаем редирект на страницу отзывов, потому, что тот курс мы удалили
      res.redirect('/result')
    }catch(e){
        console.log(e)
    }
})



  // роутер отвечающий за открытие отзыва в отдельном окне
  router.get('/:id', async (req, res) => {
    const mresult = await Mresult.findById(req.params.id)
    res.render('mresult',{ 
        title:`${mresult.treename}`,
        mresult
    })
})


// function split() {
// 	var table=document.getElementById('tabvalue');
// 		colc=document.getElementById('cols').value;
// 		ret = '';

//     for (i=0;i<colc;i++) {

//         ret=ret+table.rows[0].cells[i].innerHTML+';';

//     }
// 	console.log(ret);
//     document.getElementById('inputtabvalue').value = ret;
// };

module.exports = router