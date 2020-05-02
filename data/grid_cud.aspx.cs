using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_grid_cud : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		JObject ret = new JObject();
		/*
		action: "update"
		changes: { PPL: "1.68000000", External: "1.62640000", Diff: "31", from_date: "10/16/2019 21:52:08"}
		dataSet: { view: "curr.v_getLatest",…}
		old: { from_curr: "EUR", to_curr: "AUD", PPL: 1.68, External: 1.6264, Diff: 3,…}
		row: { from_curr: "EUR", to_curr: "AUD", PPL: "1.68000000", External: "1.62640000", Diff: "31",…}
		viewSet: { rowEdit: ["e", "i", "d"]}
		*/

		/********************** Init stuff **************************/
		string zSql = "";
		string zTable = "";
		string zSchema = "";
		string zDataSetView = "";
		string zWhere = "";
		string zWhere_ret = "";
		string zInsertColumn = "";
		string zInsValues = "";
		string action = "";
		JObject old = null;

		/********************** Get stuff **************************/
		JObject payload = JObject.Parse(My.getParam("payload"));
		// if (payload["action"].ToString() == "delete") { Response.End(); }
		action = string.Format("{0}", payload["action"]);
		//string changes = string.Format("{0}", payload["changes"]);
		string dataSet = string.Format("{0}", payload["dataSet"]);
		
		string viewSet = string.Format("{0}", payload["viewSet"]);
		//JObject changes = payload["changes"].ToString();

		

		/********************** Set stuff **************************/
		if (payload["old"] != null) old = JObject.Parse(payload["old"].ToString());
		if (payload["dataSet"]["view"] != null) { zDataSetView = payload["dataSet"]["view"].ToString(); }
		string zConn = My.getMachineName() + "_PricingService";
		zSchema = zDataSetView.Split('.')[0];
		zTable = zDataSetView.Split('.')[1];

		

		/********************** strategy **************************/
		/*
		 * action is determined by the client and can be [insert], [update] or [delete?] 
		 * identity for update and delete is done at server side
		 * mandatory fields for insert and update is checked client side
		 * 
		 * Payload form param contains [action], [changes], [dataSet], [old], [viewSet]
		 * 
		 * For [update] and [delete?] 
		 * 1) Get Identity if exists
		 * 2) Get Primary Key if exists
		 * 3) Else Get All fields
		 */

		/********************** Get Identity **************************/
		zSql = string.Format(@"SELECT columns.name as COLUMN_NAME FROM sys.tables tables JOIN sys.columns columns ON tables.object_id=columns.object_id WHERE columns.is_identity=1 and OBJECT_SCHEMA_NAME(tables.object_id, db_id()) = '{0}' and tables.name = '{1}';"
			, zSchema
			, zTable
			);
		zSql += string.Format("SELECT ccu.COLUMN_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu ON tc.CONSTRAINT_NAME = ccu.Constraint_name WHERE tc.TABLE_SCHEMA = '{0}' and tc.TABLE_NAME = '{1}' and tc.CONSTRAINT_TYPE = 'Primary Key';"
			, zSchema
			, zTable
			);
		zSql += string.Format("select COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, NUMERIC_PRECISION, NUMERIC_SCALE, NUMERIC_PRECISION_RADIX, DATETIME_PRECISION, IS_NULLABLE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = '{0}' and TABLE_NAME = '{1}';"
			, zSchema
			, zTable
			);

		payload["debug"] = zSql;

		
		DataSet ds = My.dbReadSet(zSql,zConn);
		// My.print(My.dtToHtmlTable(ds.Tables[0]));
		// My.print(My.dtToHtmlTable(ds.Tables[1]));
		// Response.End();
		// Boolean, Byte, Char, DateTime, Decimal, Double, Guid, Int16, Int32, Int64, SByte, Single, String, TimeSpan, UInt16, UInt32, UInt64, Byte[],

		/********************** Add fields **************************/
		ds.Tables[2].Columns.Add("id", typeof(Boolean));
		ds.Tables[2].Columns.Add("old", typeof(String));
		ds.Tables[2].Columns.Add("null", typeof(Boolean));
		ds.Tables[2].Columns.Add("new", typeof(String));

		/********************** Set ID columns **************************/
		if (ds.Tables[0].Rows.Count > 0)
		{
			string zColumnName = ds.Tables[0].Rows[0][0].ToString();
			ds.Tables[2].Select("COLUMN_NAME='"+ zColumnName + "'")[0]["id"] = 1;
		}
		else if (ds.Tables[1].Rows.Count > 0)
		{
			foreach (DataRow dr in ds.Tables[1].Rows) {
				string zColumnName = dr["COLUMN_NAME"].ToString();
				ds.Tables[2].Select("COLUMN_NAME='" + zColumnName + "'")[0]["id"] = 1;
			}
		}
		else {
			ds.Tables[2].Columns["id"].Expression = "1";
		}

		

		/********************** Add old values **************************/
		foreach (var pair in JObject.Parse( payload["old"].ToString())) {
			string name = pair.Key; JToken value = pair.Value;
			if (name.Substring(0,2) == "__") continue; 
			ds.Tables[2].Select("COLUMN_NAME='" + name + "'")[0]["old"] = value;
			if (value.Type == JTokenType.Null) {
				ds.Tables[2].Select("COLUMN_NAME='" + name + "'")[0]["null"] = 1;
			}
		}

		

		/********************** Add new values **************************/
		foreach (var pair in JObject.Parse(payload["row"].ToString()))
		{
			string name = pair.Key; JToken value = pair.Value;
			if (name.Substring(0, 2) == "__") continue;
			
			DataRow[] dr = ds.Tables[2].Select("COLUMN_NAME='" + name + "'");
			if (dr[0]["NUMERIC_PRECISION"].ToString() != "") {
				if (value.ToString() != "") {
					// double xx = value.ToObject<double>();
					// double xx = double.Parse(value, System.Globalization.CultureInfo.InvariantCulture);
					// My.print(value.ToString(), string.Format("{0}", xx));
					dr[0]["new"] = value.ToObject<double>();
					dr[0]["new"] = dr[0]["new"].ToString().Replace(",", ".");
					
				}

			} //  My.print(Convert.ToDecimal(value).ToString()); } dr[0]["new"] =
			else if (dr[0]["DATETIME_PRECISION"].ToString() != "") {
				dr[0]["new"] = value.ToString();
			}
			else {
				dr[0]["new"] = value.ToObject<string>();
			}
		}


		/********************** Build where x 2 **************************/
		foreach (DataRow dr in ds.Tables[2].Rows) {
			if (dr["id"].ToString()=="True") {

				/********************** Build zWhere **************************/
				if (dr["null"].ToString() == "True") {
					zWhere += string.Format("AND[{0}] IS NULL ", dr["COLUMN_NAME"]);
					
				}
				else {
					string zOldValue = dr["old"].ToString();
					if (dr["NUMERIC_PRECISION"].ToString() != "") { zOldValue = zOldValue.Replace(",","."); }
					zWhere += string.Format("AND[{0}]='{1}'", dr["COLUMN_NAME"], zOldValue);
				}

				/********************** Build zWhere_ret **************************/
				if (dr["new"].ToString() == "")
				{
					if (dr["null"].ToString() == "True" || dr["NUMERIC_PRECISION"].ToString() != "")
					{
						zWhere_ret += string.Format("AND[{0}] IS NULL ", dr["COLUMN_NAME"]);
					}
					else
					{
						//zWhere_ret += string.Format("AND[{0}]=''", dr["COLUMN_NAME"]);
					}
				}
				else {
					string zNewValue = dr["new"].ToString();
					zWhere_ret += string.Format("AND[{0}]='{1}'", dr["COLUMN_NAME"], zNewValue);
				}
			}
		}
		if (zWhere.Length>1) { zWhere = "WHERE" + zWhere.Substring(3); }
		if (zWhere_ret.Length > 1) { zWhere_ret = "WHERE" + zWhere_ret.Substring(3); }
		
		payload["zWhere"] = zWhere;
		payload["zWhere_ret"] = zWhere_ret;

		/********************** Build [update] **************************/
		string zSet = "";
		switch (action)
		{
			case "update":
				foreach (DataRow dr in ds.Tables[2].Rows) {
					if (dr["new"].ToString() == dr["old"].ToString()) continue;
					/********************** if Number **************************/
					if (dr["NUMERIC_PRECISION"].ToString() != "")
					{
						if (dr["new"].ToString() == "")
						{
							zSet += string.Format(",[{0}]={1}", dr["COLUMN_NAME"], "NULL");
						}
						else
						{
							zSet += string.Format(",[{0}]={1}", dr["COLUMN_NAME"], dr["new"]);
						}
					}
					else if (dr["CHARACTER_MAXIMUM_LENGTH"].ToString() != "")
					{
						if ((dr["null"].ToString() == "True" && dr["new"].ToString() == "") || dr["new"].ToString() == "NULL")
						{
							zSet += string.Format(",[{0}]={1}", dr["COLUMN_NAME"], "NULL");
						}
						else
						{
							zSet += string.Format(",[{0}]='{1}'", dr["COLUMN_NAME"], dr["new"]);
						}
					}
					else if (dr["DATETIME_PRECISION"].ToString() != "")
					{
						if ((dr["null"].ToString() == "True" && dr["new"].ToString() == "") || dr["new"].ToString() == "NULL")
						{
							zSet += string.Format(",[{0}]={1}", dr["COLUMN_NAME"], "NULL");
						}
						else
						{
							zSet += string.Format(",[{0}]='{1}'", dr["COLUMN_NAME"], dr["new"]);
						}
					}
					else {
						if ((dr["null"].ToString() == "True" && dr["new"].ToString() == "") || dr["new"].ToString() == "NULL")
						{
							zSet += string.Format(",[{0}]={1}", dr["COLUMN_NAME"], "NULL");
						}
						else
						{
							zSet += string.Format(",[{0}]='{1}'", dr["COLUMN_NAME"], dr["new"]);
						}
					}
				}
				if (zSet.Length > 1) { zSet= zSet.Substring(1); }
				payload["zSet"] = zSet;
				break;
			case "insert":
			case "copy":
				string zColumns = ""; string zValues = "";
				foreach (DataRow dr in ds.Tables[2].Rows)
				{
					if (dr["new"].ToString() == "") { continue; }
					zInsertColumn += string.Format(",[{0}]", dr["COLUMN_NAME"]);
					zInsValues += string.Format(",'{0}'", dr["new"]);
				}
				if (zInsertColumn.Length > 1) { zInsertColumn = zInsertColumn.Substring(1); }
				if (zInsValues.Length > 1) { zInsValues = zInsValues.Substring(1); }
				break;
		}
		switch (action)
		{
			case "update":
				if (zSet.Length>1) zSql = string.Format("UPDATE [{0}].[{1}] SET {2} {3}", zSchema, zTable, zSet, zWhere);
				break;
			case "insert":
			case "copy":
				zSql = string.Format("INSERT INTO [{0}].[{1}] ({2}) VALUES ({3})  ", zSchema, zTable, zInsertColumn, zInsValues);
				break;
			case "delete":
				zSql = string.Format("DELETE FROM [{0}].[{1}] {2}", zSchema, zTable, zWhere);
				break;
		}
		
		payload["zSql"] = zSql;
		JObject zResult = My.dbCUD(zSql,zConn);
		string zSql_ret= string.Format("SELECT * FROM [{0}].[{1}] {2}", zSchema, zTable, zWhere_ret);
		payload["zSql_ret"] = zSql_ret;
		zResult["return"] = JArray.Parse(My.oToJson(My.dbRead(zSql_ret, zConn)));
		payload["result"] = zResult;
		//  My.print(My.dtToHtmlTable(ds.Tables[2])); // !!!!!!!!!!!!!!!!!!!!!!!!!!

		My.print(payload.ToString()); Response.End();
		
		JObject result = My.dbCUD(zSql,zConn);
		if (string.Format("{0}", result["new_id"]).Length > 0) {
			ret["row"] = JArray.Parse( My.oToJson( My.dbRead(string.Format("select * from customer.test WHERE [id]='{0}' ", result["new_id"]), zConn)))[0];
		}

		ret["sql"] = zSql;
		ret["result"] = result;
		ret["payload"] = payload;
		My.print(ret.ToString());

	}

	private static string Update(JObject jsonPayload)
	{
		var jnew = jsonPayload["new"];
		// My.print(jnew.ToString());
		var jold = jsonPayload["old"];
		// My.print(jold.ToString());

		return string.Format("update {0} set {1} where {2} and idx = 223;"
			, jsonPayload["view"]
			, Loop(jnew)
			, Loop(jold));

	}
	private static string Insert(JObject znew)
	{
		return "insert into xxxx ('id','idx') values ('','');";
	}
	private static string Loop(JToken jo)
	{
		string ret = "";
		foreach (var x in jo)
		{
			//if (x.Value == null) My.print("null_null");
			//if (x.Value == null) My.print("null_null");
			ret += string.Format(",[{0}]='{1}'", x.ToString().Split(':')[0], x.ToString().Split(':')[1]);
		}
		if (ret.Length > 2) ret = ret.Substring(1);
		return ret;
	}

	


}