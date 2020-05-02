using Common;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class lab_form_submit : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string zSql = "";
        string columns = "";
        string values = "";
        string payload = My.getParam("payload");
        JObject joPayload = JObject.Parse(payload);
        string view = string.Format("{0}", joPayload["view"]);
        string form = string.Format("{0}", joPayload["form"]);
        string type = string.Format("{0}", joPayload["type"]);

        switch (type) {
            case "add":
                JArray jaForm = JArray.Parse(form);
                foreach (JObject jo in jaForm)
                {
                    columns += string.Format(",[{0}]", jo["name"]);
                    values += string.Format(",'{0}'", jo["value"]);
                }
                if (columns.Length > 2) { columns = columns.Substring(1); values = values.Substring(1); }
                zSql = string.Format("INSERT INTO {0} ({1}) VALUES ({2})", view, columns, values);
                break;
        }
        string zConnection = My.getMachineName() + "_PricingService";
        JObject res = My.dbCUD(zSql, zConnection);
        My.print(res.ToString());
    }
}