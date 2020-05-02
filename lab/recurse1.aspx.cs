using Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class lab_Default2 : System.Web.UI.Page
{

	protected void Page_Load(object sender, EventArgs e)
	{


		string zSql = "select a.Code, a.Parent, a.Name from [service_reference].[product] a";
		string zConn = My.getMachineName() + "_PricingService";
		DataTable dt = My.dbRead(zSql, zConn);
		var folders = dt.AsEnumerable().ToList();




		var input = new[]
		{

				new folder {id = "F182",  text = "GLOBAL REPORTS",state = "open", parent = null   },
				new folder {id = "F184",  text = "software",state = "open",            parent = null   },
				new folder {id = "F1227", text = "LYB P&L Reports",state = "open",     parent = "F184" },
				new folder {id = "F1245", text = "LYB Training",state = "open",        parent = "F184" },
				new folder {id = "F1239", text = "test3",state = "open",               parent = "F182" },
				new folder {id = "F1249", text = "Paavan_Test_Reports",state = "open", parent = "F184" },
		  };

		var roots = input.Where(i => i.parent == null);
		foreach (var root in roots)
			BuildTree(root, input);

		// var json = JsonConvert.SerializeObject(roots, Formatting.Indented);
		// My.print(json);
	}
	public class folder
	{
		public string id { get; set; }
		public string parent { get; set; }
		public string text { get; set; }
		public string state { get; set; }
		public string count { get; set; }
		public string iconCls { get; set; }

		
		public IEnumerable<folder> items { get; set; }

		public bool ShouldSerializeitems()
		{
			return items.Any();
		}
	}
	public static IEnumerable<folder> BuildTree(folder current, folder[] allItems)
	{
		var childs = allItems.Where(c => c.parent == current.id).ToArray();
		foreach (var child in childs)
			child.items = BuildTree(child, allItems);
		current.items = childs;
		return childs;
	}
}