using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_gauge : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string zConn = My.getMachineName() + "_PricingService";
		string payload = My.getParam("payload");
		JObject jPayload = JObject.Parse(payload);
		string sql = jPayload["sql"].ToString();
		DataTable dt = My.dbRead(sql, zConn);
		My.print(My.oToJson(dt));
	}
}