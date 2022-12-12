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
            ON x00 x01 x02 
            AND p.id_emp = e.id 
            ORDER BY cast(p.cod as unsigned integer);',
         "8"  => 'SELECT * FROM tb_und WHERE(SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4) ORDER BY nome;' ,          
         "9"  => 'INSERT INTO tb_und (id, nome, sigla) VALUES(x00, "x01", "x02") ON DUPLICATE KEY UPDATE nome="x01", sigla="x02";',
         "10" => 'SELECT IF((SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4),TRUE,FALSE) AS access',
         "11" => 'SELECT *, CONCAT(LPAD(id,4,"0"),"-",nome) AS cod_nome FROM tb_empresa WHERE(SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4) AND x01 x02 "x03" ORDER BY nome;',
         "12" => 'INSERT INTO tb_produto (id, descricao, estoque, etq_min, unidade, cod, cod_bar, cfop, id_emp, ncm, preco_comp, margem, tipo, cod_cli)
            VALUES(x00,"x01","x02","x03","x04",((SELECT MAX(P.cod)+1 FROM tb_produto as P WHERE P.cod < 7000)),"x06","x07","x08","x09","x10","x11","x12","x13")
            ON DUPLICATE KEY UPDATE 
            descricao ="x01", estoque="x02", etq_min="x03", unidade="x04", cod="x05", cod_bar="x06", cfop="x07", id_emp="x08", ncm="x09", preco_comp="x10", margem="x11", tipo="x12", cod_cli="x13";',
         "13" => 'DELETE FROM tb_produto WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "14" => 'SELECT * FROM tb_pcp WHERE(SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4,3) AND data_serv >="x01" AND data_serv<="x02" ORDER BY data_serv;',
         "15" => 'INSERT INTO tb_pcp (id, data_serv, suporte, frente, costura, montagem) VALUES(x00,"x01","x02","x03","x04","x05")
            ON DUPLICATE KEY UPDATE suporte="x02", frente="x03", costura="x04", montagem="x05";',
         "16" => 'DELETE FROM tb_pcp WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4,3);',
         "17" => 'INSERT INTO tb_analise_frota (id, id_emp, data_analise, num_carro, func, local, valor, obs, exec) 
            VALUES ("x00","x01", "x02", "x03", "x04", "x05", "x06", "x07", "x08") ON DUPLICATE KEY UPDATE 
            id_emp="x01", data_analise="x02", num_carro="x03", func="x04", local="x05", valor="x06", obs="x07", exec="x08";',
         "18" => 'SELECT A.*, E.fantasia, E.id AS id_emp, E.cnpj, E.endereco, E.num, E.cidade, E.estado 
            FROM tb_analise_frota as A INNER JOIN tb_empresa as E 
            ON x00 x01 x02 AND A.id_emp = E.id AND A.data_analise >= "x03" AND A.data_analise <= "x04" ORDER BY A.valor DESC, A.data_analise DESC;',
         "19" => 'DELETE FROM tb_analise_frota WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "20" => 'SELECT * FROM tb_financeiro WHERE x00 x01 x02 AND data_pg >= "x03" AND data_pg <= "x04" ORDER BY data_pg DESC; ',
         "21" => 'INSERT INTO tb_financeiro (id, tipo, data_ini, data_pg, preco, ref, resp, emp, origem, pgto) 
            VALUES ("x00","x01", "x02", "x03", "x04", "x05", "x06", "x07", "x08", "x09") ON DUPLICATE KEY UPDATE 
            tipo="x01", data_ini="x02", data_pg="x03", preco="x04", ref="x05", resp="x06", emp="x07", origem="x08", pgto="x09";',
         "22" => 'DELETE FROM tb_financeiro WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "23" => 'UPDATE tb_produto SET img_path="x01" WHERE id=x00;',
         "24" => 'SELECT * FROM tb_empresa WHERE x00 x01 x02;',
         "25" => 'INSERT INTO tb_empresa (id, nome, fantasia, tipo, cnpj, ie, im, endereco, num, cidade, estado, bairro, cep, tel)
           VALUES(x00,"x01","x02","x03","x04","x05","x06","x07","x08","x09","x10","x11","x12","x13")
           ON DUPLICATE KEY UPDATE 
           nome ="x01", fantasia="x02", tipo="x03", cnpj="x04", ie="x05", im="x06", endereco="x07", num="x08", cidade="x09", estado="x10", bairro="x11", cep="x12", tel="x13";',
         "26" => 'DELETE FROM tb_empresa WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "27" => 'SELECT p.*, e.fantasia, e.nome AS nome_emp, e.cnpj, e.ie,e.im,e.endereco, e.cidade, e.num,e.estado,e.cep, e.tel,e.bairro, i.venda FROM tb_pedido AS p 
            INNER JOIN tb_empresa AS e
            INNER JOIN ( SELECT id as id_ped, 0 as venda, 0 as id_prod FROM tb_pedido WHERE id NOT IN (SELECT id_ped FROM tb_item_ped)
               UNION ALL SELECT id_ped, ROUND(SUM(qtd * preco),2) AS venda, id_prod FROM tb_item_ped GROUP BY id_ped) AS i
            ON p.id = i.id_ped
            AND p.id_emp = e.id
            AND x00 x01 x02
            AND p.data_ped >= "x03"
            AND p.data_ped <= "x04"
            ORDER BY p.data_ped DESC;',
         "28" => 'INSERT INTO tb_pedido (id, id_emp, data_ped, data_ent, resp, comp, num_ped, origem, cond_pgto, obs, desconto)
            VALUES(x00,"x01","x02","x03","x04","x05","x06","x07","x08","x09","x10")
            ON DUPLICATE KEY UPDATE
            id_emp="x01", data_ped="x02", data_ent="x03", resp="x04", comp="x05", num_ped="x06", origem="x07", cond_pgto="x08", obs="x09", desconto="x10";',
         "29" => 'SELECT COUNT(*) as dg FROM tb_pedido WHERE num_ped LIKE "%x00%" ',
         "30" => 'SELECT item.*, prod.descricao, prod.cod as cod_prod, prod.id_emp, prod.ncm,  ROUND((item.qtd * item.preco),2) as total
            FROM tb_item_ped AS item 
            INNER JOIN tb_produto AS prod 
            ON item.id_prod = prod.id
            AND item.id_ped = "x00"; ',
         "31" => 'DELETE FROM tb_pedido WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "32" => 'INSERT INTO tb_item_ped (id, id_prod, id_ped, qtd, preco, und, serv)
            VALUES (x00,"x01","x02","x03","x04","x05","x06") ON DUPLICATE KEY UPDATE 
            id_prod="x01", id_ped="x02", qtd="x03", preco="x04", und="x05", serv="x06";',
         "33" => 'DELETE FROM tb_item_ped WHERE y00="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "34" => 'SELECT MAX(id) AS last_ped FROM tb_pedido',
         "35" => 'UPDATE tb_pedido SET status="x02" WHERE id=x00 AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "36" => 'UPDATE tb_produto as prod INNER JOIN tb_item_ped as item 
            SET prod.estoque = (prod.estoque - item.qtd) WHERE prod.id=item.id_prod AND item.id_ped = "x00";',
         "37" => 'SELECT ag.*, emp.fantasia FROM tb_agenda AS ag
            INNER JOIN tb_empresa AS emp 
            ON ag.id_emp = emp.id
            AND x00 x01 "x02";',
         "38" => 'INSERT INTO tb_agenda (id, id_emp, nome, email, depart, cel1, cel2)
            VALUES (x00,"x01","x02","x03","x04","x05","x06") ON DUPLICATE KEY UPDATE 
            id_emp="x01", nome="x02", email="x03", depart="x04", cel1="x05", cel2="x06";',
         "39" => 'DELETE FROM tb_agenda WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4,3); ',
         "40" => 'UPDATE tb_pedido SET status="x01", path="x02" WHERE id=x00;',
         "41" => 'SELECT ENT.*, EMP.fantasia, EMP.id AS emp_id
            FROM tb_entrada AS ENT
            INNER JOIN tb_empresa AS EMP 
            ON ENT.id_emp = EMP.id
            AND x00 x01 x02
            AND data_ent >= "x03" 
            AND ENT.data_ent <= "x04" 
            ORDER BY ENT.data_ent DESC;',
         "42" => 'INSERT INTO tb_entrada (id, nf, id_emp, data_ent, resp, status, OBS)
            VALUES (x00,"x01","x02","x03","x04","x05","x06") ON DUPLICATE KEY UPDATE
            nf="x01", id_emp="x02", data_ent="x03", resp="x04", status="x05", OBS="x06";',
         "43" => 'SELECT IC.*, PROD.descricao, PROD.unidade, PROD.cod, PROD.cod_bar AS cod_cli, ROUND((IC.qtd * IC.preco),2) as total
            FROM tb_item_compra AS IC 
            INNER JOIN tb_produto AS PROD
            ON PROD.id = IC.id_prod
            AND id_ent="x00";',
         "44" => 'UPDATE tb_entrada SET path="x01" WHERE id=x00;',
         "45" => 'DELETE FROM tb_entrada WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4); ',
         "46" => 'INSERT INTO tb_item_compra (id, id_prod, id_ent, qtd, preco)
            VALUES (x00,"x01","x02","x03","x04") ON DUPLICATE KEY UPDATE
            id_prod="x01", id_ent="x02", qtd="x03", preco="x04";',
         "47" => 'DELETE FROM tb_item_compra WHERE y00="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "48" => 'UPDATE tb_entrada SET status="x02" WHERE id=x00 AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "49" => 'UPDATE tb_produto as prod INNER JOIN tb_item_compra as item 
            SET prod.estoque = (prod.estoque + item.qtd), prod.preco_comp = item.preco WHERE prod.id=item.id_prod AND item.id_ent = "x00";',
         "50" => 'INSERT INTO tb_serv_exec (id, id_emp, data_exec, num_carro, func, obs, nf, pedido, valor) 
            VALUES (x00,"x01","x02","x03","x04","x05","x06","x07","x08") ON DUPLICATE KEY
            UPDATE id_emp="x01" ,data_exec="x02" ,num_carro="x03" ,func="x04" ,obs="x05" ,nf="x06" ,pedido="x07" ,valor="x08";',
         "51" => 'DELETE FROM tb_serv_exec WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "52" => 'SELECT SERV.*, EMP.fantasia, EMP.id AS id_emp , EMP.cnpj, EMP.endereco, EMP.num, EMP.estado, EMP.cidade, EMP.ie, EMP.nome as razao_social, EMP.bairro, EMP.cep
            FROM tb_serv_exec as SERV
            INNER JOIN tb_empresa as EMP
            ON SERV.id_emp = EMP.id
            AND x00 x01 x02
            AND SERV.data_exec >= "x03" 
            AND SERV.data_exec <= "x04"
            ORDER BY SERV.data_exec DESC;',
         "53" => 'SELECT *	FROM tb_cargos WHERE (SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4,1) ORDER BY cargo;',
         "54" => 'INSERT INTO tb_cargos (id,cargo,tipo,cbo,salario) 
            VALUES (x00,"x01","x02","x03","x04") ON DUPLICATE KEY
            UPDATE cargo="x01",tipo="x02",cbo="x03",salario="x04";',
         "55" => 'DELETE FROM tb_cargos WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4,1);',
         "56" => 'SELECT FUNC.*, CAR.cargo, CAR.salario, CAR.tipo, CAR.id AS id_cargo, CAR.cbo FROM tb_funcionario AS FUNC
            INNER JOIN tb_cargos AS CAR
            ON FUNC.id_cargo = CAR.id
            AND x00 x01 x02
            AND x04 = "x05"
            AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x03") IN (10,4,1) ORDER BY nome;',
         "57" => 'INSERT INTO tb_funcionario (id,nome,rg,cpf,pis,endereco,cidade,estado,cep,data_adm,id_cargo,tel,cel,status,data_nasc, data_dem, impostos)
            VALUES(x00,"x01","x02","x03","x04","x05","x06","x07","x08","x09","x10","x11","x12","x13","x14","x15","x16")
            ON DUPLICATE KEY UPDATE
            nome="x01",rg="x02",cpf="x03",pis="x04",endereco="x05",cidade="x06",estado="x07",cep="x08",data_adm="x09",id_cargo="x10",tel="x11",cel="x12",status="x13",data_nasc="x14", data_dem="x15", impostos="x16";',
         "58" => 'DELETE FROM tb_funcionario WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4,1);',
         "59" => 'SELECT HE.*, FUNC.nome, CAR.cargo, CAR.salario, CAR.tipo 
            FROM tb_funcionario AS FUNC
            INNER JOIN tb_cargos AS CAR
            INNER JOIN tb_hora_extra AS HE
            ON HE.id_func = FUNC.id
            AND FUNC.id_cargo = CAR.id
            AND x00 x01 x02
            AND x04 = "x05"
            AND HE.entrada >= "x06"
            AND HE.entrada <= DATE_ADD("x07", INTERVAL 2 DAY)
            ORDER BY HE.entrada ASC,FUNC.nome ASC;',
         "60" => 'SELECT id, LPAD(dia,2,"0") AS dia,LPAD(mes,2,"0") AS mes, ano, nome 
            FROM tb_feriados 
            WHERE (SELECT U.class FROM tb_usuario AS U WHERE hash="x03") IN (10,4,1) ORDER BY mes,dia;',
         "61" => 'INSERT INTO tb_feriados (id,dia,mes,ano,nome) 
            VALUES (x00,"x01","x02","x03","x04") ON DUPLICATE KEY
            UPDATE dia="x01",mes="x02",ano="x03",nome="x04";',
         "62" => 'DELETE FROM tb_feriados WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "63" => 'INSERT INTO tb_hora_extra (id,id_func,entrada,saida)
            VALUES(x00,"x01","x02","x03") ON DUPLICATE KEY
            UPDATE id_func="x01", entrada="x02", saida="x03";',
         "64" => 'DELETE FROM tb_hora_extra WHERE id="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4);',
         "65" => 'SELECT * FROM tb_imposto WHERE (SELECT U.class FROM tb_usuario AS U WHERE hash="x00") IN (10,4,1);',
         "66" => 'SELECT IMP.nome, ALQ.* FROM tb_imposto AS IMP
            INNER JOIN tb_aliquota AS ALQ
            ON ALQ.id_imp = IMP.id
            AND IMP.id IN (x00)
            AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4,1)
            ORDER BY ALQ.ini_range ASC',
         "67" => 'INSERT INTO tb_imposto (id,nome) VALUES (x00,"x01")
            ON DUPLICATE KEY UPDATE nome="x01";',
         "68" => 'INSERT INTO tb_aliquota (id,id_imp,tipo,ini_range,fin_range,valor,acumulado)
            VALUES (x00,"x01","x02","x03","x04","x05","x06") ON DUPLICATE KEY 
            UPDATE tipo="x02",ini_range="x03",fin_range="x04",valor="x05", acumulado="x06";',
         "69" => 'DELETE FROM tb_aliquota WHERE y00="x00" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4,1);',
         "70" => 'DELETE FROM tb_imposto WHERE y02="x02" AND (SELECT U.class FROM tb_usuario AS U WHERE hash="x01") IN (10,4,1);',
         "71" => 'UPDATE tb_produto SET estoque = estoque+x01 WHERE cod = x00;',

            
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