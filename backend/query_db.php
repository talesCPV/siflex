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
         "7"  => 'SELECT p.*, e.nome, e.id as id_emp,(p.preco_comp * (p.margem/100 +1)) as preco_venda
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
         "17" => 'INSERT INTO tb_analise_frota (id, id_emp, data_analise, num_carro, func, local, valor, obs, exec) 
            VALUES ("x00","x01", "x02", "x03", "x04", "x05", "x06", "x07", "x08") ON DUPLICATE KEY UPDATE 
            id_emp="x01", data_analise="x02", num_carro="x03", func="x04", local="x05", valor="x06", obs="x07", exec="x08";',
         "18" => 'SELECT A.*, E.fantasia, E.id AS id_emp, E.cnpj, E.endereco, E.num, E.cidade, E.estado 
            FROM tb_analise_frota as A INNER JOIN tb_empresa as E 
            ON x00 x01 x02 AND A.id_emp = E.id AND A.data_analise >= "x03" AND A.data_analise <= "x04" ORDER BY A.data_analise DESC;',
         "19" => 'DELETE FROM tb_analise_frota WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "20" => 'SELECT * FROM tb_financeiro WHERE x00 x01 x02 AND data_pg >= "x03" AND data_pg <= "x04" ORDER BY data_pg DESC; ',
         "21" => 'INSERT INTO tb_financeiro (id, tipo, data_ini, data_pg, preco, ref, resp, emp, origem, pgto) 
            VALUES ("x00","x01", "x02", "x03", "x04", "x05", "x06", "x07", "x08", "x09") ON DUPLICATE KEY UPDATE 
            tipo="x01", data_ini="x02", data_pg="x03", preco="x04", ref="x05", resp="x06", emp="x07", origem="x08", pgto="x09";',
         "22" => 'DELETE FROM tb_financeiro WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "23" => 'UPDATE tb_produto SET img_path="x01" WHERE id=x00;',
         "24" => 'SELECT * FROM tb_empresa WHERE x00 x01 "x02";',
         "25" => 'INSERT INTO tb_empresa (id, nome, fantasia, tipo, cnpj, ie, im, endereco, num, cidade, estado, bairro, cep, tel)
           VALUES(x00,"x01","x02","x03","x04","x05","x06","x07","x08","x09","x10","x11","x12","x13")
           ON DUPLICATE KEY UPDATE 
           nome ="x01", fantasia="x02", tipo="x03", cnpj="x04", ie="x05", im="x06", endereco="x07", num="x08", cidade="x09", estado="x10", bairro="x11", cep="x12", tel="x13";',
         "26" => 'DELETE FROM tb_empresa WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "27" => 'SELECT p.*, e.fantasia, i.venda FROM tb_pedido AS p 
            INNER JOIN tb_empresa AS e 
            INNER JOIN (   
               SELECT id as id_ped, 0 as venda FROM tb_pedido WHERE id NOT IN (SELECT id_ped FROM tb_item_ped)
               UNION ALL
               SELECT id_ped, ROUND(SUM(qtd * preco),2) AS venda FROM tb_item_ped GROUP BY id_ped) AS i
            ON p.id = i.id_ped
            AND p.id_emp = e.id
            AND x00 x01 x02
            AND p.data_ped >= "x03"
            AND p.data_ped <= "x04"
            ORDER BY p.data_ped DESC;',
         "28" => 'INSERT INTO tb_pedido (id, id_emp, data_ped, data_ent, resp, comp, num_ped, origem, cond_pgto, obs)
            VALUES(x00,"x01","x02","x03","x04","x05","x06","x07","x08","x09")
            ON DUPLICATE KEY UPDATE
            id_emp="x01", data_ped="x02", data_ent="x03", resp="x04", comp="x05", num_ped="x06", origem="x07", cond_pgto="x08", obs="x09";',
         "29" => 'SELECT COUNT(*) as dg FROM tb_pedido WHERE num_ped LIKE "%x00%" ',
         "30" => 'SELECT item.*, prod.descricao, prod.cod as cod_prod,  ROUND((item.qtd * item.preco),2) as total
            FROM tb_item_ped AS item 
            INNER JOIN tb_produto AS prod 
            ON item.id_prod = prod.id
            AND item.id_ped = "x00"; ',
         "31" => 'DELETE FROM tb_pedido WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "32" => 'INSERT INTO tb_item_ped (id, id_prod, id_ped, qtd, preco, und, serv)
            VALUES ("x00","x01","x02","x03","x04","x05","x06") ON DUPLICATE KEY UPDATE 
            id_prod="x01", id_ped="x02", qtd="x03", preco="x04", und="x05", serv="x06";',
         "33" => 'DELETE FROM tb_item_ped WHERE y00="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "34" => 'SELECT MAX(id) AS last_ped FROM tb_pedido',
            
            
      );

    if (IsSet($_POST["cod"]) && IsSet($_POST["params"])){       

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