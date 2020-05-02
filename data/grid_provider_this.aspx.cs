using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Data;
using System.Data.SqlClient;

public partial class grid_provider : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		/*
		 string zConnection = My.getMachineName() + "_PricingService";
		JObject jsonRet = new JObject();
		string ret = Pg.pagination(My.getParam("table"), My.getParam("page"), My.getParam("rows"), My.getParam("sort"), My.getParam("order"), My.getParam("q"), My.getParam("filterRules"), My.getParam("preFilter"));
		My.print(ret);
		 */
		var watch = System.Diagnostics.Stopwatch.StartNew();
		
		string zDebug = "";
		string zPreFilter = My.getParam("preFilter");
		string zs_filterRules = My.getParam("filterRules");
		string zMyFilterRules = My.getParam("myFilterRules");
		string iPage = My.getParam("page", "F", "1");
		string iRows = My.getParam("rows", "F", "50");
		string iSort = My.getParam("sort", "F");
		string iOrder = My.getParam("order", "F");
		string iFirst = My.getParam("first", "F");
		string zProc = My.getParam("proc", "F");
		string zUsername = My.getParam("username", "F");

		string zConnection = My.getMachineName() + "_PricingService";
		string zSql = null;
		string zPayload = "";
		string zType = "";
		JObject jsonRet = new JObject();
		DataSet ds = null;
		string zView = My.getParam("view");
		string zDsql = My.getParam("sql");

		/************ check input type **************/
		if (zView != "") { zType = "view"; }
		else if (zDsql != "") { zType = "sql"; }
		else if (zProc != "") { zType = "proc"; }
		else
		{
			zPayload = new System.IO.StreamReader(Context.Request.InputStream).ReadToEnd();
			if (ValidateJSON(zPayload))
			{
				zType = "payload";
			}
			else { My.print("{columns:[{field:'id',title:'load error'}],rows:[{id:'missing view or payload'}],total:1}"); return; }
		}

		switch (zType)
		{
			case "view":
				string[] arrTable = zView.Split('.');
				string zSchema = arrTable[0];
				string zTable = arrTable[1];
				string zWhere = "";
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zPreFilter));
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zs_filterRules));
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zMyFilterRules));
				zSql = My.getSqlMainFr2012(
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

				// My.print(zSql); Response.End();
				ds = My.dbReadSet(zSql, zConnection);
				jsonRet["total"] = Int32.Parse(ds.Tables[1].Rows[0][0].ToString());
				jsonRet["rows"] = JArray.FromObject(ds.Tables[0]);
				if (iFirst == "true") { 
					jsonRet["columns"] = JArray.FromObject(ds.Tables[2]); }
				jsonRet["sql"] = zSql;
				jsonRet["where"] = zWhere;
				watch.Stop();
				var elapsedMs = watch.ElapsedMilliseconds;
				jsonRet["time"] = elapsedMs;
				My.print(jsonRet.ToString());
				Response.End();
				break;

			case "sql":
				string hashCode = String.Format("{0:X}", zDsql.GetHashCode());
				zTable = zUsername + "_" + hashCode;
				if (iFirst == "true")
				{
					// "select stuff( (select ',' + cast(SCHEMA_NAME(t.schema_id)+'.'+name as varchar(max)) from sys.tables t where SCHEMA_NAME(schema_id) = 'user_temp' and DATEDIFF(MINUTE, create_date,GETDATE())>100 for xml path ('') ), 1, 1, '' );";
					string zDropTables = My.dbRead("select stuff( (select ',' + cast(SCHEMA_NAME(t.schema_id)+'.'+name as varchar(max)) from sys.tables t where SCHEMA_NAME(schema_id) = 'user_temp' and DATEDIFF(MINUTE, create_date,GETDATE())>100 for xml path ('') ), 1, 1, '' );", zConnection).Rows[0][0].ToString();
					if (zDropTables.Length>3) zDebug = My.dbExec(string.Format("drop table {0}; ", zDropTables), zConnection).ToString();
					zDebug = My.dbExec(string.Format("drop table if exists [user_temp].[{0}]; ", zTable), zConnection).ToString();
					zDebug = My.dbExec(string.Format("with a as ({0}) select* into [user_temp].[{1}] from a; ", zDsql, zTable), zConnection).ToString();
				}
				
				zSchema = "user_temp";
				DataTable dt = My.dbRead(string.Format("select * from [user_temp].[{0}];", zTable), zConnection);
				zPreFilter = My.getParam("preFilter");
				zs_filterRules = My.getParam("filterRules");
				zMyFilterRules = My.getParam("myFilterRules");
				iPage = My.getParam("page", "F", "1");
				iRows = My.getParam("rows", "F", "50");
				iSort = My.getParam("sort", "F");
				iOrder = My.getParam("order", "F");
				iFirst = My.getParam("first", "F");
				zUsername = My.getParam("username", "F");

				zWhere = "";
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zPreFilter));
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zs_filterRules));
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zMyFilterRules));

				zSql = My.getSqlMainFr2012(
					iTable: zTable
					, iSchema: zSchema
					, iPage: iPage
					, iRows: iRows
					, iSort: iSort
					, iOrder: iOrder
					, iWhere: zWhere
				  ) + "";// #0
				zSql += string.Format("with a as (SELECT * FROM [curr].[currency]) select count(*) from a {0};", zWhere);
				if (iFirst == "true") zSql += getSqlForColumns(zSchema, zTable);

				ds = My.dbReadSet(zSql, zConnection);
				jsonRet["total"] = dt.Rows.Count;
				jsonRet["rows"] = JArray.FromObject(ds.Tables[0]);
				if (iFirst == "true") jsonRet["columns"] = JArray.FromObject(ds.Tables[2]);
				jsonRet["sql"] = zSql;
				jsonRet["where"] = zWhere;
				

				jsonRet["debug"] = zDebug;
				My.print(jsonRet.ToString());
				Response.End();
				break;

			case "payload":
				JObject jsonPayload = JObject.Parse(zPayload);
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
				jsonRet["debug"] = zDebug;
				My.print(jsonRet.ToString());
				Response.End();
				break;
			case "proc":
				JObject procParam = JObject.Parse(zProc);
				SqlConnection sqlConnObj = new SqlConnection(My.getDbConnString(zConnection));
				SqlCommand sqlCmd = new SqlCommand(procParam["name"].ToString(), sqlConnObj);
				sqlCmd.CommandType = CommandType.StoredProcedure;
				sqlCmd.Parameters.Add("@geo", SqlDbType.VarChar, 50).Value = procParam["params"]["geo"].ToString();
				sqlCmd.Parameters.Add("@ind", SqlDbType.VarChar, 50).Value = procParam["params"]["ind"].ToString();
				sqlCmd.Parameters.Add("@to_curr", SqlDbType.VarChar, 50).Value = procParam["params"]["to_curr"].ToString();
				if (procParam["params"]["items"]!=null) sqlCmd.Parameters.Add("@items", SqlDbType.VarChar, 50).Value = procParam["params"]["items"].ToString();
				sqlCmd.Parameters.Add("@user", SqlDbType.VarChar, 50).Value = procParam["params"]["user"].ToString();
				SqlDataAdapter da = new SqlDataAdapter(sqlCmd);
				// ds = new DataSet(); // da.Fill(ds); // My.print(My.dtToHtmlTable(ds.Tables[0]));
				sqlConnObj.Open();
				sqlCmd.ExecuteNonQuery();
				sqlConnObj.Close();

				zTable = "magnus_112233";
				if (iFirst == "true")
				{
					// string zDropTables = My.dbRead("select stuff( (select ',' + cast(SCHEMA_NAME(t.schema_id)+'.'+name as varchar(max)) from sys.tables t where SCHEMA_NAME(schema_id) = 'user_temp' and DATEDIFF(MINUTE, create_date,GETDATE())>100 for xml path ('') ), 1, 1, '' );", zConnection).Rows[0][0].ToString();
					// if (zDropTables.Length > 3) zDebug = My.dbExec(string.Format("drop table {0}; ", zDropTables), zConnection).ToString();
					// zDebug = My.dbExec(string.Format("drop table if exists [user_temp].[{0}]; ", zTable), zConnection).ToString();
					// zDebug = My.dbExec(string.Format("with a as ({0}) select* into [user_temp].[{1}] from a; ", zDsql, zTable), zConnection).ToString();
				}

				zSchema = "user_temp";
				zPreFilter = My.getParam("preFilter");
				zs_filterRules = My.getParam("filterRules");
				zMyFilterRules = My.getParam("myFilterRules");
				iPage = My.getParam("page", "F", "1");
				iRows = My.getParam("rows", "F", "50");
				iSort = My.getParam("sort", "F");
				iOrder = My.getParam("order", "F");
				iFirst = My.getParam("first", "F");
				zUsername = My.getParam("username", "F");

				zWhere = "";
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zPreFilter));
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zs_filterRules));
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zMyFilterRules));

				zSql = My.getSqlMainFr2012(
					iTable: zTable
					, iSchema: zSchema
					, iPage: iPage
					, iRows: iRows
					, iSort: iSort
					, iOrder: iOrder
					, iWhere: zWhere
				  ) + "";// #0
				zSql += string.Format("select count(*)from[{0}].[{1}]{2};", zSchema,zTable, zWhere);
				if (iFirst == "true") zSql += getSqlForColumns(zSchema, zTable);

				ds = My.dbReadSet(zSql, zConnection);
				jsonRet["rows"] = JArray.FromObject(ds.Tables[0]);
				jsonRet["total"] = ds.Tables[1].Rows[0][0].ToString();
				if (iFirst == "true") jsonRet["columns"] = JArray.FromObject(ds.Tables[2]);
				jsonRet["sql"] = zSql;
				jsonRet["where"] = zWhere;

				jsonRet["debug"] = zDebug;
				My.print(jsonRet.ToString());
				Response.End();
				break;
		}
	}

	private static bool ValidateJSON(string s)
	{
		try
		{ JToken.Parse(s); return true; }
		catch
		{ return false; }
	}


	private static string getSqlForColumns(string iSchema, string iTable)
	{
		string zDatabase = "";
		string zSchema = string.Format("='{0}'", iSchema);
		if (iTable.Substring(0, 2) == "##") { zDatabase = "tempdb."; zSchema = "IS NULL"; }
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
				FROM {2}sys.columns AS c INNER JOIN
				{2}sys.objects AS o ON o.object_id = c.object_id LEFT OUTER JOIN
				{2}sys.types AS t ON t.user_type_id = c.user_type_id
				LEFT OUTER JOIN {2}sys.extended_properties AS ex ON c.object_id = ex.major_id AND c.column_id = ex.minor_id 
				WHERE (OBJECT_SCHEMA_NAME(c.object_id) {0}) AND (o.name = '{1}');"
			, zSchema    // 0
			, iTable    // 1
			, zDatabase // 2
			);
		return zSql;
	}
}
