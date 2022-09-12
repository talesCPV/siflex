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

function backLine(N=1, botton=0, top=46){
    txt.y -= txt.lineHeigth * N
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

function header_pdf(lin_h = 5, font_size = 12){
    ini_y = 13
    logo([14,15,45,10])
    //  CABEÇALHO
    doc.setFontSize(font_size)
    doc.setFont(undefined, 'normal')
    doc.text('Av. Dr. Rosalvo de Almeida Telles, 2070', 97,ini_y);
    doc.text('Nova Cacapava - Cacapava-SP - CEP 12.283-020', 88,ini_y+lin_h);
    doc.text('comercial@flexibus.com.br | (12) 3653-2230', 93,ini_y + (lin_h*2));
    doc.text('CNPJ 00.519.547/0001-06', 111,ini_y+(lin_h*3));    

}


/*  RELATORIES  */

function print_etq(data){
    
    doc = new jsPDF()  
    const x_ = 60

    clearTxt()
//    frame()

    doc.rect(x_+5,5,txt.dim[0]-5*2,txt.dim[1]-5*2)
    doc.line(x_+5,23,x_+txt.dim[0]-5,23)
    doc.line(x_+5,45,x_+txt.dim[0]-5,45)

    getBarcode(data.cod.padStart(13,'0'),[x_+25,52,40,15])
    logo([x_+30,10,30,10])

    doc.setFontSize(8)
    doc.setFont(undefined, 'bold')
    doc.text(data.descricao, x_+6,30);
    doc.text('Forn.:', x_+6,35);
    doc.text('Cod.:', x_+6,40);
    doc.text('Cod. Orig:', x_+40,40);

    doc.setFont(undefined,'normal')
    doc.text(data.nome.toUpperCase(), x_+15,35);
    doc.text(data.cod.padStart(13,'0') , x_+15,40);
    doc.text(data.cod_cli.padStart(13,'0') , x_+55,40);

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
    header_pdf(4,10)
   
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
                doc.setFontSize(14)
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

function carrosRelat(obj, origem='AnaFrota'){
    let color = [0,0,0]
    let fontSize = 11
    let desc = 0
    function postCli(data){
console.log(data)        
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
        if(['AnaFrota','AnaFrotaOrc'].includes(origem)){
            doc.text('Data da Avaliação:'+ dataBR(data.data_analise),15,txt.y)
            color = main_data.anafrota.data.cor
            desc = main_data.anafrota.data.desc
            doc.setTextColor(color); 
        }else{
            doc.text('Data da Execução:'+ dataBR(data.data_exec),15,txt.y)
            color = main_data.servexec.data.cor
            desc = main_data.servexec.data.desc
            doc.setTextColor(color); 
        }
        addLine()
        //  TEXTO DE OBS
        if(document.querySelector('#edtObs').value.trim() != ''){
            addLine()
            doc.setFontSize(8)
            box(document.querySelector('#edtObs').value.trim(),15,txt.y,170,0.7)
        }
        doc.setTextColor(0,0,0); 
    }

    function postTable(){
        function pushTot(title,value){
            tbl_body.push([{
                content: title,
                colSpan: colspan,
                styles: { halign: 'left', fillColor: [37, 68, 65], textColor:[255]},
              },
              {
                content: value, 
                styles: { halign: 'right', fillColor: [37, 68, 65], textColor:[255] },         
              }])
        }

        let head
        let colspan
        let celWidth
        if(origem == 'AnaFrota'){
            head =  [["Carro","Análise", "Exec.",'Valor']]
            colspan = 3
            celWidth = 20
            fontSize = main_data.anafrota.data.fontsize
        }else if(origem == 'AnaFrotaOrc'){
            head =  [["Carro","Local", "Serviço a ser Executado"]]
            colspan = 2
            celWidth = 100
            fontSize = main_data.anafrota.data.fontsize
        }else if(origem == 'ServExec'){
            head =  [["Carro","Pedido", "NF.",'Valor']]
            colspan = 3
            celWidth = 20
            fontSize = main_data.servexec.data.fontsize
        }else{
            head =  [["Carro","NF","Pedido","Serviço Executado"]]
            colspan = 3
            celWidth = 20
            fontSize = main_data.servexec.data.fontsize
        }

        pushTot(qtd+' carros','Total '+viewMoneyBR(subTot.toFixed(2)))
        qtd = 0

        doc.autoTable({
            head: head,
            body: tbl_body,
            columnStyles: {
                0: {cellWidth: fontSize+10},
                1: {cellWidth: fontSize+15},
                2: {cellWidth: fontSize+celWidth}
            },
            styles :{fontSize: fontSize},
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
//    frame()
    header_pdf()

    line(txt.y)
    addLine()

    doc.setFontSize(15)
    doc.setFont(undefined, 'bold')
    center_text(document.querySelector('#edtTitle').value.trim())
    doc.setFont(undefined, 'normal')
    doc.setFontSize(12)
    addLine()

    let lastEmp
    let tbl_body = []
    let subTot = 0
    let total = 0 
    let qtd = 0   
    for(let i=1; i< obj.rows.length;i++){
        const data = obj.rows[i].data
        if(data.id_emp != lastEmp){
            lastEmp = data.id_emp
            if(i!= 1){
                postTable()                
            }         
            postCli(data)
        }

        if(origem == 'AnaFrota'){
            tbl_body.push([data.num_carro,dataBR(data.data_analise),data.exec=='1'?'SIM':'NÃO',viewMoneyBR(parseFloat(data.valor).toFixed(2))]) 
        }else if(origem == 'AnaFrotaOrc'){
            tbl_body.push([data.num_carro,data.local,data.obs])
            tbl_body.push(['','','Valor: '+viewMoneyBR(parseFloat(data.valor).toFixed(2))])
            tbl_body.push(['','',''])
        }else if(origem == 'ServExec'){
            tbl_body.push([data.num_carro,data.pedido,data.nf,viewMoneyBR(parseFloat(data.valor).toFixed(2))]) 
        }else{
            tbl_body.push([data.num_carro,data.nf,data.pedido,data.obs])
            tbl_body.push(['','','','Valor: '+viewMoneyBR(parseFloat(data.valor).toFixed(2))])
            tbl_body.push(['','','',''])
        }
        qtd++
        subTot += parseFloat(data.valor)
    }

    postTable()
    addLine()
    doc.setFont(undefined, 'bold')
    if(desc > 0){
        doc.setFontSize(11)
        right_text('Desconto: '+ viewMoneyBR(desc.toFixed(2)),17)
        addLine(0.4)
        line(txt.y,'h',150,15)
        addLine()            
        right_text('Total '+ viewMoneyBR((total-desc).toFixed(2)),17)
        addLine(2) 
    } 

    if(['AnaFrotaOrc','ServOrc'].includes(origem)){
        doc.setTextColor(color); 
        addLine()
        doc.setFontSize(8)       
        center_text('Lembrando que até a data da execução poderá haver acrécimos de serviço')
        addLine(0.3)
        center_text('Recomenda-se corrigir os problemas o mais rápido possível')
        doc.setFont(undefined, 'normal')
        doc.setFontSize(10)
        doc.setTextColor(0,0,0); 
        addLine()
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
        tbl_body.push([data.id,data.tipo,data.origem,data.ref.maxWidth(15).toUpperCase(),data.emp.maxWidth(15).toUpperCase(),dataBR(data.data_pg),data.pgto,viewMoneyBR(parseFloat(data.preco).toFixed(2))])
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
    emp.endereco.trim() == '' && emp.cidade.trim() == '' ? 0 : addLine()
    emp.cep == null || emp.cep.trim() == '' ? 0 : doc.text('CEP:'+ getCEP(emp.cep),10,txt.y)
    emp.tel == null || emp.tel.trim() == '' ? 0 : doc.text('Tel:'+ getFone(emp.tel),80,txt.y)
    emp.cnpj== null || emp.cnpj.trim()== '' ? 0 : doc.text('CNPJ:'+ getCNPJ(emp.cnpj),120,txt.y)
    emp.ie  == null || emp.ie.trim()  == '' ? 0 : doc.text('IE:'+ getIE(emp.ie),172,txt.y)
    addLine()
    ped.comp != null ? doc.text('Comprador:'+ped.comp.trim().toUpperCase(),10,txt.y) :0    
    ped.resp != null ? doc.text('Vendedor:'+ ped.resp.trim().toUpperCase(),80,txt.y) :0
    doc.text('Prev. Entrega:'+ dataBR(ped.data_ent),157,txt.y)
    if(ped.obs != null && ped.obs.trim() != ''){
        addLine()
        doc.text('Obs:',10,txt.y)
        addLine()
        doc.setFont(undefined, 'bold')
        box(ped.obs,10,txt.y,170)
        doc.setFont(undefined, 'normal')
    }
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
    doc.setFontSize(12)
    if(show_val){  
        if(ped.desconto != '0') {
            addLine(0.5)
            right_text('Subtotal '+ viewMoneyBR(total.toFixed(2)),17)
            addLine()
            right_text('Desconto '+ viewMoneyBR(parseFloat(ped.desconto).toFixed(2)),17)
            addLine(0.4)
            line(txt.y,'h',150,15)
            addLine()
        }        
        right_text('Total '+ viewMoneyBR((total - parseFloat(ped.desconto)).toFixed(2)),17)
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
    if(show_val && ped.cond_pgto.trim() != ''){
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

function holerite(func){

    function drawFrame(Y=5,mode='ADTO'){
        const date =  meses[func.data.getMonth()-1] +'/'+ func.data.getFullYear()
        const pageWidth = doc.internal.pageSize.getWidth()
        txt.y = Y+5
//        doc.rect(Y,5,doc.internal.pageSize.getWidth()-10,Y+100)        
        logo([10,Y+5,20,5])
        doc.setFontSize(8)
        doc.setFont(undefined, 'bold')    
        doc.text('Flexibus Sanfonados LTDA.',35,txt.y)
        center_text('RECIDO DE PAGAMENTO',[165,pageWidth-5])
        backLine()
        addLine(0.7)
        doc.text('Rua Dr. Rosalvo de Almeida Telles, 2070',35,txt.y)
        doc.text('Caçapava-SP',105,txt.y)
        center_text(mode,[165,pageWidth-5])
        backLine()
        addLine(0.7)
        doc.text('00.519.547/0001-06',35,txt.y)
        center_text(date,[165,pageWidth-5])
        backLine(0.5)
        line(txt.y)
        addLine()
        doc.text(func.nome,10,txt.y)
        doc.text(func.cbo,105,txt.y)
        addLine(0.7)
        doc.text(func.cargo,10,txt.y)
        doc.text('ADMISSÂO '+dataBR(func.data_adm),105,txt.y)
        addLine(0.7)
        line(txt.y)
        addLine(0.7)
        doc.text('Descrição',10,txt.y)
        doc.text('Referência',90,txt.y)
        doc.text('Vencimentos',135,txt.y)
        doc.text('Descontos',180,txt.y)
        addLine()


        const sal = parseFloat(func.salario)
        const H_normal = func.horas.hr + func.horas.adn
        const sal_base = sal * 220
        const sal_bruto = sal * (func.horas.hr + (func.horas.adn * 1.2) + (func.horas.he * 2) + (func.horas.he_adn * 2.2) )

        const adto = (sal_base*0.4).toFixed(2)

        if(mode=='ADTO'){
            doc.text('ADIANTAMENTO SALARIAL',10,txt.y)
            doc.text(H_normal.toFixed(2),90,txt.y)
            doc.text(adto,135,txt.y)



        }






        doc.setFont(undefined, 'normal')

    }


    console.log(func)
    alert(1)
    jsPDF.autoTableSetDefaults({
        headStyles: { fillColor: [37, 68, 65] },
    })

    doc = new jsPDF();

    clearTxt(37,10,[210,297])

    drawFrame()
    drawFrame(150)

    doc.save('holerite.pdf')


}