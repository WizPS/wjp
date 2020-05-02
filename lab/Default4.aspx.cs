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

		string zSql = "select top 50 a.Code id , a.Parent parent, a.Name text from [service_reference].[product] a where a.iID is not null order by 2";
		string zConn = My.getMachineName() + "_PricingService";
		DataTable dt = My.dbRead(zSql, zConn);

		My.print(JsonConvert.SerializeObject(GetLayers(dt)));
	}

	public IList<Layer> GetLayers(DataTable dt)
	{
		IList<Layer> data = JsonConvert.DeserializeObject<List<Layer>>(My.dtToJson(dt));
		IList<Layer> hierarcy = new List<Layer>();
		foreach (var layer in data)
		{
			var sublayers = data.Where(i => i.parent == layer.id && i.parent != null);
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
		public string id { get; set; }
		public string parent { get; set; }
		public string text { get; set; }
		public string state { get; set; }
		public string @checked { get; set; }
		public IList<Layer> children { get; private set; }

		public Layer()
		{
			children = new List<Layer>();
		}
	}


}