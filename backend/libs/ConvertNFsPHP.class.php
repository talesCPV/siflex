<?php

class ConvertNFsPHP {

    /**
     * xml
     * XML da NFe
     * @var string 
     */
    public $xml='';

    /**
     * txt
     * @var string TXT com NFe
     */
    public $txt='';

    public function nfstxt2xml($arq) {        
        if ( !is_file($arq) ){            
            return FALSE;
        }        
        $arrayComAsLinhasDoArquivo = file($arq);
        return $this->nfstxt2xml_array_com_linhas( $arrayComAsLinhasDoArquivo );
    }//fim nfesxt2xml

    public function nfstxt2xml_string($contentString) {
        $arrayComAsLinhasDoArquivo = explode("\n", $contentString);
        return $this->nfetxt2xml_array_com_linhas( $arrayComAsLinhasDoArquivo );
    }//fim nfstxt2xml_string

    function nfstxt2xml_array_com_linhas($arrayComAsLinhasDoArquivo) {
        $arquivo = $arrayComAsLinhasDoArquivo;
        //cria o objeto DOM para o xml
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->formatOutput = true;
        $dom->preserveWhiteSpace = false;
        $NFe = $dom->createElement("SDTNotasExport");
        $NFe->setAttribute("xmlns", "NFe");

        //lê linha por linha do arquivo txt
        for($l = 0; $l < count($arquivo); $l++) {
            //separa os elementos do arquivo txt usando o pipe "|"
            $dados = explode("|",$arquivo[$l]);
            
            //remove todos os espaços adicionais, tabs, linefeed, e CR
            //de todos os campos de dados retirados do TXT
            for ($x=0; $x < count($dados); $x++) {
                if( !empty($dados[$x]) ) {
                    $dados[$x] = preg_replace('/\s\s+/', " ", $dados[$x]);
//                    $dados[$x] = $this->__limpaString(trim($dados[$x]));
                } //end if
            } //end for
//            echo $dados[0];
            //monta o dado conforme o tipo, inicia lendo o primeiro campo da matriz
            switch ( $dados[0] ) {

                case "10":  //10|CpfCnpj|DtIni|DtFin|TipoArq|Versao|
                    $CpfCnpj = $dom->createElement("CpfCnpj", $dados[1]);
                    $NFe->appendChild($CpfCnpj);
                    $DtIni = $dom->createElement("DtIni", $dados[2]);
                    $NFe->appendChild($DtIni);
                    $DtFin = $dom->createElement("DtFin", $dados[3]);
                    $NFe->appendChild($DtFin);
                    $TipoArq = $dom->createElement("TipoArq", $dados[4]);
                    $NFe->appendChild($TipoArq);
                    $Versao = $dom->createElement("Versao", $dados[5]);
                    $NFe->appendChild($Versao);
                    break;

                case "20": //20|TipoNf|NumNf|SerNf|DtEmiNf|DtHrGerNf|CodVernf|NumRps|SerRps|DtEmiRpsee
                    $Reg20 = $dom->createElement("Reg20");
                    $Reg20Item = $dom->createElement("Reg20Item");

                    $TipoNf = $dom->createElement("TipoNf", $dados[1]);
                    $Reg20Item->appendChild($TipoNf);
                    $NumNf = $dom->createElement("NumNf", $this->__trimnum(trim($dados[2])));
                    $Reg20Item->appendChild($NumNf);
                    $SerNf = $dom->createElement("SerNf", $dados[3]);
                    $Reg20Item->appendChild($SerNf);
                    $DtEmiNf = $dom->createElement("DtEmiNf", $dados[4]);
                    $Reg20Item->appendChild($DtEmiNf);
                    $DtHrGerNf = $dom->createElement("DtHrGerNf", $dados[5]);
                    $Reg20Item->appendChild($DtHrGerNf);
                    $CodVernf = $dom->createElement("CodVernf", $dados[6]);
                    $Reg20Item->appendChild($CodVernf);
                    $NumRps = $dom->createElement("NumRps", $this->__trimnum(trim($dados[7])));
                    $Reg20Item->appendChild($NumRps);
                    $SerRps = $dom->createElement("SerRps", $this->__trimnum(trim($dados[8])));
                    $Reg20Item->appendChild($SerRps);
                    $DtEmiRps = $dom->createElement("DtEmiRps", $dados[9]);
                    $Reg20Item->appendChild($DtEmiRps);
                    $TipoCpfCnpjPre = $dom->createElement("TipoCpfCnpjPre", $dados[10]=="2" ? "J" : "F" );
                    $Reg20Item->appendChild($TipoCpfCnpjPre);
                    $CpfCnpjPre = $dom->createElement("CpfCnpjPre", $this->__formatcnpj(trim($dados[11])));
                    $Reg20Item->appendChild($CpfCnpjPre);
                    $RazSocPre = $dom->createElement("RazSocPre", $dados[12]);
                    $Reg20Item->appendChild($RazSocPre);
                    $LogPre = $dom->createElement("LogPre", $dados[13]);
                    $Reg20Item->appendChild($LogPre);
                    $NumEndPre = $dom->createElement("NumEndPre", $dados[14]);
                    $Reg20Item->appendChild($NumEndPre);
                    $ComplEndPre = $dom->createElement("ComplEndPre", $dados[15]);
                    $Reg20Item->appendChild($ComplEndPre);
                    $BairroPre = $dom->createElement("BairroPre", $dados[16]);
                    $Reg20Item->appendChild($BairroPre);
                    $MunPre = $dom->createElement("MunPre", $dados[17]);
                    $Reg20Item->appendChild($MunPre);
                    $SiglaUFPre = $dom->createElement("SiglaUFPre", $dados[18]);
                    $Reg20Item->appendChild($SiglaUFPre);
                    $CepPre = $dom->createElement("CepPre", $dados[19]);
                    $Reg20Item->appendChild($CepPre);
                    $EmailPre = $dom->createElement("EmailPre", $dados[20]);
                    $Reg20Item->appendChild($EmailPre);
                    $TipoTribPre = $dom->createElement("TipoTribPre", $dados[21]);
                    $Reg20Item->appendChild($TipoTribPre);
                    $DtAdeSN = $dom->createElement("DtAdeSN", $dados[22]);
                    $Reg20Item->appendChild($DtAdeSN);
                    $AlqIssSN = $dom->createElement("AlqIssSN", $this->__decimal(trim($dados[23])));
                    $Reg20Item->appendChild($AlqIssSN);
                    $SitNf = $dom->createElement("SitNf", $dados[24]);
                    $Reg20Item->appendChild($SitNf);
                    $DataCncNf = $dom->createElement("DataCncNf", $dados[25]);
                    $Reg20Item->appendChild($DataCncNf);
                    $MotivoCncNf = $dom->createElement("MotivoCncNf", $dados[26]);
                    $Reg20Item->appendChild($MotivoCncNf);
                    $TipoCpfCnpjTom = $dom->createElement("TipoCpfCnpjTom", $dados[27]=="2" ? "J" : "F");
                    $Reg20Item->appendChild($TipoCpfCnpjTom);
                    $CpfCnpjTom = $dom->createElement("CpfCnpjTom", $this->__formatcnpj(trim($dados[28])));
                    $Reg20Item->appendChild($CpfCnpjTom);
                    $RazSocTom = $dom->createElement("RazSocTom", $dados[29]);
                    $Reg20Item->appendChild($RazSocTom);
                    $LogTom = $dom->createElement("LogTom", $dados[30]);
                    $Reg20Item->appendChild($LogTom);
                    $NumEndTom = $dom->createElement("NumEndTom", $dados[31]);
                    $Reg20Item->appendChild($NumEndTom);
                    $ComplEndTom = $dom->createElement("ComplEndTom", $dados[32]);
                    $Reg20Item->appendChild($ComplEndTom);
                    $BairroTom = $dom->createElement("BairroTom", $dados[33]);
                    $Reg20Item->appendChild($BairroTom);
                    $MunTom = $dom->createElement("MunTom", $dados[34]);
                    $Reg20Item->appendChild($MunTom);
                    $SiglaUFTom = $dom->createElement("SiglaUFTom", $dados[35]);
                    $Reg20Item->appendChild($SiglaUFTom);
                    $CepTom = $dom->createElement("CepTom", $dados[36]);
                    $Reg20Item->appendChild($CepTom);
                    $EMailTom = $dom->createElement("EMailTom", $dados[37]);
                    $Reg20Item->appendChild($EMailTom);
                    $LogLocPre = $dom->createElement("LogLocPre", $dados[38]);
                    $Reg20Item->appendChild($LogLocPre);
                    $NumEndLocPre = $dom->createElement("NumEndLocPre", $dados[39]);
                    $Reg20Item->appendChild($NumEndLocPre);
                    $ComplEndLocPre = $dom->createElement("ComplEndLocPre", $dados[40]);
                    $Reg20Item->appendChild($ComplEndLocPre);
                    $BairroLocPre = $dom->createElement("BairroLocPre", $dados[41]);
                    $Reg20Item->appendChild($BairroLocPre);
                    $MunLocPre = $dom->createElement("MunLocPre", $dados[42]);
                    $Reg20Item->appendChild($MunLocPre);
                    $SiglaUFLocpre = $dom->createElement("SiglaUFLocpre", $dados[43]);
                    $Reg20Item->appendChild($SiglaUFLocpre);
                    $CepLocPre = $dom->createElement("CepLocPre", $dados[44]);
                    $Reg20Item->appendChild($CepLocPre);
                    $CodSrv = $dom->createElement("CodSrv", $dados[45]);
                    $Reg20Item->appendChild($CodSrv);
                    $DiscrSrv = $dom->createElement("DiscrSrv", $this->__quebralinha(trim($dados[46])));
                    $Reg20Item->appendChild($DiscrSrv);
                    $VlNFS = $dom->createElement("VlNFS", $this->__decimal(trim($dados[47])));
                    $Reg20Item->appendChild($VlNFS);
                    $VlDed = $dom->createElement("VlDed", $this->__decimal(trim($dados[48])));
                    $Reg20Item->appendChild($VlDed);
                    $DiscrDed = $dom->createElement("DiscrDed", $this->__quebralinha(trim($dados[49])));
                    $Reg20Item->appendChild($DiscrDed);
                    $VlBasCalc = $dom->createElement("VlBasCalc", $this->__decimal(trim($dados[50])));
                    $Reg20Item->appendChild($VlBasCalc);
                    $AlqIss = $dom->createElement("AlqIss", $this->__decimal(trim($dados[51])));
                    $Reg20Item->appendChild($AlqIss);
                    $VlIss = $dom->createElement("VlIss", $this->__decimal(trim($dados[52])));
                    $Reg20Item->appendChild($VlIss);
                    $VlIssRet = $dom->createElement("VlIssRet", $this->__decimal(trim($dados[53])));
                    $Reg20Item->appendChild($VlIssRet);

                    $Reg30 = $dom->createElement("Reg30",'');
                    $Reg20Item->appendChild($Reg30);
                    $Reg20->appendChild($Reg20Item);
                    $NFe->appendChild($Reg20);
                    break;

                case "30": //

                    break;

                case "90": //
                    $Reg90 = $dom->createElement("Reg90");

                    $QtdRegNormal = $dom->createElement("QtdRegNormal", $this->__trimnum(trim($dados[1])));
                    $Reg90->appendChild($QtdRegNormal);
                    $ValorNFS = $dom->createElement("ValorNFS", $this->__decimal(trim($dados[2])));
                    $Reg90->appendChild($ValorNFS);
                    $ValorISS = $dom->createElement("ValorISS", $this->__decimal(trim($dados[3])));
                    $Reg90->appendChild($ValorISS);
                    $ValorDed = $dom->createElement("ValorDed", $this->__decimal(trim($dados[4])));
                    $Reg90->appendChild($ValorDed);
                    $ValorIssRet = $dom->createElement("ValorIssRet", $this->__decimal(trim($dados[5])));
                    $Reg90->appendChild($ValorIssRet);
                    $QtdReg30 = $dom->createElement("QtdReg30", $this->__decimal(trim($dados[6])));
                    $Reg90->appendChild($QtdReg30);
                    $ValorTributos = $dom->createElement("ValorTributos", $this->__decimal(trim($dados[7])));
                    $Reg90->appendChild($ValorTributos);
                    $NFe->appendChild($Reg90);

                    break;

            } //end switch
        } //end for

        //salva o xml na variável se o txt não estiver em branco
        if(!empty($NFe)){
            $dom->appendChild($NFe);
            $xml = $dom->saveXML();
            $this->xml = $dom->saveXML();
            $xml = str_replace('<?xml version="1.0" encoding="UTF-8  standalone="no"?>','<?xml version="1.0" encoding="UTF-8"?>',$xml);
            //remove linefeed, carriage return, tabs e multiplos espaços
            $xml = preg_replace('/\s\s+/',' ', $xml);
            $xml = str_replace("> <","><",$xml);
            return $xml;
        } else {
            return '';
        }

    } //end function

    /**
     * __limpaString
     * Remove todos dos caracteres espceiais do texto e os acentos
     *  
     * @version 1.02
     * @package NFePHP
     * @author  Roberto L. Machado <linux.rlm at gmail dot com>
     * @return  string Texto sem caractere especiais
     */
     private function __limpaString($texto){
        $aFind = array('&','á','à','ã','â','é','ê','í','ó','ô','õ','ú','ü','ç','Á','À','Ã','Â','É','Ê','Í','Ó','Ô','Õ','Ú','Ü','Ç');
        $aSubs = array('e','a','a','a','a','e','e','i','o','o','o','u','u','c','A','A','A','A','E','E','I','O','O','O','U','U','C');
        $novoTexto = str_replace($aFind,$aSubs,$texto);
        $novoTexto = preg_replace("/[^a-zA-Z0-9 @,-.;:]/", "", $novoTexto);
        return $novoTexto;
    }//fim __limpaString

    private function __decimal($num){
        return str_replace(',','.',$num);
    }//fim __decimal

    private function __trimnum($num){
        return (int)$num ;
    }//fim __trimnum

    private function __formatdate($texto){
        return trim($texto) != "" ? substr($texto,0,2).'/'.substr($texto,2,2).'/'.substr($texto,4,4).substr($texto,8,strlen($texto)) : "";
    }//fim __formatdate

    private function __formatcnpj($texto){
        return trim($texto) != "" ? substr($texto,0,2).'.'.substr($texto,2,3).'.'.substr($texto,5,3).'/'.substr($texto,8,4).'-'.substr($texto,12,2) : "";
    }//fim __formatcnpj

    private function __quebralinha($texto){
        return trim($texto) != "" ? str_replace("\\\\","&#xA;",$texto) : "";
    }//fim __quebralinha


} //fim da classe

?>
