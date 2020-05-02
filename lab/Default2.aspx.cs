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
		My.print(JsonConvert.SerializeObject(GetLayers()));
	}

	public IList<Layer> GetLayers()
	{
		IList<Layer> data = Db.GetLayers();
		IList<Layer> hierarcy = new List<Layer>();
		foreach (var layer in data)
		{
			var sublayers = data.Where(i => i.ParentId == layer.Id && i.ParentId != 0);
			if (sublayers.Any())
			{
				hierarcy.Add(layer);
			}
			foreach (var sublayer in sublayers)
			{
				layer.ChildLayers.Add(sublayer);
			}
		}
		return hierarcy;
	}
	public class Layer
	{
		public int Id { get; set; }
		public int ParentId { get; set; }
		public string Name { get; set; }
		public IList<Layer> ChildLayers { get; set; }

		public Layer()
		{
			ChildLayers = new List<Layer>();
		}
	}
	public static class Db
	{
		public static IList<Layer> GetLayers()
		{
			return new List<Layer>
						 {
							  new Layer{Id = 1, ParentId = 0, Name = "First Layer" },
							  new Layer{Id = 2, ParentId = 1, Name = "First SubLayer1" },
							  new Layer{Id = 3, ParentId = 1, Name = "First SubLayer2" },
							  new Layer{Id = 4, ParentId = 1, Name = "First SubLayer3" },
							  new Layer{Id = 5, ParentId = 0, Name = "Second Layer" },
							  new Layer{Id = 6, ParentId = 5, Name = "Second SubLayer1" },
							  new Layer{Id = 7, ParentId = 5, Name = "Second SubLayer2" },
							  new Layer{Id = 8, ParentId = 7, Name = "Sub -3" }
						 };
		}
	}
}