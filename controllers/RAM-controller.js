'use strict'

var ACModel = require('../models/RAM-model'),
    db = require('../models/db.js'),
    formidable = require('formidable'),
    fse = require('fs-extra'),
    // algolia = require('../models/RAM-Algolia'),
    ACController = () => {}
ACController.push = (req, res, next) => {
    var date = req.body.fecha,
        arrayfecha = date.split("-"),
        dia = arrayfecha[arrayfecha.length - 1]
    let id = req.body.acuerdo_id,
        miFechaPasada = new Date(date),
        dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
        idmongo = id,
        dia_semana = dias[miFechaPasada.getUTCDay()] + "-" + dia,
        AC = {
            acuerdo_id: id,
            nro_acuerdo: req.body.nro_acuerdo,
            fecha: date,
            dia_sem: dia_semana,
            detalle: req.body.detalle
        }
    ACModel.push(idmongo, id, AC, (err, l) => {
        if (err) {
            let locals = {
                title: `Error al salvar el registro con el id: ${AC.acuerdo_id}`,
                description: "Error de Sintaxis",
                error: err
            }
            res.render('error', locals)
        } else {
            res.redirect("/S_U_E:guardado")
        }
    })
}

ACController.update = (req, res, next) => {
    var date = req.body.fecha,
        arrayfecha = date.split("-"),
        dia = arrayfecha[arrayfecha.length - 1]
    let id = req.params._id,
        miFechaPasada = new Date(date),
        dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
        idmongo = req.body.acuerdo_id,
        dia_semana = dias[miFechaPasada.getUTCDay()] + "-" + dia,
        AC = {
            acuerdo_id: req.body.acuerdo_id,
            nro_acuerdo: req.body.nro_acuerdo,
            fecha: date,
            dia_sem: dia_semana,
            detalle: req.body.detalle
        }
    console.log(id)

    ACModel.push(idmongo, id, AC, (err, l) => {
        if (err) {
            let locals = {
                title: `Error al salvar el registro con el id: ${AC.acuerdo_id}`,
                description: "Error de Sintaxis",
                error: err
            }

            res.render('error', locals)
        } else {
            res.redirect("/S_U_E:actualizado")
        }
    })
}

ACController.formxlsx = (req, res, next) => {
    let locals = {
        title: 'Subir datos desde excel',
        footer: 'El archivo de excel sera copiado y los datos introducidos en la ',
        cite: 'Base de Datos',
        op: 'search',
        pre: "no"
    }
    res.render("Copiar_guardar", locals)
}

function myid(num){
    var letras_a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        letras_A = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    var _id = {}
    ACModel.getAll((err,rows)=>{
        if(err)
            console.log(err)
        else{
            for (var i = 0; i < num; i++) {
                // console.log('entro')
                var m_id = "AC_"
                for (var j = 0; j < 3; j++) {
                    m_id += letras_a[Math.round(Math.random() * 25)] + Math.round(Math.random() * 9) + letras_A[Math.round(Math.random() * 25)]
                }
                rows.forEach((ram) => {
                    while (m_id == ram.acuerdo_id) {
                        for (var k = 0; k < 1; k++) {
                            m_id += letras_a[Math.round(Math.random() * 25)] + Math.round(Math.random() * 9) + letras_A[Math.round(Math.random() * 25)]
                        }
                    }
                })
                _id[i] = m_id
                return _id[i]
            }
        }
    })
}

ACController.xls_CandS = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form
        .parse(req, function(err, fields, files) {})
        .on('progress', function(bytesReceived, bytesExpected) {
            let percentCompleted = (bytesReceived / bytesExpected) * 100
            console.log(percentCompleted.toFixed(2))
        })
        .on('error', function(err) {
            console.log(err)
        })
        .on('end', function(fields, files) {
            //Ubicacion temporal del archivo que se sube
            let tempPath = this.openedFiles[0].path,
                // El nombre del archivo subido
                fileName = this.openedFiles[0].name,
                // Nueva ubicacion
                newLocation = './upload/' + fileName
                // console.log(this.openedFiles[0])
            fse.copy(tempPath, newLocation, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    
                    console.log('El archivo  se subio con exito :)')
                    var array = ACModel.Converter_xlsx_json("./upload/" + fileName),
                        cont = 0
                    for (let i = 0; i < array.length; i++) {
                        console.log(array[i])
                        var nro_acuerdo,fecha,detalle
                        array[i].forEach(function(ac) {
                            if(ac.__EMPTY_1 != undefined){
                                console.log(ac.__EMPTY_5)
                                if(cont==0){  
                                     nro_acuerdo = ac.__EMPTY_1
                                     fecha = ac.__EMPTY_3
                                     detalle = ac.__EMPTY_5
                                     // console.log(cont)
                                }else{
                                    console.log(myid(1))
                                    let nro_acuerdo_d = ac.__EMPTY_1,
                                        date = new  Date ((ac.__EMPTY_3 - ( 25567  +  1 )) * 86400 * 1000 ),
                                        dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
                                        dia = date.getDate(),
                                        mes = date.getMonth(),
                                        yyy = date.getFullYear(),
                                        fecha_d =  yyy + '-' + mes + '-' + dia,
                                        dia_semana = dias[date.getUTCDay()] + "-" + dia,
                                        detalle_d = ac.__EMPTY_5
                                }
                            } else if(nro_acuerdo != undefined){
                                    let nro_acuerdo_d = ac[nro_acuerdo],
                                        date = new  Date ((ac[fecha] - ( 25567  +  1 )) * 86400 * 1000 ),
                                        dia = date.getDate(),
                                        mes = date.getMonth(),
                                        yyy = date.getFullYear(),
                                        fecha_d =  yyy + '-' + mes + '-' + dia,
                                        detalle_d = ac[detalle]
                                        console.log("numero_acuerdo " + nro_acuerdo_d + " Fecha " + fecha_d + " detalle " + detalle_d)
                            }else{ 
                                var key = Object.keys(ac)
                                for(var i=0; i < key.length; i++){
                                    if(key[i].toLowerCase().indexOf('acu') != -1)
                                        // console.log(key[i])
                                        nro_acuerdo = key[i]
                                    if(key[i].toLowerCase().indexOf('fe') != -1)
                                        // console.log(key[i])
                                        fecha = key[i]
                                    if(key[i].toLowerCase().indexOf('deta') != -1) 
                                        // console.log(key[i])
                                        detalle = key[i]
                                }
                                return false
                            }
                            cont = 1 + cont
                        })
                    }
                    console.log(cont)
                    let locals = {
                        title: 'Subir datos desde excel',
                        footer: 'El archivo de excel ha sido copiado y los datos introducidos en la ',
                        cite: 'Base de Datos',
                        data_save: "Datos guardados con exito",
                        op: 'search',
                        data: array,
                        // id: _id,
                        pre: "si"
                    }
                    res.render("Copiar_guardar", locals)
                }
            })
        })
}

ACController.getAll = (req, res, next) => {
    var letras_a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        letras_A = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        cant = req.params.cant,
        m_idarray = [],
        elim = ""

    let H_D = req.params.value,
        perPage = 10,
        savee = req.params.guardado,
        childKey = "no paso",
        c, save, num = 0,
        cont,
        page = req.params.page || 1
    console.log(page)
    ACModel.getAll(perPage, page, (err, rows) => {
        // navigator.onLine ? console.log('online') : console.log('offline');
        db.countDocuments((err, count) => {
            if (err) {
                let locals = {
                    title: `Error al obtener los datos`,
                    description: "Error de Sintaxis",
                    error: err
                }
                res.render('error', locals)
            } else {
                console.log(count)
                for (var i = 0; i < 1; i++) {
                    // console.log('entro')
                    var m_id = "AC_"
                    for (var j = 0; j < 3; j++) {
                        m_id += letras_a[Math.round(Math.random() * 25)] + Math.round(Math.random() * 9) + letras_A[Math.round(Math.random() * 25)]
                    }
                    rows.forEach((ram) => {
                        while (m_id == ram.acuerdo_id) {
                            for (var k = 0; k < 1; k++) {
                                m_id += letras_a[Math.round(Math.random() * 25)] + Math.round(Math.random() * 9) + letras_A[Math.round(Math.random() * 25)]
                            }
                        }
                    })
                    m_idarray[i] = m_id
                }
                if (H_D == ":agregar") {
                    cont = 'si'
                    num = 1
                } else if (H_D == ":guardado") {
                    save = "Acuerdo guardado con exito"
                    cont = 'si'
                    num = 1
                } else if (H_D == ":actualizado") {
                    save = "Acuerdo actualizado con exito"
                    num = 2
                } else if (H_D == ":sincro") {
                    save = "Base de datos sincronizada con exito"
                    num = 2
                }
                if (String(H_D).indexOf(":Habilitar") != -1) {
                    c = 'false'
                    elim = "S_U_E:Habilitar/"
                    if (H_D == ":Habilitar2")
                        save = "Acuerdo eliminado con exito"
                } else if (H_D == ":Varios") {
                    c = 'false_v'
                } else {
                    c = 'true_defect'
                }
                if (rows.length <= 0) {
                    ACModel.getConection(err => {
                        if (err) {
                            console.log("No connection");
                            locals = {
                                title: `Error al obtener los datos`,
                                description: "Error de conexión",
                                errors: 'Asegurate de estar conectado a internet la primera vez que te conectas a la aplicación'
                            }
                            res.render('error', locals)
                        } else {
                            console.log("Connected");
                            ACModel.getAllFirebase(snapshot => {
                                if (snapshot.exists()) {
                                    var locals = {
                                        title: 'Acuerdos Municipales',
                                        title2: 'Agregar Acuerdo Municipal',
                                        cont: cont,
                                        disables: c,
                                        data: rows,
                                        elims: elim,
                                        previous: parseInt(page) - 1,
                                        current: page,
                                        next: parseInt(page) + 1,
                                        pages: Math.ceil(count / perPage),
                                        data_save: save,
                                        data_id: m_idarray,
                                        buttons: 'si'
                                    }
                                } else {
                                    var locals = {
                                        title: 'Acuerdos Municipales',
                                        title2: 'Agregar Acuerdo Municipal',
                                        cont: cont,
                                        disables: c,
                                        data: rows,
                                        elims: elim,
                                        previous: parseInt(page) - 1,
                                        current: page,
                                        next: parseInt(page) + 1,
                                        pages: Math.ceil(count / perPage),
                                        data_save: save,
                                        data_id: m_idarray,
                                        buttons: 'no'
                                    }
                                }
                                res.render('index', locals)
                            })
                        }
                    })
                } else {
                    var locals = {
                        title: 'Acuerdos Municipales',
                        title2: 'Agregar Acuerdo Municipal',
                        cont: cont,
                        disables: c,
                        data: rows,
                        elims: elim,
                        previous: parseInt(page) - 1,
                        current: page,
                        next: parseInt(page) + 1,
                        pages: Math.ceil(count / perPage),
                        data_save: save,
                        data_id: m_idarray,
                        buttons: 'si'
                    }
                    res.render('index', locals)

                }
            }
        })
    })
}

ACController.close_reset_sync = (req, res, next) => {
    let closeORreset = req.params.CoRoS,
        id, num = 1

    if (closeORreset == ":Close") {
        id = "Close"
        num = 1
    } else if (closeORreset == ":Restart") {
        id = "Restart"
        num = 1
    } else if (closeORreset == ":Firebase") {
        num = 0
    } else if (closeORreset == ":Syncfirebase") {
        num = 2
    } else if (closeORreset == ":SyncMongo") {
        num = 2
    } else if (closeORreset == ":xlsx") {
        num = 3
    }
    if (num == 3) {
        let libro = req.params.value
        ACModel.cccc(path, name, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('El archivo  se subió con éxito :)')
                    res.redirect("/")
                }

            })
            // var datos_excel = ACModel.Converter_xlsx_json("C:/Users/edwar/Documents/ordenado/Carpetas/ejj/Ac_804004425/controllers/Libro1.xlsx")

    } else if (num == 1) {
        ACModel.close_reset(id, (err, stdout, stderr) => {
            // return (err) ? console.log(`Archivo no encontrado ${err.stack}`) : console.log(`Archivo encontrado: stdout ${stdout}, stderr ${stderr} `)
        })
        res.redirect('/')
    } else
    if (num == 2) {
        console.log('entroooooooo')
        ACModel.SyncMongo((err, cc) => {
                if (err) {
                    console.log('error ' + err)
                } else {
                    console.log('guardado')
                    res.redirect('/S_U_E:sincro')
                }
            })
            // res.redirect('/')
    } else {
        let H_D = "no",
            save,
            childKey = "no paso",
            c = "no"
        ACModel.getAllFirebase(snapshot => {
            var childKey = {},
                rows, isss = 0
            snapshot.forEach(function(childSnapshot) {
                rows = snapshot.val()
                isss++
            });
            if (H_D == ":Habilitar") {
                c = 'false'
            }
            if (H_D == ":Habilitar2") {
                c = 'false'
                save = "Acuerdo eliminado con exito"
            } else if (H_D == ":Varios") {
                c = 'false_v'
            } else {
                c = 'true_defect'
            }
            let locals = {
                title: 'Acuerdos Municipales',
                disables: c,
                data: rows,
                data_save: save
            }
            console.log(locals)
            res.render('index_firebase', locals)
        })
    }
}

ACController.getOne = (req, res, next) => {
    let acuerdo_id = req.params._id
    console.log(acuerdo_id)

    ACModel.getOne(acuerdo_id, (err, rows) => {
        // let rows = snapshot.val(),
        let locals = {
                title: 'Acuerdos Municipales',
                // id: acuerdo_id,
                data: rows,
                op: 'search',
                data_save: 'heloowda'
            }
            // console.log(rows)
        res.render('edit', locals)
    })
}

ACController.searchForm = (req, res, next) => {
    let sr = req.params.value_search,
        search1, search2, arrayDeCadenas,
        dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
        search = "",
        search_ant = "",
        po = "",
        num,
        tooltip = "Puedes escribir el dia de la semana(lunes, martes, etc..), el dia en numero (1,2... 22), el nombre del mes (enero, febrero, etc..) o el numero del mes con un cero antecediendolo (01, 02... 010) como parametros de busqueda"
    if (sr != ":") {
        arrayDeCadenas = sr.split("=")
        search = arrayDeCadenas[arrayDeCadenas.length - 1]
        po = arrayDeCadenas[0]
    }
    if (po == ":Todo") {
        num = 1
        search_ant = search
        search1 = search
    } else if (po == ":Palabra") {
        num = 2
        search_ant = search
        search1 = search
    } else if (po == ":Numero de acuerdo") {
        num = 3
        search_ant = search
        search1 = search
    } else if (po == ":Fecha del acuerdo") {
        search_ant = search
        search1 = dia_sem(search_ant)
        console.log(search1)
        if (search1.length == 3) {
            num = 5
        } else if (search1.includes("=")) {
            arrayDeCadenas = search1.split("=")
            search2 = arrayDeCadenas[arrayDeCadenas.length - 1]
            search1 = arrayDeCadenas[0]
            console.log("numero igual a 6")
            num = 6
        } else {
            num = 4
        }
        console.log('search1= ' + search1 + ' search2= ' + search2)
    } else {
        num = 0
        search_ant = search
        search1 = search
    }
    console.log("sr= " + sr + " po= " + po + " search= " + search_ant)
    let locals = {
        title: 'Buscar Acuerdo Municipal',
        op: 'elim_d',
        search: search_ant,
        data_save: tooltip,
        data: '',
        image1: '/img/lupa_busqueda.png',
        txt1: 'Realiza una busqueda',
        input: po
    }
    if (num != 0) {
        console.log("entro")
        ACModel.search(num, search1, search2, async(err, bb) => {
            for (var i = 0; i < bb.length; i++) {
                console.log(bb[i])
            }
            let locals = {
                title: 'Buscar Acuerdo Municipal',
                op: 'elim_d',
                data: bb,
                image1: '/img/no_se_encontraron.png',
                data_save: tooltip,
                txt1: 'No se encontro ningun resultado coincidente',
                search: search_ant,
                input: po
            }
            res.render('search', locals)
        })
    } else {
        res.render('search', locals)
    }

}

ACController.error404 = (req, res, next) => {
    let error = new Error(),
        locals = {
            title: 'Error 404',
            description: 'Recurso No Encontrado',
            error: error
        }

    error.status = 404

    res.render('error', locals)

    next()
}

ACController.delete = (req, res, next) => {
    let idmongo = req.params.acuerdo_id,
        id = req.body.acuerdo_id
        // console.log(acuerdo_id)

    ACModel.delete(idmongo, id, function(err) {
        if (err) {
            let locals = {
                title: `Error al eliminar el registro con el id: ${id}`,
                description: "Error de Sintaxis",
                error: err
            }
            res.render('error', locals)
        } else {
            res.redirect('/S_U_E:Habilitar2')
        }
    })
}

function dia_sem(search) {
    var split, param1, param1_ant, param2, param2_ant, param3, paramUlt, paramUlt_ant, mes, dias, params, cero = "",
        indicador_dia = 0,
        indicador_mes = 0,
        ninguno = [],
        i = 0,
        dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
        meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        meses_num = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "010", "011", "012"],
        dias_mes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
        numeros = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    if (search.indexOf(" ") != -1) {
        split = search.split(" ")
        console.log("1", split)
    } else if (search.indexOf("-") != -1) {
        split = search.split("-")
        console.log("2", split)
    }

    if (split != undefined) {
        param1 = split[0]
        paramUlt = split[split.length - 1]
        if (split.length == 3) {
            param2 = split[1]
            console.log("entro split1 = " + param1 + " " + param2 + " " + paramUlt)
        } else {
            console.log("entro split1 = " + param1 + " " + paramUlt)
        }
    } else {
        param1 = search
        console.log(param1)
    }

    // dias de la semana

    if (dias.includes(param1)) {
        param1 = param1
        indicador_dia = 1
        console.log("param1 = ", param1)
    } else if (dias.includes(param2)) {
        param2 = param2
        indicador_dia = 2
        console.log("param2 = ", param2)
    } else if (dias.includes(paramUlt)) {
        paramUlt = paramUlt
        indicador_dia = 3
        console.log("param3 = ", paramUlt)
    } else {
        console.log("ninguno")
        ninguno[i] = 1
        i++
    }

    //meses

    if (meses.indexOf(param1) != -1 && indicador_dia != 1 && param1 != undefined) {
        param1_ant = param1
        mes = numeros[meses.indexOf(param1_ant)]
        param1 = "-" + mes + "-"
        indicador_mes = 1
        console.log("param1 a= ", param1)
    } else if (meses.indexOf(param2) != -1 && indicador_dia != 2 && param2 != undefined) {
        param2_ant = param2
        mes = numeros[meses.indexOf(param2_ant)]
        param2 = "-" + mes + "-"
        indicador_mes = 2
        console.log("param2 = ", param2)
    } else if (meses.indexOf(paramUlt) != -1 && indicador_dia != 3 && paramUlt != undefined) {
        paramUlt_ant = paramUlt
        mes = numeros[meses.indexOf(paramUlt_ant)]
        paramUlt = "-" + mes + "-"
        indicador_mes = 3
        console.log("param3 = ", paramUlt)
    } else if (meses_num.includes(param1) && indicador_dia != 1 && param1 != undefined) {
        param1_ant = param1
        mes = numeros[meses_num.indexOf(param1_ant)]
        param1 = "-" + mes + "-"
        indicador_mes = 1
        console.log("param1 b= ", param1)
    } else if (meses_num.includes(param2) && indicador_dia != 2 && param2 != undefined) {
        param2_ant = param2
        mes = numeros[meses_num.indexOf(param2_ant)]
        param2 = "-" + mes + "-"
        indicador_mes = 2
        console.log("param2 = ", param2)
    } else if (meses_num.includes(paramUlt) && indicador_dia != 3 && paramUlt != undefined) {
        paramUlt_ant = paramUlt
        mes = numeros[meses_num.indexOf(paramUlt_ant)]
        paramUlt = "-" + mes + "-"
        indicador_mes = 3
        console.log("param3 = ", paramUlt)
    } else {
        console.log("ninguno")
        ninguno[i] = 2
        console.log(ninguno)
        i++
    }

    //dias en numero

    if (dias_mes.includes(param1) && indicador_dia != 1 && indicador_mes != 1 && param1 != undefined) {
        param1_ant = param1
        dias = dias_mes[dias_mes.indexOf(param1_ant)]
        if (dias < 10) {
            cero = "0"
        }
        param1 = "-" + cero + dias
        indicador_dia = 4
        console.log("param1 = ", param1)
    } else if (dias_mes.includes(param2) && indicador_dia != 2 && indicador_mes != 2 && param2 != undefined) {
        param2_ant = param2
        dias = dias_mes[dias_mes.indexOf(param2_ant)]
        if (dias < 10) {
            cero = "0"
        }
        param2 = "-" + cero + dias
        indicador_dia = 5
        console.log("param2 = ", param2)
    } else if (dias_mes.includes(paramUlt) && indicador_dia != 3 && indicador_mes != 3 && paramUlt != undefined) {
        paramUlt_ant = paramUlt
        dias = dias_mes[dias_mes.indexOf(paramUlt_ant)]
        if (dias < 10) {
            cero = "0"
        }
        paramUlt = "-" + cero + dias
        indicador_dia = 6
        console.log("param3 = ", paramUlt)
    } else {
        console.log("ninguno")
        ninguno[i] = 3
        i++
    }
    if (i >= 3) {
        return param1
    } else if (i == 2 || i == 1) {
        console.log(split)
        if (split != undefined) {
            console.log("parametro 1 =", param1)
            if (indicador_dia == 1 || indicador_mes == 3) {
                console.log("parametro 1 es un dia")
                params = paramUlt + "=" + param1
            } else if (indicador_dia == 3 || indicador_mes == 1) {
                console.log("parametro 2 es un dia")
                params = param1 + "=" + paramUlt
            } else if (indicador_dia == 1 || indicador_dia == 4) {
                console.log("parametro 1 es un dia")
                params = paramUlt + param1
            } else if (indicador_dia == 3 || indicador_dia == 6) {
                console.log("parametro 2 es un dia")
                params = param1 + paramUlt
            }
        } else {
            params = param1
        }
        console.log(params)
        return params
    } else if (i == 1) {
        console.log(param1, paramUlt)
        param3 = param1 + paramUlt
        return param3
    } else if (i = 0) {

    }
}

module.exports = ACController