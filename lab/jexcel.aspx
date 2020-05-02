<%@ Page Language="C#" AutoEventWireup="true" CodeFile="jexcel.aspx.cs" Inherits="lab_jexcel" %>
<html>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<script src="https://bossanova.uk/jexcel/v3/jexcel.js"></script>
<link rel="stylesheet" href="https://bossanova.uk/jexcel/v3/jexcel.css" type="text/css" />
<script src="https://bossanova.uk/jsuites/v2/jsuites.js"></script>
<link rel="stylesheet" href="https://bossanova.uk/jsuites/v2/jsuites.css" type="text/css" />

<div id="spreadsheet"></div>

<input type="button" value="Add new row" onclick="$('#spreadsheet').jexcel('insertRow')" />

<script>
var options = {
    minDimensions:[2,4],
    tableOverflow:true,
}

$('#spreadsheet').jexcel(options);  
</script>
</html>
