<?php   

  function addItem($access,$obj){
    $menu = [];

    for($i = 0; $i< count($obj); $i++){  

      if (in_array($access, $obj[$i]->access)) {

        $item = new stdClass();
        $item->modulo = $obj[$i]->modulo;
        $item->script = $obj[$i]->script;
        $item->class = $obj[$i]->class;
        $item->icone = $obj[$i]->icone;
        $item->itens = [];

        if(count($obj[$i]->itens) > 0){
          $item->itens = addItem($access, $obj[$i]->itens);
//          array_push($item->itens, addItem($access, $obj[$i]->itens));          
        } 

        array_push($menu, $item);

      }       

    }

    return $menu;
  }

  $out = [];

	if (IsSet($_POST["hash"])){
	  $path = "../config/menu.json";
	  $hash = $_POST["hash"];
    $access = 0;
    
    include "connect.php";        

    $query = "SELECT class FROM tb_usuario WHERE hash=\"$hash\";";

    $result = mysqli_query($conexao, $query);
		$qtd_lin = $result->num_rows;

		if($qtd_lin > 0){
      $row = $result->fetch_assoc();
      $access = $row["class"];
		}

	    $conexao->close();  

      if (file_exists($path)) {
          $fp = fopen($path, "r");
          $resp = "";
          while (!feof ($fp)) {
              $resp = $resp . fgets($fp,4096);
          }
          fclose($fp);
          $json = json_decode($resp);

          $out = addItem($access,$json->menu);

      }            

  }
        
//    var_dump($out);
	print json_encode($out);

?>