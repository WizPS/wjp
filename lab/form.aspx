<%@ Page Language="C#" AutoEventWireup="true" CodeFile="form.aspx.cs" Inherits="lab_form" %>
    <script>
        function submitForm() {
            using(['form', 'messager'], function () {
                $.messager.progress();
                $('#ff').form('submit', {
                    url: 'lab/form_submit.aspx'
                    , queryParams: { payload: JSON.stringify({ form: $('#ff').serializeArray(), view:'curr.currency_rate_ppl',type:'add' })}
                    , onSubmit: function () {
                        var isValid = $(this).form('validate');
                        if (!isValid) {
                            $.messager.progress('close');
                            return false;
                        }
                    }
                    , success: function (data) {
                        data = JSON.parse(data);
                        $.messager.progress('close');
                        if (data.success) {
                            $('#ff').closest('.window-body').panel('close');
                            msg("Successfully saved", "Successfully saved " + data.records_affected + " rows. New id: " + data.new_id);
                            <%=postActions()%>
                        } else {
                            msg("Error when saved", "Error:<br>" + data.errorMsg);
                        }
                        
                    }
                    , onLoadError: function () { alert('error');}
                });
            });
        }
        function clearForm() {
            using('form', function () {
                $('#ff').form('clear');
            });
        }
        function cancelForm() {
            $('#ff').closest('.window-body').panel('close');
        }
        

    </script>

