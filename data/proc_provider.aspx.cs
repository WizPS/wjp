using Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_proc_provider : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
		string zPayload = new System.IO.StreamReader(Context.Request.InputStream).ReadToEnd();
		string zConn = My.getMachineName() + "_pricingservice";
		JObject zResult = new JObject();
		if (Request.ContentType == "application/json")
		{
			zResult["response"] = isPayload(zPayload, zConn);
			My.print(zResult.ToString());
			Response.End();
		}
	}

	private static JObject isPayload(string payload, string zConn)
	{
		// check if json
		try { JObject.Parse(payload); }
		catch (JsonReaderException ex) { return JObject.Parse(@"{""exception"":""Invalid JSON""}"); }
		JObject jsonPayload = JObject.Parse(payload);
		string my_conn_string = My.getDbConnString(zConn);
		string proc = string.Format("service.{0}_{1}"
				, jsonPayload["service"]
				, jsonPayload["version"].ToString().Replace(".", "_")
				);
		SqlConnection sqlConnObj = new SqlConnection(my_conn_string);
		SqlCommand sqlCmd = new SqlCommand(proc, sqlConnObj);
		sqlCmd.CommandType = CommandType.StoredProcedure;
		sqlCmd.Parameters.Add("@payload", SqlDbType.VarChar, 8000).Value = payload;
		SqlDataAdapter da = new SqlDataAdapter(sqlCmd);
		DataSet ds = new DataSet();
		try { da.Fill(ds); }
		catch (Exception ex)
		{
			return JObject.Parse(@"{""exception"":""" + ex.Message + @"""}");
		}

		string zRet = ds.Tables[0].Rows[0][0].ToString();
		if (zRet == "") zRet = "{}";
		 JObject joRet = new JObject();
		try { joRet = JObject.Parse(zRet); }
		catch (Exception ex)
		{
			return JObject.Parse(@"{""exception"":""Response invalid JSON "",""debug"":""" + zRet + @"""}");
		}
		return joRet;
	}
	private static string getJObject(string name, JObject jo)
	{
		string zRet = "";
		try { zRet = jo[name].ToString(); } catch { }
		return zRet;
	}
}