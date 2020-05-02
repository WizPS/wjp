using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System;
using System.Data.Odbc;


public partial class lab_odbc : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		using (OdbcConnection myConnection = new OdbcConnection())
		{

			string myConnectionString = @"Driver={Microsoft Access Driver (*.mdb)};Dbq=C:\inetpub\wwwroot\dba2\App_Data\local.mdb;Uid=Admin;Pwd=";
			myConnectionString = "DSN=local2;";
			myConnectionString = @"Provider = Microsoft.ACE.OLEDB.12.0;Data Source = C:\inetpub\wwwroot\dba2\App_Data\local.mdb;Persist Security Info = False;";
			myConnectionString = @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\inetpub\wwwroot\dba2\App_Data\local.accdb;Persist Security Info=False;";

			myConnection.ConnectionString = myConnectionString;
			myConnection.Open();

			//execute queries, etc

		}
	}
}