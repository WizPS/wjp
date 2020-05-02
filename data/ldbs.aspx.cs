using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_ldbs : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string zPayload = My.getParam("payload");
        JObject joPayload = JObject.Parse(zPayload);
        string zTable = joPayload["field"].ToString().Split('.')[0];
        string zField= joPayload["field"].ToString().Split('.')[1];
        string zValue = joPayload["value"].ToString();
        string zSql = string.Format("UPDATE users SET theme = 'aaaa' WHERE user = 'magnus'");
        // UPDATE table SET column = expression [WHERE condition] 
        var f_path = AppDomain.CurrentDomain.BaseDirectory + @"\App_Data\wal\local.accdb";

        // string connectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + f_path;
        string connectionString = @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + f_path;
        DataTable dt = new DataTable();
        using (OleDbConnection conn = new OleDbConnection(connectionString))
        {
            OleDbCommand cmd = new OleDbCommand(zSql, conn);
            cmd.Connection.Open();
            int nAffected = cmd.ExecuteNonQuery();
            conn.Close();
        }
        // return "";

    }
}