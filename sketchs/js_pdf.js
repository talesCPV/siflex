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

function addPage(Y=46){
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

function addLine(N=1, botton=0, top=46){
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
    const w = doc.getTextDimensions(T).w
    const xOffset = (box[1] - box[0] - w) /2;  
    doc.text(T, box[0] + xOffset, txt.y);
    addLine()
}

function right_text(T='',margin=0, pos=doc.internal.pageSize.getWidth()){
    const text = T==''? txt.text : T
    const w = doc.getTextDimensions(T).w
    const xOffset = pos - margin - w 
    doc.text(T, xOffset, txt.y);
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

function anaFrotaRelat(obj,tipo='analise'){
    function postCli(data){
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text('Cliente:' + data.fantasia.trim().toUpperCase() ,15,txt.y)
        doc.setFont(undefined, 'normal')
        doc.setFontSize(10)
        data.cnpj.trim() != '' ? doc.text('CNPJ:' + getCNPJ(data.cnpj) ,130,txt.y) :0
        addLine()
        data.endereco.trim() != '' ? doc.text('End. '+ data.endereco.trim().toUpperCase()+','+data.num.trim(),15,txt.y) :0
        data.cidade.trim()!= '' ? doc.text(data.cidade.trim().toUpperCase()+'-'+data.estado,130,txt.y) :0    
        addLine()
        doc.text('Data da Avaliação:'+ dataBR(data.data_analise),15,txt.y)
        addLine(2)
    }

    function postTable(){
        function pushTot(title,value,color=[37, 68, 65],font=[255]){
            tbl_body.push([{
                content: title,
                colSpan: colspan,
                styles: { halign: 'right', fillColor: color, textColor:font},
              },
              {
                content: value, 
                styles: { halign: 'right', fillColor: color, textColor:font },         
              }])
        }

        let head
        let colspan
        if(tipo == 'analise'){
            head =  [["Carro","Analize", "Exec.",'Valor']]
            colspan = 3
        }else{
            head =  [["Carro","Local", "Serviço."]]
            colspan = 2
        }

        pushTot('','Total '+viewMoneyBR(subTot.toFixed(2),[0,0,0]))


        doc.autoTable({
            head: head,
            body: tbl_body,
            columnStyles: {
                0: {cellWidth: 15},
                1: {cellWidth: 20},
                2: {cellWidth: 100}
            },
            startY: txt.y
        });

        txt.y = doc.previousAutoTable.finalY
        tbl_body = []
        total += subTot
        subTot=0  

        addLine()
        line(txt.y)
        addLine()
    }

    jsPDF.autoTableSetDefaults({
        headStyles: { fillColor: [37, 68, 65] },
    })

    doc = new jsPDF()  

    clearTxt(37,10,[210,297])
    frame()
    header_pdf()

    line(txt.y)
    addLine(2)

    doc.setFontSize(15)
    doc.setFont(undefined, 'bold')
    if(tipo == 'analise'){
    center_text(document.querySelector('#edtTitle').value.trim())
    }else{
        center_text('Orçamento')
    }
    doc.setFont(undefined, 'normal')
    doc.setFontSize(12)
    addLine()

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

        if(tipo == 'analise'){
            tbl_body.push([data.num_carro,dataBR(data.data_analise),data.exec=='1'?'SIM':'NÃO',viewMoneyBR(parseFloat(data.valor).toFixed(2))])            
        }else{
            tbl_body.push([data.num_carro,data.local,data.obs])
            tbl_body.push(['Valor',viewMoneyBR(parseFloat(data.valor).toFixed(2)),''])
        }

        subTot += parseFloat(data.valor)
    }

    postTable()
    addLine()
    if(tipo == 'analise'){
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        right_text('Total '+ viewMoneyBR(total.toFixed(2)),17)
        doc.setFont(undefined, 'normal')
        doc.setFontSize(10)
        addLine()
    }

//  TEXTO DE OBS 
    if(document.querySelector('#edtObs').value.trim() != ''){
        if(txt.y < 250){
            txt.y = 250
        }
        doc.setFontSize(8)
        line(txt.y)
        addLine(0.7)
        box(document.querySelector('#edtObs').value.trim(),10,txt.y,170,0.7)
    
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
        tbl_body.push([data.id,data.tipo,data.origem,data.ref.maxWidth(15).toUpperCase(),data.emp.maxWidth(15).toUpperCase(),dataBR(data.data_pg),data.pgto,viewMoneyBR(data.preco)])
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

    doc.text('Total    '+viewMoneyBR(total.toFixed(2)), 155,txt.y);

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

function print_cotacao(ped,itens,emp,tipo='cot'){
   
    const show_val = document.querySelector('#ckbValor').checked

    jsPDF.autoTableSetDefaults({
        headStyles: { fillColor: [37, 68, 65] },
    })

    doc = new jsPDF();
    
    clearTxt(37,10,[210,297])
    frame()
    header_pdf()
    line(txt.y)
    addLine()

//  CABEÇALHO    
    doc.setFontSize(10)
    doc.text(ped.id +' - '+ (ped.status=='ABERTO' ? 'COTAÇÃO: ' : 'PEDIDO: ') + ped.num_ped.trim().toUpperCase()  ,10,txt.y)
    doc.text('Data:' + dataBR(ped.data_ped) ,172,txt.y)
    addLine()
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text('Cliente:' + ped.fantasia.trim().toUpperCase() ,10,txt.y)
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    addLine()
    emp.endereco.trim() != '' ? doc.text('End. '+ emp.endereco.trim().toUpperCase()+','+emp.num.trim(),10,txt.y) :0
    emp.cidade.trim()!= '' ? doc.text(emp.cidade.trim().toUpperCase()+'-'+emp.estado,120,txt.y) :0    
    addLine()
    doc.text('CEP:'+ getCEP(emp.cep),10,txt.y)
    doc.text('Tel:'+ getFone(emp.tel),80,txt.y)
    emp.cnpj.trim()!= '' ? doc.text('CNPJ:'+ getCNPJ(emp.cnpj),120,txt.y) :0    
    emp.ie.trim()!= '' ? doc.text('IE:'+ getIE(emp.ie),172,txt.y) :0
    addLine()
    ped.comp != null ? doc.text('Comprador:'+ped.comp.trim().toUpperCase(),10,txt.y) :0    
    ped.resp != null ? doc.text('Vendedor:'+ ped.resp.trim().toUpperCase(),80,txt.y) :0
    doc.text('Prev. Entrega:'+ dataBR(ped.data_ent),157,txt.y)
    addLine()
    doc.text('Obs:',10,txt.y)
    ped.obs != null ? box(ped.obs,20,txt.y,170) : addLine()    
    line(txt.y)
    addLine(2)

    doc.setFontSize(15)
    doc.setFont(undefined, 'bold')
    if(tipo == 'cot'){
        if(show_val){
            center_text((ped.status=='ABERTO' ? 'COTAÇÃO - ' : 'PEDIDO - ')+ ped.num_ped.trim().toUpperCase())   
        }else{
            center_text('Preparação de Material')
        }
    }else{
        center_text('Recibo de Material')
    }
    doc.setFontSize(14)

//    TABELA
    let tbl_body = []
    let total = 0
    let head
    for(let i=1; i< itens.rows.length;i++){
        const data = itens.rows[i].data
        if(show_val){
            tbl_body.push([data.cod_prod,data.descricao.maxWidth(40).toUpperCase(),data.und,data.qtd,viewMoneyBR(parseFloat(data.preco).toFixed(2)),viewMoneyBR(data.total)])
            head= [["Cod","Descrição",'Und.','Qtd.',"Preço Unit.",'Sub Total.']]
        }else{
            tbl_body.push([data.cod_prod,data.descricao.maxWidth(50).toUpperCase(),data.und,data.qtd])
            head= [["Cod","Descrição",'Und.','Qtd.']]
        }
        total += parseFloat(data.total)
    }

    doc.autoTable({
        head: head,
        body: tbl_body,
        startY: txt.y      
    });

    txt.y = doc.previousAutoTable.finalY
    addLine()


//  TOTAL  
    if(show_val){  
        right_text('Total '+ viewMoneyBR(total.toFixed(2)),17)
    }

//  ASS. RECIBO DE MATERIAL

    if(tipo == 'rec'){
        addLine(5)
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        center_text('______________________________________________________')
        center_text('Fico ciente da cobranca que sera feita posteriormente')
    }
    
//  CONDIÇÂO DE PGTO  
    if(show_val){
        if(txt.y < 250){
            txt.y = 250
        }
        doc.setFontSize(8)
        line(txt.y)
        addLine(0.7)
        doc.text('Condição de Pagamento:',10,txt.y)
        addLine(0.7)
        box(ped.cond_pgto.trim(),10,txt.y,170,0.7)    
    }

    doc.save('cotacao.pdf')

}