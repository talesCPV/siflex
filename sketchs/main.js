
/* VARIABLES */

var main_data = new Object
var today = new Date()
var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
var semana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
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
 
Date.prototype.addMin = function(N=1){
    this.setTime(this.getTime() + N*60000)
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

Date.prototype.getFullHour = function(){
    return (`${this.getHours().toString().padStart(2,'0')}:${this.getMinutes().toString().padStart(2,'0')}:${this.getSeconds().toString().padStart(2,'0')}`)
}

Date.prototype.getFullDate = function(){
    return `${this.getFormatBR()} ${this.getFullHour()}`
}

Date.prototype.getFullDateTime = function(){
    return `${this.getFormatDate()}T${this.getFullHour()}-03:00`
}

Date.prototype.getWeekDay = function(){
    const dia = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
    return dia[this.getDay()]
}

Date.prototype.getCod = function(){
    return this.getFullYear().toString().substring(2,4) + (this.getMonth()+1).toString().padStart(2,'0') + this.getDate().toString().padStart(2,'0')
}

/* TABLE */
HTMLTableElement.prototype.plot = function(obj, fields,type='',file=false){
    fields = fields.split(',')
    type = type=='' ? '' : type.split(',')
    const tr = document.createElement('tr')
    if(file && obj.path != null){
        tr.classList = 'path'
    }
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
                case 'flo':
                    html = obj[arr[0]] != null ? parseFloat(obj[arr[0]]).toFixed(2) : ''
                    break;
                case 'Upp':
                    html = obj[arr[0]] != null ? obj[arr[0]].toUpperCase().trim() : ''
                    break
                case 'str':
                    html = obj[arr[0]] != null ? obj[arr[0]].trim() : ''
                  break;
                case 'dat':
                    html = obj[arr[0]] != null ? obj[arr[0]].substring(8,10)+'/'+ obj[arr[0]].substring(5,7)+'/'+obj[arr[0]].substring(0,4) : ''
                    break                 
                case 'Low':
                    html = obj[arr[0]] != null ? obj[arr[0]].toLowerCase().trim() : ''
                    break;
                case 'R$.':
                    html = obj[arr[0]] != null ? viewMoneyBR(parseFloat(obj[arr[0]]).toFixed(2)) : ''   //'R$'+ parseFloat(obj[arr[0]]).toFixed(2)
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
                    html = eval(op[1])
                    break;
                case 'con':
                    op =   arr[0].split('#')
                    const campo = op[0].split(' ')
                    html = ''
                    for(let j=0; j< campo.length; j++){
                        html +=  obj[campo[j]] 
                        html += j<campo.length-1 ? op[1] : ''
                    }
                    break;                     
                default:
                  html = obj[arr[0]] != null ? obj[arr[0]] :''
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

function closeModal(id='all'){
    const mod_main = document.querySelector('#myModal')
    if(id=='all'){
        while(mod_main.querySelectorAll('.modal').length > 0){
            mod_main.querySelectorAll('.modal')[0].remove()    
        }
    }else{
        id = (id=='')? mod_main.querySelectorAll('.modal').length-1 : id
        mod_main.querySelector('#modal-'+id).remove()
        delete main_data[id]
    }
    mod_main.style.display = (mod_main.querySelectorAll('.modal').length < 1) ? "none" : 'block'
}

function newModal(title, content, pos, id){

    const mod_main = document.querySelector('#myModal')
    const index = mod_main.querySelectorAll('.modal-content').length        
    const offset = 15

    const backModal = document.createElement('div')
        backModal.classList = 'modal'
        backModal.id = 'modal-'+id
        backModal.style.zIndex = 2+index
        backModal.style.display = 'block'

    const mod_card = document.createElement('div')
        mod_card.classList = 'modal-content'
        mod_card.id = 'card-'+id        
        mod_card.style.position = 'absolute'
        mod_card.style.zIndex = 3+index
        mod_card.style.margin = '0 auto'
        mod_card.style.top = pos[1] + index*offset+'px'
        mod_card.style.left = pos[0] + index*offset+'px'
        mod_card.style.right = pos[0] - index*offset+'px'
    
    const mod_title = document.createElement('div')
    mod_title.className = 'modal-title'    

    const p = document.createElement('p')
    p.innerHTML = title
    mod_title.appendChild(p)

    const span = document.createElement('span')
    span.classList = 'close'
    span.innerHTML = '&times;'
    span.addEventListener('click',()=>{
        closeModal(id)
    })
    mod_title.appendChild(span)
    mod_card.appendChild(mod_title)

    const mod_content = document.createElement('div')
    mod_content.classList = 'modal-text'
    mod_content.innerHTML = content
    mod_card.appendChild(mod_content)


    backModal.appendChild(mod_card)
    mod_main.appendChild(backModal)
    mod_main.style.display = "block"


}

async function openHTML(template,where="content-screen",label="", data="",pos=[30,30]){
    if(template.trim() != ""){
        const page_name = template.split('.')[0]
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
                    newModal(label,body.innerHTML,pos,page_name)
                }else{
                    const cont = body.innerHTML.replace('<h1>', `<span id="close-screen" onclick="document.querySelector('#imgLogo').click()">&times;</span><h1>`)
                    
//                    const close = where == 'content-screen' ? `<div id="close-screen"><span onclick="document.querySelector('#imgLogo').click()">&times;</span></div>` : ''
                    document.getElementById(where).innerHTML = cont;                    
                }

                main_data[page_name] = new Object
                main_data[page_name].data = data

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

function NFeConf(dados='',file='NFe.json'){
    const data = new URLSearchParams();
    if(dados == ''){
        data.append("data", dados);
        data.append("file", file);
    }else{
        data.append("data", JSON.stringify(dados));
        data.append("file", file);
    }        

    const myRequest = new Request("backend/nfe_POST.php",{
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

function getConfig(field,file='config.json',order='read',value=0){
    const data = new URLSearchParams();        
        data.append("order", order);
        data.append("field", field);
        data.append("value", value);
        data.append("file",file);
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

function loadTXT(file='templateNFe.txt'){
        const data = new URLSearchParams();        
            data.append("file",file);
        const myRequest = new Request("backend/getFile.php",{
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

/*  ABAS */

function pictab(e){
    const tab = e.id
    const content = document.querySelectorAll(".tab");
    for (let i = 0; i < content.length; i++) {
        const sel_tab = document.querySelector('#tab-'+content[i].id)

        if(content[i].id == tab.split('-')[1]){
            content[i].style.display = "block"
            sel_tab.style.background = "#3F5954";
            sel_tab.style.color = "#FFF8DC";
        }else{
            content[i].style.display = "none"
            sel_tab.style.background = "#FFF8DC";
            sel_tab.style.color = "#3F5954";
        }
    }
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
                lbl.innerHTML = obj[i].modulo + ' ▸'                  
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

function listNF(folder,ext='txt'){

    const data = new URLSearchParams();        
        data.append("folder",folder);
    const myRequest = new Request("backend/nfe_LIST.php",{
        method : "POST",
        body : data
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
    myPromisse.then((txt)=>{
        const list = JSON.parse(txt)
        const sel = document.querySelector(`#${ext}Files`)
        sel.innerHTML=''
        for(let i=list.length-1; i>1;  i--){
            sel.innerHTML += `<option value="${list[i]}">${list[i]}</option>`
        }
    })
}