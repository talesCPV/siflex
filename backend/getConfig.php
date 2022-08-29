<?php   

	if (IsSet($_POST["field"])){
        $path = getcwd().'/../config/config.json';
        $field = $_POST["field"];
        $order = $_POST["order"];
        $value = $_POST["value"];
        if (file_exists($path)) {           
            $fp = fopen($path, "r");
            $txt = "";
            while (!feof ($fp)) {
                $txt = $txt . fgets($fp,4096);
            }
            fclose($fp); 
            $json = json_decode($txt); 
            if($order == 'read'){          
                $out =$json->$field;
                print json_encode($out);
            }else{ 
                $json->$field->$order = $value; 
//var_dump($json);                                          
                return file_put_contents($path, json_encode($json));
            }
        }        
    }

?>