using Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_dataLoader : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string zSql = "";

        dynamic d = JArray.Parse("['rows','total','columns']");
        dynamic dynJson = JsonConvert.DeserializeObject(My.getParam("payload"));
        dynamic dataSets = dynJson.dataSets;
        foreach (var dataSet in dataSets)
        {
            /************ pre assign stuff **************/
            string zTable = ""; string zSchema = ""; string zDatabase = ""; string zServer = "";
            string[] arrTable = string.Format("{0}", dataSet.view).Split('.');
            Array.Reverse(arrTable);
            for (int ii = 0; ii < arrTable.Length; ii++)
            { if (ii == 0) zTable = arrTable[ii]; else if (ii == 1) zSchema = arrTable[ii]; else if (ii == 2) zDatabase = arrTable[ii]; else if (ii == 3) zServer = arrTable[ii]; }
            if (zSchema == "") zSchema = "dbo";

            zSql += string.Format("select top 50 * from {0}; ", string.Format("[{0}]", dataSet.view).Replace(".", "].["));
            zSql += string.Format("select count (*) as total from {0} ; ", string.Format("[{0}]", dataSet.view).Replace(".", "].["));
            string zIsLinked = "";
            if (zServer != "") { zIsLinked = "[" + zServer + "].[" + zDatabase + "]."; }
            zSql += string.Format("SELECT[COLUMN_NAME]AS[field],[COLUMN_NAME]AS[title],len(COLUMN_NAME)*7+30 AS[width]FROM{0}[INFORMATION_SCHEMA].[COLUMNS]WHERE[TABLE_NAME]='{1}'AND[TABLE_SCHEMA]='{2}'", zIsLinked, zTable, zSchema);
            if (zDatabase != "") { zSql += "AND[TABLE_CATALOG]='" + zDatabase + "'"; }
            zSql += ";";

        }
        string zConnection = My.getMachineName() + "_PricingService";
        DataSet ds = My.dbReadSet(zSql, zConnection);
        string zRet = "";
        Int16 i = 0;
        foreach (var dataSet in dataSets)
        {
            zRet += string.Format(",{0}:{{", dataSet.name);

            zRet += "rows:" + My.oToJson(ds.Tables[i*3+0]);
            zRet += ",total:" + My.oToJson(ds.Tables[i * 3 + 1].Rows[0][0]);
            zRet += ",columns:["+ My.oToJson(ds.Tables[i * 3 + 2]) + "]";

            zRet += "}";
            i++;
        }
        zRet = "{" + zRet.Substring(1) + "}";
        JObject jRet = new JObject();
        jRet["dataSets"] = JObject.Parse(zRet);

        My.print(jRet.ToString());

    }
}