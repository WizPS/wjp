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
		string zProc2 = My.getParam("proc2", "F");
		string zUsername = My.getParam("username", "F");
		string zType = My.getParam("type", "F");

		string zConnection = My.getMachineName() + "_PricingService";
		string zSql = null;
		string zPayload = "";
		JObject jsonRet = new JObject();
		DataSet ds = null;
		string zView = My.getParam("view");
		string zDsql = My.getParam("sql");
		string payload = My.getParam("payload", "F");

		string zTable = ""; string zSchema = ""; string zDatabase = ""; string zServer = "";

		/************ pre assign stuff **************/
		string[] arrTable = zView.Split('.');
		Array.Reverse(arrTable);
		for (int ii = 0; ii < arrTable.Length; ii++)
		{ if (ii == 0) zTable = arrTable[ii]; else if (ii == 1) zSchema = arrTable[ii]; else if (ii == 2) zDatabase = arrTable[ii]; else if (ii == 3) zServer = arrTable[ii]; }
		if (zSchema == "") zSchema = "dbo";

		/************ check input type **************/
		if (zType != "" ) { }
		else if (zView != "") { zType = "view"; }
		else if (payload != "") { zType = "form_payload"; }
		else if (zDsql != "") { zType = "sql"; }
		else if (zProc != "") { zType = "proc"; }
		else if (zProc2 != "") { zType = "proc2"; }
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
					string a = pair.Value["geo"].ToString();
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

			case "proc2":
				string p_name = My.getParam("p_name", "F");
				string p_type = My.getParam("p_type", "F");
				string p_params = My.getParam("p_params", "F");
				payload = My.getParam("payload", "F");

				string my_conn_string = My.getDbConnString(zConnection);

				SqlConnection sqlConnObj = new SqlConnection(my_conn_string);
				SqlCommand sqlCmd = new SqlCommand(p_name, sqlConnObj);
				sqlCmd.CommandType = CommandType.StoredProcedure;
				JObject jo_params = JObject.Parse(p_params);
				if (jo_params["payload"] != null) sqlCmd.Parameters.Add("@payload", SqlDbType.VarChar, 8000).Value = jo_params["payload"].ToString();
				if (jo_params["geo"] != null) sqlCmd.Parameters.Add("@geo", SqlDbType.VarChar, 50).Value = jo_params["geo"].ToString();
				if (jo_params["ind"] != null) sqlCmd.Parameters.Add("@ind", SqlDbType.VarChar, 50).Value = jo_params["ind"].ToString();
				sqlCmd.Parameters.Add("@to_curr", SqlDbType.VarChar, 50).Value = jo_params["to_curr"].ToString();
				sqlCmd.Parameters.Add("@c_type", SqlDbType.VarChar, 50).Value = jo_params["c_type"].ToString();
				if (jo_params["items"] != null) sqlCmd.Parameters.Add("@items", SqlDbType.VarChar, 8000).Value = jo_params["items"].ToString();
				if (jo_params["qtys"] != null) sqlCmd.Parameters.Add("@qtys", SqlDbType.VarChar, 1000).Value = jo_params["qtys"].ToString();
				SqlDataAdapter da = new SqlDataAdapter(sqlCmd);
				ds = new DataSet();
				da.Fill(ds);
				sqlConnObj.Close();
				jsonRet["rows"] = JArray.Parse(My.dtToJson(ds.Tables[0]));
				if (ds.Tables.Count > 1) jsonRet["rows2"] = JArray.Parse(My.dtToJson(ds.Tables[1]));
				if (ds.Tables.Count > 2) jsonRet["rows3"] = JArray.Parse(My.dtToJson(ds.Tables[2]));
				if (iFirst == "true") { jsonRet["columns"] = tableToColumns(ds.Tables[0]); }
				// jsonRet["columns"] = tableToColumns(ds.Tables[0]);
				jsonRet["total"] = ds.Tables[0].Rows.Count;

				jsonRet["sql"] = zSql;
				jsonRet["debug"] = zDebug;
				My.print(jsonRet.ToString());

				Response.End();
				break;

			case "form_payload":
				// zDebug = "form_payload";
				jsonPayload = JObject.Parse(payload);
				my_conn_string = My.getDbConnString(zConnection);
				var proc = "service.corridor_discount_0_0_1";
				proc = string.Format("service.{0}_{1}"
					, jsonPayload["service"]
					, jsonPayload["version"].ToString().Replace(".", "_")
					);
				sqlConnObj = new SqlConnection(my_conn_string);
				sqlCmd = new SqlCommand(proc, sqlConnObj);
				sqlCmd.CommandType = CommandType.StoredProcedure;
				sqlCmd.Parameters.Add("@payload", SqlDbType.VarChar, 8000).Value = payload;
				da = new SqlDataAdapter(sqlCmd);
				ds = new DataSet();
				da.Fill(ds);
				// use 

				jsonRet["response"] = new JObject();
				if(ds.Tables[0].Rows.Count>0 && ds.Tables[0].Rows[0][0].ToString()!="") jsonRet["response"] = JObject.Parse(ds.Tables[0].Rows[0][0].ToString());

				if (iFirst == "true")
				{
					jsonRet["columns"] = tableToColumns(ds.Tables[1]);
					jsonRet["rows"] = new JArray();
				}
				else
				{
					jsonRet["rows"] = JArray.Parse(My.dtToJson(ds.Tables[1]));
					jsonRet["total"] = ds.Tables[1].Rows.Count;
					jsonRet["header"] = JArray.Parse(My.dtToJson(ds.Tables[2]));
					if (ds.Tables.Count > 3) jsonRet["seq_ext"] = JArray.Parse(My.dtToJson(ds.Tables[3]));
					if (ds.Tables.Count > 4) jsonRet["seq_qty"] = JArray.Parse(My.dtToJson(ds.Tables[4]));
				}

				sqlConnObj.Close();
				jsonRet["sql"] = zSql;
				jsonRet["debug"] = "form_payload";
				jsonRet["debug2"] = "x_lab";
				My.print(jsonRet.ToString());
				Response.End();
				break;
			case "view":
				// My.print("zTable", zTable); My.print("zSchema", zSchema); Response.End();
				string zWhere = "";
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zPreFilter));
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zs_filterRules));
				zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(zMyFilterRules));
				zSql = getSqlMainFr2012(
					iView: zView
					, iPage: iPage
					, iRows: iRows
					, iSort: iSort
					, iOrder: iOrder
					, iWhere: zWhere
				  ) + "";// #0
				zSql += string.Format("select count (*) from {0} {1};", zView, zWhere);
				if (iFirst == "true") zSql += getSqlForColumns_n(zTable, zSchema, zDatabase, zServer);// string.Format("select COLUMN_NAME as field, COLUMN_NAME as title, len(COLUMN_NAME)*7+30 as width from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA ='{0}' and TABLE_NAME = '{1}' ;", zSchema, zTable);

				// My.print(zSql); Response.End();
				ds = My.dbReadSet(zSql, zConnection);
				jsonRet["total"] = Int32.Parse(ds.Tables[1].Rows[0][0].ToString());
				jsonRet["rows"] = JArray.FromObject(ds.Tables[0]);
				if (iFirst == "true") jsonRet["columns"] = JArray.FromObject(ds.Tables[2]);
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
				if (iFirst == "true") zSql += getSqlForColumns_n(zTable, zSchema, zDatabase, zServer);

				// My.print(zSql); Response.End();
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

			

			

			case "proc3":
				p_name = My.getParam("p_name", "F");
				p_type = My.getParam("p_type", "F");
				p_params = My.getParam("p_params", "F");

				my_conn_string = My.getDbConnString(zConnection);

				sqlConnObj = new SqlConnection(my_conn_string);
				sqlCmd = new SqlCommand(p_name, sqlConnObj);
				sqlCmd.CommandType = CommandType.StoredProcedure;
				jo_params = JObject.Parse(p_params);
				if (jo_params["geo"] != null) sqlCmd.Parameters.Add("@geo", SqlDbType.VarChar, 50).Value = jo_params["geo"].ToString();
				if (jo_params["ind"] != null) sqlCmd.Parameters.Add("@ind", SqlDbType.VarChar, 50).Value = jo_params["ind"].ToString();
				if (jo_params["products"] != null) sqlCmd.Parameters.Add("@products", SqlDbType.VarChar, 8000).Value = jo_params["products"].ToString();
				if (jo_params["qtys"] != null) sqlCmd.Parameters.Add("@qtys", SqlDbType.VarChar, 1000).Value = jo_params["qtys"].ToString();
				da = new SqlDataAdapter(sqlCmd);
				ds = new DataSet();
				da.Fill(ds);
				sqlConnObj.Close();
				jsonRet["rows"] = JArray.Parse(My.dtToJson(ds.Tables[0]));
				if (ds.Tables.Count > 1) jsonRet["rows2"] = JArray.Parse(My.dtToJson(ds.Tables[1]));
				if (ds.Tables.Count > 2) jsonRet["rows3"] = JArray.Parse(My.dtToJson(ds.Tables[2]));
				if (iFirst == "true") { jsonRet["columns"] = tableToColumns(ds.Tables[0]); }
				// jsonRet["columns"] = tableToColumns(ds.Tables[0]);
				jsonRet["total"] = ds.Tables[0].Rows.Count;

				jsonRet["sql"] = zSql;
				jsonRet["debug"] = zDebug;
				My.print(jsonRet.ToString());
				Response.End();
				break;

			case "proc_0_0_2":
				p_name = My.getParam("p_name", "F");
				payload = My.getParam("payload", "F");

				my_conn_string = My.getDbConnString(zConnection);

				sqlConnObj = new SqlConnection(my_conn_string);
				sqlCmd = new SqlCommand(p_name, sqlConnObj);
				sqlCmd.CommandType = CommandType.StoredProcedure;
				sqlCmd.Parameters.Add("@payload", SqlDbType.VarChar, 8000).Value = payload;
				sqlCmd.Parameters.Add("@query_by", SqlDbType.VarChar, 10).Value = "PS";
				da = new SqlDataAdapter(sqlCmd);
				ds = new DataSet();
				da.Fill(ds);
				sqlConnObj.Close();
				jsonRet["rows"] = JArray.Parse(My.dtToJson(ds.Tables[0]));
				if (ds.Tables.Count > 1) jsonRet["rows2"] = JArray.Parse(My.dtToJson(ds.Tables[1]));
				if (ds.Tables.Count > 2) jsonRet["rows3"] = JArray.Parse(My.dtToJson(ds.Tables[2]));
				if (ds.Tables.Count > 3) jsonRet["rows4"] = JObject.Parse(ds.Tables[3].Rows[0][0].ToString());
				if (iFirst == "true") { jsonRet["columns"] = tableToColumns(ds.Tables[0]); }
				// jsonRet["columns"] = tableToColumns(ds.Tables[0]);
				jsonRet["total"] = ds.Tables[0].Rows.Count;

				jsonRet["sql"] = zSql;
				jsonRet["debug"] = zDebug;
				My.print(jsonRet.ToString());

				Response.End();

				break;

			case "proc":
				my_conn_string = My.getDbConnString(zConnection);

				// My.print(my_conn_string); Response.End();
				JObject procParam = JObject.Parse(zProc);
				sqlConnObj = new SqlConnection(my_conn_string);
				
				sqlCmd = new SqlCommand(procParam["name"].ToString(), sqlConnObj);
				sqlCmd.CommandType = CommandType.StoredProcedure;
				
				sqlCmd.Parameters.Add("@geo", SqlDbType.VarChar, 50).Value = procParam["params"]["geo"].ToString();
				sqlCmd.Parameters.Add("@ind", SqlDbType.VarChar, 50).Value = procParam["params"]["ind"].ToString();
				sqlCmd.Parameters.Add("@to_curr", SqlDbType.VarChar, 50).Value = procParam["params"]["to_curr"].ToString();
				if (procParam["params"]["items"]!=null) sqlCmd.Parameters.Add("@items", SqlDbType.VarChar, 50).Value = procParam["params"]["items"].ToString();
				sqlCmd.Parameters.Add("@user", SqlDbType.VarChar, 50).Value = procParam["params"]["user"].ToString();
				da = new SqlDataAdapter(sqlCmd);
				ds = new DataSet(); da.Fill(ds); 
				// My.print(My.dtToHtmlTable(ds.Tables[0]));
				//sqlConnObj.Open();
				
				//sqlCmd.ExecuteNonQuery();
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
				if (iFirst == "true") zSql += getSqlForColumns_n(zTable, zSchema, zDatabase, zServer);
				// My.print(zConnection); Response.End();
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
	private static JArray tableToColumns(DataTable dt)
	{
		JArray ret = new JArray();
		foreach ( DataColumn dc in dt.Columns) {
			ret.Add(new JObject(new JProperty("field", dc.ColumnName), new JProperty("title", dc.ColumnName), new JProperty("width", dc.ColumnName.Length*7+15)));
		}
		return ret;
	}

		private static string getSqlForColumns_n(string iTable, string iSchema, string zDatabase, string zServer)
	{
		string zSchema = string.Format("='{0}'", iSchema);
		if (zDatabase != "") { zDatabase += "."; }
		if (zServer != "") { zServer += "."; }
		if (iTable.Substring(0, 2) == "##") { zDatabase = "tempdb.";}
		string zSql = string.Format(@"
			SELECT TOP (100) PERCENT c.name AS field
				, c.name AS title
				, LEN(c.name) * 7 + 30 AS width
				, CAST(1 AS bit) AS sortable
				, CASE WHEN t .precision > 0 THEN 'right' ELSE '' END AS align
				, CASE WHEN t .precision = 0 THEN 'textbox' WHEN t .name LIKE '%date%' THEN 'datetimebox' WHEN t .name LIKE 'bit' THEN 'checkbox' ELSE 'numberbox' END AS editor
				, CAST(c.is_identity AS bit) AS isID
				, CAST(CASE WHEN EXISTS (SELECT * FROM {3}{2}sys.indexes AS i INNER JOIN {3}{2}sys.index_columns AS ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id WHERE (i.is_primary_key = 1) AND (i.object_id = c.object_id) AND ic.column_id = c.column_id) THEN 1 ELSE 0 END AS bit) AS isPK
				, (SELECT STRING_AGG(OBJECT_SCHEMA_NAME(referenced_object_id) + '.' + OBJECT_NAME(referenced_object_id) + '.' + COL_NAME(referenced_object_id, referenced_column_id), ',') FROM {3}{2}sys.foreign_key_columns WHERE parent_column_id=c.column_id AND parent_object_id=c.object_id) AS FKs
				, (SELECT STRING_AGG(cast(referenced_object_id as varchar) + '.' + cast(referenced_column_id as varchar), ',') FROM {3}{2}sys.foreign_key_columns WHERE parent_column_id=c.column_id AND parent_object_id=c.object_id) AS FKIDs
				, CAST(CASE WHEN c.default_object_id = 0 THEN 0 ELSE 1 END AS bit) AS defaulted
				, t.name AS Data_Type
				, CASE WHEN t .name = 'int' THEN 1234 ELSE NULL END AS max
				, c.scale
				, CASE WHEN t .name LIKE 'n%' THEN c.max_length / 2 ELSE c.max_length END AS length
				, t.precision
				, CAST(CASE c.is_nullable WHEN 1 THEN 0 ELSE 1 END AS bit) AS required
				, CAST(c.is_computed AS bit) AS computed
				, o.type
				, ex.value AS description
				FROM 
				{3}{2}sys.schemas AS s RIGHT OUTER JOIN
				{3}{2}sys.columns AS c INNER JOIN
				{3}{2}sys.objects AS o ON o.object_id = c.object_id ON s.schema_id = o.schema_id LEFT OUTER JOIN
				{3}{2}sys.types AS t ON c.user_type_id = t.user_type_id LEFT OUTER JOIN
				{3}{2}sys.extended_properties AS ex ON c.object_id = ex.major_id AND c.column_id = ex.minor_id
				WHERE s.name = '{0}' AND o.name ='{1}'
				;"
			, iSchema    // 0
			, iTable    // 1
			, zDatabase // {2}
			, zServer // 3
			);
		return zSql;
	}
	private static string getSqlForColumns(string iSchema, string iTable)
	{
		string zDatabase = "";
		string zSchema = string.Format("='{0}'", iSchema);
		if (iTable.Substring(0, 2) == "##") { zDatabase = "tempdb."; zSchema = "IS NULL"; }
		string zSql = string.Format(@"
				SELECT TOP (100) PERCENT c.name AS field
					, c.name AS title
					, LEN(c.name) * 7 + 30 AS width
					, CAST(1 AS bit) AS sortable
					, CASE WHEN t .precision > 0 THEN 'right' ELSE '' END AS align
					, CASE WHEN t .precision = 0 THEN 'textbox' WHEN t .name LIKE '%date%' THEN 'datetimebox' WHEN t .name LIKE 'bit' THEN 'checkbox' ELSE 'numberbox' END AS editor
					, CAST(c.is_identity AS bit) AS isID
					, CAST(CASE WHEN EXISTS (SELECT * FROM sys.indexes AS i INNER JOIN sys.index_columns AS ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id WHERE (i.is_primary_key = 1) AND (i.object_id = c.object_id) AND ic.column_id = c.column_id) THEN 1 ELSE 0 END AS bit) AS isPK
					, '' AS FKs
					, '' AS FKIDs
					, CAST(CASE WHEN c.default_object_id = 0 THEN 0 ELSE 1 END AS bit) AS defaulted
					, t.name AS Data_Type
					, CASE WHEN t .name = 'int' THEN 1234 ELSE NULL END AS max
					, c.scale
					, CASE WHEN t .name LIKE 'n%' THEN c.max_length / 2 ELSE c.max_length END AS length
					, t.precision
					, CAST(CASE c.is_nullable WHEN 1 THEN 0 ELSE 1 END AS bit) AS required
					, CAST(c.is_computed AS bit) AS computed
					, o.type
					, ex.value AS description 
				;"
			, zSchema    // 0
			, iTable    // 1
			, zDatabase // 2
			);
		return zSql;
	}
	public static string getSqlMainFr2012(string iView, string iSelect = "*", string iSort = "", string iOrder = "", string iPage = "1", string iRows = "10", string iWhere = "")
	{
		string zOrderBy = "";
		if (iPage == null || iPage == "") iPage = "1"; if (iRows == null || iRows == "") iRows = "10";
		if (iSort != "")
		{
			string[] arrSort = iSort.Split(','); string[] arrOrder = iOrder.Split(',');
			for (int i = 0; i < arrSort.Length; i++)
			{
				string order = "";
				if (arrOrder.Length > i) { order = arrOrder[i]; }
				zOrderBy += string.Format(",[{0}] {1}", arrSort[i], order);
			}
			zOrderBy = zOrderBy.Substring(1);
		}
		else { iSort = "1"; iOrder = "desc"; zOrderBy = "1 desc"; }


		int zOffset = (Int32.Parse(iPage) - 1) * Int32.Parse(iRows);
		string zSql = string.Format("SELECT {0} FROM {1} {5} ORDER BY {2} OFFSET {3} ROWS FETCH NEXT {4} ROWS ONLY ;"
			 , iSelect   // 0: SELECT
			 , iView     // 1: View
			 , zOrderBy  // 2: ORDER BY
			 , zOffset   // 3: OFFSET
			 , iRows     // 4: FETCH NEXT
			 , iWhere    // 5: WHERE
			 );
		return (zSql);
	}
}
