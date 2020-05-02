using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_grid_provider_proc : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string zConnection = My.getMachineName() + "_PricingService";
		string conn_str = My.getDbConnString(zConnection);
		string zColumns = null;
		string zFirst = My.getParam("first");
		string zUsername = My.getParam("username");
		JObject jsonRet = new JObject();
		// DataTable dt = null;
		using (SqlConnection conn = new SqlConnection(conn_str))
		{
			conn.Open();

			// 1.  create a command object identifying the stored procedure
			SqlCommand cmd = new SqlCommand("service.pricelist", conn);

			// 2. set the command object so it knows to execute a stored procedure
			cmd.CommandType = CommandType.StoredProcedure;

			// 3. add parameter to command, which will be passed to the stored procedure
			cmd.Parameters.Add(new SqlParameter("@username", zUsername));

			// execute the command
			using (SqlDataReader rdr = cmd.ExecuteReader())
			{
				DataTable dt = new DataTable();
				dt.Load(rdr);
				if (zFirst == "true")
				{
					foreach (DataColumn col in dt.Columns)
					{
						zColumns += string.Format(",{{field:'{0}',title:'{0}', width: 44}}", col.ColumnName);
					}
					zColumns = "[" + zColumns.Substring(1) + "]";
					jsonRet["columns"] = JArray.Parse(zColumns);
				}
				
				jsonRet["total"] = 10;
				jsonRet["rows"] = JArray.FromObject(dt);
				My.print(jsonRet.ToString());
			}
		}

	}
}