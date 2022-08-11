<?php

	$forb = ["<",">","&","$","'","\\"];
	$range =[32,122];
	$index = [47,22,46,35,9,43,1,30,8,34,17,32,10,7,44,21,31,0,42,39,29,38,27,13,6,49,16,14,24,20,2,25,15,26,37,45,19,41,5,33,18,40,12,3,48,4];


	function shift($key,$shift,$sd){

		global $forb;
		global $range;

		$needle = ord($key);

		$i = 0;
		while($i < $shift){

			$needle = $needle + $sd;

			if(!in_array(chr($needle), $forb)){
				$i++;
			}

			if($needle > $range[1]){
				$needle = $range[0];
			}else if($needle < $range[0]){
				$needle = $range[1];
			}

		}

		return chr($needle);

	}



	function crip($str){
		global $index;

		while (strlen($str) < 6) {
			$str = " ".$str;
		}

		$size = strlen($str);

		$soma = 0;
		for($i=0; $i<$size; $i++){
			$soma = $soma + (ord($str[$i])) * ($i+1);
		}

		$word = "";				
		$i = 0;
		while (strlen($word) < count($index)) {
			$word = $word.shift(chr($index[$i]),$index[$i]+$soma,-1);
			$i++;
		}

		$ch1 = ord( shift($str[4], ord($str[0]) * ord($str[5]), -1)) ;
		$ch2 = ord( shift($str[3], ord($str[1]) * ord($str[2]),  1)) ;
		if($ch1 % 2 == 0){
			$st2 = 1;
		}else{
			$st2 = -1;
		}
		if($ch2 % 2 == 0){
			$st1 = 1;
		}else{
			$st1 = -1;
		}

		

		$word[23] = shift("#",floor($size / 2),1); 
		$word[36] = shift("g",ceil($size / 2),-1);
		$word[28] = chr($ch1);
		$word[11] = chr($ch2);


		for($i=0; $i<$size;$i++){

			if($i % 2 == 0){
				$word[$index[$i]] = shift($str[$i],$ch1,$st1);
			}else{
				$word[$index[$i]] = shift($str[$i],$ch2,$st2);
			}
		}


		return trim($word);

	};

	function decrip($str){		
		global $index;

		$ch = $str[23];
		$i = 0;
		while($ch != "#"){
			$ch = shift($ch,1,-1);
			$i++;
		}

		$size = $i;

		$ch = $str[36];
		$i = 0;
		while($ch != "g"){
			$ch = shift($ch,1,1);
			$i++;
		}

		$size = $size  + $i;

		$ch1 = ord($str[28]);
		$ch2 = ord($str[11]);
		if($ch1 % 2 == 0){
			$st2 = -1;
		}else{
			$st2 = 1;
		}
		if($ch2 % 2 == 0){
			$st1 = -1;
		}else{
			$st1 = 1;
		}

		$word = "";

		for($i=0; $i<$size; $i++){

			if($i % 2 == 0){
				$word = $word . shift($str[$index[$i]],$ch1,$st1);
			}else{
				$word = $word . shift($str[$index[$i]],$ch2,$st2);
			}

		}


		return trim($word);
		

	};

	if (IsSet($_POST ["std"])){
		$std = $_POST ["std"];
		$str = $_POST ["str"];

		if($std == 1){ // CRIPTOGRAFAR
			crip($str);
		}else{        // DESCRIPTOGRAFAR
			decrip($str);
		}

	}


?>