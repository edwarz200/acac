window.onload = () => {
    var lista = document.getElementById("S_E"),
        lista2 = document.getElementById("C_R"),
        sync = document.getElementById("sync"),
        search = document.getElementById("List_search"),
        syncInput = document.getElementById("syncInput"),
        span_fecha = document.getElementById("span_fecha"),
        numspan = 0
    lista.onchange = () => {
        redirect("S_U_E", lista.value)
    }
    lista2.onchange = () => {
        redirect("C_R", lista2.value)
    }
    if (search != null) {
        search.onchange = () => {
            console.log(search.value)
            if (search.value == "Fecha del acuerdo") {
                span_fecha.classList.remove('span2')
                span_fecha.classList.add('span')
                numspan = 1
            } else if (numspan == 1) {
                span_fecha.classList.add('span2')
                span_fecha.classList.remove('span')
            }
        }
    }
}

function Numeros(string) { //Solo numeros
    return string.split("/").join("-");
}

function redirect(l, value) {
    if (value == "xlsx") {
        location.href = "/xlsx"
    } else if (value == "Deshabilitar") {
        location.href = "/"
    } else {
        window.location = "/" + l + ":" + value;
    }
}

function on(h) {
    var listaAdd, sORa, inputSearch
    if (h == "/search/SR:") {
        listaAdd = document.getElementById("List_search")
        inputSearch = document.getElementById("inputSearch")
        sORa = "=" + inputSearch.value
    }
    location.href = h + listaAdd.value + sORa;
}

function eliminar(input) {
    var deleteOk = confirm('¿Estás seguro de eliminar este acuerdo?')
    return (deleteOk) ? input.parentNode.submit() : false
}

function A_C(value) {
    if (value == 'agregar') {
        document.querySelector('.contenedor').classList.remove('cont2')
        document.querySelector('.contenedor').classList.add('cont')
    }
    if (value == 'cancelar') {
        document.querySelector('.contenedor').classList.add('cont2')
        document.querySelector('.contenedor').classList.remove('cont')
    }
}

function myfun(h_d, h, e, s, b, c, elim_d) {
    var select = 0,
        selectS = 0,
        inputGroupSelect01 = document.getElementById("inputGroupSelect01"),
        List_search = document.getElementById("List_search"),
        btnsync = document.getElementById("btnsync")
    if (h_d == "false") {
        $(".disable").removeAttr('disabled')
        select = 1
    }
    if (h_d == "true_defect") {
        $(".disable").attr('disabled')
        select = 0
    }
    if (h_d == "false_v") {
        $(".disable").removeAttr('disabled')
        $(".disable").attr('type', 'radio')
        select = 2
    }
    document.querySelector(".selectE").options.item(select).setAttribute('selected', false)
    if (h == "search") {
        document.querySelector(".selectE").setAttribute('hidden', false)
        document.querySelector(".Ag").removeAttribute('hidden')
    } else if (h == "elim_d") {
        document.querySelector(".selectE").setAttribute('hidden', false)
    } else {
        document.querySelector(".selectE").removeAttribute('hidden')
        document.querySelector(".Ag").setAttribute('hidden', false)
    }
    if (inputGroupSelect01 != null)
        inputGroupSelect01.options.item(e).setAttribute('selected', false)

    if (s == ":Palabra") {
        selectS = 1
    } else if (s == ":Numero de acuerdo") {
        selectS = 2
    } else if (s == ":Fecha del acuerdo") {
        selectS = 3
    }
    if (b == "no") {
        btnsync.classList.remove('btn-info')
        btnsync.classList.add('btn-secondary')
        btnsync.classList.add('btn-lg')
        btnsync.classList.add('disabled')
        btnsync.innerHTML = "La base de datos en la nube esta vacia"
    }
    if (c == "si") {
        document.querySelector('.contenedor').classList.remove('cont2')
        document.querySelector('.contenedor').classList.add('cont')
    }
    if (List_search != null)
        List_search.options.item(selectS).setAttribute('selected', false)
}

// jquery

$(".custom-file-input").on("change", function(e) {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    console.log($(this).siblings(".custom-file-label").addClass("selected").html(fileName))
        //Ubicación temporal del archivo que se sube
    let tempPath = $(this).val()
    console.log(tempPath)
    var TmpPath = URL.createObjectURL(e.target.files[0]);
    $('#Name_File').attr('value', fileName)
    $('#path').attr('value', TmpPath)
    
    // var reader = new FileReader();
    // reader.readAsArrayBuffer(e.target.files[0]);
    // console.log(reader)
    // reader.onload = function(e) {
    //     var data = new Uint8Array(reader.result);
    //     var wb = XLSX.read(data,{type:'array'});
    //     for(var i=0;i<wb.SheetNames.length;i++){
    //         var htmlstr = XLSX.write(wb,{sheet: wb.SheetNames[i],type:'binary',bookType:'html'});
    //         $('#pre_image')[0].innerHTML += htmlstr;
    //     }
    // }

});

$("#inputSearch").keypress(function(event) {
    if (event.which == 13) {
        on('/search/SR:')
    }
});