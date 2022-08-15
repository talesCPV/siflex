/*  VARIABLES  */

var doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
}) 

var txt = new Object
    txt.lineHeigth = 5
    txt.x = 10
    txt.y = 10
    txt.width = doc.internal.pageSize.getWidth() - txt.x
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

function clearTxt(y=10,x=10,dim=[90,80]){
    txt = new Object
        txt.lineHeigth = 5
        txt.x = x
        txt.y = y
        txt.width = doc.internal.pageSize.getWidth() - txt.x
        txt.text = ''
        txt.dim = dim 

}


function frame(margin=5){
    doc.rect(margin,margin,txt.dim[0]-margin*2,txt.dim[1]-margin*2)
}

function line(p, direct='h',margin=5, end=margin){

    if(direct == 'h'){
        doc.line(margin,p,txt.dim[0]-end,p)
    }else{
        doc.line(p,margin,p,txt.dim[1]-end)
    }

}

function logo(pos = [14,7,36,25]){
    doc.addImage(imgData, 'png', pos[0], pos[1], pos[2], pos[3]);
}

function addLine(N=1){
    txt.y += txt.lineHeigth * N
}

function box(text,x,y,w){
    const h = doc.getTextDimensions(text).h * 0.8       
    text = text.split(' ')
    let lin = ''
    for(let i=0; i<text.length; i++){            
        if(doc.getTextDimensions(lin+text[i]+' ').w < w ){
            lin +=  text[i] + ' '
        }else{
            doc.text(lin, x,y);
            size = lin.split('\n').length
            y += lin.includes('\n')? h * size : h
            lin =  text[i] + ' '                
        }

    }
    doc.text(lin, x,y);
}


function center_text(T='',box=[txt.y,0,doc.internal.pageSize.getWidth()]){
    const text = T==''? txt.text : T
    const text_size = doc.internal.getFontSize() * text.length 
    const xOffset = (box[2] - box[1] - text_size) /2;
    console.log(box)
    console.log(text_size)
    console.log(xOffset)
    console.log(doc.getTextDimensions(text).w)

    doc.text(text.toUpperCase(), xOffset, box[0]);
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
        if (txt.y >= txt.dim[1]){
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

    getBarcode(data.cod.padStart(13,'0'),[25,52,40,15])
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
    doc.save('etiqueta.pdf')
}

function print_pcp(tbl){

    function grid(){
        line(37)
        line(27,'v',37,5)
        line(92,'v',37,5)
        line(157,'v',37,5)
        line(222,'v',37,5)
        line(70.6)
        line(104.2)
        line(137.8)
        line(171.4)
    }

    doc = new jsPDF({
        orientation: '2',
        unit: 'pt',
        format: [297,210]
    })  

    clearTxt(10,10,[297,210])
    frame()
    grid()
    logo([14,15,45,10])

//  CABEÇALHO
    doc.setFontSize(3)
    doc.setFont(undefined, 'bold')
    doc.text('Av. Dr. Rosalvo de Almeida Telles, 2070', 85,13);
    doc.text('Nova Cacapava - Cacapava-SP - CEP 12.283-020', 78,17);
    doc.text('comercial@flexibus.com.br | (12) 3653-2230', 83,21);
    doc.text('CNPJ 00.519.547/0001-06', 98,25);
    doc.setFontSize(20)
    doc.text('PCP', 200,23);
    doc.setFontSize(5)
    doc.text(`de ${tbl[1].data.day.getFormatBR()} a ${tbl[7].data.day.getFormatBR()}`, 186,28);
  
 // TEXT
    const x = [12,30,95,160,225]
    const y = [20,40.6,74.2,107.8,141.4,175]
    let y_
    doc.setFontSize(3)
    doc.setFont(undefined, 'normal')
    for(let row=0; row<tbl.length-2; row++){ 
        for(let cel=0; cel<tbl[row].cells.length;cel++){
            if(row == 0||cel == 0){
                doc.setFont(undefined, 'bold')
                doc.setFontSize(5)
                y_ = 15
            }else{
                doc.setFont(undefined, 'normal')
                doc.setFontSize(3)
                y_ = 0
            }
            box(tbl[row].cells[cel].innerHTML, x[cel],y[row]+y_,65)
        }
    }


    doc.save('pcp.pdf')
}