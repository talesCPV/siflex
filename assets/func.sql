 DROP PROCEDURE sp_setVale;
DELIMITER $$
	CREATE PROCEDURE sp_setVale(
		IN Ihash varchar(30),
		IN Iid int(11),
		IN Iid_func int(11),
        IN Ivalor double,
        IN Iquitado boolean,
		IN Iobs varchar(200),
        IN Idata datetime
    )
	BEGIN
        SET @class = (SELECT class FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		SET @edit = (SELECT COUNT(*) FROM tb_vale WHERE id=Iid);

		IF(@class >=4)THEN
			IF(@edit) THEN
				UPDATE tb_vale SET quitado=Iquitado, valor=Ivalor, obs=Iobs WHERE id=Iid;
			ELSE
				INSERT INTO tb_vale (id_func,valor,obs,data) VALUES (Iid_func,Ivalor,Iobs,Idata);
			END IF;
        END IF;

		SELECT @edit;

	END $$
DELIMITER ;

CALL sp_setVale("IFi:2r'|S*#V-%Y0(¨3+_6.b91e<4h",0	,1,150,0,"teste");

CALL sp_setVale("IFi:2r'|S*#V-%Y0(¨3+_6.b91e<4h",0,1,15,0,"teste 3");

 DROP PROCEDURE sp_setValePgto;
DELIMITER $$
	CREATE PROCEDURE sp_setValePgto(
		IN Ihash varchar(30),
		IN Iid int(11),
        IN Ivalor double,
        IN Idata datetime,
		IN Iobs varchar(200)        
    )
	BEGIN
        SET @class = (SELECT class FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);

		IF(@class >=4)THEN
			INSERT INTO tb_vale_pgto (id_vale,valor,obs,data) VALUES (Iid,Ivalor,Iobs,Idata);
        END IF;

		SELECT * FROM tb_vale_pgto WHERE id_vale=Iid;

	END $$
DELIMITER ;

CALL sp_setValePgto("IFi:2r'|S*#V-%Y0(¨3+_6.b91e<4h",1,100,"2023-12-11 00:00:00","teste");

 DROP PROCEDURE sp_delVale;
DELIMITER $$
	CREATE PROCEDURE sp_delVale(
		IN Ihash varchar(30),
		IN Iid int(11)        
    )
	BEGIN
        SET @class = (SELECT class FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);

		IF(@class >=4)THEN
			DELETE FROM tb_vale_pgto WHERE id_vale=Iid;
            DELETE FROM tb_vale WHERE id=Iid;
        END IF;

		SELECT * FROM tb_vale WHERE id=Iid;

	END $$
DELIMITER ;

 DROP PROCEDURE sp_delValePgto;
DELIMITER $$
	CREATE PROCEDURE sp_delValePgto(
		IN Ihash varchar(30),
		IN Iid int(11)        
    )
	BEGIN
        SET @class = (SELECT class FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);

		IF(@class >=4)THEN
			DELETE FROM tb_vale_pgto WHERE id=Iid;
        END IF;

	END $$
DELIMITER ;

 DROP PROCEDURE sp_anal2servexec;
DELIMITER $$
	CREATE PROCEDURE sp_anal2servexec(
		IN Ihash varchar(30),
		IN Iid_analise int(11)
    )
	BEGIN
        SET @class = (SELECT class FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		SET @serv = (SELECT MAX(id) FROM tb_serv_exec);

		IF(@class >=4)THEN
			UPDATE tb_analise_frota SET serv_exec=@serv WHERE id=Iid_analise;
        END IF;

	END $$
DELIMITER ;

 DROP PROCEDURE sp_edtICMS;
DELIMITER $$
	CREATE PROCEDURE sp_edtICMS(
		IN Ihash varchar(30),
		IN Iid_uf int(11),
        IN Ivalor double
    )
	BEGIN
        SET @class = (SELECT class FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);

		IF(@class >=4)THEN
			UPDATE tb_icms SET valor=Ivalor WHERE id=Iid_uf;
        END IF;

		SELECT * FROM tb_icms;

	END $$
DELIMITER ;


SELECT item.*,EMP.id, prod.descricao, prod.cod as cod_prod, prod.id_emp, prod.ncm,  ROUND((item.qtd * item.preco),2) as total
            FROM tb_item_ped AS item 
            INNER JOIN tb_produto AS prod
            INNER JOIN tb_pedido AS PED
            INNER JOIN tb_empresa AS EMP
            ON item.id_prod = prod.id
            AND item.id_ped = PED.id
            AND PED.id_emp = EMP.id
            AND item.id_ped = "1152";
