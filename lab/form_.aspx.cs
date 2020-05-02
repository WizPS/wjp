using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class lab_form : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string zRet = "";
        string zControle = @"
    <div style='margin-bottom:10px'>
        <input class='easyui-textbox' name='name' style='width:200px' data-options='label:Name:,required:true'>
    </div>";
        zRet = @"
    <div style='padding: 20px 20px;'>
        <form id='ff' method='post'>";
        zRet += @"
        </form>";

        My.praint(zReqt);
    }
}