using Common;
using Newtonsoft.Json.Linq;
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
                <input class='easyui-{0}' name='{1}' style='width:{2}' data-options='{3}'>
            </div>";
        string zControls = My.getParam("controls");
        JArray jaControles = JArray.Parse(zControls);
        string zGeneral = My.getParam("general");
        JObject joGeneral = JObject.Parse(zGeneral);
        JArray jaButtons = (JArray)joGeneral["buttons"];
        string zPostAction = joGeneral["postAction"].ToString();

        zRet = @"
    <div style='padding: 20px 20px;'>
        <form id='ff' method='post'>";

        foreach (JObject jo in jaControles)
        {
            string zOptions = getParameters(jo);
            string labelWidth = string.Format("{0}", jo["labelWidth"]);
            if (labelWidth == "") labelWidth = "100";
            zRet += string.Format(zControle
                , jo["type"]     // #0
                , jo["field"]   // #1
                , "200px"       // #2
                , zOptions   // #3
                );
        }

        zRet += @"
        </form>
    </div>";
        zRet += @"
    <div style='text-align:center; padding: 5px'>";
        foreach (JObject jo in jaButtons)
        {
            switch (jo["type"].ToString())
            {
                case "submit":
                    zRet += string.Format(@"<a href='javascript:void(0)' class='easyui-linkbutton' onclick='submitForm()' style='width:80px'>{0}</a> ", jo["name"]);
                    break;
                case "cancel":
                    zRet += string.Format(@"<a href='javascript:void(0)' class='easyui-linkbutton' onclick='cancelForm()' style='width:80px'>{0}</a> ", jo["name"]);
                    break;
            }
        }
        zRet += @"
    </div>";

        My.print(zRet);

    }
    private static string getParameters(JObject jo)
    {
        string zOptions = "";
        foreach (var zPair in jo)
        {
            string name = zPair.Key; JToken value = zPair.Value;
            // My.print("",value.Type.ToString());
            switch (value.Type.ToString())
            {
                case "String": value = "\"" + value + "\""; break;
                case "Boolean": value = value.ToString().ToLower(); break;
                case "Integer": value = value.ToString().Replace(",", "."); break;
                case "Float": value = value.ToString().Replace(",", "."); break;
            }
            zOptions += "," + name + @":" + value;
        }
        if (zOptions.Length > 2) zOptions = zOptions.Substring(1);
        return zOptions;
    }
    public static string postActions() {
        return "$('#pc3').datagrid('reload');";
    }


}