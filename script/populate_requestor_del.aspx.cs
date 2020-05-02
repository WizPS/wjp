using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class script_populate_requestor : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string zConn = My.getMachineName() + "_PricingService";
		string zSql = "select id,request from [service_ppl].[request_log] where isnull( requestor,'')='';";
		string zSql2 = "";
		DataTable dt = My.dbRead(zSql, zConn);
		My.print(dt.Rows.Count.ToString());
		int i = 0; int ii = 0;int pos2;
		foreach (DataRow row in dt.Rows)
		{
			string zRet = "";
			int pos = row["request"].ToString().IndexOf("requesting_system");
			if (pos > 0)
			{
				zRet = row["request"].ToString().Substring(pos + 18, 5);
				zSql2 = "update [service_ppl].[request_log] set requestor = '" + zRet + "' where id = " + row["id"].ToString() + ";";
				My.dbCUD(zSql2, zConn);
				i++;
			}
			// X-Forwarded-For
			/*
			pos = row["request"].ToString().IndexOf("X-Forwarded-For") + 16;
			pos2 = row["request"].ToString().IndexOf("%",pos);
			if (pos > 16)
			{
				zRet = row["request"].ToString().Substring(pos, pos2-pos);
				// zSql2 = "update [service_ppl].[request_log] set ip = '" + zRet + "' where id = " + row["id"].ToString() + ";";
				// My.dbCUD(zSql2, zConn);
				My.print(zRet + "<br>");
				ii++;
			}
			*/
		}
		My.print("<br>"+i.ToString());
	}
}