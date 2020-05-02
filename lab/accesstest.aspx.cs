using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.OleDb;
using System.Data;
using Common;

public partial class lab_accesstest : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        DataTable dt = ldb.ldbToDt("SELECT * FROM users");
        My.print(My.dtToHtmlTable(dt));
    }
}