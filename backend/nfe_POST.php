<?php   
	if (IsSet($_POST["data"]) && IsSet($_POST["file"])){
        $path = getcwd().'/../config/'.$_POST["file"];        
        $data = $_POST["data"];
        if (file_exists($path)) {
            if($data == ''){
                $fp = fopen($path, "r");
                $txt = "";
                while (!feof ($fp)) {
                    $txt = $txt . fgets($fp,4096);
                }
                fclose($fp);
                $json = json_decode($txt);
                print json_encode($json);
            }else{
                $json = json_encode($data);
                $fp = fopen($path, "w");
                fwrite($fp,$data);
                fclose($fp);            
            }
        }        
    }

?>