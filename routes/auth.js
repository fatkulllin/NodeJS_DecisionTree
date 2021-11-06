const{Router} = require('express')
const bcrypt = require ('bcryptjs')//расширение для шифрования пароля
const router =Router()
const User = require('../models/user')


router.get('/login', async(req, res)=>{
    res.render('auth/login',{
        title:'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),//передаем ошибку на клиента. Флеш хранит все данные в сесси поэтому они со временем удалятся
        registerError: req.flash('registerError')
      })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
      res.redirect('/auth/login#login')
    })
  })

router.post('/login', async(req, res)=>{
  try{
      const {email, password} = req.body

    const candidate = await User.findOne({email})

    if(candidate){
      const areSame = await bcrypt.compare(password, candidate.password ) //проверка паролей. Проверяем пароль с паролем из бд
      if(areSame){
        req.session.user = candidate
          req.session.isAuthenticated = true
          req.session.save(err=>{ // для того чтоб не было ошибок и предыдущие две строчки выполнились, нужно сделать это
            if(err){
              throw err
            }
            res.redirect('/')
          })
      }else{
        req.flash('loginError', 'Неверный пароль')
        res.redirect('/auth/login#login')
      }
    }else{
      req.flash('loginError', 'Такого пользователя не существует')
      res.redirect('/auth/login#login')
    }
  }catch(e){
    console.log(e)
  }
  
})

router.post('/register', async(req, res)=>{
  try{
    const {email, password, repeat, name} = req.body
    const candidate = await User.findOne({email})

    if(candidate){
      req.flash('registerError', 'Пользователь с таким email уже существует')//первым параметром мы передаем ключ какого-то сообщений, напирмер error. вторым само сообщение
      res.redirect('/auth/login#register')
    }else{
      const hashPassword = await bcrypt.hash(password, 10) // шифрование пароля из 10 символов
      const user = new User({
        email, name, password: hashPassword  // передаем сюда этот хеш пассворд
      })
      await user.save()
      res.redirect('/auth/login#login')
    }
  }catch(e){
    console.log(e)
  }
})


module.exports = router