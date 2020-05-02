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

		

		string zSql = "select top 100 a.iID Id , isnull(a.iParent,0) ParentId, a.Name Data from [service_reference].[product] a where a.iID is not null order by 2";
		string zConn = My.getMachineName() + "_PricingService";
		DataTable dt = My.dbRead(zSql, zConn);

		List<Hier> studentList = new List<Hier>();
		for (int i = 0; i < dt.Rows.Count; i++)
		{
			Hier student = new Hier();
			student.Id = Convert.ToInt32(dt.Rows[i]["Id"]);
			student.ParentId = Convert.ToInt32(dt.Rows[i]["ParentId"]);
			student.Data = dt.Rows[i]["Data"].ToString();
			studentList.Add(student);
		}

		// var list = dt.AsEnumerable().ToList();
		var json = JsonConvert.SerializeObject(studentList);
		My.print(json); Response.End();

		List<FlatObject> flatObjects = new List<FlatObject>
		{
			 new FlatObject("Category",1,0),
			 new FlatObject("Sub Category 1",2,1),
			 new FlatObject("Sub Category 2",3,1),
			 new FlatObject("Item 1",4,2),
			 new FlatObject("Item 2",5,2),
			 new FlatObject("Item 3",6,2),
			 new FlatObject("Item 4",7,3),
			 new FlatObject("Item 5",8,3),
			 new FlatObject("Item 6",9,3)
		};

		var recursiveObjects = FillRecursive(flatObjects, 0);

		//var json = JsonConvert.SerializeObject(recursiveObjects);
		//My.print(json);
		//var json = JsonConvert.SerializeObject(flatObjects); My.print(json);


	}

	public class Hier
	{
		public int Id { get; set; }
		public int ParentId { get; set; }
		public string Data { get; set; }

	}


	public class FlatObject
	{
		public int Id { get; set; }
		public int ParentId { get; set; }
		public string Data { get; set; }
		public FlatObject(string name, int id, int parentId)
		{
			Data = name;
			Id = id;
			ParentId = parentId;
		}
	}

	public class RecursiveObject
	{
		public int Id { get; set; }
		public int ParentId { get; set; }
		public string Data { get; set; }
		public List<RecursiveObject> Children { get; set; }
	}

	private static List<RecursiveObject> FillRecursive(List<FlatObject> flatObjects, int parentId)
	{
		List<RecursiveObject> recursiveObjects = new List<RecursiveObject>();
		foreach (var item in flatObjects.Where(x => x.ParentId.Equals(parentId)))
		{
			recursiveObjects.Add(new RecursiveObject
			{
				Data = item.Data,
				Id = item.Id,
				Children = FillRecursive(flatObjects, item.Id)
			});
		}
		return recursiveObjects;
	}


}