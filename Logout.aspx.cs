using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Logout : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string zAction = My.getParam("action", "F");
		dynamic json = new JObject();
		Response.Cookies["userkey"].Expires = DateTime.Now.AddDays(-1);
		Session["username"] = null;
		Session["userLevel"] = null;
		Session["userkey"] = null;
		Session["fPerm"] = null;
		Session["client"] = null;
		json.success = true;
		My.print(json.ToString());
		Response.End();
	}
}