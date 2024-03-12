const express = require('express')

const cors = require('cors')

const app = express()

const conn = require('./db/conn')

app.use(express.json())

app.use(cors({ credentials: true, origin: '*' }))

app.use(express.static('public'))

const UserRoutes = require('./routes/UserRoutes')
const BrincoRoutes = require('./routes/BrincoRoutes')
const AnelRoutes = require('./routes/AnelRoutes')
const ButtonRoutes = require('./routes/ButtonRoutes')
const BrocheRoutes = require('./routes/BrocheRoutes')
const NovidadeRoutes = require('./routes/NovidadeRoutes')
const PromocaoRoutes = require('./routes/PromocaoRoutes')

app.use('/users', UserRoutes)
app.use('/brincos', BrincoRoutes)
app.use('/aneis', AnelRoutes)
app.use('/buttons', ButtonRoutes)
app.use('/broches', BrocheRoutes)
app.use('/novidade', NovidadeRoutes)
app.use('/promocao', PromocaoRoutes)


conn
   .sync()
   .then(() => {
      app.listen(5000)
   })
   .catch((error) => console.log(error))
