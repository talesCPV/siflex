/*  VARIABLES  */

var doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
}) 

var txt = new Object
    txt.heigth = 5
    txt.x = 25
    txt.y = 46
    txt.width = doc.internal.pageSize.getWidth() - txt.x
    txt.alt = 285
    txt.text
    txt.dim = [90,80] 

var imgData = new Image()
    imgData.src = 'assets/logo.png'

/* FUNCTIONS */

function getBarcode(N, pos=[txt.dim[0]-41,txt.dim[1]-30, 36, 25] ){
    const bar = newBarcode(N,70)    
    const image = new Image();
    image.src = bar.toDataURL();
    doc.addImage(image, 'png', pos[0],pos[1],pos[2],pos[3]);
}

function clearTxt(y=10,x=10){
    txt = new Object
        txt.heigth = 5
        txt.x = x
        txt.y = y
        txt.width = doc.internal.pageSize.getWidth() - txt.x
        txt.alt = 285
        txt.text = ''
        txt.dim = [90,80] 

}


function frame(margin=5){
    doc.rect(margin,margin,txt.dim[0]-margin*2,txt.dim[1]-margin*2)
}

function line(y, margin=5){

    doc.line(margin,y,txt.dim[0]-margin,y)

}

function logo(pos = [14,7,36,25]){
    doc.addImage(imgData, 'png', pos[0], pos[1], pos[2], pos[3]);
}

function addLine(N=1){
    txt.y += txt.heigth * N
}


function center_text(T=''){
    let text = T==''? txt.text : T
    xOffset = (doc.internal.pageSize.getWidth() - text.length * (doc.internal.getFontSize() / 4.6)) /2;         
    doc.text(text.toUpperCase(), xOffset, txt.y);
    addLine()
}

function block_text(T=''){
    const text = T==''? txt.text.split(' ') : T.split(' ')
    let line = ''

    function print(){

        if(line.length > 0){
            doc.text(line.trim(), txt.x, txt.y);
        }
        addLine()
        line = ''
        if (txt.y >= txt.alt){
            doc.addPage();
            frame()
            logo()
            txt.y = 46 
        }                
    }

    for(let i=0; i< text.length; i++){

        if(text[i].includes('\n')){
            line = line.trim() + ' ' + text[i].trim()
            print()
        }else if(text[i] != ''){
            line = line.trim() + ' ' + text[i].trim()
        }

        length = line.length * (doc.internal.getFontSize() / 4.6)
        if(length > txt.width){
            print()
        }                
    }
    print()
}

/*  RELATORIES  */

function print_etq(data){
    
    doc = new jsPDF({
        orientation: '1',
        unit: 'mm',
        format: [90,80]
    })  

    clearTxt()
    frame()

    getBarcode(data.cod.padStart(13,'0'),[25,52,40,20])
    logo([30,10,30,10])

    doc.setFontSize(8)
    doc.setFont(undefined, 'bold')
    doc.text(data.descricao, 6,30);
    doc.text('Forn.:', 6,35);
    doc.text('Forn.:', 6,35);
    doc.text('Cod.:', 6,40);
    doc.text('Cod. Orig:', 40,40);


    doc.setFont(undefined,'normal')
    doc.text(data.nome.toUpperCase(), 15,35);
    doc.text(data.cod.padStart(13,'0') , 15,40);
    doc.text(data.cod_cli.padStart(13,'0') , 55,40);

    line(23)
    line(45)


//    doc.text(data.descricao, 15, 8);




    doc.save('etiqueta.pdf')
}