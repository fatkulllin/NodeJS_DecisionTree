//подключаем фреймворк
const express = require('express')
//является результатом работы функции express
const app = express()
//модуль PATH позволяет работать с путями
const path = require('path')
//подключаем движок для составления динимический html файлы
const exphbs = require('express-handlebars')
/*ДЛЯ ТОГО ЧТОБЫ РОУТЫ РАБОТАЛИ НАМ НУЖНО ИМПОРТИРОВАТЬ В INDEX.JS*/
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const reviewsRoutes = require('./routes/reviews')
var https = require('https')
var fs = require('fs')
//Подключаем пакет express-session
const session = require('express-session')
//Подключаем пакет connect-mongodb-session
const MongoStore = require('connect-mongodb-session')(session)

//подключаем пакет csurf для защитыы фронтенда
const csrf = require('csurf')
const jspdf = require('jspdf-autotable')

//подключаем пакет connect-flash для вывода сообщений об ошибке при регистрации
const flash = require('connect-flash')

//TEST
const resultRoutes = require ('./routes/result')
const saveresultRoutes = require('./routes/saveresult')


/* ДЛЯ ПОДКЛЮЧЕНИЯ MONGO DB подключаем mongoose*/ 
const mongoose = require('mongoose')

//Route логина
const authRoutes = require('./routes/auth')


/*Подключаем middleware */
const varMiddleware = require('./middleware/variables')

//подключаем user middleware
const userMiddleware = require('./middleware/user')

/*Ссылка на покдлючение mongoDb */
const MONGODB_URI = `mongodb+srv://sliva:aLGTQ6H48rGFUl7j@cluster0-96ggy.mongodb.net/review` 

/* ВСЕ ЧТО НУЖНО, ЧТОБЫ РАБоТАТЬ С handlebars */
//создадим объект, где будем конфигурировать hbs
const hbs = exphbs.create({
    defaultLayout: 'main', 
    extname: 'hbs' //название экстеншена
})
const store = new MongoStore({
    collection:'sessions',
    uri:MONGODB_URI
})

//теперь, что бы зарегестрировать модуль hbs как движок для рендеринга html страниц
//мы обращаемся к объекту app, вызываем метод энжин, где первым параметром указываем назавание данного движка
//потом передаем объект hbs 
app.engine('hbs', hbs.engine)//регистрируем, что такой движок есть
//указываем название движка, с которым будем работать
app.set('view engine', 'hbs')
//указываем папку, где будут храниться наши шаблоны
app.set('views', 'views')

/*Создание временного пользователя */
// app.use( async (req, res, next)=>{
//     try{
//         const user = await User.findById('5e8e2550487d1d41b8433e51')
//         req.user = user
//         next()
//     }catch(e){
//       console.log(e)  
//     }
// })




/* ПОДКЛЮЧАЕМ КЛИЕНТСКИЕ СТИЛИ  */
app.use(express.static('public'))

app.use(express.urlencoded({extended:true}))

/*Настройка express-session*/
app.use(session({//добавляем новый мидлевеар на проект
    secret:'some secret value',
    resave: false,
    saveUninitialized: false,
    store //тоже самое что store:store
}))
//подключаем пакет csrf

//подключаем пакет connect-flash
app.use(flash())

app.use(csrf())
/*подключаем variavles*/
app.use(varMiddleware)
//Подключаем user middlware
app.use(userMiddleware)

/*ИСПОЛЬЗУЕМ РОУТ HOME.JS, ADD.JS, review.JS*/
//первым параметром передали префиксы(роуты)
app.use('/',homeRoutes)
app.use('/add',addRoutes)
app.use('/reviews', reviewsRoutes)

//TEST
app.use('/saveresult', saveresultRoutes)
app.use('/result', resultRoutes)

//Роут логина
app.use('/auth', authRoutes)



/* Запуск сервера и подключение к базе mongoo*/
//Запуск сервера
const PORT = process.env.PORT || 3000

//async чтобы использовать оператор await
async function start(){
    

//через try catche обрабатываем потенциальные ошибки
 try{
     /* Подключение MongoDB */
    
 
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify:false
    })

    /*Создание временного пользователя */
//     const candidate = await User.findOne()
//     if(!candidate){
//     const user = new User({
//         email: 'test@Mail.ru',
//         name:'test'
//     })
//     await user.save()
// }

    //является аналогм сервер, слшуает 3000 порт и по аналогии пишем колбэк функцию
    // app.listen(PORT, () =>{
    //     console.log(`server is running ${PORT}`)
    // })
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
      }, app)
      .listen(3000, function () {
        console.log('Example app listening on port 3000! Go to https://localhost:3000/')
      })
 }catch(e){
     console.log(e)
 }
}

start()