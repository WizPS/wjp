using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Data;

public partial class grid_provider : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string zConnection = My.getMachineName() + "_PricingService";
		string zSql = null;
		JObject jsonRet = new JObject();
		DataSet ds = null;
		string cView = My.getParam("view");
		if (cView.Length > 5)
		{
			string[] arrTable = cView.Split('.');
			string zSchema = arrTable[0];
			string zTable = arrTable[1];
			string zPreFilter = My.getParam("preFilter");
			string zs_filterRules = My.getParam("filterRules");
			string zMyFilterRules = My.getParam("myFilterRules");
			string iPage = My.getParam("page", "F", "1");
			string iRows = My.getParam("rows", "F", "50");
			string iSort = My.getParam("sort", "F");
			string iOrder = My.getParam("order", "F");
			string iFirst = My.getParam("first", "F");

			string zWhere = "";
			zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zPreFilter));
			zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zs_filterRules));
			zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zMyFilterRules));

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
			if (iFirst == "true") zSql += getSqlForColumns(zSchema, zTable);// string.Format("select COLUMN_NAME as field, COLUMN_NAME as title, len(COLUMN_NAME)*7+30 as width from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA ='{0}' and TABLE_NAME = '{1}' ;", zSchema, zTable);

			ds = My.dbReadSet(zSql, zConnection);
			jsonRet["total"] = Int32.Parse(ds.Tables[1].Rows[0][0].ToString());
			jsonRet["rows"] = JArray.FromObject(ds.Tables[0]);
			if (iFirst == "true") jsonRet["columns"] = JArray.FromObject(ds.Tables[2]);
			jsonRet["sql"] = zSql;
			jsonRet["where"] = zWhere;
			My.print(jsonRet.ToString());
			Response.End();
		}
		else
		{
			string Payload = new System.IO.StreamReader(Context.Request.InputStream).ReadToEnd();
			JObject jsonPayload = JObject.Parse(Payload);
			foreach (var pair in jsonPayload)
			{
				// My.print(pair.Key);
				// JToken jt = pair.Value;
				zSql += string.Format("select count (*) as total from {0} ;", pair.Value["queryParams"]["view"]);
				zSql += string.Format("select top 50 * from {0} ;", pair.Value["queryParams"]["view"]);
				zSql += string.Format("select COLUMN_NAME as field, COLUMN_NAME as title, len(COLUMN_NAME)*7+30 as width from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '{0}' ;", pair.Value["queryParams"]["view"].ToString().Split('.')[1]);
			}
			ds = My.dbReadSet(zSql, zConnection);
			JObject myJo = new JObject();
			int i = 0;
			foreach (var pair in jsonPayload)
			{
				int wPart = i * 3;
				myJo.Add(new JProperty(pair.Value["id"].ToString(), new JObject(
					new JProperty("total", ds.Tables[wPart].Rows[0][0])
					, new JProperty("rows", JArray.FromObject(ds.Tables[wPart + 1]))
					, new JProperty("columns", JArray.FromObject(ds.Tables[wPart + 2]))
					, new JProperty("view", pair.Value["queryParams"]["view"])
					)));
				i++;
			}
			jsonRet["result"] = myJo;
			jsonRet["debug"] = zSql;
			My.print(jsonRet.ToString());
			Response.End();
		}
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

	private static string getSqlForColumns(string iSchema, string iTable)
	{
		string zSql = string.Format(@"
				SELECT TOP (100) PERCENT c.name AS field
				, c.name AS title
				, len(c.name)*7+30 as width 
				, cast (1 as bit) AS sortable
				, CASE WHEN t.precision > 0 THEN 'right' ELSE '' END AS align
				, CASE WHEN t.precision = 0 THEN 'textbox' WHEN t.name LIKE '%date%' THEN 'datetimebox' WHEN t.name LIKE 'bit' THEN 'checkbox' ELSE 'numberbox' END  AS editor
				, cast (c.is_identity as bit) AS isID
				, cast (case when exists (SELECT * FROM sys.indexes AS i INNER JOIN sys.index_columns AS ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id WHERE (i.is_primary_key = 1) AND (i.object_id = c.object_id) and ic.column_id=c.column_id) then 1 else 0 end as bit) AS isPK
				, (Select SUBSTRING((SELECT ',' + OBJECT_SCHEMA_NAME(referenced_object_id) + '.' + OBJECT_NAME(referenced_object_id) + '.' + COL_NAME(referenced_object_id, referenced_column_id) AS 'data()' FROM sys.foreign_key_columns WHERE parent_column_id=c.column_id AND parent_object_id=c.object_id FOR XML PATH('')), 2 , 9999) ) AS FKs
				, (Select SUBSTRING((SELECT ',' + cast(referenced_object_id as varchar) + '.' + cast(referenced_column_id as varchar) AS 'data()' FROM sys.foreign_key_columns WHERE parent_column_id=c.column_id AND parent_object_id=c.object_id FOR XML PATH('')), 2 , 9999) ) AS FKIDs
				, cast (CASE WHEN c.default_object_id = 0 THEN 0 ELSE 1 END as bit) AS defaulted
				, t.name AS Data_Type
				, CASE WHEN t.name = 'int' THEN 1234 ELSE null END AS max
				, c.scale AS scale
				, CASE WHEN t.name LIKE 'n%' THEN c.max_length / 2 ELSE c.max_length END AS length
				, t.precision  AS precision
				, cast (case c.is_nullable when 1 then 0 else 1 end as bit) AS required
				, cast (c.is_computed as bit) AS computed
				, o.type
				, ex.value as description
				FROM sys.columns AS c INNER JOIN
				sys.objects AS o ON o.object_id = c.object_id LEFT OUTER JOIN
				sys.types AS t ON t.user_type_id = c.user_type_id
				LEFT OUTER JOIN sys.extended_properties AS ex ON c.object_id = ex.major_id AND c.column_id = ex.minor_id 
				WHERE (OBJECT_SCHEMA_NAME(c.object_id) = '{0}') AND (o.name = '{1}');"
			, iSchema    // 0
			, iTable    // 1
			);
		return zSql;
	}

}