'use strict'

var express = require('express'),
    Cexec = require('child_process').exec

exports.conexec = ((id,cb) => {
    Cexec('start %CD%/op_servidor/App-' + id + '.bat', cb)
})