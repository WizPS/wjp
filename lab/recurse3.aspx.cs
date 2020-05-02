using Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class lab_Default2 : System.Web.UI.Page
{

	protected void Page_Load(object sender, EventArgs e)
	{
		// http://localhost:61777/lab/recurse2.aspx

		string zSql = "select top 50 a.iID Nr , a.iParent Parent, a.Name Name from [service_reference].[product] a where a.iID is not null order by 2";
		string zConn = My.getMachineName() + "_PricingService";
		DataTable dt = My.dbRead(zSql, zConn);


		List<RootObject> data = new List<RootObject>();

		for (int i = 0; i < dt.Rows.Count; i++)
		{
			if (dt.Rows[i]["Parent"].ToString() == "")
			{
				data.Add(new RootObject
				{
					nr = dt.Rows[i]["Nr"].ToString(),
					name = dt.Rows[i]["Name"].ToString(),
					child = new List<Child>()
				});

			}
		}

		for (int i = 0; i < dt.Rows.Count; i++)
		{
			if (dt.Rows[i]["Parent"].ToString() != "")
			{
				var parent = data.FirstOrDefault(d => d.nr == dt.Rows[i]["Parent"].ToString());
				if (parent != null)
				{
					parent.child.Add(new Child
					{
						nr = dt.Rows[i]["Nr"].ToString(),
						name = dt.Rows[i]["Name"].ToString()
					});
				}
			}

		}
		My.print(JsonConvert.SerializeObject(data));



	}

	public class Child
	{
		public string nr { get; set; }
		public string name { get; set; }
	}
	public class RootObject
	{
		public string nr { get; set; }
		public string name { get; set; }
		public List<Child> child { get; set; }
	}


}