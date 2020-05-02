using System;
using System.Data;
using System.Data.OleDb;

namespace Common
{

	public class ldb
	{
		public static string DoStuff()
		{
            return ("I'm doing something....");
		}

        public static DataTable ldbToDt(string strSQL)
        {
            var f_path = AppDomain.CurrentDomain.BaseDirectory + @"\App_Data\wal\local.accdb";

            // string connectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + f_path;
            string connectionString = @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + f_path;
            DataTable dt = new DataTable();
            using (OleDbConnection conn = new OleDbConnection(connectionString))
            {
                OleDbCommand cmd = new OleDbCommand(strSQL, conn);
                conn.Open();
                OleDbDataAdapter adapter = new OleDbDataAdapter(cmd);
                adapter.Fill(dt);
                conn.Close();
            }
            return dt;
        }
	}
}
