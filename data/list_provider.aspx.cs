using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_list_provider : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
		string zConnection = My.getMachineName() + "_PricingService";
		string zSql = null;
		string zPayload = "";
		JArray jsonRet = new JArray();
		DataSet ds = null;
		string zView = My.getParam("view");
		string zDsql = My.getParam("sql");
		string zGroupField = My.getParam("groupField");
		string zTextField = My.getParam("textField");

		string zTable = ""; string zSchema = ""; string zDatabase = ""; string zServer = "";

		/************ pre assign stuff **************/
		string[] arrTable = zView.Split('.');
		Array.Reverse(arrTable);
		for (int ii = 0; ii < arrTable.Length; ii++)
		{ if (ii == 0) zTable = arrTable[ii]; else if (ii == 1) zSchema = arrTable[ii]; else if (ii == 2) zDatabase = arrTable[ii]; else if (ii == 3) zServer = arrTable[ii]; }
		if (zSchema == "") zSchema = "dbo";

		/************ main stuff **************/
		zSql = string.Format("SELECT[{1}][group],[{2}][text],{3}[value]FROM {0}	ORDER BY 1,2"
			, zView // #0
			, zGroupField // #1
			, zTextField // #2
			, "123"
			);
		ds = My.dbReadSet(zSql, zConnection);

		/************ write back stuff **************/
		jsonRet = JArray.Parse( My.oToJson(ds.Tables[0]));
		My.print(jsonRet.ToString());

	}
}