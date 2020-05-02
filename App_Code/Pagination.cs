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

	public class Pg
	{
		public static string DoStuff()
		{
			return ("I'm doing something....");
		}

		public static string pagination(string view, string page = "", string rows = "", string sort = "", string order = "", string q = "", string filterRules = "", string preFilter = "")
		{
			/************************  Description ************************/
			// listen to easyui pagination and datagrid standard
			// returns: { rows:[{id:12,name:"a1"},{id:13,name:"a2"}], total:6, debug:""}

			/************************  Input's ************************/
			// here 

			/************************  Set stuff ************************/
			string zSql = "";
			string zSelect = "*";
			string zKeyField = "";
			string zSchema = view.Split('.')[0];
			string zTable = view.Split('.')[1];
			if (view.Split('.').Length>2) { zKeyField = view.Split('.')[2]; }
			string zWhere = "";
			
			string zConn = My.getMachineName() + "_pricingService";
			JObject jo = new JObject();
			jo["zKeyField"] = zKeyField;

			/************************  Check stuff ************************/
			if (rows == "") { rows = "50"; }
			if (order==""){ order = "1"; }
			if (zKeyField!="" && q !="") { zWhere = My.addWhere(zWhere,string.Format("[{0}] like '{1}%'", zKeyField, q)); }
			zWhere = My.addWhere(zWhere, My.jsonFieldsToWhere2(filterRules));
			jo["filterRules"] = filterRules;

			/************************  Do stuff ************************/
			jo["q"] = q;
			int zOffset = (Int32.Parse(page) - 1) * Int32.Parse(rows);
			zSql = "SELECT {0} FROM [{1}].[{2}] {7} ORDER BY {3} {4} OFFSET {5} ROWS FETCH NEXT {6} ROWS ONLY ;SELECT COUNT(*) FROM [{1}].[{2}] {7};";
			zSql += "SELECT COLUMN_NAME as field, COLUMN_NAME as title, len(COLUMN_NAME)*7+30 as width from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA='{1}' AND TABLE_NAME = '{2}' ;";
			zSql = string.Format(zSql
				, zSelect   // 0: SELECT
				 , zSchema     // 1: SCHEMA
				 , zTable    // 2: FROM
				 , sort     // 3: ORDER BY
				 , order    // 4: ORDER BY
				 , zOffset   // 5: OFFSET
				 , rows     // 6: FETCH NEXT
				 , zWhere    // 7: WHERE
				 );

			// return (zSql);

			DataSet ds = My.dbReadSet(zSql, zConn);
			jo["rows"] = JArray.Parse(My.oToJson(ds.Tables[0]));
			jo["total"] = ds.Tables[1].Rows[0][0].ToString();
			jo["columns"] = JArray.Parse("[" + My.oToJson(ds.Tables[2]) + "]");
			jo["zSql"] = zSql;
			return jo.ToString();

		}
	}
}
