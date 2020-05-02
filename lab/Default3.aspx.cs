using Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class lab_Default2 : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		// https://codereview.stackexchange.com/questions/102389/nested-object-to-hierarchical-object-list

		string zSql = "select top 50 a.iID id , isnull(a.iParent,0) parent, a.Name text from [service_reference].[product] a where a.iID is not null order by 2";
		string zConn = My.getMachineName() + "_PricingService";
		DataTable dt = My.dbRead(zSql, zConn);

		My.print(JsonConvert.SerializeObject(GetLayers(dt)));
	}

	public IList<Layer> GetLayers(DataTable dt)
	{
		// IList<Layer> data = Db.GetLayers();
		IList<Layer> data = JsonConvert.DeserializeObject<List<Layer>>(dtToJson(dt));
		// My.print(JsonConvert.SerializeObject(data)); Response.End();
		IList<Layer> hierarcy = new List<Layer>();
		foreach (var layer in data)
		{
			var sublayers = data.Where(i => i.parent == layer.id && i.parent != 0);
			if (sublayers.Any())
			{
				hierarcy.Add(layer);
			}
			foreach (var sublayer in sublayers)
			{
				layer.children.Add(sublayer);
			}
		}
		return hierarcy;
	}
	public class Layer
	{
		public int id { get; set; }
		public int parent { get; set; }
		public string text { get; set; }
		public IList<Layer> children { get; set; }

		public Layer()
		{
			children = new List<Layer>();
		}
	}
	public static class Db
	{
		public static IList<Layer> GetLayers()
		{
			return new List<Layer>
						 {
							  new Layer{id = 1, parent = 0, text = "First Layer" },
							  new Layer{id = 2, parent = 1, text = "First SubLayer1" },
							  new Layer{id = 3, parent = 1, text = "First SubLayer2" },
							  new Layer{id = 4, parent = 1, text = "First SubLayer3" },
							  new Layer{id = 5, parent = 0, text = "Second Layer" },
							  new Layer{id = 6, parent = 5, text = "Second SubLayer1" },
							  new Layer{id = 7, parent = 5, text = "Second SubLayer2" },
							  new Layer{id = 8, parent = 7, text = "Sub -3" }
						 };
		}
	}

	public string dtToJson(DataTable table)
	{
		string JSONString = string.Empty;
		JSONString = JsonConvert.SerializeObject(table);
		return JSONString;
	}
}