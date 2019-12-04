const mongoose = require('mongoose')
		mongoose.connect('mongodb://localhost/Ac-db-app',{
			useCreateIndex: true,
			useNewUrlParser: true,
			useFindAndModify: false
		})
			.then(db => console.log('base de datos conectada'))
			.catch(err => console.log('error al conectar a la base de datos '+err))