using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_provider : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		JObject jsonPayload = JObject.Parse(new System.IO.StreamReader(Context.Request.InputStream).ReadToEnd());
		string zConnection = ""; string zSchema = ""; string zTable = "";
		string zSql = null;
		JObject jsonRet = new JObject();
		DataSet ds = null;
		string cView = ""; string zPreFilter = ""; string zs_filterRules = ""; string zMyFilterRules = "";
		string iPage = "1"; string iRows = "50"; string iSort = ""; string iOrder = "";
		cView = jsonPayload["view"].ToString();

		if (jsonPayload.ContainsKey("preFilter")) zPreFilter = jsonPayload["preFilter"].ToString();
		if (jsonPayload.ContainsKey("filterRules")) zPreFilter = jsonPayload["filterRules"].ToString();
		if (jsonPayload.ContainsKey("myFilterRules")) zPreFilter = jsonPayload["myFilterRules"].ToString();
		if (jsonPayload.ContainsKey("page")) iPage = jsonPayload["page"].ToString();
		if (jsonPayload.ContainsKey("rows")) iRows = jsonPayload["rows"].ToString();
		if (jsonPayload.ContainsKey("sort")) iSort = jsonPayload["sort"].ToString();
		if (jsonPayload.ContainsKey("order")) iOrder = jsonPayload["order"].ToString();

		string[] arrTable = cView.Split('.');
		if (arrTable.Length == 3)
		{
			zConnection = arrTable[0];
			zSchema = arrTable[1];
			zTable = arrTable[2];
		}
		else if (arrTable.Length == 2)
		{
			zConnection = My.getMachineName() + "_PricingService";
			// My.print(zConnection); Response.End();
			zSchema = arrTable[0];
			zTable = arrTable[1];
		}
		string zWhere = "";
		zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zPreFilter));
		zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zs_filterRules));
		zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zMyFilterRules));
		// zWhere = My.addWhere(zWhere, iConditionToWhere(ziCondition));

		zSql = getSqlMainFr2012(
				iTable: zTable
				, iSchema: zSchema
				, iPage: iPage
				, iRows: iRows
				, iSort: iSort
				, iOrder: iOrder
				, iWhere: zWhere
			  ) + "";// #0
		zSql += string.Format("select count (*) from {0}.{1} {2};", zSchema, zTable, zWhere);

		ds = My.dbReadSet(zSql, zConnection);

		jsonRet["total"] = Int32.Parse(ds.Tables[1].Rows[0][0].ToString());
		jsonRet["rows"] = JArray.FromObject(ds.Tables[0]);
		jsonRet["sql"] = zSql;
		jsonRet["where"] = zWhere;

		string zRet = jsonRet.ToString();
		My.print("" + zRet + "");
		Response.End();

	}

	private static string getSqlMainFr2012(string iTable, string iSchema, string iSelect = "*", string iSort = "1", string iOrder = "desc", string iPage = "1", string iRows = "10", string iWhere = "")
	{
		// My.log(iPage, iRows);
		if (iPage == null || iPage == "") iPage = "1"; if (iRows == null || iRows == "") iRows = "10";
		//iPage = "1";
		//iRows = "10";
		if (iOrder == "") iOrder = "1";
		int zOffset = (Int32.Parse(iPage) - 1) * Int32.Parse(iRows);
		string zSql = string.Format("SELECT {0} FROM [{1}].[{2}] {7} ORDER BY {3} {4} OFFSET {5} ROWS FETCH NEXT {6} ROWS ONLY ;"
			 , iSelect   // 0: SELECT
			 , iSchema     // 1: SCHEMA
			 , iTable    // 2: FROM
			 , iSort     // 3: ORDER BY
			 , iOrder    // 4: ORDER BY
			 , zOffset   // 5: OFFSET
			 , iRows     // 6: FETCH NEXT
			 , iWhere    // 7: WHERE
			 );
		return (zSql);
	}
}