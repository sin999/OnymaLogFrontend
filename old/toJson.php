#!/usr/bin/php
<?php

while($line = fgets(STDIN)){
    $obj=line2obj($line);
    if($obj!=null){
        echo json_encode($obj)."\n";
    }
}


function line2obj($line){
    $line=trim($line,"\n");
    $targetLineStart="D-Date";
    $propertyKeyValSeparator="=";
    $fieldSeparator="&";
    $retObj=null;
    if(substr($line, 0, strlen($targetLineStart)) === $targetLineStart){
        $retObj=new stdClass();
        $fieldArray=split($fieldSeparator,$line);
        foreach($fieldArray as $propKeyVal) {
            $propArr=split($propertyKeyValSeparator,$propKeyVal);
            if(count($propArr)>1){
            //          property name          property value
                $retObj->{$propArr[0]} = trim($propArr[1],'"');
            }
        }
    }
    return $retObj;
}
?>

