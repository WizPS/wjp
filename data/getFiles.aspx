<%@ Page Language="C#" AutoEventWireup="true" CodeFile="getFiles.aspx.cs" Inherits="lab_getFiles" %>

    <table id="dg" style="height:auto;border:1px solid #ccc;">
        <thead>
            <tr>
                <th data-options="field:'itemid', sortable:true, width:220">Filename</th>
                <th data-options="field:'productid', sortable:true, width:118">Date</th>
                <th data-options="field:'listprice',align:'right', sortable:true, width:70">Size</th>
            </tr>
        </thead>
        <tbody>
            <%=files() %>
        </tbody>
    </table>

	 <script>
		 $('#dg').datagrid({ singleSelect: true, fit: true });
		//restore
	 </script>
	 