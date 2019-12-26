'use strict'

var conn = require('./RAM-connection'),
    Cexec = require('./conexec'),
    db = require('./db.js'),
    excel = require('../controllers/convertidor_excel_a_json'),
    ACModel = () => {}

// if (conn == "null") {
//     console.log('aqui en null')
// } else {
//     console.log('aqui en otro lado')
// }

// ACModel.cccc = (cb) => {}

ACModel.Converter_xlsx_json = (libro) => {
    let cb = new Array()
    var workbook = excel.readFile(libro)
    var sheet_name_list = workbook.SheetNames
    for (let i = 0; i < sheet_name_list.length; i++) {
        cb[i] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]])
    }
    return cb
}

ACModel.getConection = (cb) => {
    require('dns').resolve('www.google.com', cb);
}

ACModel.getAll = (perPage, page, cb) => {
    db
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ fecha: -1 })
        .exec(cb)

    // conn.ref('RAM/').once('value', cb)
}
ACModel.getAll2 = (cb) => {
    db
        .find({})
        .exec(cb)

    // conn.ref('RAM/').once('value', cb)
}

ACModel.getAllFirebase = (cb) => {
    // db.find(cb).sort({fecha: 1, nro_acuerdo: 1} )
    conn.ref('RAM/').once('value', cb)
}

ACModel.SyncMongo = (cb) => {
    conn.ref('RAM/').orderByChild('fecha').once('value', snapshot => {
        var id, nro_acuerdo, fecha, detalle, data
        db.find((err, cc) => {
            if (err) {
                console.log(err)
            } else if (cc.length != 0 && snapshot.exists()) {
                contador_de_hijos = snapshot.numChildren()
                let ccc = cc.length
                    // while(contador_de_hijos<ccc||contador_de_hijos>ccc){
                console.log('contador_de_hijos = ' + contador_de_hijos)
                console.log('cc.length = ' + cc.length)
                var childKey = {},
                    childSnapshot, isss = 0,
                    iss = 0,
                    numsnao = 0
                if (contador_de_hijos <= cc.length) {
                    var childKey = {},
                        childSnapshot, isss = 0,
                        iss = 0
                    cc.forEach((c) => {
                        let numsnapshot = 0,
                            num = 0,
                            cont = 0,
                            id = c.acuerdo_id,
                            nro_acuerdo = c.nro_acuerdo,
                            fecha = c.fecha,
                            dia_sem = c.dia_sem,
                            detalle = c.detalle,
                            data = { acuerdo_id: id, nro_acuerdo, fecha, dia_sem, detalle }
                        snapshot.forEach((childSnapshot) => {
                            var vuelta = "vuelta numero " + num
                                // console.log(childSnapshot.key)
                            console.log(vuelta)
                            childKey[isss] = childSnapshot.key
                            childSnapshot = snapshot.val()
                                // childKey.objectID = childKey
                            if (childKey[isss] == id) {
                                var updates = {}
                                updates['/RAM/' + id] = data
                                conn.ref().update(updates, (err) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log("actualizado")
                                    }
                                })
                                console.log('entro a actualizar acuerdo_id de firebase', childKey[isss], " acuerdo_id de mongo=", id)
                                numsnapshot = 1
                                return true
                            }
                            num++
                        });
                        numsnao++
                        console.log(num)
                        if (numsnapshot == 0) {
                            conn.ref('RAM').child(id).set(data, async(err) => {
                                if (err) {
                                    console.log('error al guardar el dato con el id: ' + id + ' en la nube')
                                } else {
                                    console.log('exito')
                                }
                                numsnapshot = 2
                                console.log('entro a guardar acuerdo_id de firebase', childKey[isss], " acuerdo_id de mongo=", id)
                            })
                        }
                        // console.log(numsnapshot)
                        // if (numsnapshot == 0) {
                        //     console.log("entro a eliminar el acuerdo_id de firebase ", childKey[isss])
                        // }
                        // }
                        isss++

                    });
                    console.log(cc.length)
                    if (numsnao >= cc.length) {
                        console.log('entro')
                        db.find(cb)
                    }
                    iss++
                }
                if (contador_de_hijos > cc.length) {
                    snapshot.forEach((childSnapshot) => {
                        childKey[iss] = childSnapshot.key
                        let num = 0,
                            numsnapshot = 0,
                            childss = childSnapshot.val(),
                            acuerdo_id = childKey[iss],
                            nro_acuerdo = childss.nro_acuerdo,
                            fecha = childss.fecha,
                            dia_sem = childss.dia_sem,
                            detalle = childss.detalle,
                            data = { acuerdo_id, nro_acuerdo, fecha, dia_sem, detalle }
                            // childSnapshot = snapshot.val()
                        cc.some((c) => {
                            var vuelta = "vuelta numero " + num
                                // console.log(childSnapshot.key)
                            console.log(vuelta)
                                // childKey.objectID = childKey
                            if (acuerdo_id == c.acuerdo_id) {
                                db.findOneAndUpdate({ acuerdo_id: c.acuerdo_id }, data, (err, bb) => {
                                    if (err) {
                                        console.log('error ' + err)
                                    } else {
                                        console.log('actualizado ' + c.acuerdo_id)
                                    }
                                })
                                console.log('actualizado', childKey[isss], '  odsmosmdso', c.acuerdo_id)
                                numsnapshot = 1
                                return true;
                            }
                            num++

                            // console.log('cc'+c)
                        });
                        numsnao++

                        console.log(num)
                        if (numsnapshot == 0) {
                            const newAc = new db(data)
                            newAc.save((err, bb) => {
                                if (err) {
                                    console.log('error ' + err)
                                } else {
                                    console.log('guardado ' + bb.acuerdo_id)
                                }
                                console.log('no', childKey[iss], '  odsmosmdso', bb.acuerdo_id)
                            })
                        }
                    })
                    console.log(contador_de_hijos)
                    if (numsnao >= contador_de_hijos) {
                        console.log('entro')
                        db.find(cb)
                    }
                    iss++
                }
                contador_de_hijos = snapshot.numChildren()
                ccc = cc.length
                    // }
                    // 
            } else if (snapshot.exists()) {
                var num = 0,
                    childKey = {},
                    contador_de_hijos = snapshot.numChildren()
                snapshot.forEach((childSnapshot) => {
                    // console.log('enttttttrrrrrooo')
                    var vuelta = "vuelta numero " + num
                        // console.log(childSnapshot.key)
                    childKey[num] = childSnapshot.key
                        // console.log(childKey[num])
                    let childss = childSnapshot.val(),
                        acuerdo_id = childKey[num],
                        nro_acuerdo = childss.nro_acuerdo,
                        fecha = childss.fecha,
                        dia_sem = childss.dia_sem,
                        detalle = childss.detalle,
                        data = { acuerdo_id, nro_acuerdo, fecha, dia_sem, detalle }
                        // child = childKey[num] + childss
                        // childKey.objectID = childKey
                        // console.log('guardado', acuerdo_id)
                    const newAc = new db(data)
                    newAc.save().then((bb) => {
                        console.log('guardado ' + bb.acuerdo_id)
                        console.log('no', childKey[num], '  odsmosmdso', bb.acuerdo_id)
                    }).catch((err) => {
                        console.log('error ' + err)
                    })
                    num++
                })
                console.log(contador_de_hijos)
                if (num >= contador_de_hijos) {
                    console.log('entro')
                    db.find(cb)
                }
                isss++
                console.log('entro pero paso del tema')
            } else {
                conn.ref('RAM').child(id).set(data, async(err) => {
                    if (err) {
                        console.log('error al guardar el dato con el id: ' + id + ' en la nube')
                    } else {
                        console.log('La base de datos estaba vacia')
                        console.log('Contacto guardado con el id ' + id)
                    }
                })

            }
        })
    })
}

ACModel.search = (num, search1, search2, cb) => {
    // detalle: /search/
    const Regex = new RegExp(search1, 'i')
    const Regex2 = new RegExp(search2, 'i')
    if (num == 1) {
        db.find({ $or: [{ nro_acuerdo: Regex }, { fecha: Regex }, { detalle: Regex }] }, cb)
    } else if (num == 2) {
        db.find({ detalle: Regex }).exec(cb)
    } else if (num == 3) {
        db.find({ nro_acuerdo: Regex }).exec(cb)
    } else if (num == 4) {
        db.find({ $or: [{ fecha: Regex }, { dia_sem: Regex }] }).exec(cb)
    } else if (num == 5) {
        db.find({ dia_sem: Regex }).exec(cb)
    } else if (num == 6) {
        db.find({ $and: [{ fecha: Regex }, { dia_sem: Regex2 }] }).exec(cb)
    }
}

ACModel.getOne = (id, cb) => {
    db.findById(id).exec(cb)
}

ACModel.push = (idmongo, id, data, cb) => {
    db.findOne({ acuerdo_id: idmongo }).exec((err, bb) => {
        if (err) {
            console.log('entro al error')
        } else {
            if (bb == null) {
                console.log('entro al null')
                conn.ref('RAM').child(id).set(data)
                console.log('exito')
                const newAc = new db(data)
                newAc.save(cb)
            } else {
                console.log('no entro al null')
                var updates = {}
                updates['/RAM/' + idmongo] = data
                conn.ref().update(updates)
                console.log('actualizado')
                db.findByIdAndUpdate(id, data, cb)
            }
        }
    })
}

ACModel.delete = (idmongo, id, cb) => {
    conn.ref('RAM/').child(id).remove((err) => {
        if (err) {
            console.log('error al eliminar el dato con el id: ' + id + ' en la nube')
        }
    })
    db.findByIdAndDelete(idmongo, cb)
}

ACModel.close_reset = (id, cb) => Cexec.conexec(id, cb)

module.exports = ACModel