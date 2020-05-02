using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Common;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.IO;
using System.Data.Odbc;

public partial class Login : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{

		string zAction = My.getParam("action");

		

		dynamic json = new JObject();
		///////////////// < Load the json user-configuration file > /////////////////
		string zjson = File.ReadAllText(Server.MapPath("~/App_Data/wal/config.json"));
		JObject jo = JObject.Parse(zjson);
		// string fPerm = zjson;
		string zKey = My.getCookie("userkey");


		if (zAction == "login")
		{
			///////////////// User loggs-in /////////////////	
			string zUser = My.getParam("user", "F");
			string zPassword = My.getParam("pw", "F");
			string zclient = My.getParam("client", "F");
			string zRememberme = My.getParam("rememberme", "F");

			if (zUser != "")
			{
				///////////////// User entered login credentials /////////////////	
				JObject match = jo["Users"].Values<JObject>().Where(m => m["user"].Value<string>() == zUser).FirstOrDefault();
				json = new JObject();
				if (match == null)
				{
					///////////////// Wrong username /////////////////	
					json.failUser = "Incorrect username";
				}
				else if (match["password"].ToString() != zPassword)
				{
					///////////////// Wrong PW /////////////////		
					json.failPW = "Incorrect password";
				}
				else
				{
					///////////////// User and password correct /////////////////		
					zKey = match["key"].ToString();
					fnLogin(zUser, 4, zKey, match["fPerm"].ToString(),zclient,"wal");
					if (zRememberme == "true") {
						My.setCookie("userkey", zKey);
						My.setCookie("client", zclient);
					}
					json.sucsess = "User OK.";
				}
				///////////////// Write back and stop presenting login /////////////////		
				Response.Write(json.ToString());
				Response.End();
			}
		}
		else {
			///////////////// No user action, try login by cookie /////////////////
			if (zKey != "")
			{
				///////////////// Client-side cookie exists /////////////////		 
				JObject match = jo["Users"].Values<JObject>().Where(m => m["key"].Value<string>() == zKey).FirstOrDefault();
				if (match != null)
				{
					///////////////// Client-side cookie matches the server expected /////////////////	
					///////////////// Auto-login and redirect /////////////////	
					fnLogin(match["user"].ToString(), 4, zKey, match["fPerm"].ToString(), My.getCookie("client"), "wal");
					Response.Redirect("wal/Default.aspx?auto=" + Session["username"] + "_" + Session["userLevel"] + "_" + zKey);
				}
			}
		}
		///////////////// No usefull cookie found, continue and show login /////////////////
	}


	public static void fnLogin(string username, Int16 userLevel, string userkey, string fPerm, string client, string sys)
	{
		DataTable dt = ldb.ldbToDt(string.Format("select theme from users where user = '{0}'", username));
		HttpContext.Current.Session["theme"] = dt.Rows[0][0].ToString();
		HttpContext.Current.Session["username"] = username;
		HttpContext.Current.Session["userLevel"] = userLevel;
		HttpContext.Current.Session["userkey"] = userkey;
		HttpContext.Current.Session["fPerm"] = fPerm;
		HttpContext.Current.Session["client"] = client;
		HttpContext.Current.Session["sys"] = sys;
		createUserCatalog(username);
	}

	public static void createUserCatalog(string username)
	{
		string APPL_PHYSICAL_PATH = HttpContext.Current.Request.ServerVariables["APPL_PHYSICAL_PATH"];
		string zFolder = APPL_PHYSICAL_PATH + @"user\" + username;
		try
		{
			System.IO.Directory.CreateDirectory(zFolder);
			System.IO.Directory.CreateDirectory(zFolder + @"\download");
		}
		catch
		{
			My.print("error writing to " + zFolder);
		}
	}
	public static string message()
	{
		string zRet = "";
		string zMessage = My.getParam("reason");
		switch (zMessage)
		{
			case "time_out":
				zRet = "You were automatically signed out due to inactivity.";
				break;
			case "manual":
				zRet = "";
				break;
		}
		return zRet;
	}

}