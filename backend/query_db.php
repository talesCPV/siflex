<?php

    $query_db = array(
         "0"  => 'SELECT * FROM tb_usuario WHERE (user="x00" OR email="x00") AND hash="x01";',
         "1"  => 'SELECT * FROM tb_usuario WHERE(SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10);',
         "2"  => 'INSERT INTO tb_usuario (id,user,hash,class,nome,email,cel) VALUES (x00,"x01","x02","x03","x04","x05","x06")
            ON DUPLICATE KEY UPDATE user="x01", hash="x02", class="x03", nome="x04", email="x05", cel="x06";',
         "3"  => 'DELETE FROM tb_usuario WHERE id="x00";',
         "4"  => 'SELECT * FROM tb_calendario WHERE y00=x00 AND data_agd>="x01" AND data_agd<="x02";',
         "5"  => 'INSERT INTO tb_calendario (id_user, data_agd, obs) VALUES(x00, "x01", "x02") ON DUPLICATE KEY UPDATE obs="x02";',         
         "6"  => 'DELETE FROM tb_calendario WHERE id_user="x00" AND data_agd="x01";',
         "7"  => 'SELECT p.*, e.nome, e.id as id_emp, 
            CONCAT("R$",FORMAT(p.preco_comp * (p.margem/100 +1),2, "de_DE")) as preco_venda
            FROM tb_produto AS p 
            INNER JOIN tb_empresa AS e 
            ON x00 x01 "x02" 
            AND p.id_emp = e.id 
            ORDER BY cast(p.cod as unsigned integer);',
         "8"  => 'SELECT * FROM tb_und WHERE(SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4) ORDER BY nome;' ,          
         "9"  => 'INSERT INTO tb_und (id, nome, sigla) VALUES(x00, "x01", "x02") ON DUPLICATE KEY UPDATE nome="x01", sigla="x02";',
         "10" => 'SELECT IF((SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4),TRUE,FALSE) AS access',
         "11" => 'SELECT *, CONCAT(LPAD(id,4,"0"),"-",nome) AS cod_nome FROM tb_empresa WHERE(SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4) AND tipo = "x01" ORDER BY nome;',
         "12" => 'INSERT INTO tb_produto (id, descricao, estoque, etq_min, unidade, cod, cod_bar, cfop, id_emp, ncm, preco_comp, margem, tipo, cod_cli)
            VALUES(x00,"x01","x02","x03","x04",((SELECT MAX(P.cod)+1 FROM tb_produto as P WHERE P.cod < 7000)),"x06","x07","x08","x09","x10","x11","x12","x13")
            ON DUPLICATE KEY UPDATE 
            descricao ="x01", estoque="x02", etq_min="x03", unidade="x04", cod="x05", cod_bar="x06", cfop="x07", id_emp="x08", ncm="x09", preco_comp="x10", margem="x11", tipo="x12", cod_cli="x13";',
         "13" => 'DELETE FROM tb_produto WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "14" => 'SELECT * FROM tb_pcp WHERE(SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4) AND data_serv >="x01" AND data_serv<="x02" ORDER BY data_serv;',
         "15" => 'INSERT INTO tb_pcp (id, data_serv, suporte, frente, costura, montagem) VALUES(x00,"x01","x02","x03","x04","x05")
            ON DUPLICATE KEY UPDATE suporte="x02", frente="x03", costura="x04", montagem="x05";',
         "16" => 'DELETE FROM tb_pcp WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "17" => 'INSERT INTO tb_analise_frota (id, id_emp, data_analise, num_carro, func, local, valor, obs) 
            VALUES ("x00","x01", "x02", "x03", "x04", "x05", "x06", "x07", "x08") ON DUPLICATE KEY UPDATE 
            id_emp="x01", data_analise="x02", num_carro="x03", func="x04", local="x05", valor="x06", obs="x07";',
         "18" => 'SELECT A.*, E.fantasia, E.id AS id_emp 
            FROM tb_analise_frota as A INNER JOIN tb_empresa as E 
            ON x00 x01 x02 AND A.id_emp = E.id AND A.data_analise >= "x03" AND A.data_analise <= "x04";'


    );

    if (IsSet($_POST["cod"]) && IsSet($_POST["params"])  ){       

        $cod = $_POST["cod"];
        $params = json_decode($_POST["params"],true); 
        $rows = array();

        include "connect.php";        

        $query = $query_db[$_POST["cod"]];
        $i = 0;
        foreach($params as $key => $val ){
            $y = 'y'.str_pad(strval($i), 2, "0", STR_PAD_LEFT);
            $x = 'x'.str_pad(strval($i), 2, "0", STR_PAD_LEFT);
        
            $query = str_replace($y, $key,$query); // fields
            $query = str_replace($x, $val,$query); // values
            $i++;
        }

//    echo $query;

            $result = mysqli_query($conexao, $query);
            if(is_object($result)){
                if($result->num_rows > 0){			
                    while($r = mysqli_fetch_assoc($result)) {
                        $rows[] = $r;
                    }
                }        
            }

	    $conexao->close();        

        print json_encode($rows);

    }

?>