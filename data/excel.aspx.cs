using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using OfficeOpenXml;
using System.IO;
using System.Data;

using OfficeOpenXml.Style;
using Newtonsoft.Json.Linq;

public partial class Lab_Excel1 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
		string zUsername = HttpContext.Current.Session["username"].ToString();
		string zTime = DateTime.Now.ToString("yyyyMMdd_HHmmss");
		string payload = My.getParam("payload","F");
		JObject oPayload = JObject.Parse(payload);
		// string conn = oPayload["conn"].ToString();
		string schema = oPayload["view"].ToString().Split('.')[0];
		string table = oPayload["view"].ToString().Split('.')[1];
		string filterRules = oPayload["filterRules"].ToString();
		string where = jsonFieldsToWhere(filterRules);
		string zConn = My.getMachineName() + "_PricingService";
		where = My.addWhere("", where);
		string sql = string.Format("SELECT top 100000 * FROM[{0}].[{1}]{2}", schema, table, where);
		DataTable dt = My.dbRead(sql, zConn);
		// My.print(My.dtToHtmlTable(dt));
		

		ExcelPackage excel = new ExcelPackage();
		ExcelWorksheet ws = excel.Workbook.Worksheets.Add(schema + "." + table);
		ws.Cells["A1"].LoadFromDataTable(dt, true);
		/************* correct dates ***************/
		int colNumber = 0;
		foreach (DataColumn col in dt.Columns)
		{
			colNumber++;
			if (col.DataType == typeof(DateTime))
			{
				ws.Column(colNumber).Style.Numberformat.Format = "yyyy-MM-dd hh:mm:ss";
			}
		}

		string zPath = Request.ServerVariables["APPL_PHYSICAL_PATH"]  + @"user\" + zUsername + @"\download\" + zTime + "_" + schema + "." + table + ".xlsx";
		// My.print(zPath);
		FileInfo excelFile = new FileInfo(zPath);
		excel.SaveAs(excelFile);
		My.setSession("poll","Excel");
	}

	private static string jsonFieldsToWhere(string iJson)
	{
		if (iJson == "undefined" || iJson.Length < 1) { return ""; }
		string zRet = ""; string zOp = "=";
		JArray oJson = JArray.Parse(iJson);
		foreach (var item in oJson)
		{
			// My.print(item["value"].ToString());
			if (item["value"].ToString() == "[]") { continue; }
			JArray jo = JArray.Parse(item["value"].ToString());
			// My.print(jo[0] + "<hr>");
			string zOr = "";
			foreach (string joItem in jo)
			{
				if (joItem == "[null]")
				{
					zOr += "OR[" + item["field"] + "]IS NULL ";
				}
				else if (joItem == "[blank]")
				{
					zOr += "OR[" + item["field"] + "]=''";
				}
				else
				{
					zOr += "OR[" + item["field"] + "]='" + joItem + "'";
				}

			}
			if (zOr.Length > 2) { zOr = zOr.Substring(2); }
			zRet += "AND(" + zOr + ")";
		}
		if (zRet.Length > 2) { zRet = zRet.Substring(3); }
		return zRet;
	}




}