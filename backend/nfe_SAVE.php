<?php   
	if (IsSet($_POST["txt"]) && IsSet($_POST["filename"])){
        $path = getcwd().'/../assets/NFe/'.$_POST["filename"];
        $data = $_POST["txt"];        
        $fp = fopen($path, "w");
        fwrite($fp,$data);
        fclose($fp);                                      
    }

?>