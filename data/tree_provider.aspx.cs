using Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_tree_provider : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{

		/*************  type can be 
		 * i) Increment  - expands one tree-node using id when one node clicked.
		 * e) Expanded. "preFilter" used. Normaly one value selected.
		 * c) Collapsed "preFilter" used. Shows root and second level.
		 * cf) Collapsed full. Shows root and second level while all are loaded.
		**************/

		// JObject zTreeView = JObject.Parse(My.getParam("treeView"));
		var zTreeView = JsonConvert.DeserializeObject<treeView>(My.getParam("treeView"));
		var zPreSelections = JsonConvert.DeserializeObject<preSelections>(My.getParam("preSelections"));
		//var zPreFilter = JsonConvert.DeserializeObject<preSelections>(My.getParam("preFilter"));
		string zPreFilter = My.getParam("preFilter");
		string zSelections = My.getParam("selections");
		string zChecked = My.getParam("checked");
		string zCid = My.getParam("cid");

		
		string zUsername = My.getParam("username");
		string zID = My.getParam("id");

		string zSchema = zTreeView.schema;
		string zTable = zTreeView.table;
		string zColumn = zTreeView.column;
		string zType = zTreeView.type;
		string zParent = zTreeView.parent;
		string zText = zTreeView.text;
		string zConn = My.getMachineName() + "_PricingService";
		dynamic json = new JObject();
		DataTable dt = new DataTable();

		string zValues = "";
		string zPreViewSchema = "";
		string zPreViewTable = "";
		string zWherePreFilter = "";
		string zSql = "";
		string zWhere = "";

		if (zID != "") { zType = "i"; } else if (My.getParam("type") == "u") { zType = "u"; } else if (zType == null) { zType = "c"; }
		if (zPreSelections == null && zPreFilter == "") { zValues = "''"; }
		else
		{
			if (zPreFilter != "")
			{
				zWhere = "WHERE" + My.jsonFieldsToWhere2(zPreFilter);
				zValues = string.Format("SELECT DISTINCT[{0}]FROM[{1}].[{2}]{3}"
					, zColumn
					, zSchema
					, zTable
					, zWhere
					);
			}
			if (zPreSelections != null)
			{
				if (zPreFilter != "") { zWhere = "WHERE" + My.jsonFieldsToWhere2(zPreFilter); } else { zWhere = ""; }
				zValues = string.Format("SELECT DISTINCT[{0}]FROM[{1}].[{2}]{3}"
					, zPreSelections.column
					, zPreSelections.schema
					, zPreSelections.table
					, zWhere
					);
			}
		}
		switch (zType)
		{
			case "i":
				zSql = string.Format(@"
				SELECT[{2}] as id
				, (SELECT CASE WHEN count(*) > 0 THEN 'closed' ELSE 'open' END FROM [{0}].[{1}] where [{3}] = a.{2}) AS 'state'
				, (select count (*) FROM [{0}].[{1}] WHERE [{3}] = a.{2}) AS 'count'
				, a.[{2}] + ' - ' + a.[{5}] as text
				FROM [{0}].[{1}] a WHERE [{3}] ='{4}' order by 1,2"
			, zSchema // #0
			, zTable // #1
			, zColumn // #2
			, zParent //#3
			, zID //#4
			, zText//zTextField //#5
			);
				dt = My.dbRead(zSql, zConn);
				json.body = JsonConvert.DeserializeObject(JsonConvert.SerializeObject(dt));
				json.sql = zSql;
				My.print(json.ToString());
				break;
			case "e":
				zSql = string.Format(getSQL("e")
					, zColumn // #0
					, zParent // #1
					, zText // #2
					, zSchema // #3
					, zTable // #4	
					, zValues //  #5
					, zPreViewSchema// #6
					, zPreViewTable// #7
					, zWherePreFilter// #8
					);
				// My.print(zSql); Response.End();
				dt = My.dbRead(zSql, zConn);
				json.body = JArray.Parse(JsonConvert.SerializeObject(GetLayers(dt)));
				json.debug = zSql;
				json.debugWherePreFilter = zWherePreFilter;
				My.print(json.ToString());
				Response.End();
				// My.print(zSql);
				break;
			case "c":
				zSql = string.Format(getSQL("c")
					, zColumn // #0
					, zParent // #1
					, zText // #2
					, zSchema // #3
					, zTable // #4	
					, zValues //  #5
					, zPreViewSchema// #6
					, zPreViewTable// #7
					, zWherePreFilter// #8
					);
				// My.print(zSql); Response.End();
				dt = My.dbRead(zSql, zConn);
				json.body = JArray.Parse(JsonConvert.SerializeObject(GetLayers(dt)));
				json.debug = zSql;
				json.debugWherePreFilter = zWherePreFilter;
				My.print(json.ToString());
				Response.End();
				
				break;
			case "u":
				if (zTreeView.updateColumn != "")
				{
					zSql = string.Format("UPDATE[{0}].[{1}]SET[{2}]='{3}'WHERE[{4}]='{5}'"
						, zTreeView.schema // #0
						, zTreeView.table // #1
						, zTreeView.updateColumn // #2
						, zChecked // #3
						, zTreeView.column // #4
						, zCid // #5
						);
					My.dbCUD(zSql, zConn);
					json.debug = zSql;
					My.print(json.ToString());
				}
				break;
			case "cf":
				zSql = string.Format("SELECT[{0}]id,[{1}][parent],[{0}]+' - '+[{2}][text],CASE WHEN [{1}]IS NULL THEN 'open'WHEN[Lev]=6THEN'open'WHEN(SELECT COUNT(*)FROM[{3}].[{4}]WHERE[{1}]=a.[{0}])=0THEN'open'ELSE'closed'END[state]FROM[{3}].[{4}]a"
					, zColumn // #0
					, zParent // #1
					, zText // #2
					, zSchema // #3
					, zTable // #4	
					);
				// My.print(zSql); Response.End();
				dt = My.dbRead(zSql, zConn);
				json.body = JArray.Parse(JsonConvert.SerializeObject(GetLayers(dt)));
				json.debug = zSql;
				json.debugWherePreFilter = zWherePreFilter;
				My.print(json.ToString());
				break;
		}
	}
	
	public class preSelections
	{
		public string sameTableColumn { get; set; }
		public string schema { get; set; }
		public string table { get; set; }
		public string column { get; set; }

	}
	public class treeView
	{
		public string schema { get; set; }
		public string table { get; set; }
		public string column { get; set; }
		public string parent { get; set; }
		public string text { get; set; }
		public string type { get; set; }
		public string updateColumn { get; set; }
		
	}
	public class preFilter
	{
		public string field { get; set; }
		public string op { get; set; }
		public string value { get; set; }
		public string isOR { get; set; }
	}

	public class JsonBody
	{
		public Dictionary<string, treeView> Profile { get; set; }
	}

	public IList<Layer> GetLayers(DataTable dt)
	{
		IList<Layer> data = JsonConvert.DeserializeObject<List<Layer>>(My.dtToJson(dt));
		IList<Layer> hierarcy = new List<Layer>();
		foreach (var layer in data)
		{
			if (layer.parent==null)
			{
				//layer.text = layer.id + " - " + layer.text;
				hierarcy.Add(layer);
			}
			var sublayers = data.Where(i => i.parent == layer.id && i.parent != null);
			foreach (var sublayer in sublayers)
			{
				layer.children.Add(sublayer);
			}
		}
		return hierarcy;
	}

	public class Layer
	{
		public string id { get; set; }
		public string parent { get; set; }
		public string text { get; set; }
		public string state { get; set; }
		public bool @checked { get; set; }
		public IList<Layer> children { get; set; }

		public Layer()
		{
			children = new List<Layer>();
		}
	}

	private static string getSQL(string iType)
	{
		string zExpanded = "";
		if (iType == "c" || iType == "cf") { zExpanded = "UPDATE[#temp]SET[state]='closed' WHERE [Parent] IS NOT NULL;"; }
		return @"
drop table if exists #temp;
CREATE TABLE[#temp]([id]varchar(5),[parent]varchar(5),[text]varchar(110),[state]varchar(6),[checked]varchar(5),[count]smallint,[iconCls]varchar(20)); 
INSERT INTO[#temp]([id],[parent],[text],[state],[checked])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'open','false'FROM[{3}].[{4}]WHERE[{1}]is null
INSERT INTO[#temp]([id],[parent],[text],[state],[checked])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'closed','false'FROM[{3}].[{4}]WHERE[{1}]IN(SELECT[{0}]FROM[{3}].[{4}]WHERE[{1}]is null)
INSERT INTO[#temp]([id],[parent],[text],[state],[checked],[iconCls])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'closed','true','icon-add'FROM[{3}].[{4}]
WHERE[{0}]IN({5});
/**/
INSERT INTO[#temp]([id],[parent],[text],[state],[checked])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'closed','false'FROM[{3}].[{4}]WHERE[{0}]IN(SELECT[{1}]FROM[#temp])AND[{0}]NOT IN(SELECT[id]FROM[#temp]);
INSERT INTO[#temp]([id],[parent],[text],[state],[checked])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'closed','false'FROM[{3}].[{4}]WHERE[{0}]IN(SELECT[{1}]FROM[#temp])AND[{0}]NOT IN(SELECT[id]FROM[#temp]);
INSERT INTO[#temp]([id],[parent],[text],[state],[checked])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'closed','false'FROM[{3}].[{4}]WHERE[{0}]IN(SELECT[{1}]FROM[#temp])AND[{0}]NOT IN(SELECT[id]FROM[#temp]);
INSERT INTO[#temp]([id],[parent],[text],[state],[checked])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'closed','false'FROM[{3}].[{4}]WHERE[{0}]IN(SELECT[{1}]FROM[#temp])AND[{0}]NOT IN(SELECT[id]FROM[#temp]);
INSERT INTO[#temp]([id],[parent],[text],[state],[checked])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'closed','false'FROM[{3}].[{4}]WHERE[{0}]IN(SELECT[{1}]FROM[#temp])AND[{0}]NOT IN(SELECT[id]FROM[#temp]);
/**/
INSERT INTO[#temp]([id],[parent],[text],[state],[checked])SELECT[{0}],[{1}],[{0}] + ' - ' + [{2}],'closed','false'FROM[{3}].[{4}]WHERE([{1}]IN(SELECT[parent]FROM #temp))AND[{0}]NOT IN(SELECT[id]FROM #temp);
UPDATE[#temp]SET[count]=(SELECT COUNT(*)FROM[{3}].[{4}][a]WHERE[ID]=a.[{1}]);
UPDATE[#temp]SET[state]='open'WHERE[id]IN(SELECT[parent]FROM[#temp]);
" + zExpanded + @"
UPDATE[#temp]SET[state]='open'WHERE[count]=0
SELECT*FROM[#temp]ORDER BY 1;";
	}

	
}

