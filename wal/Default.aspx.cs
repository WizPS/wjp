using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		if (!Request.IsSecureConnection && Request.Url.ToString().Contains("org"))
		{
			string redirectUrl = Request.Url.ToString().Replace("http:", "https:");
			Response.Redirect(redirectUrl, false);
			// HttpContext.ApplicationInstance.CompleteRequest();
		}
		if (HttpContext.Current.Session["userLevel"] == null)
		{
			My.print("<script> window.location.replace('../Login.aspx?ret=notauthenticated');</script>");
			HttpContext.Current.Response.End();
		}
		else if (Int32.Parse(HttpContext.Current.Session["userLevel"].ToString()) < 2)
		{
			My.print("<script> window.location.replace('../Login.aspx?ret=nopermission');</script>");
			HttpContext.Current.Response.End();
		}
	}
}