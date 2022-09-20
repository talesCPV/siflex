<?php

    $path = getcwd().'/../assets/NFe/';
    $files = scandir($path);
    $resp = json_encode($files);
    print($resp); 

?>