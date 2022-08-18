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
    txt.page = 1
    txt.width = doc.internal.pageSize.getWidth() - txt.x
    txt.text
    txt.dim = [90,80] 

var imgData = new Image()
    imgData.src = 'assets/logo.png'

/* FUNCTIONS */

function addPage(Y,margin=10){
    doc.text(txt.page.toString().padStart('0',2), doc.internal.pageSize.getWidth()-margin,doc.internal.pageSize.getHeight()-margin);
    txt.page++
    doc.addPage();
    frame()
    header_pdf()    
    txt.y = Y 
}

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
        txt.page = 1
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

function addLine(N=1, botton=20, top=46){
    txt.y += txt.lineHeigth * N
    if(txt.y >= doc.internal.pageSize.getHeight() - botton){
        addPage(top)
        return false
    }
    return true
}

function box(text,x,y,w,lh=0.8){
    const h = txt.lineHeigth * lh   
    text = text.trim().split('\n')
    for(let i=0; i<text.length; i++){
        const txt = text[i].trim().split(' ')
        let lin = ''
        for(let j=0; j<txt.length; j++){
            if(doc.getTextDimensions(lin+txt[j]+' ').w < w ){
                lin +=  txt[j] + ' '
            }else{
                console.log(lin)
                doc.text(lin.trim(),x,y);
                y += h
                lin =  txt[j] + ' '
                addLine()
            }

        }
        lin.trim() != '' ? doc.text(lin,x,y): '';
        y += h
        addLine()
    }    
}


function center_text(T='',box=[0,doc.internal.pageSize.getWidth()]){
    const text = T==''? txt.text : T
    const w = doc.getTextDimensions(text).w
    const xOffset = (box[2] - box[1] - w) /2;
    console.log(box)
    console.log(w)
    console.log(xOffset)
   
    doc.text(T, box[0] + xOffset, txt.y);
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
            addPage(46)
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

function header_pdf(){
    logo([14,15,45,10])
    //  CABEÇALHO
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Av. Dr. Rosalvo de Almeida Telles, 2070', 95,13);
    doc.text('Nova Cacapava - Cacapava-SP - CEP 12.283-020', 88,17);
    doc.text('comercial@flexibus.com.br | (12) 3653-2230', 93,21);
    doc.text('CNPJ 00.519.547/0001-06', 108,25);    

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
        unit: 'mm',
        format: [297,210]
    })  

    clearTxt(10,10,[297,210])
    frame()
    grid()
    logo([14,15,45,10])

//  CABEÇALHO
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Av. Dr. Rosalvo de Almeida Telles, 2070', 85,13);
    doc.text('Nova Cacapava - Cacapava-SP - CEP 12.283-020', 78,18);
    doc.text('comercial@flexibus.com.br | (12) 3653-2230', 83,23);
    doc.text('CNPJ 00.519.547/0001-06', 98,28);
    doc.setFontSize(45)
    doc.text('PCP', 200,23);
    doc.setFontSize(12)
    doc.text(`de ${tbl[1].data.day.getFormatBR()} a ${tbl[7].data.day.getFormatBR()}`, 186,28);
  
 // TEXT
    const x = [12,30,95,160,225]
    const y = [20,40.6,74.2,107.8,141.4,175]
    let y_
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    for(let row=0; row<tbl.length-2; row++){
        txt.y = 10 
        for(let cel=0; cel<tbl[row].cells.length;cel++){
            if(row == 0||cel == 0){
                doc.setFont(undefined, 'bold')
                doc.setFontSize(12)
                y_ = 15
            }else{
                doc.setFont(undefined, 'normal')
                doc.setFontSize(8)
                y_ = 0
            }
            box(tbl[row].cells[cel].innerHTML, x[cel],y[row]+y_,170,0.8)
        }
    }

    doc.save('pcp.pdf')
}

function anaFrotaRelat(obj){

    function postCli(data){
        doc.setFont(undefined, 'bold')
        line(txt.y)
        addLine()
        doc.text('Cliente: '+data.fantasia, txt.x,txt.y);
        doc.text('CNPJ: '+getCNPJ(data.cnpj), txt.x+135,txt.y);
        addLine()
        doc.text('End.: '+data.endereco.trim()+','+data.num+'   '+data.cidade.trim()+'-'+data.estado, txt.x,txt.y);
        addLine()
        addLine()
    }

    doc = new jsPDF({
        orientation: '2',
        unit: 'mm',
        format: [210,297]
    })  

    clearTxt(37,10,[210,297])
    frame()
    header_pdf()
    doc.setFontSize(23)
    doc.setFont(undefined, 'bold')
    doc.text('ANÁLISE DE FROTA', txt.x+ 50,txt.y);
    addLine()
    doc.setFont(undefined, 'normal')
    doc.setFontSize(12)
    let lastEmp
    let tot = 0
    let subTot = 0
    for(let i=1; i< obj.rows.length;i++){
        const data = obj.rows[i].data

        if(data.id_emp != lastEmp){
            lastEmp = data.id_emp
            postCli(data)
        }
        doc.setFont(undefined, 'normal')
        doc.text(dataBR(data.data_analise) + '  Carro-'+data.num_carro, txt.x,txt.y);
        doc.text('Executado: '+(data.exec=='1'?'SIM':'NÃO'), txt.x+ 70,txt.y);
        doc.text('R$ '+parseFloat(data.valor).toFixed(2), txt.x+ 110,txt.y);
        addLine()
        subTot += parseFloat(data.valor)
        if(i+1 == obj.rows.length || obj.rows[i+1].data.id_emp != lastEmp){
            doc.setFont(undefined, 'bold')
            doc.text(' Total', txt.x+ 90,txt.y);
            doc.text('R$ '+subTot.toFixed(2), txt.x+ 110,txt.y);
            doc.setFont(undefined, 'normal')
            tot += subTot
            subTot = 0
            addLine()
        }
    }

    doc.save('RelAnaFrot.pdf')

}

function anaFrotaOrc(obj){

    function postCli(data){
        doc.setFont(undefined, 'bold')
        line(txt.y)
        addLine(3)
        doc.text(today.getFormatBR() +'  Cliente: '+data.fantasia, txt.x,txt.y);
        doc.text('CNPJ: '+getCNPJ(data.cnpj), txt.x+135,txt.y);
        addLine()
        doc.text('End.: '+data.endereco.trim()+','+data.num+'   '+data.cidade.trim()+'-'+data.estado, txt.x,txt.y);
        addLine(2)

    }

    doc = new jsPDF({
        orientation: '2',
        unit: 'mm',
        format: [210,297]
    })  

    clearTxt(37,10,[210,297])
    frame()
    header_pdf()
    doc.setFontSize(23)
    doc.setFont(undefined, 'bold')
    doc.text('ORÇAMENTO', txt.x+ 65,txt.y);
    addLine()
    doc.setFont(undefined, 'normal')
    doc.setFontSize(12)
    let lastEmp
    let tot = 0
    let subTot = 0
    for(let i=1; i< obj.rows.length;i++){
        const data = obj.rows[i].data
console.log(data)
        if(data.id_emp != lastEmp){
            lastEmp = data.id_emp
            postCli(data)
        }

        doc.setFont(undefined, 'bold')
        doc.text('Carro-'+data.num_carro, txt.x,txt.y);
        doc.text('Local de Execução: '+data.local, txt.x+ 40,txt.y);
        addLine()
        doc.text('Serviço:', txt.x,txt.y);
        addLine()
        doc.setFont(undefined, 'normal')
        box(data.obs,txt.x,txt.y,800,1)
        doc.text('Valor R$'+parseFloat(data.valor).toFixed(2), txt.x,txt.y);
        addLine(2)

        subTot += parseFloat(data.valor)
        if(i+1 == obj.rows.length || obj.rows[i+1].data.id_emp != lastEmp){
            doc.setFont(undefined, 'bold')
            doc.text('Valor Total R$ '+subTot.toFixed(2), txt.x,txt.y);
            doc.setFont(undefined, 'normal')
            tot += subTot
            subTot = 0
            addLine()
        }
    }

    doc.save('RelAnaFrot.pdf')

}
