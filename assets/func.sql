 DROP PROCEDURE sp_setVale;
DELIMITER $$
	CREATE PROCEDURE sp_setVale(
		IN Ihash varchar(30),
		IN Iid int(11),
		IN Iid_func int(11),
        IN Ivalor double,
        IN Iquitado boolean,
		IN Iobs varchar(200)        
    )
	BEGIN
        SET @class = (SELECT class FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		SET @edit = (SELECT COUNT(*) FROM tb_vale WHERE id=Iid);

		IF(@class >=4)THEN
			IF(@edit) THEN
				UPDATE tb_vale SET quitado=Iquitado, valor=Ivalor, obs=Iobs WHERE id=Iid;
			ELSE
				INSERT INTO tb_vale (id_func,valor,obs) VALUES (Iid_func,Ivalor,Iobs);
			END IF;
        END IF;

		SELECT * FROM tb_vale;

	END $$
DELIMITER ;
