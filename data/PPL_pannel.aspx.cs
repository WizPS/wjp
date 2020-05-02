using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class app_PPL_pannel : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string zType = My.getParam("type");
		string zScope = My.getParam("scope");
		string zScope2 = "";
		DataSet dsResult = null;
		DataTable dtResult = null;
		string zSql = "";
		string zSqlSet = "";
		JObject zBranch_details = null;
		if (My.getParam("branch_details", "F") != "")
		{
			zBranch_details = JObject.Parse(My.getParam("branch_details", "F"));
			// My.print(zBranch_details.ToString());
		}


		switch (zType)
		{
			case "exec_sp_create_full":
				// @Created_by, @target_commit, @target_valid_from, @Comment
				// [service_ppl].[create_branch] 1,'selumeda','2019-04-01','2019-05-01','comment'
				zSql = "[service_ppl].[create_branch] 1,'" + zBranch_details["created_by"] + "','" + zBranch_details["target_commit_date"] + "','" + zBranch_details["target_valid_from"] + "',null,'" + zBranch_details["comment"] + "'";
				// My.print(zSql);
				dsResult = My.dbReadSet(zSql, My.getMachineName() + "_PricingService");
				break;
			case "exec_sp_create_partial":
				JArray jScope = JArray.Parse(zScope);
				foreach (string x in jScope)
				{
					zScope2 += "," + x;
				}
				if (zScope2.Length > 1) zScope2 = zScope2.Substring(1);
				zSql = "[service_ppl].[create_branch] 2,'" + zBranch_details["created_by"] + "','" + zBranch_details["target_commit_date"] + "','" + zBranch_details["target_valid_from"] + "','" + zScope2 + "','" + zBranch_details["comment"] + "'";
				dsResult = My.dbReadSet(zSql, My.getMachineName() + "_PricingService");
				// My.print(zSql);  My.print(My.dtToHtmlTable(dsResult.Tables[0]));
				break;
			case "exec_sp_commit_branch":
				zSql = "[service_ppl].[commit_branch] '" + zBranch_details["version"] + "'";
				dsResult = My.dbReadSet(zSql, My.getMachineName() + "_PricingService");
				break;
			case "file":
				zSql = "select 10 as 'ten'";
				dsResult = My.dbReadSet(zSql, My.getMachineName() + "_PricingService");
				break;
		}
		// My.print(zSql); Response.End();

		JObject jResult = new JObject();

		zSql = "select * from [service_ppl].[version] where state > 1;";
		DataTable dt = My.dbRead(zSql, My.getMachineName() + "_PricingService");
		JObject json = new JObject();
		json.Add(new JProperty("openBranches", new JArray(JArray.Parse(My.oToJson(dt)))));

		if (dsResult != null)
		{
			dtResult = dsResult.Tables[dsResult.Tables.Count - 1];
			json.Add(new JProperty("result", new JArray(JArray.Parse(My.oToJson(dtResult)))));
		}

		// branchStatus "No" "Full" "Partial"
		if (dt.Rows.Count < 1)
		{
			json.Add(new JProperty("branchStatus", "No"));
		}
		else if (dt.Rows[0]["type"].ToString() == "full")
		{
			json.Add(new JProperty("branchStatus", "Full"));
		}
		else
		{
			json.Add(new JProperty("branchStatus", "Partial"));
		}


		// json.Add(new JProperty("branchStatus", "No")); // "No" "Full" "Partial"
		switch (json["branchStatus"].ToString())
		{
			case "No":
				json.Add(new JProperty("rrFunctions", new JObject(new JProperty("PPL_create_full", "enable"), new JProperty("PPL_create_partial", "enable"))));
				break;
			case "Full":
				json.Add(new JProperty("rrFunctions", new JObject(new JProperty("PPL_hide_branch", "enable"), new JProperty("PPL_show_branch", "enable"))));
				// $("#PPL_hide_branch").linkbutton("enable"); $("#PPL_show_branch").linkbutton("enable");
				break;
			case "Partial":
				json.Add(new JProperty("rrFunctions", new JObject(new JProperty("PPL_create_partial", "enable"))));
				break;
		}
		My.print(json.ToString());
		/*
		DataTable dt = null;
		if (zSp != "")
		{
			dt = My.dbRead(zSp, My.getMachineName() + "_PricingService");
			My.print(My.dtToHtmlTable(dt));
		}
		else if (zType == "getstatus")
		{
			zSql = "[service_ppl].[commit_branch] ";
			zSqlSet = "select * from [service_ppl].[version] where state > 1;";
			DataSet ds = My.dbReadSet(zSqlSet, My.getMachineName() + "_PricingService");
			dt = My.dbRead(zSql, My.getMachineName() + "_PricingService");
			// My.print(My.oToJson(dt));
		}
		else
		{
			zSql = @"
		SELECT SCHEMA_NAME(SCHEMA_ID) AS [Schema], 
			SO.name AS[ObjectName],
			SO.Type_Desc AS[ObjectType(UDF / SP)],
			COALESCE(P.parameter_id, 0) AS[ParameterID],
			COALESCE(P.name, 'NO PARAMETER')  AS[ParameterName],
			COALESCE(TYPE_NAME(P.user_type_id), '')  AS[ParameterDataType],
			COALESCE(P.max_length, 0) AS[ParameterMaxBytes],
			COALESCE(P.is_output, 0) AS[IsOutPutParameter]
			FROM sys.objects AS SO
			LEFT OUTER JOIN sys.parameters AS P
			ON SO.OBJECT_ID = P.OBJECT_ID
			WHERE SO.OBJECT_ID IN(SELECT OBJECT_ID
			FROM sys.objects
			WHERE TYPE IN ('P','FN'))
			AND SO.NAME LIKE 'c%'
			ORDER BY[Schema], SO.name, P.parameter_id
			;";
			dt = My.dbRead(zSql, My.getMachineName() + "_PricingService");
			// My.print(My.dtToHtmlTable(dt));
		}
		*/

	}
}