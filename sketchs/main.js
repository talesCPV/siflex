
/* VARIABLES */

var main_data
var today = new Date()
var meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

/*  PROTOTYPES  */

/*  STRING  */
String.prototype.getHash = function(S){
    let weigth = 0
    let hash = ''
    let str = this.valueOf()

    function getRange(N){ // keeps caracters under ASCII 33 & 126
        while (N > 126 || N < 33){
            N -= 126
            N < 33 ? N += 33 : N
            N == 127 ? N++ : 0
        }
        return N
    }

    for (i = 0; i < str.length; i++) {
        weigth += str.charCodeAt(i) * 5
    }

    while(str.length < S){
        str += String.fromCharCode(str.length + 33)
    }

    for (i = 0; i < str.length; i++) {
        chr = getRange(weigth * str.charCodeAt(i))
        chr = chr===92 ? 168 : chr;
        chr = chr===34 ? 173 : chr;
        hash += String.fromCharCode(chr)  
    }

    return hash;
}

String.prototype.maxWidth = function(N=0){
    return ((N>0 && N<this.length) ? this.valueOf().substring(0,N) : this.valueOf())
}

/* DATE */
Date.prototype.change = function(N=1){
    this.setDate(this.getDate()+N)
 }
 
Date.prototype.iniMonth = function(){
    const day = this.getDate() -1
    this.change(-day)
    const out = this.getFormatDate()
    this.change (day)
    return out
}

Date.prototype.finMonth = function(){
    const day = this.getDate() -1
    this.change(30-day)
    const out = this.getFormatDate()
    this.change (-30+day)
    return out
}

Date.prototype.getFormatDate = function(N=''){
    if(N==''){
        return (`${this.getFullYear()}-${(this.getMonth()+1).toString().padStart(2,'0')}-${this.getDate().toString().padStart(2,'0')}`)
    }else{
        this.change(N)
        const out = `${this.getFullYear()}-${(this.getMonth()+1).toString().padStart(2,'0')}-${this.getDate().toString().padStart(2,'0')}`
        this.change(-N)
        return out
    }
}

Date.prototype.getFormatBR = function(){
    return (`${this.getDate().toString().padStart(2,'0')}/${(this.getMonth()+1).toString().padStart(2,'0')}/${this.getFullYear()}`)
}

Date.prototype.getWeekDay = function(){
    const dia = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
    return dia[this.getDay()]
}

Date.prototype.getCod = function(){
    return this.getFullYear().toString().substring(2,4) + (this.getMonth()+1).toString().padStart(2,'0') + this.getDate().toString().padStart(2,'0')
}

/* TABLE */
HTMLTableElement.prototype.plot = function(obj, fields,type=''){
    fields = fields.split(',')
    type = type=='' ? '' : type.split(',')
    const tr = document.createElement('tr')
    for(let i=0; i<fields.length; i++){
        const td = document.createElement('td')
        const arr = fields[i].split('|')
        if(arr.length > 1){
            td.classList = arr[1]
        }
        let html, op
    
        if(type.length > 0 && i<type.length){
            switch (type[i].substring(0,3)) {
                case 'int':
                  html = parseInt(obj[arr[0]])
                  break;
                case 'Upp':
                    html = obj[arr[0]].toUpperCase()
                    break
                case 'str':
                    html = obj[arr[0]]
                  break;
                case 'dat':
                    html = obj[arr[0]].substring(8,10)+'/'+ obj[arr[0]].substring(5,7)+'/'+obj[arr[0]].substring(0,4)
                    break                 
                case 'Low':
                    html = obj[arr[0]].toLowerCase()
                    break;
                case 'R$.':
                    html = 'R$'+ parseFloat(obj[arr[0]]).toFixed(2)
                    break;             
                case 'cha':
                    op = type[i].split(' ')
                    html = ''
                    for(let j=1; j<op.length; j++){
                        if((obj[arr[0]] == op[j].split('=')[0])||(j==op.length-1 && html=='')||obj[arr[0]] == null ){
                            html = op[j].split('=')[1] == '**' ? obj[arr[0]] : op[j].split('=')[1]
                        }
                    }
                    break;
                case 'fun':
                    op = type[i].split(' ')                    
                    html = eval(`${op[1]}(obj[arr[0]])`)
                    break;
                case 'cal':
                    op = type[i].split(' ')
console.log(op)                    
                    html = eval(op[1])
                    break;
                default:
                  html = obj[arr[0]]
            }            
        }else{
            html = obj[fields[i].split('|')[0]]
        }
        td.innerHTML = html
        tr.appendChild(td)
    }
    tr.data = obj
    this.appendChild(tr)
}

HTMLTableElement.prototype.head = function(hd){
    this.innerHTML = ''
    hd = hd.split(',')
    const tr = document.createElement('tr')
    for(let i=0; i<hd.length; i++){
        const th = document.createElement('th')
        const arr = hd[i].split('|')
        if(arr.length > 1){
            th.classList = arr[1]
        }
        th.innerHTML = arr[0]
        tr.appendChild(th)
    }
    this.appendChild(tr)
}

/*  FUNCTIONS  */

/*  MODAL  */
function closeModal(N=''){
    const mod_main = document.querySelector('#myModal')

    if(N=='all'){
        while(mod_main.querySelectorAll('.modal-content').length > 0){
            mod_main.querySelectorAll('.modal-content')[0].remove()    
        }
    }else{
        N = (N=='')? mod_main.querySelectorAll('.modal-content').length-1 : N // N=='' -> Last Modal
        mod_main.querySelector('#card-'+N).remove()    
    }

    mod_main.style.display = (mod_main.querySelectorAll('.modal-content').length < 1) ? "none" : 'block'
}

function newModal(title, content, y, x){

    const mod_main = document.querySelector('#myModal')
    const index = mod_main.querySelectorAll('.modal-content').length        

        const mod_card = document.createElement('div')
        mod_card.classList = 'modal-content'
        mod_card.id = 'card-'+index
        mod_card.style.transform = `translateY(${y}%) translateX(${x}%)`

            const mod_title = document.createElement('div')
            mod_title.className = 'modal-title'    

                const p = document.createElement('p')
                p.innerHTML = title
                mod_title.appendChild(p)

                const span = document.createElement('span')
                span.classList = 'close'
                span.innerHTML = '&times;'
                span.addEventListener('click',()=>{
                    closeModal()
                })
                mod_title.appendChild(span)

            const mod_content = document.createElement('div')
            mod_content.classList = 'modal-text'
            mod_content.innerHTML = content

        mod_card.appendChild(mod_title)
        mod_card.appendChild(mod_content)

    mod_main.appendChild(mod_card)
    mod_main.style.display = "block"


}

async function openHTML(template,where="content-screen",label="", data="",y=0, x=0){
    if(template.trim() != ""){
        return await new Promise((resolve,reject) =>{
            fetch( "templates/"+template)
            .then( stream => stream.text())
            .then( text => {
                const temp = document.createElement('div');
                temp.innerHTML = text;
                let body = temp.getElementsByTagName('template')[0];
                let script = temp.getElementsByTagName('script')[0];

                if(body == undefined){
                    script = ''
                    body = document.createElement('div')
                    body.innerHTML = '<style>p{text-align : center;}</style> <p>Desculpe, este módulo ainda não foi implementado</p>'
                    body.style.color = '#FFFF00 !important'
                    where = 'pop-up'
                    label = 'ERRO 404!'
                }

                if(where == "pop-up"){
                    newModal(label,body.innerHTML,y,x)
                }else{
                    document.getElementById(where).innerHTML = body.innerHTML;
                }

                main_data = data;
                eval(script.innerHTML);
                resolve = body
                document.querySelector('#drop').checked = false // close menu
            }); 
        }); 
    }
}

/*  DATABASE  */
function queryDB(params,cod){
    const data = new URLSearchParams();        
        data.append("cod", cod);
        data.append("params", JSON.stringify(params));

    const myRequest = new Request("backend/query_db.php",{
        method : "POST",
        body : data
    });

    return new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    });      
}

function getConfig(field,value=0,order='read'){
    const data = new URLSearchParams();        
        data.append("order", order);
        data.append("field", field);
        data.append("value", value);

    const myRequest = new Request("backend/getConfig.php",{
        method : "POST",
        body : data
    });

    return new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    }); 
}
 /*  MENU  */ 
function openMenu(){        
    var drop = 0
    const data = new URLSearchParams();        
        data.append("hash", localStorage.getItem('hash'));

    const myRequest = new Request("backend/openMenu.php",{
        method : "POST",
        body : data
    });

    const myPromisse = new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                document.querySelector('#usr-name').innerHTML = localStorage.getItem('username').toUpperCase()
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    }); 

    myPromisse.then((resolve)=>{
        localStorage.setItem("menu",resolve);
        const menu_data = JSON.parse(resolve)
        const menu = document.querySelector('.menu')
        pushMenu(menu, menu_data)

    });

    function pushMenu(menu, obj){
        menu.innerHTML = ''
        for( let i=0; i<obj.length; i++){

            const li = document.createElement('li') 
            if(obj[i].class.trim().length>0){
                li.classList = obj[i].class
            }           
            const a = document.createElement('a')

            a.href = obj[i].script
            a.innerHTML = obj[i].modulo 
            if (obj[i].itens.length > 0 ){
                const lbl = document.createElement('label')
                lbl.htmlFor = `drop-${drop}`
                lbl.classList = 'toggle'
                lbl.innerHTML = obj[i].modulo + ' +'                  
                li.appendChild(lbl)

                li.appendChild(a)

                const ckb = document.createElement('input')
                ckb.type = 'checkbox';
                ckb.id = `drop-${drop}`
                drop++
                li.appendChild(ckb)

                if(obj[i].itens.length > 0){
                    const ul = document.createElement('ul')                       
                    pushMenu(ul,obj[i].itens)
                    li.appendChild(ul)
                }

            }else{
                li.appendChild(a)
            }

            menu.appendChild(li)
        }
    }
}

/*  FILL COMBOS  */


function fillCombo(combo, params, cod, fields, value=''){

    combo = document.getElementById(combo)
    combo.innerHTML = ''
    const myPromisse = queryDB(params,cod);
    myPromisse.then((resolve)=>{
        const json = JSON.parse(resolve)
        for(let i=0; i<json.length; i++){
            const opt = document.createElement('option')
            opt.value = json[i][fields[0]]
            opt.innerHTML = json[i][fields[1]].toUpperCase()
            combo.appendChild(opt)
        }
        if(value != ''){
            combo.value = value
        }
    })

}

/* IMAGE */

function aspect_ratio(img,cvw=300, cvh=300){
    out = [0,0,cvw,cvh]
    w = img.width
    h = img.height
    
    if(w >= h){
        out[3] = cvh/(w/h)
        out[1] = (cvh - out[3]) / 2
    }else{
        out[2] = cvw/(h/w)
        out[0] = (cvw - out[2]) / 2
    }
    return out
}

function loadImg(filename, id='cnvImg') {

    var ctx = document.getElementById(id);
    if (ctx.getContext) {

        ctx = ctx.getContext('2d');
        var img = new Image();
        img.onload = function () {
            ar = aspect_ratio(img)
            ctx.drawImage(img, 0, 0,img.width,img.height,ar[0],ar[1],ar[2],ar[3]);
        };

        img.src = './'+filename;
    }
}

function uploadImage(fileID,path,filename){

    const up_data = new FormData();        
        up_data.append("up_file",  document.getElementById(fileID).files[0]);
        up_data.append("path", path);
        up_data.append("filename", filename);

    const myRequest = new Request("backend/upload.php",{
        method : "POST",
        body : up_data
    });

    const myPromisse = new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());             
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    }); 

    return myPromisse
}
