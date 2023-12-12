-- DROP VIEW vw_vales;
-- CREATE VIEW vw_vales AS
SELECT VL.*,
ROUND(valor - IFNULL((SELECT SUM(valor) FROM tb_vale_pgto WHERE id_vale = VL.id),0),2) AS SALDO
FROM tb_vale AS VL;

select * from vw_vales;