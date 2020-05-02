using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class app_chart_js_srv_get : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string zRate = My.getParam("rate");
		string zPayload = My.getParam("payload");
		JObject zRet = new JObject();
		string zConnection = My.getMachineName() + "_PricingService";
		if (zPayload != "")
		{
			JObject joPayload = JObject.Parse(zPayload);
			JArray zlabels = new JArray();
			JArray jaDatasets = new JArray();
			JObject joRet = new JObject();
			string zSql = joPayload["dataSet"]["sql"].ToString();
			DataTable dt1 = My.dbRead(zSql, zConnection);
			foreach (DataRow row in dt1.Rows)
			{
				zlabels.Add(row[0]);
			}
			joRet["labels"] = zlabels;

			foreach (DataColumn col in dt1.Columns)
			{
				if (col.Ordinal == 0) continue;
				JArray dataArr = new JArray();
				foreach (DataRow row in dt1.Rows)
				{
					dataArr.Add(row[col.ColumnName]);
				}
				JObject datasetObj = new JObject();
				datasetObj["label"] = col.ColumnName;
				datasetObj["data"] = dataArr;
				jaDatasets.Add(datasetObj);
			}
			joRet["datasets"] = jaDatasets;
			joRet["sql"] = zSql;
			My.print(joRet.ToString());
			Response.End();
		}

		string zSql1 = string.Format("SELECT TOP (100) PERCENT currency_set, type, COUNT(*) AS count, (select top 1 value from curr.v_currency_rate where id = MAX(a.id)) as value FROM curr.v_currency_rate a GROUP BY currency_set, type HAVING (currency_set = 'EUR-{0}') ORDER BY currency_set, type", zRate);
		DataTable dtLegends = My.dbRead(zSql1, zConnection);
		string zLegends = "";
		foreach (DataRow dr in dtLegends.Rows)
		{
			zLegends += string.Format(",[{0} {1}]", dr["currency_set"], dr["type"]);
		}
		if (zLegends.Length > 2) { zLegends = zLegends.Substring(1); }

		string zSql2 = string.Format(@"
				select top 10000 [from_date], {0} into #temp
				from
				(
				  select CONVERT(char(10), [from_date],126) as [from_date] ,[value], [currency_set] + ' ' + [type] AS [currency_set]
				  from [curr].[v_currency_rate] where from_date > '2007-12-01'
				) d
				pivot
				(
				  avg(value)
				  for [currency_set] in ({0})
				) piv ORDER BY 1;insert into #temp select convert(varchar, getdate(), 23),null,null; select * from #temp order by 1;"
				, zLegends);

		JArray datasets = new JArray();
		DataTable dt = My.dbRead(zSql2, zConnection);

		/************** Add row ladt to create line till end **************/
		DataRow newdr = dt.NewRow();
		DataRow newdr2 = dt.NewRow();
		int i = 0;
		foreach (DataColumn col in dt.Columns)
		{
			if (i == 0) {
				newdr[0] = "2020-02-10";
				newdr2[0] = "2020-02-10";
			} else { 
			DataTable dt2 = dt.Select("[" + col.ColumnName + "] is not null", "from_date desc").AsEnumerable().Take(1).CopyToDataTable();
			newdr[i] = dt2.Rows[0][i].ToString();
			newdr2[i] = dt2.Rows[0][i].ToString();
			}
			i++;
		}
		dt.Rows.Add(newdr);
		dt.Rows.Add(newdr2);
		//My.print(My.dtToHtmlTable(dt)); Response.End();

		/************** Generate JSON output **************/
		foreach (DataColumn col in dt.Columns)
		{
			bool valued = false; double value;
			JArray data = new JArray();
			foreach (DataRow dr in dt.Rows)
			{
				// if (dr[col.ColumnName.ToString()].ToString() != "xxx")
				// {
					dt.Rows[dt.Rows.Count - 1][col.ColumnName.ToString()] = dr[col.ColumnName.ToString()];
					if (!valued)
					{
						//dt.Rows[0][col.ColumnName.ToString()] = dr[col.ColumnName.ToString()];
						valued = true;
					}
				// }
				data.Add(dr[col.ColumnName.ToString()]);
			}
			datasets.Add(new JObject(new JProperty("name", col.ColumnName), new JProperty("data", data)));
		}

		

		zRet["labels"] = datasets[0]["data"];
		datasets[0].Remove();  // removes "from_date" from legend
		zRet["datasets"] = datasets;
		zRet["debug1"] = zSql1;
		zRet["debug2"] = zSql2;
		My.print(zRet.ToString());
	}
}