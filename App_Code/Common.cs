using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Common
{

	public class My
	{
		public static string DoStuff()
		{
			return ("I'm doing something....");
		}

		public static string dtToJson(DataTable table)
		{
			string JSONString = string.Empty;
			JSONString = JsonConvert.SerializeObject(table);
			return JSONString;
		}

		public static string getSqlMainFr2012(string iTable, string iSchema, string iSelect = "*", string iSort = "", string iOrder = "", string iPage = "1", string iRows = "10", string iWhere = "")
		{
			string zOrderBy = "";
			if (iPage == null || iPage == "") iPage = "1"; if (iRows == null || iRows == "") iRows = "10";
			if (iSort != "")
			{
				string[] arrSort = iSort.Split(','); string[] arrOrder = iOrder.Split(',');
				for (int i = 0; i < arrSort.Length; i++)
				{
					string order = "";
					if (arrOrder.Length > i) { order = arrOrder[i]; }
					zOrderBy += string.Format(",[{0}] {1}", arrSort[i], order);
				}
				zOrderBy = zOrderBy.Substring(1);
			}
			else { iSort = "1"; iOrder = "desc"; zOrderBy = "1 desc"; }


			int zOffset = (Int32.Parse(iPage) - 1) * Int32.Parse(iRows);
			string zSql = string.Format("SELECT {0} FROM [{1}].[{2}] {6} ORDER BY {3} OFFSET {4} ROWS FETCH NEXT {5} ROWS ONLY ;"
				 , iSelect   // 0: SELECT
				 , iSchema     // 1: SCHEMA
				 , iTable    // 2: FROM
				 , zOrderBy     // 3: ORDER BY
				 , zOffset   // 4: OFFSET
				 , iRows     // 5: FETCH NEXT
				 , iWhere    // 6: WHERE
				 );
			return (zSql);
		}

		public static string getApplication(string iVariable)
		{
			return string.Format("{0}", @"C:\inetpub\wwwroot\dba\");
		}

		public static string dtToHtmlTable(DataTable iDT)
		{
			if (iDT == null) return "";
			string guid = Guid.NewGuid().ToString().Substring(0, 8);
			// <table id="dg" style="width: 700px; height: auto; border: 1px solid #ccc;">
			string html = @"
            <table id='" + guid + "' border='1'><thead><tr><th colspan=" + iDT.Columns.Count + @">" + iDT.TableName + @"</th></tr></thead><thead>";
			//add header row
			html += @"
                <tr>";
			for (int i = 0; i < iDT.Columns.Count; i++)
			{
				html += string.Format(@"
                    <th data-options=""field: '{0}'"">{0}</th>", iDT.Columns[i].ColumnName);
			}
			html += @"
                </tr></thead><tbody>";
			//add rows
			for (int i = 0; i < iDT.Rows.Count; i++)
			{
				html += @"
                <tr class_='datagrid-row'>";
				for (int j = 0; j < iDT.Columns.Count; j++)
					html += @"
                    <td nowrap>" + iDT.Rows[i][j].ToString() + "</td>";
				html += @"
                </tr>";
			}
			html += @"
            </tbody></table>";
			html += @"
            <script>
					$('#" + guid + @"').datagrid();
				</script>";
			return html;
		}

		public static string getDbServer(string iCon = "")
		{
			string zRet = "";
			try { 
				zRet = getDbConnString(getMachineName() + "_PricingService");
				return zRet.Substring(7, 10);
			}
			catch {
				return "non";
			}
			// Server=SELUWS2252;Database=PricingService;User Id=PricingService;Password=5pK#TExFi6;
		}

		public static string getMachineName()
		{
			string zMachineName = System.Environment.MachineName;
			if (zMachineName.Substring(0, 2) == "RD")
			{
				zMachineName = "AZURE";
			}
			return zMachineName;
		}


		public static string getParam(string iParam, string iType = "A", string iDefault = "")
		{
			string zRet = "";
			string zRetF = HttpContext.Current.Request.Form[iParam];
			// HttpContext.Current.Request.QueryString[iParam];
			string zRetQ = HttpUtility.ParseQueryString(new Uri(HttpContext.Current.Request.Url.AbsoluteUri).Query).Get(iParam);
			// HttpUtility.ParseQueryString(new Uri(HttpContext.Current.Request.Url.AbsolutePath + "?aa=1234").Query).Get(iParam);
			switch (iType)
			{
				case "F":
					zRet = zRetF;
					break;
				case "Q":
					zRet = zRetQ;
					break;
				default:
					zRet = zRetF + zRetQ;
					// if (zRetF != "") zRet = zRetF;
					// else if (zRetQ != "") zRet = zRetQ;
					break;
			}
			if (zRet == null) zRet = "";

			if (zRet == "") zRet = iDefault;
			// My.log("Type="+ iType + " and par="+ iParam + " and result=" + zRet, " Form=" + zRetF + " Query=" + zRetF);
			return (zRet);
		}

		public static string addWhere(string iWhere, string iAddWhere)
		{
			string zRet = "";
			if (iWhere.Length > 2) zRet = iWhere;
			if (iAddWhere.Length > 2)
			{
				if (iWhere != "")
				{
					zRet = string.Format("{0} AND({1})", iWhere, iAddWhere);
				}
				else
				{
					zRet = string.Format(" WHERE{0}", iAddWhere);
				}
			}
			return (zRet);
		}


		public static string jsonFieldsToWhere2(string iJson)
		{
			if (iJson == "undefined" || iJson.Length < 1) { return ""; }
			string zRet = "";
			string zOp = "=";

			JArray oJson = JArray.Parse(iJson);
			foreach (var item in oJson)
			{
				// My.print(item["value"].ToString());
				string zValue = item["value"].ToString();
				string zOpText = item["op"].ToString();
				string zIsOr = "";
				if (item["isOR"]!=null) zIsOr = item["isOR"].ToString();
				if (zValue == "") { continue; }

				string zRetP = "";

				if (zValue == "[null]")
				{
					zRetP += "[" + item["	"] + "]IS NULL ";
				}
				else if (zValue == "[blank]")
				{
					zRetP += "[" + item["field"] + "]=''";
				}
				else
				{
					// less(<),greater(>),equal(=),lessorequal(<=),greaterorequal(>=),notequal(<>),beginwith(.*),endwith(*.),contains,pup,pdn,iup,idn,gup,gdn
					string inline_opp = "";
					if (zValue.Length >=3 && "pup,pdn,iup,idn,gup,gdn".IndexOf(zValue.Substring(0, 3)) > -1) {
						inline_opp = zValue.Substring(0, 3);zValue = zValue.Substring(3);
					}
					else if (zValue.Length >= 2 && "<=,>=,<>".IndexOf(zValue.Substring(0, 2)) > -1) {
						inline_opp = zValue.Substring(0, 2);zValue = zValue.Substring(2);
					}
					else if (zValue.Length >= 1 && "<>=".IndexOf(zValue.Substring(0, 1)) > -1) {
						inline_opp = zValue.Substring(0, 1);zValue = zValue.Substring(1);
					}
					if (zValue.Length == 0) return "";
					switch (inline_opp)
					{
						case "<":zOpText = "less";break;
						case ">":zOpText = "greater";break;
						case "=":zOpText = "equal";break;
						case "<=":zOpText = "lessorequal";break;
						case ">=":zOpText = "greaterorequal";break;
						case "<>":zOpText = "notequal";break;
						case "pup":zOpText = "pup";break;
						case "pdn":zOpText = "pdn";break;
						case "iup":zOpText = "iup";break;
						case "idn":zOpText = "idn";break;
						case "gup":zOpText = "gup";break;
						case "gdn":zOpText = "gdn";break;
						case "sql": zOpText = "sql"; break;
					}
					switch (zOpText)
					{
						case "greater": zOp = ">"; break;
						case "greaterorequal": zOp = ">="; break;
						case "less": zOp = "<"; break;
						case "lessorequal": zOp = "<="; break;
						case "notequal": zOp = "<>"; break;
						case "equal": zOp = "="; break;
						case "in": zOp = "IN"; break;
					}

					//if (zValue.Split(';').Length>1) { My.print("Muuuuuuuuuuuulti items"); }
					
					foreach (string arrValue in zValue.Split(',')) {
						// zRetP += "OR";
						string zRetPP = "";

						if (zOpText == "contains")
						{
							if (arrValue.IndexOf("*") > -1)
								zRetPP += "[" + item["field"] + "]like'" + arrValue.Replace("*", "%") + "'";
							else
								zRetPP += "[" + item["field"] + "]like'%" + arrValue.Replace("*", "%") + "%'";
						} // zRetPP += "[" + item["field"] + "]" + zOp + "'" + arrValue + "'";
						else if (zOpText == "equal")
						{
							if (arrValue.IndexOf("*") > -1)
								zRetPP += "[" + item["field"] + "]like'" + arrValue.Replace("*", "%") + "'";
							else
								zRetPP += "[" + item["field"] + "]='" + arrValue + "'";
						}
						else if (zOpText == "beginwith")
						{
							zRetPP += "[" + item["field"] + "]like'" + arrValue + "%'";
						}
						else if (zOpText == "endwith")
						{
							zRetPP += "[" + item["field"] + "]like'%" + arrValue + "'";
						}
						else if (zOpText == "in")
						{
							zRetPP += "[" + item["field"] + "]IN('" + arrValue.Replace(",", "','") + "')";
						}
						else if (zOpText == "pup")
						{
							zRetPP += "[" + item["field"] + "]IN(select down_code from [service_guidelines].[v_climb_product] where up_code = '" + arrValue + "')";
						}
						else if (zOpText == "pdn")
						{
							zRetPP += "[" + item["field"] + "]IN(select up_code from [service_guidelines].[v_climb_product] where down_code = '" + arrValue + "')";
						}
						else if (zOpText == "wildcard")
						{
							zRetPP += "[" + item["field"] + "]like'" + arrValue.Replace("*", "%") + "'";
						}
						else if (zOpText == "sql")
						{
							zRetPP += "[" + item["field"] + "]"+ arrValue;
						}
						else
						{
							zRetPP += "[" + item["field"] + "]" + zOp + "'" + arrValue + "'";
						}
						zRetP += "OR"+ zRetPP ;
					}
					zRetP = zRetP.Substring(2);
				}
				if (zRetP.Length > 2) { zRetP = zRetP.Substring(0); }
				if (zIsOr == "true") { zRet += " OR(" + zRetP + ")"; } else{ zRet += "AND(" + zRetP + ")"; }   
			}
			if (zRet.Length > 2) { zRet = zRet.Substring(3); }
			// My.print(zRet); return "";
			return zRet;
		}

		public static System.Data.DataSet dbReadSet(string iSQL, string iConn)
		{
			// string zSwitch = getSystemName();
			// My.print(iConn); 
			// My.log(iSQL, iConn);

			using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection())
			{
				if (iSQL == null || iSQL == "")
				{
					logError("Warning in dbRead", "NULL value in SQL string");
					// My.print("Warning in dbRead, NULL value in SQL string");
					return null;
				}
				else if (iSQL.ToLower().Contains("insert into") || iSQL.ToLower().Contains("u_pdate") || iSQL.ToLower().Contains("delete"))
				{
					logError("Warning in dbRead: Use dbCUD instead.", iSQL);
				}

				conn.ConnectionString = getDbConnString(iConn);
				conn.Open();
				System.Data.SqlClient.SqlCommand command = new System.Data.SqlClient.SqlCommand(iSQL, conn);
				System.Data.SqlClient.SqlDataAdapter da = new System.Data.SqlClient.SqlDataAdapter(command);
				System.Data.DataSet dataSet = new System.Data.DataSet();
				try
				{
					da.Fill(dataSet);
					return dataSet;
				}
				catch (Exception ex)
				{
					My.logError("Error in dbReadSet:" + iSQL, ex.Message);
					// My.print(ex.Message);
					// return (My.dbReadSet("select " + My.toSql("error: " + ex.Message) + " as ERROR"));
					throw new System.InvalidOperationException("dbReadSet error using: '" + iConn + "'\n\nFor sql: '" + iSQL + "' \n\n Error is:'" + ex + "'");
				}
				finally
				{
					if (conn != null)
						conn.Dispose();

					if (command != null)
						command.Dispose();
				}
			}
		}


		public static string logError(string iError, string iContext)
		{

			if (iError.Length > 199) iError = iError.Substring(0, 199);
			if (iContext.Length > 49) iContext = iContext.Substring(0, 49);
			// avoid looping error when logging errors if table not exists
			// 2018-10-04 Errorlogging turned off to not create loop with dbCudErrpr
			// dbCUD("IF OBJECT_ID('dbo.sError', 'U') IS NOT NULL insert into [sError] ([error],[context]) values (" + toSql(iError) + "," + toSql(iContext) + ");");
			setSession("ping", "errrr");
			// addPing("iError:iContext");
			return "";

		}

		public static string getDbConnString(string iCon)
		{
			string zRet = "";
			string zCon = iCon;
			if (zCon == "") zCon = getSystemName();

			try { zRet = ConfigurationManager.ConnectionStrings[zCon].ConnectionString; }
			catch (Exception ex)
			{
				throw new System.InvalidOperationException("getDbConnString could not find connection-string for: '" + zCon + "'\n\nRequest string was: '"+iCon+ "'\n\nError is:'" + ex + "'");
			}

			return zRet;
		}


		public static int dbExec(string iSQL = "", string iCon = "")
		{
			string zSql = iSQL;
			int zRet = 0;

			////////////////////////////   Validate  the SQL statement  ////////////////////////////
			if (zSql == "")
			{
				zSql = "SELECT 'No SQL provided.' as 'Method dbRead says'";
			}

			string CS = getDbConnString(iCon);
			SqlConnection con = new SqlConnection(CS);
			using (con)
			{
				con.Open();
				SqlCommand cmd = new SqlCommand(zSql, con);
				zRet = cmd.ExecuteNonQuery();
			}
			return zRet;
		}

		public static DataTable dbRead(string iSQL, string iCon)
		{
			string zSql = iSQL;

			////////////////////////////   Validate  the SQL statement  ////////////////////////////
			if (zSql == "")
			{
				zSql = "SELECT 'No SQL provided.' as 'Method dbRead says'";
			}
			else if (zSql.ToLower().Contains("u__pdate") || zSql.ToLower().Contains("i_nsert into") || zSql.ToLower().Contains("d_elete") || zSql.ToLower().Contains("--"))
			{
				logError("Warning in dbRead: Use dbCUD instead.", iSQL);
				zSql = "SELECT 'SQL violation error!!' as 'Method dbRead says'";
			}

			string CS = getDbConnString(iCon);
			SqlConnection con = new SqlConnection(CS);

			try
			{
				con.Open();
				SqlCommand cmd = new SqlCommand(zSql, con);
				// My.log(zSql);
				DataTable dt = new DataTable();
				using (SqlDataReader rdr = cmd.ExecuteReader())
				{
					dt.Load(rdr);
				}
				return dt;
			}
			catch (Exception ex)
			{
				// logError("Error in dbRead:" + zSql + " Connection: " + iCon, ex.Message); // CAN NOT LOG WHEN CONNECTION PROBLEM
				// My.print(ex.Message);
				/*
				DataTable dtErr = new DataTable();
				dtErr.Columns.Add("Error", typeof(String));
				dtErr.Rows.Add();
				dtErr.Rows[0]["Error"] = "Error in dbRead: SQL=" + zSql + " ERROR=" + ex.Message;
				//return (My.dbRead("select " + My.toSql("error: " + ex.Message) + " as ERROR"));
				return dtErr;
				*/
				throw new System.InvalidOperationException("dbRead error using: '" + iCon + "'\n\nFor sql: '" + zSql + "' \n\nError is: '" + ex + "'");
			}
			finally
			{
				con.Close();
			}
		}


		public static string toSql(string iText, string iType = "Text")
		{
			decimal myDec;
			if (iText == null) return "NULL";
			if (iText.ToLower() == "null") return "NULL";
			if (iText.ToLower() == "''") return "NULL";
			if (iText == "") return "NULL";
			if (iType.ToLower().Contains("num"))
			{
				if (decimal.TryParse(iText, out myDec))
					return (iText.Replace(",", "."));
				else
					return "null";
			}
			else
			{
				if (iText == "")
					return "''";
				else
					return "'" + iText.Replace("'", "''").Replace("/", "/") + "'";
			}
		}

		public static void setSession(string iSession, string iValue)
		{
			try
			{
				if (iValue != null) HttpContext.Current.Session[iSession] = iValue;
				// zRet = HttpContext.Current.Session[iSession].ToString();
			}
			catch { }
		}

		public static string getSession(string iSession)
		{
			string zRet = "";
			try
			{
				zRet = HttpContext.Current.Session[iSession].ToString();
			}
			catch { }
			return (zRet);
		}

		public static string getSystemName()
		{
			/*
			 * syntax   [computer]_[site] for DB lookup
			 *          ASUS_jp-racing (localhost/jp-racing/system/)
			 *          SELULT4165_jp-new (localhost/jp-racing/system/)
			 *          AZURE_jp-new  (jp-new.azurewebsites.net/system/)
			 *          Shall match web.config configuration.connectionStrings name-tag
			 */

			string zMachineName = getMachineName();
			string zSite = "";
			if (zMachineName == "AZURE")
			{
				zSite = System.Web.Hosting.HostingEnvironment.ApplicationHost.GetSiteName();
			}
			else
			{
				zSite = System.Web.HttpRuntime.AppDomainAppVirtualPath;
				if (zSite.Substring(0, 4) == "/pg/")
					zSite = zSite.Substring(4);
				else
					zSite = zSite.Substring(1);
			}
			return zMachineName + "_" + zSite;
		}



		public static string print(string iDescription = "", string iText = "")
		{
			if (iText == "")
			{
				HttpContext.Current.Response.Write(iDescription);
			}
			else
			{
				HttpContext.Current.Response.Write("Print: ");
				HttpContext.Current.Response.Write(iDescription);
				HttpContext.Current.Response.Write(": ");
				HttpContext.Current.Response.Write(iText);
				HttpContext.Current.Response.Write("<br>");
			}
			return null;
		}


		public static string oToJson(Object ds)
		{
			return JsonConvert.SerializeObject(ds, Formatting.None);
		}
		public static string getCookie(string iKey)
		{
			string zRet = string.Empty;
			if (HttpContext.Current.Request.Cookies[iKey] != null)
				zRet = HttpContext.Current.Request.Cookies[iKey].Value;
			return (zRet);
		}

		public static void setCookie(string iKey, string iValue = "")
		{
			// HttpContext.Current.Response.Cookies["User"][iKey] = iValue;
			HttpContext.Current.Response.Cookies[iKey].Value = iValue;
			HttpContext.Current.Response.Cookies[iKey].Expires = DateTime.Now.AddDays(1);
		}

		public static void log(string iText1, string iText2 = "", string conn = "")
		{
			if (conn == "") { conn = My.getMachineName() + "_PricingService"; }
			string zText1 = "null"; string zText2 = "null";
			if (iText1 != null) if (iText1.Length > 999) zText1 = iText1.Substring(0, 990); else zText1 = iText1;
			if (iText2 != null) if (iText2.Length > 1999) zText2 = iText2.Substring(0, 990); else zText2 = iText2;
			dbCUD("IF OBJECT_ID('dbo.sLog', 'U') IS NOT NULL insert into [sLog] ([text1],[text2]) values (" + toSql(zText1) + "," + toSql(zText2) + ")", conn);

		}
		public static JObject dbCUD(string iSQL, string iCon = "")
		{
			// where iReturn for rows affected is 1 and identity is 2
			// ExecuteReader returns a reader object. 
			// ExecuteNonQuery returns the number of rows affected
			// ExecuteScalar returns a scalar object.
			// Return format like { "success" : true } or { "success" : true, "rows":2 , "identity":12321 } or { "success":false,"errorMsg":"The xxxx."}

			////////////////////////////   Validate  the SQL statement  ////////////////////////////
			JObject json = new JObject();
			if (iSQL == "")
			{
				logError("Warning - dbCUD says", "Empty statement!");
				json["success"] = false;
				json["errorMsg"] = "Empty statement";
				json["debug"] = "";
				return json;

			}
			else if (iSQL.ToLower().Contains("--"))
			{
				logError("Warning - dbCUD says Violation", "Injection warning: " + iSQL);
				json["success"] = false;
				json["errorMsg"] = "Injection warning";
				json["debug"] = "";
				return json;

			}


			////////////////////////////   Validating  the connection object  ////////////////////////////
			string CS = getDbConnString(iCon);
			SqlConnection con = new SqlConnection(CS);
			try
			{
				string new_id = "";
				int RecordsAffected = -1;
				SqlCommand cmd = new SqlCommand();
				cmd.CommandText = iSQL + "; SELECT SCOPE_IDENTITY() As NewID;";

				cmd.Connection = con;
				con.Open();

				using (SqlDataReader rdr = cmd.ExecuteReader())
				{
					if (rdr.HasRows)
					{
						rdr.Read();
						new_id = rdr["NewID"].ToString();
						RecordsAffected = rdr.RecordsAffected;
					}
				}

				json["success"] = true;
				json["records_affected"] = RecordsAffected;
				json["new_id"] = new_id;
				//json.respond = Newtonsoft.Json.JsonConvert.DeserializeObject(JsonConvert.SerializeObject(ds.Tables[3])); ;
				json["debug"] = iSQL;
				return json;

			}
			catch (Exception ex)
			{
				logError("Error - dbCUD says" + iSQL, ex.Message);
				json["success"] = false;
				json["errorMsg"] = ex.Message.Replace("\"", "").Replace(System.Environment.NewLine, "");
				json["debug"] = iSQL;
				return json;
				// throw new System.InvalidOperationException("dbLookup problem connecting using '" + iCon + "' \n\n" + ex);

			}
			finally
			{
				con.Close();
			}
		}

	}
}
