
/* VARIABLES */

var main_data
var today = new Date()
var meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

/*  PROTOTYPES  */

/* GET FULL DATE FORMAT  */

Date.prototype.getFormatDate = function(){
    return (`${this.getFullYear()}-${(this.getMonth()+1).toString().padStart(2,'0')}-${this.getDate().toString().padStart(2,'0')}`)
}

Date.prototype.getFormatBR = function(){
    return (`${this.getDate().toString().padStart(2,'0')}/${(this.getMonth()+1).toString().padStart(2,'0')}/${this.getFullYear()}`)
}

Date.prototype.getCurrentWeek = function(){
    return (`${this.getDate().toString().padStart(2,'0')}/${(this.getMonth()+1).toString().padStart(2,'0')}/${this.getFullYear()}`)
}

Date.prototype.getWeekDay = function(){
    const dia = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
    return dia[this.getDay()]
}

Date.prototype.change = function(N=1){
   this.setDate(this.getDate()+N)
}


/* HASH */

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
        mod_card.style.transform = `translateY(${-y*index}%) translateX(${x*index}%)`

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

async function openHTML(template,where="content-screen",label="", data="",y=100, x=3){
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

/*  FILL TABLES  */

function makeHeader(hd){
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
    return tr
}

/*  
    fields: array de strings
    adicionar classes: "valor da string| nome da classe"
    alterar valor da string por lista: "valor da string | classe | {obj}"
    obj (exemp.): {"else":"valor padrão", "valor x":"valor q irá substituir x"}
    PS: se quiser um valor padrão, sempre começar com else, senão caso nao encontre o valor x ele mantem o valor original
*/

function makeRow(obj, fields){
    const tr = document.createElement('tr')
    for(let i=0; i<fields.length; i++){
        const td = document.createElement('td')
        const arr = fields[i].split('|')
        let html = obj[arr[0]]
        if(arr.length > 1){
            td.classList = arr[1]
        }
        if(arr.length > 2){
            const json = Object.entries(JSON.parse(arr[2]))
            for(let i=0; i<json.length; i++){
                html = json[i][0]=='else' ? json[i][1] : obj[arr[0]] == json[i][0] ? html = json[i][1] : html
            }

        }
        td.innerHTML = html.toUpperCase()
        tr.appendChild(td)
    }
    tr.data = obj
    return tr
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