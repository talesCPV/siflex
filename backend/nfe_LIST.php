<?php

    if (IsSet($_POST["folder"])){
        $path = getcwd().'/../assets/'.$_POST["folder"].'/';
        $files = scandir($path);
        $resp = json_encode($files);
        print($resp); 
    }

?>