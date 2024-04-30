<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    if(isset($_POST['filename'])){
        $arq = '../assets/NFe/txt/'.$_POST['filename'].'.txt';

        if (is_file($arq) ){
            require_once('libs/ConvertNFePHP.class.php');
            $nfe = new ConvertNFePHP();
            $xml = $nfe->nfetxt2xml($arq);        
            if ($xml != ''){
                if (!file_put_contents('../assets/NFe/xml/'.$_POST['filename'].'.xml',$xml)){
                    echo "ERRO na gravação do XML";
                }else{
                    echo '<PRE>';
                    echo htmlspecialchars($xml);
                    echo '</PRE><BR>';
                }
            }else{
                echo"ERROR!!!";
            }
        }    
    }

?>
