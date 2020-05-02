using Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class lab_getFiles : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{

	}

	public static string files()
	{
		string zUsername = HttpContext.Current.Session["username"].ToString();
		string zPath = My.getApplication("root") + @"user\" + zUsername + @"\download\";
		DirectoryInfo d = new DirectoryInfo(zPath);
		string str = "";
			foreach (FileInfo file in d.GetFiles().OrderByDescending(file => file.FullName))
		{
			var x = DateTime.Now.Subtract(file.CreationTime).TotalMinutes;
			if (x > 1440) { file.Delete(); continue; } // delete files older than 1 day (24x60)
			str = str + string.Format("<tr><td><a href='user/{0}/download/{1}' target='_blank'>{1}</a></td><td>{2}</td><td>{3} KB</td></tr>"
			, zUsername // #0
			, file.Name // #1
			, file.CreationTime // #2
			, file.Length / 1000 // #3
			);
		}
		return str;
	}
}