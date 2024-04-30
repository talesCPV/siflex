<?php   
	if (IsSet($_POST["file"])){
        $path = getcwd().'/../config/'.$_POST["file"];    
        if (file_exists($path)) {          
            $fp = fopen($path, "r");
            $txt = "";
            while (!feof ($fp)) {
                $txt = $txt . fgets($fp,4096);
            }
            fclose($fp); 
            print $txt;
        }        
    }

?>