const {Router} = require ('express')
const router = Router()
const mresult = require('../models/mresult')
//подключаем midleware auth
const auth = require('../middleware/auth')

router.get('/', auth, (req,res)=>{
    res.render('saveresult',{
        title:'Сохранить результат'
    })
})

router.post('/', auth, async (req, res)=>{
    

const result = new mresult({

    
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
try{
    await result.save()
    //если отсутствовала ошибка
    res.redirect('/result')
}catch(e){
    console.log(e)
}   
})

module.exports = router