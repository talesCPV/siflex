-- DROP VIEW vw_vales;
-- CREATE VIEW vw_vales AS
SELECT VL.*,
ROUND(valor - IFNULL((SELECT SUM(valor) FROM tb_vale_pgto WHERE id_vale = VL.id),0),2) AS SALDO
FROM tb_vale AS VL;

select * from vw_vales;

 DROP VIEW vw_pedItem;
 CREATE VIEW vw_pedItem AS
SELECT item.*, prod.descricao, prod.cod as cod_prod, prod.id_emp, prod.ncm,
	ROUND((item.qtd * item.preco),2) as total, ROUND(ICMS.valor,2) AS ICMS, ROUND((item.qtd * item.preco) * (ICMS.valor / 100),2 ) AS TOT_ICMS
            FROM tb_item_ped AS item 
            INNER JOIN tb_produto AS prod
            INNER JOIN tb_pedido AS PED
            INNER JOIN tb_empresa AS EMP
            INNER JOIN tb_icms AS ICMS
            ON item.id_prod = prod.id
            AND item.id_ped = PED.id
            AND PED.id_emp = EMP.id
            AND ICMS.sigla = EMP.estado;            

SELECT * FROM vw_pedItem WHERE id_ped = "1152";