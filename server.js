const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const helmet = require('helmet')
const connectDB = require('./config/connectDB')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const recordRoutes = require('./routes/recordRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
 
const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.use('/api/auth',authRoutes)

app.use('/api/users',userRoutes)

app.use('/api/records', recordRoutes)

app.use('/api/dashboard', dashboardRoutes)

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Welcome to the Finance System API')
})

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

startServer()
