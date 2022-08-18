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


function number(campo,dec=2){
    var ok_chr = new Array('1','2','3','4','5','6','7','8','9','0');
    var text = campo.value;
    var after_dot = 0;
    var out_text = '';
    for(var i = 0; i<text.length; i++){

        if(after_dot > 0){ // conta quantas casas depois da virgula
            after_dot = after_dot + 1;
        }

        if (after_dot < (dec+2) ){ // se não passou de 2 casas depois da virgula ( conta o ponto + 2 digitos)

            if(ok_chr.includes(text.charAt(i))){
                out_text = out_text + text.charAt(i)

            }
            if((text.charAt(i) == ',' || text.charAt(i) == '.') && after_dot == 0){
                out_text = out_text + '.';
                after_dot = after_dot + 1;
            }
        }


    }     

    campo.value = out_text ;
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

function getCNPJ(V){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    let out = ''
    for(let i=0; i< V.length; i++){
        if(ok_chr.includes(V[i])){
            out+=V[i]
            if(i==1 || i==4){
                out+='.'
            }else if(i==7){
                out+='/'
            }else if(i==11){
                out+='-'
            }
        }
    }
    return out
}

function dataBR(V){
    return V.substring(8,10)+'/'+V.substring(5,7)+'/'+V.substring(0,4)
}

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
    number(param);
    var num = param.value;
    var out = '';
    var count = 0;

    for(i=0;i<num.length;i++){
        chr = num.substring(i,i+1);
        count++;

        if(count == 1){
            out = '(' + out ;
        }
        if(count == 3){
            out = out + ')';
        }
        if(count == 7){
            out = out + '-';
        }
        if(count == 11){
            out = out.substr(0,5) +" "+out.substr(5,3)+out.substr(9,1)+"-"+out.substr(10,3);
        }		
        out = out + chr;			
    }

    param.value = out;
}