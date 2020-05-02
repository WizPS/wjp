using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class grid_provider_lov : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string iView = My.getParam("view");
		string type = My.getParam("type");
		string Code = My.getParam("Code");
		string id = My.getParam("id");
		// if ((type == "combotree") && Code == "") return ;

		string zConnection = My.getMachineName() + "_PricingService";
		string schema = iView.Split('.')[0];
		string table = iView.Split('.')[1];
		string comlumn = iView.Split('.')[2];
		string sql = "";
		string ret = "";
		JObject jsonRet = new JObject();
		DataTable dt = null;
		// My.print(type);Response.End();
		switch (type) {
			case "combotree":
				// sql = string.Format("select [Code], [Parent],[name],lb,rb,Lev, nn from {0}.{1} order by nn;", schema, table);
				if (id != "")
				{
					sql = string.Format(@"select Code as id, Code + ' - ' + Name as text, case when nc > 1 then 'closed' else 'open' end as state, nc, nn from {0}.{1} where Parent='{2}'", schema, table, id);
					dt = My.dbRead(sql, zConnection);
					ret = My.oToJson(dt);
					jsonRet["body"] = JArray.Parse(My.oToJson(dt));
					My.print(jsonRet.ToString());
					Response.End();
				}
				else if (Code != "")
				{
					sql = string.Format(@"
					WITH cte AS (SELECT up.Code, up.Parent, up.Name AS name, up.Lev, up.nc, up.lb, up.rb 
					FROM {0}.{1} AS up INNER JOIN 
					{0}.{1} AS down ON up.lb <= down.lb AND up.rb >= down.rb 
					WHERE (down.Code IN ('{2}'))) 
					SELECT DISTINCT TOP (100) PERCENT h.Code as Code, h.Parent as Parent, h.Code + ' - ' + h.Name as Name, h.Lev as Lev, h.nc, h.nn 
					FROM cte AS cte_1 INNER JOIN 
					{0}.{1} AS h ON cte_1.lb <= h.lb AND cte_1.rb >= h.rb AND cte_1.Lev + 1 = h.Lev OR h.Lev = 1 
					ORDER BY h.nn", schema, table, Code);
					dt = My.dbRead(sql, zConnection);
					int lev = 1;
					foreach (DataRow dr in dt.Rows)
					{
						int levN = int.Parse(dr["Lev"].ToString());
						int nc = int.Parse(dr["nc"].ToString());
						if (levN > lev) { ret += ",'children':["; }
						else if (levN < lev) { ret += "}" + new String(']', lev - levN).Replace("]", "]}") + ","; }
						else { ret += "},"; }
						ret += "{'id':'" + dr["Code"].ToString() + "'";
						ret += ",'text':'" + dr["name"].ToString().Replace("\"", "").Replace("'", "") + "'";
						if (dr["Code"].ToString() == Code) { ret += ",'checked':true"; }
						if (nc > 1) { ret += ",'state': 'closed'"; } else { ret += ",'state': 'open'"; }
						lev = int.Parse(dr["Lev"].ToString());
					}
					if (0 < lev) { ret += "}" + new String(']', lev - 1).Replace("]", "]}"); }
					if (ret.Length > 2) {
						ret = "[" + ret.Substring(2) + "]";
						jsonRet["body"] = JArray.Parse(ret);
					}
					//My.print(ret);Response.End();  
					
					jsonRet["debug"] = new JValue(sql.Replace("\r", "").Replace("\n", "").Replace("\t", ""));
					// jo = new JObject("","");// JObject.Parse(ret);
					// = "{'body':"+ ret + ",'debug':'"+ sql.Replace("'","") + "'}";
					My.print(jsonRet.ToString());
					Response.End();
				}
				else
				{
					sql = string.Format(@"select Code as id, Code + ' - ' + Name as text, case when nc > 1 then 'closed' else 'open' end as state, nc, nn from {0}.{1} where Lev=1", schema, table, id);
					dt = My.dbRead(sql, zConnection);
					ret = My.oToJson(dt);
					jsonRet["body"] = JArray.Parse(My.oToJson(dt));
					jsonRet["debug"] = sql;
					My.print(jsonRet.ToString());
					Response.End();
				}
				break;

			case "combogrid":
				ret = Pg.pagination(My.getParam("view"), My.getParam("page"), My.getParam("rows"), My.getParam("sort"), My.getParam("order"), My.getParam("q"), My.getParam("filterRules"), My.getParam("preFilter"));
				My.print(ret);
				break;				
		}
		
	}
}