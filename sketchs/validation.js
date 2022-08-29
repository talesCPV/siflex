function getEnter(e, button = ''){
    var keynum;

    if(window.event) { // IE                  
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera                 
      keynum = e.which;
    }

    if(keynum == 13){
        document.querySelector('#'+button).click()
    }
}

function checkField(fields){
    
    for(let i=0; i< fields.length; i++){
        if(document.getElementById(fields[i]).value.trim() == ''){
            alert('Favor preencher todos os campos obrigatórios.')
            document.getElementById(fields[i]).focus()
            return false
        }
    }
    return true
}

function checkRepass(fields){
    const check = document.getElementById(fields[0]).value
    for(let i=1; i<fields.length; i++){
        if(document.getElementById(fields[i]).value != check){
            alert('Por favor, repita a senha digitada.')
            document.getElementById(fields[i]).focus()
            return false
        }
    }
    return true
}

function valFloat(edt,dec=2){
    edt.value = getFloat(edt.value,dec)
}

function valCPF(edt){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    var num = edt.value;
    var count = 0;
    var out = '';

    for(i=0;i<num.length;i++){
        chr = num[i]
        if(ok_chr.includes(chr)){
            count++;
            if(count == 4 || count == 7){
                out += '.' ;
            }else if(count == 10){
                out += '-' ;
            }
            out += chr;	
        }
		
    }
    edt.value = out;
}

function valCEP(edt){
    edt.value = getCEP(getNum(edt.value))
}

function valCNPJ(edt){
    edt.value = getCNPJ(getNum(edt.value))
}

function valIE(edt){
    edt.value = getIE(getNum(edt.value))
}

function getFloat(text,dec=2){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0']
    let before_dot = '0';
    let after_dot = '';
    let dot =  '';
    for(var i = 0; i<text.length; i++){
        if(dot.length == 0){
            if(['.',','].includes(text[i])){
                dot = '.'
            }else{                
                before_dot +=  ok_chr.includes(text[i]) ? text[i] : ''
                before_dot = parseInt(before_dot).toString()
            }
        }else{
            if(after_dot.length < dec){
                after_dot +=  ok_chr.includes(text[i]) ? text[i] : ''
            }
        }
    }     
    return before_dot+dot+after_dot;
}

function getNum(V){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    let out = ''
    for(let i=0; i< V.length; i++){
        if(ok_chr.includes(V[i])){
            out+=V[i]
        }
    }
    return out
}

function getCNPJ(V){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    let out = ''
    for(let i=0; i< V.length; i++){
        if(ok_chr.includes(V[i])){
            if(i==2 || i==5){
                out+='.'
            }else if(i==8){
                out+='/'
            }else if(i==12){
                out+='-'
            }
            out+=V[i]            
        }
    }
    return out
}

function getIE(V){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    let out = ''
    for(let i=0; i< V.length; i++){
        if(ok_chr.includes(V[i])){
            if(i==3 || i==6 || i==9){
                out+='.'
            }
            out+=V[i]
        }
    }    
    return out
}

function getCEP(V){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    let out = ''
    for(let i=0; i< V.length; i++){
        if(ok_chr.includes(V[i])){
            if(i==2){
                out+='.'
            }else if(i==5){
                out+='-'
            }
            out+=V[i]            
        }
    }
    return out
}

function getFone(V){
    let num = getNum(V)
    let out = '';
    for(i=0;i<num.length;i++){
        chr = num.substring(i,i+1);
        if(i == 0){
            out = '(' + out ;
        }
        if(i == 2){
            out = out + ')';
        }
        if(i == 6){
            out = out + '-';
        }
        if(i == 10){
            out = out.substring(0,5) +" "+out.substring(5,8)+out.substring(9,10)+"-"+out.substring(10,13)
        }		
        out = out + chr;			
    }
    return out
}

function dataBR(V){
    return V.substring(8,10)+'/'+V.substring(5,7)+'/'+V.substring(0,4)
}

function viewMoneyBR(V){
    const num = getNum(V)
    let out = ''
    for(let i=num.length-1; i>=0; i--){        
        out = num[i] + out        
        out = i==num.length-2 ? ','+out : (i-num.length-1)%3==0 && i!=0 && i< num.length-3 ? '.'+out : out
    }
    return 'R$'+out
}
/*
function moneyBR(V){
    return 'R$'+ parseFloat(V).toFixed(2)
}
*/
function horario(edt){
    let ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    var num = edt.value;
    var count = 0;
    var out = '';

    for(i=0;i<num.length;i++){
        chr = num[i]
        if(ok_chr.includes(chr)){

            count++;
            if(count == 3 ){
                out += ':' ;
            }
            out += chr;	
        }
		
    }

    if(out.length == 1){
        out = parseInt(out)<3 ? out : ''
    }else if(out.length == 2){
        out = parseInt(out)<24 ? out : out.substring(0,1)
    }else if(out.length == 4){
        out = parseInt(out.substring(3,4))< 6 ? out : out.substring(0,3)
    }

    edt.value = out;
}

function phone(param){ // formata a string no padrão TELEFONE
    param.value = getFone(param.value)
}

function hideOrig(){
    if(document.querySelector('#cmbEntSai').value == 'ENTRADA'){
        document.querySelector('#cmbOrigem').disabled = true
    }else{
        document.querySelector('#cmbOrigem').disabled = false
    }
}