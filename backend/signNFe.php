<?php
/**
 * Este é um exemplo do uso do método de assinatura digital do xml 
 * da NFe
 * Esse método recebe a NFe como uma "string" com o conteúdo do xml e o 
 * nome da "tag" xml que deverá ser assinada
 * 
 */


if(isset($_POST['filename'])){
    //carregue as classes
    require_once('libs/ToolsNFePHP.class.php');
    //as classes desabilitam os erros e avisos por padrão então
    //enquanto você está desenvolvendo reabilite os avisos de erros
    error_reporting(E_ALL);ini_set('display_errors', 'On');
    //instancie a classe tools

    $nfe = new ToolsNFePHP();
    //escolha o xml a ser assinado
    $arqxml = '../assets/NFe/xml/'. $_POST['filename'].'.xml';
    //determine o novo local para o esse xml depois de assinado
    $novonome = '../assets/NFe/xml/'. $_POST['filename'] .'-sign.xml';
    echo($arqxml);
    //verifique se o xml existe
    if ( is_file($arqxml) ) {
        //se o xml for achado então carregue o xml todo em uma string
        $nfefile = file_get_contents($arqxml);
        //tente assinar o xml na tag "infNFe", pois se trata de uma NFe 
        if ( $signn = $nfe->signXML($nfefile, 'infNFe') ) {
            //se houve retorno do método então o xml foi assinado
            echo "NFe foi Assinada ..<br />";
            //tente gravar esse xml assinado na nova localização
            if ( file_put_contents($novonome, $signn) ) {
                //a gravação foi um sucesso, apague o arquivo xml original
                unlink($arqxml);
                echo "SUCESSO !!! NFe assinada em $novonome. <br />";
            } else {
                echo "FALHA na gravação da NFe Assinada!! <br />";
            }
        } else {
            echo "FALHA NFe não assinada!!!! <br />";
            echo $nfe->errMsg;
        } //fim signXML    
    }else{
        echo 'não encontrou o arquivo!';
    } //fim file existe
} //Fim do exemplo


?>