using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class data_poll : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		JObject jsonRet = new JObject();
		//{"is_alive":true}
		if (My.getSession("username") == "") { jsonRet["is_alive"] = false; } else { jsonRet["is_alive"] = true; }
		var sess_poll = "";
		sess_poll = My.getSession("poll");
		if (sess_poll.Length>1) {  jsonRet["poll"] = sess_poll;}
		My.setSession("poll","");
		// jsonRet["is_alive"] = false;
		My.print(jsonRet.ToString());
	}
}