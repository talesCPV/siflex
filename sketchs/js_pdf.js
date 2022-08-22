/*  IMPORTS  */




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

function addPage(Y=46,margin=10){
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
    doc.setFont(undefined, 'normal')
    doc.text('Av. Dr. Rosalvo de Almeida Telles, 2070', 97,13);
    doc.text('Nova Cacapava - Cacapava-SP - CEP 12.283-020', 88,18);
    doc.text('comercial@flexibus.com.br | (12) 3653-2230', 93,23);
    doc.text('CNPJ 00.519.547/0001-06', 111,28);    

}


/*  RELATORIES  */

function print_etq(data){
    
    doc = new jsPDF()  

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
        orientation: 'landscape',
        format: 'a4'
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
            box(tbl[row].cells[cel].innerHTML, x[cel],y[row]+y_,60,0.8)
        }
    }

    doc.save('pcp.pdf')
}

function anaFrotaRelat(obj){

    function postCli(data){
        doc.setFont(undefined, 'bold')
        addLine()
        doc.text('Cliente: '+data.fantasia, txt.x+5,txt.y);
        doc.text('CNPJ: '+getCNPJ(data.cnpj), txt.x+135,txt.y);
        addLine()
        doc.text('End.: '+data.endereco.trim()+','+data.num+'   '+data.cidade.trim()+'-'+data.estado, txt.x+5,txt.y);
        addLine(2)
    }

    function postTable(){

        function pushTot(title,value,color=[37, 68, 65],font=[255]){
            tbl_body.push([{
                content: title,
                colSpan: 3,
                styles: { halign: 'right', fillColor: color, textColor:font},
              },
              {
                content: moneyBR(value), 
                styles: { halign: 'left', fillColor: color, textColor:font },         
              }])
        }

        pushTot('Subtotal',subTot)

        doc.autoTable({
            head: [["Data", "Carro", "Exec.",'Valor']],
            body: tbl_body,
            startY: txt.y      
        }); 
        txt.y = doc.previousAutoTable.finalY
        tbl_body = []
        addLine()
        total += subTot
        subTot=0  
    }

    jsPDF.autoTableSetDefaults({
        headStyles: { fillColor: [37, 68, 65] },
    })

    doc = new jsPDF()  

    clearTxt(37,10,[210,297])
    frame()
    header_pdf()
    doc.setFontSize(21)
    doc.setFont(undefined, 'bold')
    addLine()
    doc.text('ANÁLISE DE FROTA', txt.x+ 55,txt.y);
    addLine()
    doc.setFont(undefined, 'normal')
    doc.setFontSize(12)
    let lastEmp
    let tbl_body = []
    let subTot = 0
    let total = 0    
    for(let i=1; i< obj.rows.length;i++){
        const data = obj.rows[i].data
        if(data.id_emp != lastEmp){
            lastEmp = data.id_emp
            if(i!= 1){
                postTable()
            }         
            postCli(data)
        }

        tbl_body.push([dataBR(data.data_analise),data.num_carro,data.exec=='1'?'SIM':'NÃO',moneyBR(data.valor)])
        subTot += parseFloat(data.valor)
       
    }


    postTable()
    addLine()
    doc.text('TOTAL   '+moneyBR(total), 155,txt.y);
    addLine()
    line(txt.y)
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

    doc = new jsPDF()  

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

function print_finan(obj){
  

    jsPDF.autoTableSetDefaults({
        headStyles: { fillColor: [37, 68, 65] },
    })


    let tbl_body = []
    let total = 0
    for(let i=1; i< obj.rows.length;i++){
        const data = obj.rows[i].data
        tbl_body.push([data.id,data.tipo,data.origem,data.ref.maxWidth(15).toUpperCase(),data.emp.maxWidth(15).toUpperCase(),dataBR(data.data_pg),data.pgto,moneyBR(data.preco)])
        total += data.tipo =='ENTRADA' ? parseFloat(data.preco) : -parseFloat(data.preco) 

    }

    doc = new jsPDF();
    
    clearTxt(37,10,[210,297])
    frame()
    header_pdf()
    line(txt.y)
    addLine(2)
    doc.setFontSize(23)
    doc.text('Relatório Financeiro', 70,txt.y);
    addLine()
    if(document.querySelector('#ckbData').checked){
        const gap = 'de '+dataBR(document.querySelector('#edtIni').value)+' até '+dataBR(document.querySelector('#edtFin').value)
        doc.setFontSize(12)
        doc.text(gap, 80,txt.y);
        addLine()
    }
    
    doc.setFontSize(12)

    doc.autoTable({
        head: [["Cod", "Tipo", "Orig.",'Referência','Sacado','Venc.','Pgto','Valor']],
        body: tbl_body,
        startY: txt.y      
    });

    txt.y = doc.previousAutoTable.finalY

    addLine()

    doc.text('Total    '+moneyBR(total), 155,txt.y);

    doc.save('RelFinan.pdf')

}

function print_prod(obj){
   
    jsPDF.autoTableSetDefaults({
        headStyles: { fillColor: [37, 68, 65] },
    })


    let tbl_body = []
    let total = 0
    for(let i=1; i< obj.rows.length;i++){
        const data = obj.rows[i].data
        tbl_body.push([data.id,data.descricao.maxWidth(25).toUpperCase(),data.tipo,data.nome.maxWidth(15).toUpperCase(),data.cod_bar,data.estoque,data.unidade])
    }

    doc = new jsPDF();
    
    clearTxt(37,10,[210,297])
    frame()
    header_pdf()
    line(txt.y)
    addLine(2)
    doc.setFontSize(23)
    doc.text('Lista de Produtos', 70,txt.y);
    addLine()
    doc.setFontSize(12)

    doc.autoTable({
        head: [["Cod","Descrição",'Tipo.','Fornecedor',"Cod. Forn.",'Estq.', "Und."]],
        body: tbl_body,
        startY: txt.y      
    });

    txt.y = doc.previousAutoTable.finalY

    doc.save('relatProd.pdf')

}