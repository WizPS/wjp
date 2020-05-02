using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Common;

public partial class system_Default : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		Response.Write("<b>Some interesting environment constants: </b><br>");
		Response.Write("<b>getSystemName:</b> " + My.getSystemName() + "<br>");
		Response.Write("<b>System.Environment.MachineName:</b> " + System.Environment.MachineName + "<br>");
		Response.Write("<b>Request.ApplicationPath:</b> " + Request.ApplicationPath + "<br>");
		Response.Write("<b>Server.MachineName:</b> " + Server.MachineName + "<br>");
		Response.Write("<b>System.Web.Hosting.HostingEnvironment.ApplicationHost.GetSiteName():</b> " + System.Web.Hosting.HostingEnvironment.ApplicationHost.GetSiteName() + "<br>");
		Response.Write("<b>System.Web.Hosting.HostingEnvironment.ApplicationHost.GetVirtualPath():</b> " + System.Web.Hosting.HostingEnvironment.ApplicationHost.GetVirtualPath() + "<br>");

		Response.Write("<br>");
		Response.Write("<b>System.Web.HttpRuntime.AppDomainAppVirtualPath:</b> " + System.Web.HttpRuntime.AppDomainAppVirtualPath + "<br>");
		Response.Write("<b>System.Web.HttpRuntime.AppDomainId:</b> " + System.Web.HttpRuntime.AppDomainId + "<br>");
		Response.Write("<b>System.Web.HttpRuntime.AspClientScriptPhysicalPath:</b> " + System.Web.HttpRuntime.AspClientScriptPhysicalPath + "<br>");
		Response.Write("<b>System.Web.HttpRuntime.AspClientScriptVirtualPath:</b> " + System.Web.HttpRuntime.AspClientScriptVirtualPath + "<br>");
		Response.Write("<b>System.Web.HttpRuntime.AppDomainAppPath:</b> " + System.Web.HttpRuntime.AppDomainAppPath + "<br>");
		Response.Write("<b>Request.ServerVariables['SERVER_NAME']:</b> " + Request.ServerVariables["SERVER_NAME"]);

		// Nollställ Sessions
		if (My.getParam("ClearSession", "F") != "")
		{
			Session.Clear();
			// Local.Page.msgUL("Session Cleared.");
			// -- HttpContext.Current.Response.Redirect(HttpContext.Current.Request.RawUrl, false);
		}

		// Nollställ Application
		if (My.getParam("ClearApplication", "F") != "")
		{
			Application.Clear();
			// Local.Page.msgUL("Application Cleared.");
			// -- HttpContext.Current.Response.Redirect(HttpContext.Current.Request.RawUrl, false);
		}

		// Nollställ Cookies
		if (My.getParam("ClearCookies", "F") != "")
		{
			HttpCookie aCookie;
			string cookieName;
			int limit = Request.Cookies.Count;
			for (int i = 0; i < limit; i++)
			{
				cookieName = Request.Cookies[i].Name;
				aCookie = new HttpCookie(cookieName);
				aCookie.Expires = DateTime.Now.AddDays(-1); // make it expire yesterday
				Response.Cookies.Add(aCookie); // overwrite it
			}
			// -- HttpContext.Current.Response.Redirect(HttpContext.Current.Request.RawUrl, false);
		}

		// Läs Session
		string zRet = @"<h3><u>Session:</u></h3>(HttpContext.Current.Session.xxxx)<br>";
		zRet += @"string zPar = HttpContext.Current.Session[""xxx""].ToString();<br>";
		// Session["root"] = @"D:\home\site\wwwroot\";
		//Application["root"] = @"D:\home\site\wwwroot\";
		for (int i = 0; i < Session.Contents.Count; i++)
		{
			zRet += "<b>" + Session.Keys[i] + "</b>=" + Session[i] + "<br/>";
		}

		zRet += "<b>SessionID</b>=" + HttpContext.Current.Session.SessionID + "<br>";

		zRet += @"
        <form action = '' method = 'post'><input type='hidden' name='ClearSession' value='1'><button>Clear Session</button></form>
        ";
		

		// Läs Application
		zRet += @"<br/><h3><u>Application:</u></h3>
        ";
		for (int i = 0; i < Application.Contents.Count; i++)
		{
			zRet += "<b>" + Application.Keys[i] + "</b>=" + Application[i] + "<br/>";
		}

		zRet += @"
        <form action = '#' method = 'post'><input type='hidden' name='ClearApplication' value='1'><button>Clear Application</button></form>
        ";

		zRet += @"<br>Local.Page.getApplication(""Site"")";


		// Läs Server variables
		zRet += "<h3><u>Server Variables</u></h3> Request.ServerVariables[\"SERVER_NAME\"];<br/><br/>";

		foreach (string var in Request.ServerVariables)
		{
			zRet += @"<b>" + var + "</b>=" + Request[var] + "<br>";
		}
		zRet += "<br><b>Request.Browser.Type</b>=" + Request.Browser.Type + " (Request.Browser.Type)<br>";

		zRet += @"<br>Request.ServerVariables[""HTTP_REFERER""].ToString()";



		Response.Write(zRet);

		// Läs Cookies 
		int loop1, loop2;
		HttpCookieCollection MyCookieColl;
		HttpCookie MyCookie;

		MyCookieColl = Request.Cookies;

		// Capture all cookie names into a string array.
		String[] arr1 = MyCookieColl.AllKeys;
		zRet = "<br><h3>Cookies:</h3>";
		// Grab individual cookie objects by cookie name.
		for (loop1 = 0; loop1 < arr1.Length; loop1++)
		{
			MyCookie = MyCookieColl[arr1[loop1]];
			zRet += "Cookie: " + MyCookie.Name + "<br>";
			zRet += "Value:" + MyCookie.Value + "<br>";
			zRet += "Expires:" + MyCookie.Expires + "<br>";
			zRet += "Secure:" + MyCookie.Secure + "<br>";

			//Grab all values for single cookie into an object array.
			String[] arr2 = MyCookie.Values.AllKeys;

			//Loop through cookie Value collection and print all values.
			for (loop2 = 0; loop2 < arr2.Length; loop2++)
			{
				zRet += "Value" + loop2 + ": " + Server.HtmlEncode(arr2[loop2]) + "<br>";
			}
			zRet += "<br>";
		}

		zRet += @"
        <form action = '#' method = 'post'><input type='hidden' name='ClearCookies' value='1'><button>Clear Cookies</button></form>
        ";

		Response.Write(zRet);
	}
}