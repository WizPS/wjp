
function testUserSettings(dg, obj) {
    var controles = [
        { type: 'textbox', name: "Name", required: true }
        , { type: 'textbox', name: "Email" }
        , { type: 'textbox', name: "Phone" }
        , { type: 'filebox', name: "File" }
        , { type: 'passwordbox', name: "Password", prompt: 'Password', xshowEye: true }
        , { type: 'combo', name: "Combo" }
        , { type: 'combobox', name: "Combobox", _url: 'combobox_data.json', valueField: 'id', textField: 'text' }
        , { type: 'datebox', name: "Datebox" }
        , { type: 'slider', name: "Slider", mode: 'v', tipFormatter: function (value) { return value + '%'; } }
        , { type: 'checkbox', name: "Checkbox", value: 'Apple', checked: true }
        , { type: 'radiobutton', name: "Radiobutton", value: 'Apple', checked: true }
        , { type: 'timepicker', name: "Timepicker" }
        , { type: 'linkbutton', iconCls: 'icon-ok', text: 'OK', height: 30, onClick: function () { msg("OK", "OK") } }
    ];

    var $cont = $('<form/>', { id: 'fff', style: 'padding: 10px 10px 10px 10px;' });

    $.each(controles, function (i, o) {
        using(o.type, function () {
            $('<span/>', { id: 'ff' + i }).appendTo($('<div/>', { style: 'padding: 5px 15px 0px 15px;' }).appendTo($cont))[o.type]($.extend({ width: "100%", label: o.name }, o))
        });
    });

    web_part_page({
        id: 'testUserSettings933'
        , title: 'User settings'
        , destroy: false
        , window: true
        , height: 400
        , width: 300
        , modal: false
        , content: $cont
    });

    /*
    $('body').append($('<div/>', { id: 'win_' }));
    using('window', function () {
        $('#win_').window({ title: 'Test js form', width: 300, height: 400, content: $cont });
    });	
    */
}

function userSettings(dg, obj) {
    var theme = ['black', 'bootstrap', 'default', 'gray', 'material', 'material-blue', 'material-teal', 'metro', 'metro-blue', 'metro-gray', 'metro-green', 'metro-orange', 'metro-red', 'ui-cupertino', 'ui-dark-hive', 'ui-pepper-grinder', 'ui-sunny'];
    var data = []; $.each(theme, function (i, o) { data.push({ value: o, text: o }); });
    var controles = [
        {
            type: 'combobox', name: "Theme", panelHeight: 200, value: $zBody.data('theme'), data: data, onChange: function (newValue, oldValue) {
                $('#theme_style').attr('href', 'easyui/themes/' + newValue + '/easyui.css');
                $zBody.data('theme', newValue);
                ldbs({ field: 'users.theme', action: 'set', value: newValue});
            }
        }
    ];

    var $cont = $('<form/>', { id: 'fff', style: 'padding: 10px 10px 10px 10px;' });

    $.each(controles, function (i, o) {
        using(o.type, function () {
            $('<span/>', { id: 'ff' + i }).appendTo($('<div/>', { style: 'padding: 5px 15px 0px 15px;' }).appendTo($cont))[o.type]($.extend({ width: "100%", label: o.name }, o))
        });
    });

    web_part_page({
        id: 'usersett933'
        , title: 'User settings'
        , destroy: false
        , window: true
        , height: 200
        , width: 300
        , modal: false
        , content: $cont
    });

    /*
    $('body').append($('<div/>', { id: 'win_' }));
    using('window', function () {
        $('#win_').window({ title: 'Test js form', width: 300, height: 400, content: $cont });
    });	
    */
}
function server_disk_capasity() {
    web_part_page({
        id: 'server_disk_capasity238'
        , title: 'Server Disk space'
        , window: true
        , modal: false
        , plugin: 'layout'
        , plugincontent: [{
            plugin: 'datagrid'
            , title: ''
            , plugincontent: {
                dataSet: {
                    noEdit: true
                    , view: 'SELUWS2252.master.dbo.v_disc_space'
                }
            }
        }, {}]
    });
}

function ppl_changes(dg, obj) {
    var row = dg.datagrid('getSelected');
    web_part_page({
        window: true, destroy: true, width: 800, id: 'PPL_changes7643', title: 'PPL-changes', plugin: 'layout', plugincontent: [{
            region: 'west', id: 'dbo_ppl_hist8354', title: '', width: '50%', plugin: 'datagrid', plugincontent: {
                dataSet: {
                    noEdit: true
                    , view: 'SELUWS2252.PSHub.gim.ppl_hist'
                    , preFilter: [{ field: 'GLOBAL_TIPAITID', op: 'equal', value: row[obj.key] }]
                    , showColumns: [
                        { field: 'GLOBAL_TIPAITID', title: 'Item      ' }
                        , { field: 'FROM_DATE', title: 'From      ' }
                        , { field: 'TIPRICE', title: 'PPL    ' }
                        , { field: 'TICURR', title: 'Curr' }

                    ]
                }
            }
        }, {
            region: 'center', id: 'chartjs_8709', title: '', plugin: 'chartjs'
            , data: {
                "labels": ["2019-11-15", "2020-01-02", "2020-01-08", "2020-01-16", "2020-01-21"],
                "datasets": [
                    {
                        "label": "PPL",
                        "data": [3847.54, 3760.07, 3650.55, 3584.19, 3122.07]
                    }, {
                        "label": "Net-price",
                        "data": [3200, 2900, 3000, 2900, 2800]
                    }, {
                        "label": "Sales",
                        "data": [4300, 4200, 4400, 4250, 4200]
                    }
                ]
            }
        }]
    });
}

function my_data(value, stDev) {
    var $labels = []; var $data = [];
    var devPrc = (1 - value / (value + stDev));
    // console.log(devPrc);
    for (i = -5; i <= 5; i++) {
        var y = Math.exp(i) / Math.pow((1 + Math.exp(i)), 2);
        $data.push(y);
        var factor = 1 - (i * devPrc);
        // console.log(factor);
        $labels.push((value * factor).toFixed(2));
    }
    $labels = $labels.reverse();
    return {
        labels: [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2800, 3000, 3200]
        , labels: $labels
        , datasets: [
            {
                label: "Price",
                data: $data
            }
        ]
    };
}

function pat_sales(dg, obj) {
    var row = dg.datagrid('getSelected');
    web_part_page({
        width: 1000, height: 500, id: 'SELUWS2252_PSHub_pat_sales_328', destroy: true, window: true, title: 'Sales', plugin: 'layout', plugincontent: [{
            region: 'center', title: 'Orders', plugin: 'datagrid', plugincontent: {
                dataSet: {
                    noEdit: true
                    , view: 'SELUWS2252.PSHub.pat.sales'
                    , preFilter: [{ field: 'Item_No', op: 'equal', value: row[obj.key] }]
                    , showColumns: [
                        { field: 'Order_Date', title: 'Date    ' },
                        { field: 'Order_No', title: 'Order_No  ' },
                        { field: 'Order_Row_No', title: 'Row' },
                        { field: 'Order_Type', title: 'Type' },
                        { field: 'Customer_No', title: 'Customer' },
                        { field: 'Customer_Name', title: 'Name' },
                        { field: 'Item_No', title: 'Item_No  ' },
                        { field: 'Item_Name', title: 'Item_Name' },
                        // { field: 'Product_Unit_Full_Name', title: 'Product_Unit_Full_Name' },
                        // { field: 'Business_Unit_Full_Name', title: 'Business_Unit_Full_Name' },
                        // { field: 'Source_Country', title: 'S-Ctry' },
                        // { field: 'Source_Name', title: 'Source_Name' },
                        { field: 'Rec_Country', title: 'R-Ctry' },
                        // { field: 'Product_Code', title: 'Product' },
                        // { field: 'Product_Name', title: 'PName' },
                        { field: 'Scope_Code', title: 'Scope' },
                        // { field: 'Scope_Name', title: 'Scope_Name' },
                        // { field: 'application_code', title: 'application_code' },
                        // { field: 'application_name', title: 'application_name' },
                        // { field: 'channel_code', title: 'channel_code' },
                        // { field: 'channel_name', title: 'channel_name' },
                        // { field: 'Sales_Person', title: 'Sales_Person' },
                        { field: 'Qty', title: 'Qty' },
                        { field: 'PPL', title: 'PPL  ' },
                        { field: 'OR', title: 'OR   ' }
                        // { field: 'Base_Discount', title: 'Base_Discount' },
                        // { field: 'Customer_Discount', title: 'Customer_Discount' },
                        // { field: 'NSD', title: 'NSD' },
                        // { field: 'Transfer_Price_Euro', title: 'Transfer_Price_Euro' },
                        // { field: 'Factory_Cost', title: 'Factory_Cost' },
                        // { field: 'price_list_name', title: 'price_list_name' },
                        // { field: 'PPL_Flag', title: 'PPL_Flag' },
                        // { field: 'Currency_Type', title: 'Currency_Type' },
                        // { field: 'Loc_Currency_Code', title: 'Loc_Currency_Code' },
                        // { field: 'on', title: 'on' }
                    ]
                }
            }
        }, {
            region: 'east', width: '50%', plugin: 'tabs', title: 'Analytics'
            , plugincontent: {
                data: [{
                    plugin: 'chartjs', title: 'Volumes'
                    , data: {
                        "labels": ["2019-11-15", "2020-01-02", "2020-01-08", "2020-01-16", "2020-01-21"],
                        "datasets": [
                            {
                                "label": "PPL",
                                "data": [3847.54, 3760.07, 3650.55, 3584.19, 3122.07]
                            }, {
                                "label": "Net-price",
                                "data": [3200, 2900, 3000, 2900, 2800]
                            }, {
                                "label": "Sales",
                                "data": [4300, 4200, 4400, 4250, 4200]
                            }
                        ]
                    }
                }, {
                    plugin: 'chartjs', title: 'Price-spread'
                    , data: my_data(row.ltm_price, row.ltm_2s_dev)
                }]
            }
        }]
    });
}

function searchify(iin) {
    var ret = [];
    $.each(iin, function (i, o) {
        ret.push({ field: o.field, name: o.title, editor: { type: "validatebox", options: { required: false } } });
    });
    return ret;
}

function ask_gim() {
    web_part_page({
        window: true
        , title: '&nbsp;Ask Item Master (GIM)'
        , iconCls: 'student-small'
        , id: 'Ask_GIM094'
        , modal: false
        , width: 900
        , height: 500
        , plugin: 'layout'
        , plugincontent: [
            {
                region: 'west', width: 200, title: 'About', plugin: 'layout', plugincontent: [{
                    region: 'north', height: 400, plugin: 'propertygrid', title: '', id: 'search_324'
                    , plugincontent: {
                        showGroup: false
                        , fitColumns: true
                        , data: searchify(showColumns_GIM)
                        , footer: $('<div/>', { style: 'padding: 5px 5px 5px 5px;' }).append($('<div/>', { style: 'float:right;' }).linkbutton({
                            iconCls: 'icon-ok', text: 'OK', width: 70, onClick: function () {
                                var val = $('#search_324').propertygrid('getRows');
                                var ret = [];
                                $.each(val, function (i, o) {
                                    if (o.value) ret.push({ field: o.field, op: 'equal', value: o.value });
                                });
                                var dgG = $('#stg_GIM_GOLDEN_TI_87');
                                dgG.datagrid('options').queryParams.preFilter = JSON.stringify(ret);
                                dgG.datagrid('reload');
                                var dgL = $('#stg_GIM_LOCAL_TI_07');
                                dgL.datagrid('options').queryParams.preFilter = JSON.stringify(ret);
                                dgL.datagrid('reload');
                            }
                        }))
                    }
                }, {
                        region: 'center', title: '', content: '3287083366<br>3287083385<br>33500074911002<br>9639103001<br>174931193'
                }]
            }
            , {
                region: 'center', plugin: 'layout', title: ''
                , plugincontent: [
                    {
                        region: 'north', height: '50%', title: 'Global', plugin: 'datagrid', id: 'stg_GIM_GOLDEN_TI_87'
                        , plugincontent: {
                            dataSet: { view: 'SELUWS2252.PSHub.gim.GIM_GOLDEN_TI', noEdit: true, showColumns: showColumns_GIM }
                            , viewSet: { menu: [{ text: 'PPL-changes', iconCls: 'filter-small', function_name: 'ppl_changes', key: 'GLOBAL_TIPAITID' }, { text: 'Sales', iconCls: 'filter-small', function_name: 'pat_sales', key: 'GLOBAL_TIPAITID' }] }
                            , onLoadSuccess: function () {

                            }
                        }
                    }
                    , {
                        region: 'center', title: 'Local', plugin: 'datagrid', id: 'stg_GIM_LOCAL_TI_07'
                        , plugincontent: {
                            dataSet: {
                                view: 'SELUWS2252.PSHub.gim.GIM_LOCAL_TI', noEdit: true, showColumns: showColumns_GIM
                            }
                        }
                    }]
            }]
    });
}

function price_list_detail() {
    web_part_page({
        window: true
        , title: 'Price-list details'
        , id: 'Price_list_details2235'
        , modal: false
        , plugin: 'layout'
        , height: 1000
        , plugincontent: [{
            id: 'user_temp_product_market_discounts', title: 'Un-prioritized', region: 'center', plugin: 'datagrid'
            , plugincontent: {
                dataSet: {
                    view: 'user_temp.product_market_discounts'
                    , noEdit: true
                    , showColumns: [
                        { field: 'req_prod', title: 'prod' }
                        , { field: 'req_geo', title: 'geo' }
                        , { field: 'req_ind', title: 'ind' }
                        , { field: 'guideline', title: 'guideline' }
                        , { field: 'gui_prod', title: 'prod' }
                        , { field: 'gui_geo', title: 'geo' }
                        , { field: 'gui_ind', title: 'ind' }
                        , { field: 'up_lev_p', title: 'p' }
                        , { field: 'up_lev_g', title: 'g' }
                        , { field: 'up_lev_i', title: 'i' }
                        , { field: 'base_discount', title: 'base(%)' }
                        , { field: 'max_discount', title: 'max(%)' }
                    ]
                }
            }
        }, {
            id: 'user_temp_product_markets', title: 'Prioritized', region: 'south', height: '50%', plugin: 'datagrid'
            , plugincontent: {
                dataSet: {
                    view: 'user_temp.product_markets'
                    , noEdit: true
                    , showColumns: [
                        { field: 'req_prod', title: 'prod' }
                        , { field: 'req_geo', title: 'geo' }
                        , { field: 'req_ind', title: 'ind' }
                        , { field: 'guideline', title: 'guideline' }
                        , { field: 'gui_prod', title: 'prod' }
                        , { field: 'gui_geo', title: 'geo' }
                        , { field: 'gui_ind', title: 'ind' }
                        , { field: 'up_lev_p', title: 'p' }
                        , { field: 'up_lev_g', title: 'g' }
                        , { field: 'up_lev_i', title: 'i' }
                        , { field: 'base_discount', title: 'base(%)' }
                        , { field: 'max_discount', title: 'max(%)' }
                    ]
                }
            }
        }]
    });
}

function Test_9() {
    web_part_page({
        id: 'x123'
        , window: true
        , modal: false
        , plugin: 'layout'
        , plugincontent: [{
            plugin: 'datalist'
            , plugincontent: { id: 'a2313' }
        }, {}]
    });
}
function Test_10() {

    var controls = [
        { name: 'client', label: 'Client:', type: 'textbox', value: '100', editable: false, align: 'right' }
        , { name: 'currency_set', label: 'Currency-set:', type: 'textbox', editable: false, required: true, labelWidth: 100, value: '' }
        , { name: 'value', label: 'PPL-fx rate:', type: 'numberbox', precision: 8, required: true, value: '' }
        , { name: 'from_date', label: 'From-date:', type: 'datebox', required: true, iconAlign: 'left' }
        , { name: 'created_by', label: 'Created by:', type: 'textbox', required: true, value: $zBody.data("username"), editable: false }
    ];
    var $cont = $("<form/>", { id: "ff", method: "post", style: 'padding: 20px 20px;' });
    $.each(controls, function (i, o) {
        var options = $.extend({ style: 'width:200px;', class: "easyui-" + o.type, labelWidth: 80 }, o);
        $cont.append($("<div/>", { style: "margin-bottom:10px" }).append($('<input/>', options)));
    });
    var $btn = $("<div/>", { id: "ff", method: "post", style: 'text-align:center; padding: 5px' });
    $btn.append($('<span/>').linkbutton({ text: 'Cancel', width: 80, onClick: function () { $('#ff').closest('.window-body').panel('close'); } }));

    web_part_page({
        id: 'test10_121'
        , title: 'test10_121'
        , destroy: true
        , window: true
        , height: 260
        , width: 300
        , modal: false
        , content: $cont.append($btn)
    });
}
function Test_11() {
    var $cont = $("<form/>", { class: "easyui-form", id: "ff", method: "post", style: "margin:10px 0px 10px 10px" });
    $cont.append($("<div/>", { style: "margin:5px" }).append($('<input/>', { style: 'width:"200px";', class: "easyui-textbox", type: "text", name: "name", label: 'name1', required: true })));
    $cont.append($("<div/>", { style: "margin:5px" }).append($('<input/>', { style: 'width:"200px";', class: "easyui-numberspinner", type: "text", name: "name", label: 'name2', required: true })));
    $cont.append($("<div/>", { style: "margin:5px" }).append($('<input/>', { style: 'width:"200px";', class: "easyui-datebox", type: "text", name: "name", label: 'name3', required: true })));

    web_part_page({
        id: 'Test_11_win'
        , window: true
        , modal: false
        , content: $cont
    });
}

function Test_12() {
    web_part_page({
        id: 'Test_12_win'
        , window: false
        , modal: false
        , plugin: 'timepicker'
        , plugincontent: {}
    });
    // $('#ffxx').form();

}
function DataLoaderTest() {
    var json = {
        dataSets: [{ name: 'GIM_GOLDEN_TI', view: 'SELUWS2252.PSHub.gim.GIM_GOLDEN_TI' }
            , { name: 'sales_items', view: 'service_reference.sales_items' }
            , { name: 'version', view: 'service_ppl.version' }]
    };
    var jqxhr = $.post('../data/dataLoader.aspx', { payload: JSON.stringify(json) }, function (response) {
        web_part_page({
            id: 'DataSetTest'
            , window: true
            , modal: false
            , destroy: true
            , content: response
        });
    }).fail(function () { alert("error"); });



}
function Test_1() {
    web_part_page({
        window: true
        , modal: false
        , plugin: 'layout'
        , plugincontent: [{
            region: 'center'
            , plugin: 'tree'
            , plugincontent: {
                cascadeCheck: true
                , dataSet: {
                    xpreView: 'service_ppl.profile.product'
                    , treeView: { schema: 'service_reference', table: 'product', column: 'Code', parent: 'Parent', text: 'Name', type: 'e', updateColumn: 'full_rollout' }
                }
            }
        }]
    });
}

function Test_2() {
    web_part_page({
        window: true
        , title: '&nbsp;Ask Item Master (GIM)'
        , iconCls: 'student-small'
        , id: 'Ask_GIM094'
        , modal: false
        , width: 900
        , height: 500
        , plugin: 'layout'
        , plugincontent: [
            {
                region: 'west', width: 200, title: 'About', plugin: 'layout', plugincontent: [{
                    region: 'north', height: 400, plugin: 'propertygrid', title: '', id: 'search_324'
                    , plugincontent: {
                        showGroup: false
                        , fitColumns: true
                        , data: searchify(showColumns_GIM)
                        , footer: $('<div/>', { style: 'padding: 5px 5px 5px 5px;' }).append($('<div/>', { style: 'float:right;' }).linkbutton({
                            iconCls: 'icon-ok', text: 'OK', width: 70, onClick: function () {
                                var val = $('#search_324').propertygrid('getRows');
                                var ret = [];
                                $.each(val, function (i, o) {
                                    if (o.value) ret.push({ field: o.field, op: 'equal', value: o.value });
                                });
                                var dgG = $('#stg_GIM_GOLDEN_TI_87');
                                dgG.datagrid('options').queryParams.preFilter = JSON.stringify(ret);
                                dgG.datagrid('reload');
                                var dgL = $('#stg_GIM_LOCAL_TI_07');
                                dgL.datagrid('options').queryParams.preFilter = JSON.stringify(ret);
                                dgL.datagrid('reload');
                            }
                        }))
                    }
                }, {
                    region: 'center', title: '', content: '3287083366<br>3287083385<br>33500074911002<br>9639103001'
                }]
            }
            , {
                region: 'center', plugin: 'layout', title: ''
                , plugincontent: [
                    {
                        region: 'north', height: '50%', title: 'Global', plugin: 'datagrid', id: 'stg_GIM_GOLDEN_TI_87'
                        , plugincontent: {
                            dataSet: { view: 'SELUWS2252.PSHub.gim.GIM_GOLDEN_TI', noEdit: true, showColumns: showColumns_GIM }
                            , viewSet: { menu: [{ text: 'PPL-changes', iconCls: 'filter-small', function_name: 'ppl_changes' }, { text: 'Sales', iconCls: 'filter-small', function_name: 'pat_sales' }] }
                            , onLoadSuccess: function () {

                            }
                        }
                    }
                    , {
                        region: 'center', title: 'Local', plugin: 'datagrid', id: 'stg_GIM_LOCAL_TI_07'
                        , plugincontent: {
                            dataSet: {
                                view: 'SELUWS2252.PSHub.gim.GIM_LOCAL_TI', noEdit: true, showColumns: showColumns_GIM
                            }
                        }
                    }]
            }]
    });
}

function xTest_2() {
    web_part_page({
        window: true
        , title: 'Items Test_2 window'
        , id: 'Items_Test_223'
        , plugin: 'datagrid'
        , plugincontent: {
            title: 'SELUWS2252.PSHub.gim.GIM_GOLDEN_TI'
            , dataSet: {
                view: 'service_reference.sales_items'
                , view: 'SELUWS2252.PSHub.gim.GIM_GOLDEN_TI'
                //, showColumns: ['id', 'item_number', 'product_code', 'ppl', 'currency', 'is_active', 'ltm_qty', 'ltm_or', 'ltm_price', 'ltm_2s_dev', 'createdON']
                , noEdit: true
                //, preFilter: [{ "field": "product_code", "op": "equal", "value": "9761" }]
            }
            , onLoadSuccess: function (param) {
            }
        }
    });
}

function Test_3() {
    web_part_page({
        window: true
        , id: 'wiwipa64'
        , title: 'window with panel'
        , plugin: 'panel'
        , plugincontent: {
            title: 'title'
            , plugin: 'datagrid'
            , plugincontent: {
                dataSet: {
                    view: 'SELUWS2252.PSHub.gim.ppl_hist'
                }
            }
            , onOpen: function () {
                // console.log($(this));
            }
            , tools: [{ iconCls: 'icon-add', handler: function () { alert('new'); } }, { iconCls: 'icon-save', handler: function () { alert('save'); } }]
            , noheader: false
            , footer: $('<div/>', { style: 'padding: 5px 5px;' }).append($('<div>').linkbutton({ iconCls: 'icon-add', text: 'Text', xwidth: 70, xheight: 30 })) // style="width:100%;max-width:400px;padding:30px 60px;"
        }
    });
}

function Test_4() {
    web_part_page({
        window: true, modal: false
        , plugin: 'layout', plugincontent: [{ region: 'west', id: 'yyyy' }, { region: 'center', id: 'yxxxx', plugin: 'datagrid', plugincontent: {} }, { region: 'east' }, { region: 'north' }, { region: 'south' }]
    });
}

function Test_5() {
    web_part_page({
        dialog: true, modal: false, title: 'dialog', id: 'dialog213'
        , plugin: 'datagrid', plugincontent: {}
    });
}

function Test_6() {
    web_part_page({
        window: true, modal: false, title: 'tree', id: 'tree2413'
        , plugin: 'tree', plugincontent: {
            cascadeCheck: true
            , dataSet: {
                treeView: { schema: 'service_reference', table: 'product', column: 'Code', parent: 'Parent', text: 'Name', type: 'cf' }
                , xpreView: 'service_reference.product.Code'
                , xpreFilter: [{ "field": "organizational_unit", "op": "equal", "value": "HSS" }]
            }
        }
    });
}

function Test_7() {
    web_part_page({
        window: true, modal: false, title: 'dialog', id: 'dialog213'
        , plugin: 'datagrid', plugincontent: {
            dataSet: { view: 'PricingService.service_reference.sales_items' }
        }
    });
}

function Test_8() {
    web_part_page({
        window: true, modal: false, title: 'dialog', id: 'dialog213'
        , plugin: 'datagrid', plugincontent: {
            dataSet: { view: 'SELUWS2252.PSHub.pat.sales' }
        }
    });
}

function test_tree_grid_find() {
    web_part_page({
        window: true
        , width: 900
        , height: 400
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', width: '40%', plugin: 'tree'
            , plugincontent: {
                dataSet: {
                    treeView: { schema: 'service_reference', table: 'product', column: 'Code', parent: 'Parent', text: 'Name' }
                    //, preView: 'service_reference.product.Code'
                    //, preFilter: [{ "field": "full_rollout", "op": "equal", "value": "1" }]
                }
                , onSelect: function () {
                    // $(this).closest('.window').find('.datagrid-f').datagrid('reload');
                }
                , onLoadSuccess: function () {
                    var tree = $(this);
                    var checked = tree.tree('getChecked');
                    var opts = tree.tree('options');
                    if (checked.length < 1 || !opts.isRemote) return;
                    opts.animate = false;
                    var node = tree.tree('find', checked[0].id);
                    tree.tree('expandTo', node.target)
                        .tree('select', node.target)
                        .tree('scrollTo', node.target);
                    opts.animate = true;
                    opts.isRemote = false;
                }
            }
        }, {
            region: 'center'
            , plugin: 'datagrid'
            , plugincontent: {
                title: 'Items'
                , dataSet: {
                    view: 'service_reference.sales_items'
                    , showColumns: ['id', 'item_number', 'product_code', 'ppl', 'currency', 'is_active', 'ltm_qty', 'ltm_or', 'ltm_price', 'ltm_2s_dev', 'createdON']
                    , noEdit: true
                    // , preFilter: [{ "field": "product_code", "op": "equal", "value": "9761" }]
                }
                , onSelect: function (i, row) {
                    var tree = $(this).closest('.window').find('.tree');
                    var opts = tree.tree('options');
                    opts.queryParams.value = row.product_code;
                    opts.isRemote = true;
                    tree.tree('reload');
                }
            }
        }]
    });
}

function Items_list() {
    web_part_page({
        id: 'prlaa'
        , title: 'items_list'
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', title: 'Filter on', id: 'prlba', xwidth: '50%'
            , plugin: 'tabs', plugincontent: {
                data: [{
                    plugin: 'tree', title: 'ALSIS'
                    , plugincontent: {
                        dataSet: {
                            treeView: { schema: 'service_reference', table: 'product', column: 'Code', parent: 'Parent', text: 'Name' }
                        }
                        , onSelect: function (row) {
                            var opts = $(this).tree('options');
                            if (opts.isRemote) return;
                            var dg = $("#sait01");
                            var options = dg.datagrid('options');
                            options.queryParams.preFilter = '[{ "field": "product_code", "op": "pup", "value": "' + row.id + '" }]';
                            dg.datagrid('reload');
                        }
                        , onLoadSuccess: function () {
                            var tree = $(this);
                            var checked = tree.tree('getChecked');
                            var opts = tree.tree('options');
                            if (checked.length < 1 || !opts.isRemote) return;
                            opts.animate = false;
                            var node = tree.tree('find', checked[0].id);
                            tree.tree('expandTo', node.target)
                                .tree('select', node.target)
                                .tree('scrollTo', node.target);
                            opts.animate = true;
                            opts.isRemote = false;
                        }
                    }
                }, {
                    title: 'Markets', id: 'Markets13', plugin: 'datagrid'
                    , plugincontent: {
                        title: ''
                        , onSelect: function (index, row) {
                            var dg = $("#sait01"); // $(this).closest(".panel").find(".datagrid-f"); // .datagrid("load", queryParams);
                            var options = dg.datagrid('options');
                            options.queryParams.preFilter = '[{ "field": "product_code", "op": "pup", "value": "' + row.product + '" }]';
                            dg.datagrid('reload');
                        }
                        , dataSet: {
                            view: 'service_guidelines.market_segment_discount'
                            , showColumns: [{ field: 'id', title: '' }, { field: 'guideline', title: 'Guideline' }, { field: 'product', title: 'Product' }, { field: 'geopol', title: 'Geopol' }, { field: 'industry', title: 'Industry' }, { field: 'base_discount', title: 'Base (%)' }]
                            , noEdit: true
                        }
                    }
                }, {
                    title: 'Touchpoints', plugin: 'datalist'
                    , plugincontent: {
                        title: ''
                        , id: 'Touchpoint38'
                        , checkbox: false
                        , data: [{ text: 'Australia', geo: 'AU' }, { text: 'New Zeeland', geo: 'NZ' }, { text: 'US', geo: 'US' }]
                        , onSelect: function (index, row) {
                            var dg = $("#sait01"); // $(this).closest(".panel").find(".datagrid-f"); // .datagrid("load", queryParams);
                            var options = dg.datagrid('options');
                            options.queryParams.preFilter = JSON.stringify([{ field: "item_number", op: "sql", value: "IN(select [item_number] from [service_reference].[pim_items]WHERE[geopol]='" + row.geo + "')" }]);
                            dg.datagrid('reload');
                        }
                    }
                }, {
                    title: 'PPL-setters', plugin: 'datagrid'
                    , plugincontent: {
                        title: ''
                        , id: 'PPLsetters76'
                        , onSelect: function (index, row) {
                            var dg = $("#sait01"); // $(this).closest(".panel").find(".datagrid-f"); // .datagrid("load", queryParams);
                            var options = dg.datagrid('options');
                            options.queryParams.preFilter = '[{ "field": "product_code", "op": "pup", "value": "' + row.product + '" }]';
                            dg.datagrid('reload');
                        }
                        , dataSet: {
                            view: 'service_ppl.profile'
                            , showColumns: [{ field: 'id', title: '' }, { field: 'person', title: 'Person', width: 150 }, { field: 'product', title: 'Product' }, { field: 'source', title: 'Source' }]
                            , preFilter: [{ "field": "role", "op": "equal", "value": "ppl_setter" }]
                            , noEdit: true
                        }
                    }
                }]
            }
        }, {
            region: 'center', title: '', id: 'sait01', plugin: 'datagrid'
            , plugincontent: {
                title: 'Sales-items'
                , dataSet: {
                    view: 'service_reference.sales_items'
                    , showColumns: [
                        //{ field: 'id', title: 'id' },
                        { field: 'item_number', title: 'item_number' },
                        { field: 'product_code', title: 'product' },
                        { field: 'ppl', title: 'ppl  ' },
                        { field: 'currency', title: 'curr' },
                        //{ field: 'is_active', title: 'is_active' },
                        { field: 'ltm_qty', title: 'ltm_Qty' },
                        { field: 'ltm_or', title: 'ltm_or' },
                        { field: 'ltm_price', title: 'ltm_price' },
                        { field: 'ltm_2s_dev', title: 'StdDev' },
                        { field: 'createdON', title: 'createdON' }]
                    , noEdit: true
                    // , preFilter: [{ "field": "product_code", "op": "equal", "value": "9761" }]
                }
                , viewSet: { menu: [{ text: 'PPL-changes', iconCls: 'filter-small', function_name: 'ppl_changes', key: 'item_number' }, { text: 'Sales', iconCls: 'filter-small', function_name: 'pat_sales', key: 'item_number' }] }
                , onSelect: function (index, row) {
                    var tree = $('#hprlba0');
                    var opts = tree.tree('options');
                    opts.queryParams.value = row.product_code;
                    opts.isRemote = true;
                    tree.tree('reload');
                }

            }
        }]
    });
}



function quantity_discounts() {
    web_part_page({
        title: 'M_Qty_Disc'
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', width: 200, title: 'Guidelines', iconCls: 'user_market-small', plugin: 'datagrid', plugincontent: {
                dataSet: {
                    view: 'service_guidelines.guideline'
                    , showColumns: [{ field: 'guideline', width: 80 }]
                }
                , sortName: 'guideline', sortOrder: 'asc'
                , onSelect: function (i, r) {
                    var dg = $('#qty_segment_discounts674');
                    var options = dg.datagrid('options');
                    options.queryParams.preFilter = '[{"field":"guideline","op":"equal","value":"' + r.guideline + '"}]'
                    dg.datagrid('reload');
                }

            }
        }, {
            region: 'center', plugin: 'datagrid', id: 'qty_segment_discounts674', title: 'Market Quantity discounts', iconCls: 'stair-small'
            , plugincontent: {

                dataSet: {
                    view: 'service_guidelines.market_qty_discount'
                    // , preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
                    , showColumns: [{ field: "id" }, { field: "guideline", title: "Guideline" }, { field: "product", title: "Product", width: 150 }, { field: "geopol", title: "Geopol", width: 150 }, { field: "industry", title: "Industry", width: 180 }, { field: "comment", title: "Comment", width: 120 }, { field: "qty_discount_model", title: "Qty discount model", width: 130 }, { field: "disabled" }]
                }
                , viewSet: { menu: [{ text: 'Quantity steps', iconCls: 'stair_steps-small', function_name: 'quantity_steps_only' }] }
            }
        }]
    });
}

function quantity_steps_only(dg) {
    var row = dg.datagrid('getSelected');
    web_part_page({
        title: 'Quantity discount steps'
        , destroy: true
        , id: 'quantity_steps_only493'
        , iconCls: "stair_steps-small"
        , window: true
        , modal: false
        , width: 600
        , height: 400
        , plugin: 'layout'
        , plugincontent: [{
            id: 'qtyste5al', region: 'center', plugin: 'datagrid', title: 'Steps & values'
            , plugincontent: {
                title: '', iconCls: 'stair-small'
                , sortName: 'qty', sortOrder: 'asc'
                , dataSet: {
                    view: 'service_guidelines.qty_discount'
                    , preFilter: [{ field: 'qty_discount_model', op: 'equal', value: row.qty_discount_model }]
                }
            }
        }]

    });
}

function quantity_steps() {
    web_part_page({
        title: 'Quantity discount steps'
        , id: 'Quantity_discount_steps903'
        , iconCls: "stair_steps-small"
        , window: true
        , modal: false
        , width: 800
        , height: 400
        , plugin: 'layout'
        , plugincontent: [{
            id: 'qtymodnam', region: 'west', plugin: 'datagrid', title: 'Model name', width: '50%'
            , plugincontent: {
                title: '', iconCls: 'stair-small'
                , onSelect: function (index, row) {
                    var dg = $('#qtysteval');
                    var options = dg.datagrid('options');
                    options.queryParams.preFilter = JSON.stringify([{ field: "qty_discount_model", op: "equal", value: row.qty_discount_model }]);
                    dg.datagrid('reload');
                    // console.log(options);
                }
                , dataSet: {
                    view: 'service_guidelines.qty_discount_model'
                }
                , viewSet: { menu: [{ text: 'Edit in list', iconCls: 'stair_steps-small', function_name: 'edit_in_list' }] }
            }
        }, {
            id: 'qtysteval', region: 'center', plugin: 'datagrid', title: 'Steps & values'
            , plugincontent: {
                title: '', iconCls: 'stair-small'
                , sortName: 'qty', sortOrder: 'asc'
                , dataSet: {
                    view: 'service_guidelines.qty_discount'
                }
            }
        }]

    });
}

function edit_in_list(dg, obj) {
    var row = dg.datagrid('getSelected');
    var dg_row = [];
    $.each(row, function (i, o) {
        if (i.substring(0, 2) != "__") dg_row.push({ name: i, value: o, editor: 'text' });
    });
    var dg2 = $("#qtysteval");
    var dg2_options = dg2.datagrid('options');
    // console.log("dg2_options", dg2_options, row);
    dg2_rows = dg2.datagrid("getRows");
    var je_columns = []; var readOnly; var width;
    $.each(dg2_rows[0], function (i, o) {
        // console.log(row[i]);
        if (row[i]) { readOnly = true; width = 30 } else { readOnly = false; width = i.length * 7 + 10; }
        je_columns.push({ title: i, width: width, type: 'text', readOnly: readOnly, tableHeigth: '600px' });
    });
    var je_data = [];
    $.each(dg2_rows, function (i, o) {
        var arr = [];
        $.each(o, function (ii, oo) { arr.push(oo); });
        je_data.push(arr);
    });

    web_part_page({
        window: true, title: 'Edit Quantity', modal: false, width: 600, destroy: true
        , plugin: 'layout'
        , plugincontent: [{
            title: 'Model',
            region: 'west', width: '50%', plugin: 'propertygrid'
            , plugincontent: {
                data: dg_row
                , footer: $('<div/>', { style: 'padding: 5px 5px 5px 5px;' }).append($('<div/>', { style: 'float:right;' }).linkbutton({
                    iconCls: 'icon-ok', text: 'OK', width: 70, onClick: function () {
                        var jx = $(this).closest('.window').find('.jexcel_container');
                        var jxJson = jx.jexcel('getJson');
                        var ret = {};
                        // console.log(je_columns, jxJson, dg.datagrid('options'), dg2_options.dataSet.view);
                        var items = ""; var qtys = "";
                        $.each(jxJson, function (i, o) {
                            $.each(o, function (ii, oo) {
                                if (oo["0"] != "") {
                                    // items += "," + oo["0"]; qtys += "," + oo["1"];
                                }
                            });
                        });
                    }
                }))
            }
        }, {
            region: 'center', title: 'Steps & values', plugin: 'jexcel'
            , plugincontent: { columns: je_columns, data: je_data }
        }]
    });
}
function Fully_rolled_out() {
    web_part_page({
        id: 'Fully_rolled_out'
        , iconCls: 'list_price-small'
        , window: true
        , modal: false
        , width: 800
        , height: 500
        , title: 'Fully rolled-out'
        , plugin: 'layout'
        , plugincontent: [{
            xid: 'qwer', region: 'center', plugin: 'tree', title: 'Fullt rolled-out products'
            , plugincontent: {
                xid: 'qwert'
                // , cascadeCheck: false
                , dataSet: {
                    treeView: { schema: 'service_reference', table: 'product', column: 'Code', parent: 'Parent', text: 'Name', type: 'c', updateColumn: 'full_rollout' }
                    , preView: 'service_reference.product.Code'
                    , preFilter: [{ "field": "full_rollout", "op": "equal", "value": "1" }]
                }
                , onBeforeCheck: function (node, checked) {
                    var dg = $(this).closest('.window').find('.datagrid-f');
                    var tree = $(this);
                    using('messager', function () {
                        if (checked) {
                            $.messager.confirm('Confirm', 'Are you sure you want to add ' + node.id + ' as fully rolled-out?', function (r) {
                                if (r) {
                                    $.post('../data/tree_provider.aspx?type=u', $.extend(tree.tree('options').queryParams, { cid: node.id, checked: checked }));
                                    tree.tree('update', { target: node.target, checked: checked });
                                    dg.datagrid('reload');
                                }
                            });
                        } else {
                            $.messager.confirm('Confirm', 'Are you sure you want to remove ' + node.id + ' as fully rolled-out?', function (r) {
                                if (r) {
                                    $.post('../data/tree_provider.aspx?type=u', $.extend(tree.tree('options').queryParams, { cid: node.id, checked: checked }));
                                    tree.tree('update', { target: node.target, checked: checked });
                                    dg.datagrid('reload');
                                }
                            });
                        }

                    });
                    return false;
                }
            }
            , tools: [{
                iconCls: 'pagination-load', handler: function () {
                    var tree = $(this).closest('.panel').find('.tree');
                    tree.tree('reload');
                }
            }]
        }, {
            region: 'east', title: '', width: '50%',
            plugin: 'datagrid'
            , plugincontent: {
                title: 'Products fully rolled-out'
                , dataSet: {
                    view: "service_reference.product"
                    , preFilter: [{ "field": "full_rollout", "op": "equal", "value": "1" }]
                    , showColumns: [{ field: 'Code' }, { field: 'Name', width: 150 }, { field: 'full_rollout', width: 70 }]
                    , noEdit: true
                }
                , onSelect: function (index, row) {
                    var tree = $(this).closest('.window').find('.tree');
                    var opts = tree.tree('options');
                    opts.animate = false;
                    var node = tree.tree('find', row.Code);
                    tree.tree('expandTo', node.target)
                        .tree('select', node.target);
                    tree.tree('scrollTo', node.target);
                    opts.animate = true;
                }
            }
        }]
    });
}

function Smoke_test() {
    var zRet1 = []; var zRet2 = []; var zRet3 = []; var zRet4 = []; var zRet5 = []; var zRet6 = [];
    $.each(master_object(), function (i, o) {
        zRet1.push({ plugin: i, title: i });
        zRet2.push({ plugin: i });
        zRet3.push({ plugin: i, id: i });
        zRet4.push({ plugin: i, title: i });
        zRet5.push({ plugin: i, title: i });
        zRet6.push({ plugin: i, title: i, window: true });
        web_part_page({ id: 'wi_' + i, window: true, xplugin: i, title: i });
    });
    web_part_page({
        id: 'smoketest'
        , title: 'smoketest'
        , plugin: 'tabs'
        , plugincontent: { data: [{ title: 'test1', plugin: 'tabs', plugincontent: zRet1 }, { title: 'test2', plugin: 'tabs', plugincontent: zRet2 }, { title: 'test3', plugin: 'tabs', plugincontent: zRet3 }, { title: 'test4', plugin: 'tabs', plugincontent: zRet4 }, { title: 'test5', plugin: 'tabs', plugincontent: zRet5 }, { title: 'test6', plugin: 'tabs', plugincontent: zRet6 }] }
    });
    web_part_page({
        id: 'smoketestw'
        , window: true
        , title: 'smoketest'
        , plugin: 'tabs'
        , plugincontent: { data: [{ title: 'test1', plugin: 'tabs', plugincontent: zRet1 }, { title: 'test2', plugin: 'tabs', plugincontent: zRet2 }, { title: 'test3', plugin: 'tabs', plugincontent: zRet3 }, { title: 'test4', plugin: 'tabs', plugincontent: zRet4 }, { title: 'test5', plugin: 'tabs', plugincontent: zRet5 }, { title: 'test6', plugin: 'tabs', plugincontent: zRet6 }] }
    });
}

function gen_table_test() {
    // type -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    web_part_page({
        id: 'gen_table_test'
        , window: false
        , dialog: true
        , title: 'gen_table_test'
        , plugin: 'datagrid'
        , plugincontent: {
            dataSet: { view: 'dbo.test' }
            , onSelect: function (index, row) { ; }
        }
    });
}

function temp_test1() {
    // type -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    web_part_page({
        id: 'temp_test1'
        , window: false
        , title: 'temp_test1'
        , plugin: 'tabs'
        , plugincontent: {
            data: [
                { title: 'content', content: '2b2b2b' }
                , { title: 'href', href: 'system' }
                , {
                    title: 'datagrid', plugin: 'datagrid', plugincontent: {
                        dataSet: { view: 'service_guidelines.market_segment_discount' }
                        , onSelect: function (index, row) { alert('zzzzz'); }
                    }
                }
                , {
                    title: 'datalist', plugin: 'datalist', plugincontent: { onSelect: function (index, row) { alert('zzzzz'); } }
                } // , onSelect: function (index, row) { alert('zzzzz'); }
                , { title: 'propertygrid', plugin: 'propertygrid' }
                , { title: 'sidemenu', plugin: 'sidemenu' }
                , { title: 'tree', plugin: 'tree' }
                , { title: 'treegrid', plugin: 'treegrid' }
                , { title: 'panel', plugin: 'panel' }
                , { title: 'accordion', plugin: 'accordion' }
                , { title: 'layout', plugin: 'layout' }
                , { title: 'tabs', plugin: 'tabs', xplugincontent: [{ title: 'content', content: '2b2b2b' }] }
                , { title: 'gauge', plugin: 'gauge' }
                , { title: 'chartjs', plugin: 'chartjs' }
                , { title: 'non', plugin: 'non' }
            ]
        }
    });
}
function temp_test2w() {
    // type 0-1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    web_part_page({
        id: 'temp_test1'
        , window: true
        , title: 'temp_test1'
        , plugin: 'tabs'
        , plugincontent: {
            data: [
                { title: 'content', content: '2b2b2b' }
                , { title: 'href', href: 'system' }
                , { title: 'datagrid', plugin: 'datagrid', plugincontent: { dataSet: { view: 'service_guidelines.market_segment_discount' } } }
                , { title: 'datalist', plugin: 'datalist' }
                , { title: 'propertygrid', plugin: 'propertygrid' }
                , { title: 'sidemenu', plugin: 'sidemenu' }
                , { title: 'tree', plugin: 'tree' }
                , { title: 'treegrid', plugin: 'treegrid' }
                , { title: 'panel', plugin: 'panel' }
                , { title: 'accordion', plugin: 'accordion' }
                , { title: 'layout', plugin: 'layout' }
                , { title: 'tabs', plugin: 'tabs', plugincontent: [{ title: 'content', content: '2b2b2b' }] }
                , { title: 'gauge', plugin: 'gauge' }
                , { title: 'chartjs', plugin: 'chartjs' }
                , { title: 'non', plugin: 'non' }
            ]
        }
    });
}
function temp_test1w() {
    // type -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    web_part_page({
        id: 'temp_test1w'
        , window: true
        , title: 'temp_test1w'
        , plugin: 'accordion'
        , plugincontent: [
            { title: 'content', content: '2b2b2b' }
            , { title: 'href', href: 'system' }
            , { title: 'datagrid' }
            , { title: 'datalist' }
            , { title: 'propertygrid' }
            , { title: 'sidemenu' }
            , { title: 'tree' }
            , { title: 'treegrid' }
            , { title: 'panel' }
            , { title: 'accordion' }
            , { title: 'layout' }
            , { title: 'tabs' }
            , { title: 'gauge' }
            , { title: 'chartjs' }
        ]
    });
}
function temp_test2() {
    // type -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    web_part_page({
        id: 'temp_test2'
        , window: true
        , title: 'temp_test2'
        , plugin: 'tree'
        , plugincontent: {}
    });
}

function temp_test3() {
    // type -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    web_part_page({
        id: 'temp_test3'
        , title: 'temp_test3'
        , plugin: 'treegrid'
        , plugincontent: {}
    });
}
function temp_test3w() {
    // type -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    web_part_page({
        id: 'temp_test3'
        , window: true
        , title: 'temp_test3'
        , plugin: 'panel'
        , plugincontent: { plugin: 'panel', plugincontent: { plugin: 'panel', plugincontent: { href: 'system/', content: "asd" } } }
    });
}

function zxtemp_table_test() {
    web_part_page({
        plugin: 'layout'
        , content: [{
            region: 'west', plugin: 'gauge', typecontent: {
                dataSet: {
                    sql: "SELECT 'GIM' AS 'title', (SELECT DATEDIFF(HH, MAX(createdON), getdate()) FROM service_reference.sales_items) [value], 'hours' 'units', 100 'maxValue' union select 'sales_items' 'title' , DATEDIFF_BIG(HH, max(createdON),getdate()) 'value' , 'hours' 'units' , 100 'maxValue' from [service_reference].[sales_items] union SELECT 'ALSIS-product', (SELECT DATEDIFF(DD, MAX(inserted), getdate()) FROM service_reference.product), 'days', 100 "
                }
            }
        }, {
            region: 'center', plugin: 'gauge', typecontent: {
                dataSet: {
                    sql: "SELECT TOP (100) PERCENT name 'title' , DATEDIFF(DD, MAX(begin_time), GETDATE()) 'value', 'days' 'units', 100 'maxValue' FROM server.scheduled_jobs GROUP BY name  "
                }
            }
        }, {
            region: 'east', plugin: 'gauge', typecontent: {
                dataSet: {
                    sql: "SELECT currency_set AS title, DATEDIFF(DD, MAX(from_date), GETDATE()) AS value, 'days' AS units, 100 AS maxValue FROM curr.v_currency_rate GROUP BY currency_set  "
                }
            }
        }]
    });
}
function _temp_table_test() {
    var content = [];
    $.each(master_object(), function (i, o) {
        content.push({ plugin: i });
    });
    web_part_page({
        id: 'accordi'
        , title: 'accordion'
        , content: {
            id: 'acc'
            , plugin: 'accordion'
            , halign: 'top'
            , content: [{ id: 'href', href: 'gauge' }, { id: 'type_chartjs', plugin: 'chartjs' }, { plugin: 'propertygrid' }, { plugin: 'datagrid', dataSet: { view: 'service_reference.sales_items' } }, { plugin: 'datalist' }, { plugin: 'tree' }, { plugin: 'treegrid' }, { plugin: 'sidemenu' }]
        }
    });
}


function monitor_integration() {
    web_part_page({
        id: 'monitor_integration'
        , title: 'monitor_integration'
        , plugin: 'gauge'
        , plugincontent: {
            dataSet: { sql: "SELECT 'GIM' AS 'title', (SELECT DATEDIFF(HH, MAX(createdON), getdate()) FROM service_reference.sales_items) [value], 'hours' 'units', 100 'maxValue' UNION ALL select 'sales_items' , DATEDIFF_BIG(HH, max(createdON),getdate()) , 'hours' , 100 from [service_reference].[sales_items] union all SELECT 'ALSIS-product', (SELECT DATEDIFF(DD, MAX(inserted), getdate()) FROM service_reference. product), 'days', 100 UNION ALL SELECT TOP (100) PERCENT name, DATEDIFF(DD, MAX(begin_time), GETDATE()), 'days', 100 FROM server.scheduled_jobs GROUP BY name UNION ALL SELECT currency_set AS title, DATEDIFF(DD, MAX(from_date), GETDATE()) AS value, 'days' AS units, 100 AS maxValue FROM curr.v_currency_rate GROUP BY currency_set  " } // SELECT * FROM [dbo].[v_integration_monnitor]
        }
    });
}

function monitor_identity() {
    web_part_page({
        id: 'monitor_identity'
        , title: 'monitor_identity'
        , plugin: 'gauge'
        , plugincontent: {
            dataSet: { sql: "SELECT distinct OBJECT_NAME (IC.object_id) + ' (' + TYPE_NAME(IC.system_type_id) + ')' AS title, IC.name AS ColumnName, TYPE_NAME(IC.system_type_id) AS ColumnDataType, 0 as 'min', case TYPE_NAME(IC.system_type_id) when 'tinyint' then 255 when 'smallint' then 32767 when 'int' then 2147483647 when 'bigint' then 9223372036854775807 else 0 end as 'max', IC.seed_value IdentitySeed, IC.increment_value AS IdentityIncrement,  IC.last_value as 'units', DBPS.row_count AS NumberOfRows, 	round((convert(decimal(18,2),CONVERT(bigint,IC.last_value)*100/case TYPE_NAME(IC.system_type_id) when 'tinyint' then 255 when 'smallint' then 32767 when 'int' then 2147483647 when 'bigint' then 9223372036854775807 else 0 end)),0) as 'value' FROM sys.identity_columns IC JOIN sys.tables TN ON IC.object_id = TN.object_id JOIN sys.dm_db_partition_stats DBPS ON DBPS.object_id =IC.object_id  JOIN sys.indexes as IDX ON DBPS.index_id =IDX.index_id  WHERE DBPS.row_count >0 order by 'value' desc, units desc  " }
        }
    });
}

function ppl_hist_updates() {
    web_part_page({
        id: 'ppl_hist_updates'
        //, title: 'chart'
        , plugin: 'chartjs'
        , plugincontent: {
            id: 'ppl_hist_updates_app'
            , dataSet: {
                sql: "SELECT CONVERT(char(10), FROM_DATE, 126) FROM_DATE, SUM(CASE WHEN [REASON] = 1 THEN 1 ELSE 0 END) AS 'insert', SUM(CASE WHEN [REASON] = 2 THEN 1 ELSE 0 END) AS 'update' FROM SELUWS2252.PSHub.gim.ppl_hist GROUP BY FROM_DATE HAVING(FROM_DATE > CONVERT(DATETIME, '2019-11-15 00:00:00', 102));"
            }
            , type: 'line'
        }
    });
}


function List_price_requests_performance() {
    web_part_page({
        id: 'xzz10'
        , plugin: 'chartjs'
        , plugincontent: {
            id: 'yyyy'
            , dataSet: {
                sql: "SELECT TOP (100) PERCENT CONVERT(char(10), created_on, 126) AS from_date, SUM(item_count) AS Items, AVG(item_count) AS avg, COUNT(*) AS count, AVG(time) AS time FROM service_ppl.request_log WHERE (NOT (item_count IS NULL)) GROUP BY CONVERT(char(10), created_on, 126) ORDER BY from_date;"
            }
            , type: 'line'
        }
    });
}
function show_system() {
    web_part_page({
        id: 'show_system'
        , title: 'show system'
        , href: 'system/'
    });
}

function touchpoint_pricelist() {
    web_part_page({
        id: 'Touchpoint_Price_list21'
        , title: 'Touchpoint Price-list'
        , iconCls: 'partial-branch-small'
        , window: true
        , modal: false
        , width: 1000
        , height: 500
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west'
            , title: ''
            , width: 280
            , plugin: 'tabs'
            , plugincontent: {
                data: [{
                    title: 'Price-request'
                    , plugin: 'layout', plugincontent: [{
                        region: 'north', maxHeight: 190, height: '100%', split: false, title: '', xtitle: 'Request-details', plugin: 'propertygrid'
                        , plugincontent: {
                            showGroup: false
                            , showHeader: false
                            , data: {
                                rows: [
                                    { group: "Non Editable:", field: "created_by", name: "Created By", value: $zBody.data("username"), hidden: true }
                                    , { group: "Editable:", field: "item", name: "Items", value: "", editor: { type: "validatebox", options: { required: false } } }
                                    , { group: "Editable:", field: "geo", name: "Geography", value: 'US', editor: { type: "validatebox", options: { required: false } } }
                                    , { group: "Editable:", field: "ind", name: "Industry", value: '16', editor: { type: "validatebox", options: { required: false } } }
                                    , { group: "Editable:", field: "curr", name: "Currency", value: "USD", editor: { type: "validatebox", options: { required: true } } }
                                ]
                            }
                            , footer: $('<div/>', { style: 'padding: 5px 5px 5px 5px;' }).append($('<div/>', { style: 'float:right;' }).linkbutton({
                                iconCls: 'icon-ok', text: 'OK', width: 70, onClick: function () {
                                    var dpg = $(this).closest('.panel').find('.datagrid-f');
                                    var dpg_rows = dpg.datagrid('getRows');
                                    var dg = $('#prlisx');
                                    var dg_options = dg.datagrid('options');
                                    var proc = JSON.parse(dg_options.queryParams.proc);
                                    proc.params.geo = dpg_rows.find(o => o.field === 'geo').value;
                                    proc.params.ind = dpg_rows.find(o => o.field === 'ind').value;
                                    proc.params.to_curr = dpg_rows.find(o => o.field === 'curr').value;
                                    proc.params.items = dpg_rows.find(o => o.field === 'item').value;
                                    dg_options.queryParams.proc = JSON.stringify(proc);
                                    dg.datagrid('reload');
                                }
                            }))
                        }

                    }, { region: 'center', maxHeight: 0, height: '0%', title: '', content: '3287133205,3287099352,3287099353,3287099358<br>3671174403,3671174404,3671174411,3671174451,3671174491' }]

                }, {
                    title: 'Touchpoint'
                    , plugin: 'datagrid'
                    , plugincontent: {
                        sortName: 'count', sortOrder: 'desc'
                        , dataSet: {
                            xsql: "select 'Australien' Name,'AU' geo, 'AUD' curr union select 'USA','US','USD' union select 'New Zeeland','NZ','NZD'"
                            , sql: "SELECT TOP (10) geo_political_area geo, industry ind, to_currency curr, COUNT(*) AS count FROM service_ppl.request_log GROUP BY to_currency, geo_political_area, industry ORDER BY Count DESC"
                            , noEdit: true
                            , xshowColumns: [{ field: 'Name', title: 'Name', width: 100 }, { field: 'geo', title: 'geo', width: 50 }, { field: 'curr', title: 'curr', width: 50 }]
                        }
                        , onSelect: function (index, row) {
                            var dg = $('#prlisx');
                            var opt = dg.datagrid('options');
                            var proc = JSON.parse(opt.queryParams.proc);
                            proc.params.geo = row.geo;
                            proc.params.ind = row.ind;
                            proc.params.to_curr = row.curr;
                            proc.params.items = null;
                            opt.queryParams.proc = JSON.stringify(proc);
                            dg.datagrid('reload');
                        }

                    }
                }]
            }
        }, {
            region: 'center', title: 'Price-list ', id: 'prlisx', iconCls: 'partial-branch-small'
            , plugin: 'datagrid'
            , tools: [{ iconCls: 'information-small', handler: function () { price_list_detail(); } }]
            , plugincontent: {
                title: '', id: 'Price_list_w_datagrid2'
                , onLoadSuccess: function () {
                    $('#user_temp_product_markets').datagrid('reload');
                    $('#user_temp_product_market_discounts').datagrid('reload');
                }
                , dataSet: {
                    proc: { name: 'price_list', params: { geo: 'AU', ind: null, to_curr: 'EUR', user: 'magnus' } }
                    , noEdit: true
                    , showColumns: [{ field: "type", title: "type", xwidth: 40 }
                        , { field: "guideline", title: "guideline", width: 80 }
                        , { field: "full_rollout", title: "full", width: 40 }
                        , { field: "item_number", title: "item", width: 90 }
                        , { field: "product_code", title: "product", width: 70 }
                        , { field: "ppl_eur", title: "ppl_eur", width: 90 }
                        , { field: "local_currency", title: "currency", width: 75 }
                        , { field: "local_fx_rate", title: "fx_rate", width: 70 }
                        , { field: "local_ppl", title: "ppl", width: 70 }
                        , { field: "base_discount", title: "base_discount", width: 110 }
                        , { field: "local_list_price", title: "LLP", width: 70 }
                    ]
                }
                , sortName: 'ppl_eur', sortOrder: 'desc'
            }
        }]
    });
}

function service_list_price() {
    web_part_page({
        id: 'package_price_query_872'
        , title: 'Service: list_price'
        , iconCls: 'items-small'
        , window: true
        , modal: false
        , width: 1000
        , height: 550
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', width: 240, title: 'Request', iconCls: 'double-arrow-small', plugin: 'layout', plugincontent: [{
                id: 'package_request_092', title: '', region: 'north', height: 215, split: true, plugin: 'propertygrid'
                , plugincontent: {
                    showGroup: false
                    , showHeader: false
                    , data: {
                        rows: [
                            { field: "service", name: "Service", value: "list_price" }
                            , { field: "version", name: "Version", value: "0.0.1", editor: { type: "combobox", options: { panelHeight: 50, required: true, data: [{ value: "0.0.1", text: "0.0.1" }, { value: "0.0.2", text: "0.0.2" }] } } }
                            , { field: "geo", name: "Geography", value: 'US', editor: { type: "validatebox", options: { required: false } } }
                            , { field: "ind", name: "Industry", value: '16', editor: { type: "validatebox", options: { required: false } } }
                            , { field: "to_curr", name: "Currency", value: "USD", editor: { type: "validatebox", options: { required: true } } }
                            , { field: "type", name: "Type", value: 'pack', editor: { type: "combobox", options: { panelHeight: 50, data: [{ value: 'line', text: "Line" }, { value: 'pack', text: "Package" }] } } }
                            , { field: "sys", name: "System", value: "ps", editor: { type: "text" } }
                            , { field: "token", name: "Token", value: '3FC8642D-1A70-4A60-A928-DE24980A2DC1', editor: { type: "validatebox" } }
                        ]
                    }
                    , footer: $('<div/>', { style: 'padding: 5px 5px 5px 5px;' })
                        .append($('<div/>', { style: 'float:right;', id: 'ok_btn_563' }).linkbutton({
                            iconCls: 'icon-ok', text: 'OK', width: 70, onClick: function () {

                                var val = $('#package_request_092').propertygrid('getRows');
                                var payload = {};
                                $.each(val, function (i, o) {
                                    if (o.value) {
                                        payload[o.field] = o.value;
                                    }
                                });

                                var jx = $('#pckage_req_542');
                                var curr_body_items = jx.jexcel('getJson');
                                var lines = [];
                                $.each(curr_body_items, function (i, o) {
                                    var qty;
                                    if (o["1"] != "") qty = o["1"];
                                    if (o["0"] != "") {
                                        lines.push({ item: o["0"], qty: qty });
                                    }
                                });
                                payload["lines"] = lines;
                                $.postJSON('../data/proc_provider.aspx', payload, function (data, status, xhr) {
                                    if (status == "success") {
                                        if (data.response.exception) { msg("Error", data.response.exception); } else {
                                            $("#query_345").linkbutton("enable");
                                            $("#Sequence45").linkbutton("enable");
                                            $('#log_service784').datagrid('options').queryParams.preFilter = JSON.stringify([{ field: "id", op: "equal", value: data.response.header.price_id }]);
                                            $('#log_service784').datagrid('reload');
                                            $('#log_service_line214').datagrid('options').queryParams.preFilter = JSON.stringify([{ field: "hid", op: "equal", value: data.response.header.price_id }]);
                                            $('#log_service_line214').datagrid('reload');
                                            if (data.response.message) { msg("Message", data.response.message); }
                                        }
                                    }
                                });
                            }
                        }))
                        .append($('<div/>', { style: 'float:left;' }).linkbutton({
                            id: 'query_345', plain: true, disabled: true,
                            iconCls: 'globe_arrow-small', text: 'Query', width: 60, onClick: function () {
                                var row = $('#log_service784').datagrid('getSelected');
                                if (!row) row = $('#log_service784').datagrid('getRows')[0];

                                web_part_page({
                                    id: 'pg_query_392', window: true, destroy: true, title: 'Web-shop Payload example for Price-ID: ' + row.id, iconCls: 'double-arrow-small', plugin: 'layout', plugincontent: [
                                        { region: 'north', title: 'Request', iconCls: 'list_price-small', content: row.request, height: '50%' }
                                        , { region: 'center', title: 'Response', content: row.response }
                                    ]
                                });
                            }
                        }))
                        .append($('<div/>', { style: 'float:left;' }).linkbutton({
                            id: 'Sequence45', plain: true, disabled: true,
                            iconCls: 'logic-small', text: 'Sequence', width: 80, onClick: function () {
                                var row = $('#log_service784').datagrid('getSelected');
                                if (!row) row = $('#log_service784').datagrid('getRows')[0];

                                web_part_page({
                                    id: 'service_list_price_stat'
                                    , title: 'Sequense for Price-ID: ' + row.id
                                    , iconCls: 'logic-small'
                                    , window: true
                                    , modal: true
                                    , destroy: true
                                    , width: 970
                                    , height: 500
                                    , plugin: 'layout'
                                    , plugincontent: [{
                                        region: 'center', id: 'log_service', title: '', plugin: 'layout', plugincontent: [{
                                            region: 'north', height: '50%', title: 'List-price', iconCls: 'list_price-small', plugin: 'datagrid', plugincontent: {
                                                sortName: 'id', sortOrder: 'asc',
                                                dataSet: {
                                                    view: 'log.service_sequence', noEdit: true
                                                    , preFilter: [{ field: "price_id", op: "equal", value: row.id }, { field: "type", op: "equal", value: 'disc' }]
                                                }
                                            }
                                        }, {
                                            region: 'center', title: 'Quantity', plugin: 'datagrid', plugincontent: {
                                                sortName: 'id', sortOrder: 'asc',
                                                dataSet: {
                                                    view: 'log.service_sequence', noEdit: true
                                                    , preFilter: [{ field: "price_id", op: "equal", value: row.id }, { field: "type", op: "equal", value: 'qty' }]
                                                }
                                            }
                                        }]
                                    }]
                                })
                            }
                        }))
                }
            }, {
                region: 'center', id: 'pckage_req_542', title: '', plugin: 'jexcel',
                plugincontent: { minDimensions: [2, 1], columns: [{ title: 'Item', width: '100', type: 'text' }, { title: 'Qty', width: '40', type: 'numeric' }] }
            }, {
                region: 'south', title: 'Example/Test data:', height: 130, plugin: 'jexcel', plugincontent: {
                    columns: [], data: [
                        ['3671174403', 45], ['3671174404', 2], ['3671174411', 2], ['3671174451', 1], ['3671174491', 1], ['390084017206', 2]
                    ]
                }, collapsed: true
            }]
        }, {
            region: 'center', title: '', iconCls: 'logic-small', plugin: 'layout', plugincontent: [{
                region: 'north', title: 'Response-Header', iconCls: 'double-arrow-small', height: '40%', id: 'log_service784', plugin: 'datagrid', plugincontent: {
                    dataSet: {
                        view: 'log.service'
                        , preFilter: [{ field: "id", op: "equal", value: 0 }]
                        , noEdit: true
                    }
                    , onSelect: function (i, r) {
                        $("#Sequence45").linkbutton("enable");
                        $("#query_345").linkbutton("enable");
                        var dg = $('#log_service_line214');
                        var options = dg.datagrid('options');
                        options.queryParams.preFilter = JSON.stringify([{ field: "hid", op: "equal", value: r.id }]);
                        dg.datagrid('reload');
                    }
                }
            }, {
                region: 'center', title: 'Lines', plugin: 'datagrid', id: 'log_service_line214', plugincontent: {
                    sortName: 'id', sortOrder: 'asc'
                    , dataSet: {
                        view: 'log.service_lines'
                        , preFilter: [{ field: "id", op: "equal", value: 0 }]
                        , noEdit: true
                    }
                }
            }]
        }]
    });
}

function service_corridor_disc() {
    web_part_page({
        id: 'corridor_disc_872'
        , title: 'Service: corridor_disc'
        , iconCls: 'items-small'
        , window: true
        , modal: false
        , width: 1000
        , height: 550
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', width: 240, title: 'Request', iconCls: 'double-arrow-small', plugin: 'layout', plugincontent: [{
                id: 'corridor_disc_092', title: '', region: 'north', height: 215, split: true, plugin: 'propertygrid'
                , plugincontent: {
                    showGroup: false
                    , showHeader: false
                    , data: {
                        rows: [
                            { field: "service", name: "Service", value: "corridor_disc", editor: { type: "textbox", options: { required: true, editable: false } } }
                            , { field: "version", name: "Version", value: "0.0.1", editor: { type: "combobox", options: { panelHeight: 50, required: true, data: [{ value: "0.0.1", text: "0.0.1" }, { value: "0.0.2", text: "0.0.2" }] } } }
                            , { field: "geo", name: "Geography", value: 'US', editor: { type: "validatebox", options: { required: false } } }
                            , { field: "ind", name: "Industry", value: '16', editor: { type: "validatebox", options: { required: false } } }
                            , { field: "sys", name: "System", value: "ps", editor: { type: "text" } }
                            , { field: "token", name: "Token", value: '3FC8642D-1A70-4A60-A928-DE24980A2DC1', editor: { type: "validatebox" } }
                        ]
                    }
                    , footer: $('<div/>', { style: 'padding: 5px 5px 5px 5px;' })
                        .append($('<div/>', { style: 'float:right;', id: 'ok_btn_534' }).linkbutton({
                            iconCls: 'icon-ok', text: 'OK', width: 70, onClick: function () {

                                var val = $('#corridor_disc_092').propertygrid('getRows');
                                var payload = {};
                                $.each(val, function (i, o) {
                                    if (o.value) {
                                        payload[o.field] = o.value;
                                    }
                                });

                                var jx = $('#pckage_req_454');
                                var curr_body_items = jx.jexcel('getJson');
                                var lines = [];
                                $.each(curr_body_items, function (i, o) {
                                    var qty;
                                    if (o["1"] != "") qty = o["1"];
                                    if (o["0"] != "") {
                                        lines.push({ product: o["0"], qty: qty });
                                    }
                                });
                                payload["lines"] = lines;
                                $.postJSON('../data/proc_provider.aspx', payload, function (data, status, xhr) {
                                    if (status == "success") {
                                        if (data.response.exception) { msg("Error", data.response.exception); } else {
                                            $("#query_ere").linkbutton("enable");
                                            $("#Sequence445").linkbutton("enable");
                                            $('#log_service522').datagrid('options').queryParams.preFilter = JSON.stringify([{ field: "id", op: "equal", value: data.response.header.price_id }]);
                                            $('#log_service522').datagrid('reload');
                                            $('#log_service_line832').datagrid('options').queryParams.preFilter = JSON.stringify([{ field: "hid", op: "equal", value: data.response.header.price_id }]);
                                            $('#log_service_line832').datagrid('reload');
                                            if (data.response.message) { msg("Message", data.response.message); }
                                        }
                                    }
                                });
                            }
                        }))
                        .append($('<div/>', { style: 'float:left;' }).linkbutton({
                            id: 'query_ere', plain: true, disabled: true,
                            iconCls: 'globe_arrow-small', text: 'Query', width: 60, onClick: function () {
                                var row = $('#log_service522').datagrid('getSelected');
                                if (!row) row = $('#log_service522').datagrid('getRows')[0];

                                web_part_page({
                                    id: 'al_query_392', window: true, destroy: true, title: 'Web-shop Payload example for Price-ID: ' + row.id, iconCls: 'double-arrow-small', plugin: 'layout', plugincontent: [
                                        { region: 'north', title: 'Request', iconCls: 'list_price-small', content: row.request, height: '50%' }
                                        , { region: 'center', title: 'Response', content: row.response }
                                    ]
                                });
                            }
                        }))
                        .append($('<div/>', { style: 'float:left;' }).linkbutton({
                            id: 'Sequence445', plain: true, disabled: true,
                            iconCls: 'logic-small', text: 'Sequence', width: 80, onClick: function () {
                                var row = $('#log_service522').datagrid('getSelected');
                                if (!row) row = $('#log_service522').datagrid('getRows')[0];

                                web_part_page({
                                    id: 'service_corr_stat'
                                    , title: 'Sequense for Price-ID: ' + row.id
                                    , iconCls: 'logic-small'
                                    , window: true
                                    , modal: true
                                    , destroy: true
                                    , width: 970
                                    , height: 500
                                    , plugin: 'layout'
                                    , plugincontent: [{
                                        region: 'center', id: 'log_service128', title: '', plugin: 'layout', plugincontent: [{
                                            region: 'north', height: '50%', title: 'List-price', iconCls: 'list_price-small', plugin: 'datagrid', plugincontent: {
                                                sortName: 'id', sortOrder: 'asc',
                                                dataSet: {
                                                    view: 'log.service_sequence', noEdit: true
                                                    , preFilter: [{ field: "price_id", op: "equal", value: row.id }, { field: "type", op: "equal", value: 'disc' }]
                                                }
                                            }
                                        }, {
                                            region: 'center', title: 'Quantity', plugin: 'datagrid', plugincontent: {
                                                sortName: 'id', sortOrder: 'asc',
                                                dataSet: {
                                                    view: 'log.service_sequence', noEdit: true
                                                    , preFilter: [{ field: "price_id", op: "equal", value: row.id }, { field: "type", op: "equal", value: 'qty' }]
                                                }
                                            }
                                        }]
                                    }]
                                })
                            }
                        }))
                }
            }, {
                region: 'center', id: 'pckage_req_454', title: '', plugin: 'jexcel',
                plugincontent: { minDimensions: [2, 1], columns: [{ title: 'Product', width: '80', type: 'text' }, { title: 'Qty', width: '40', type: 'text' }] }
            }, {
                region: 'south', title: 'Example/Test data:', height: 130, plugin: 'jexcel', plugincontent: {
                    minDimensions: [1, 1]
                    , columns: [], data: [
                        ['2501'], ['2502'], ['2509'], ['2614'], ['2654'], ['2671'], ['2673']
                    ]
                }, collapsed: true
            }]
        }, {
            region: 'center', title: '', iconCls: 'logic-small', plugin: 'layout', plugincontent: [{
                region: 'north', title: 'Response-Header', iconCls: 'double-arrow-small', height: '40%', id: 'log_service522', plugin: 'datagrid', plugincontent: {
                    dataSet: {
                        view: 'log.service'
                        , preFilter: [{ field: "id", op: "equal", value: 0 }]
                        , noEdit: true
                        , showColumns: [{ field: 'id', title: 'id' },
                            { field: 'createdON', title: 'createdON' },
                            { field: 'sys', title: 'sys' },
                            { field: 'service', title: 'service' },
                            { field: 'version', title: 'version' },
                            { field: 'geo', title: 'geo' },
                            { field: 'ind', title: 'ind' },
                            { field: 'm_type', title: 'm_type' },
                            { field: 'lines', title: 'lines' },
                            { field: 'qty', title: 'qty' },
                            { field: 'request', title: 'request' },
                            { field: 'response', title: 'response' },
                            { field: 'isErr', title: 'isErr' },
                            { field: 'comments', title: 'comments' },
                            { field: 'milliseconds', title: 'milliseconds' }]
                    }
                    , onSelect: function (i, r) {
                        $("#Sequence445").linkbutton("enable");
                        $("#query_ere").linkbutton("enable");
                        var dg = $('#log_service_line832');
                        var options = dg.datagrid('options');
                        options.queryParams.preFilter = JSON.stringify([{ field: "hid", op: "equal", value: r.id }]);
                        dg.datagrid('reload');
                    }
                }
            }, {
                region: 'center', title: 'Lines', plugin: 'datagrid', id: 'log_service_line832', plugincontent: {
                    sortName: 'id', sortOrder: 'asc'
                    , dataSet: {
                        view: 'log.service_lines'
                        , preFilter: [{ field: "id", op: "equal", value: 0 }]
                        , noEdit: true
                        , showColumns: [{ field: 'id', title: 'id' },
                        { field: 'hid', title: 'hid' },
                        { field: 'm_type', title: 'm_type' },
                        { field: 'ord', title: 'ord' },
                        { field: 'qty', title: 'qty' },
                        { field: 'product_code', title: 'product_code' },
                        { field: 'resolved', title: 'resolved' },
                        { field: 'geo', title: 'geo' },
                        { field: 'ind', title: 'ind' },
                        { field: 'base_disc', title: 'base_disc' },
                        { field: 'qty_disc', title: 'qty_disc' },
                        { field: 'qty_from', title: 'qty_from' },
                        { field: 'guideline', title: 'guideline' },
                        { field: 'guidelineid', title: 'guidelineid' },
                        { field: 'qty_discount_model', title: 'qty_discount_model' }]
                    }
                }
            }]
        }]
    });
}

function x_service_corridor_disc_del() {
    var showColumns = [{ field: 'x_hid', title: 'hid', width: 30, hidden: true },
    { field: 'x_step', title: 'step', width: 38, hidden: true },
    { field: 'Row', title: 'Row', width: 40 },
    { field: 'm_type', title: 'm_type', width: 70 },
    { field: 'prod', title: 'Prod', width: 50 },
    { field: 'geo', title: 'Geo', width: 50 },
    { field: 'ind', title: 'Ind', width: 50 },
    { field: 'x_gid', title: 'gid', width: 40, hidden: true },
    { field: 'guideline', title: 'Guideline', width: 80 },
    { field: 'full', title: 'Full', width: 60 },
    { field: 'g_prod', title: 'gui_prod', width: 70 },
    { field: 'g_geo', title: 'gui_geo', width: 70 },
    { field: 'g_ind', title: 'gui_ind', width: 70 },
    { field: 'p', title: 'p', width: 30 },
    { field: 'g', title: 'g', width: 30 },
    { field: 'i', title: 'i', width: 30 },
    { field: 'base_disc', title: 'base_disc', width: 70 },
    { field: 'max_disc', title: 'max_disc', width: 70 },
    { field: 'millisec', title: 'millisec', width: 70 }
    ];

    web_part_page({
        id: 'ALiCE_Product_Corridor_query213'
        , title: 'Service: corridor_disc'
        , iconCls: 'list_price-small'
        , window: true
        , modal: false
        , width: 1000
        , height: 500
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', width: 230, title: 'Request', iconCls: '', plugin: 'layout', plugincontent: [{
                id: 'ALiCE_request_984', title: '', region: 'north', height: 160, split: true, plugin: 'propertygrid'
                , plugincontent: {
                    showGroup: false
                    , showHeader: false
                    , data: {
                        rows: [
                            { field: "service", name: "Service", value: "corridor_disc", editor: { type: "textbox", options: { required: true, editable: false } } }
                            , { field: "version", name: "Version", value: "0.0.1", editor: { type: "combobox", options: { panelHeight: 50, required: true, data: [{ value: "0.0.1", text: "0.0.1" }, { value: "0.0.2", text: "0.0.2" }] } } }
                            , { field: "geo", name: "Geography", value: 'US', editor: { type: "validatebox", options: { required: false } } }
                            , { field: "ind", name: "Industry", value: '16', editor: { type: "validatebox", options: { required: false } } }
                        ]
                    }
                    , footer: $('<div/>', { style: 'padding: 5px 5px 5px 5px;' })
                        .append($('<div/>', { style: 'float:right;' }).linkbutton({
                            iconCls: 'icon-ok', text: 'OK', width: 70, onClick: function () {
                                var val = $('#ALiCE_request_984').propertygrid('getRows');
                                var payload = { service: 'corridor_disc', token: '3FC8642D-1A70-4A60-A928-DE24980A2DC1' };
                                $.each(val, function (i, o) {
                                    if (o.value) {
                                        payload[o.field] = o.value;
                                    }
                                });
                                var jx = $('#pckage_req_e54');
                                var curr_body_products = jx.jexcel('getJson');
                                var lines = [];
                                $.each(curr_body_products, function (i, o) {
                                    if (o["0"] != "") {
                                        lines.push({ product: o["0"] });
                                    }
                                });
                                payload["lines"] = lines;
                                var dgG = $('#proc_e435');
                                var gOptions = dgG.datagrid('options');
                                gOptions.queryParams.payload = JSON.stringify(payload);
                                dgG.datagrid('reload');
                                if (curr_body_products[0]["0"] == "") { $("#Query_345").linkbutton("disable"); } else { $("#Query_345").linkbutton("enable"); };
                            }
                        }))
                        .append($('<div/>', { style: 'float:left;' }).linkbutton({
                            disabled: true, id: 'Query_345', iconCls: 'double-arrow-small', text: 'Query', width: 65, onClick: function () {
                                var dgG = $('#proc_e435');
                                var gOptions = dgG.datagrid('options');
                                // console.log(gOptions.__meta.data.response.message);
                                web_part_page({
                                    id: 'pg_query_e89', window: true, destroy: true, title: 'ALiCE Payload example', iconCls: 'double-arrow-small', plugin: 'layout', plugincontent: [
                                        { region: 'north', title: 'Request', content: gOptions.queryParams.payload, height: '50%' }
                                        , { region: 'center', title: 'Response', content: JSON.stringify(gOptions.__meta.data.response) }
                                    ]
                                });
                            }
                        }))
                }
            }, {
                region: 'center', id: 'pckage_req_e54', title: '', plugin: 'jexcel', plugincontent: { minDimensions: [1, 1], columns: [{ title: 'Product', width: '80', type: 'text' }] }
            }, {
                region: 'south', title: 'Example/Test data', plugin: 'jexcel', plugincontent: {
                    minDimensions: [1, 1]
                    , columns: [], data: [
                        ['2501'], ['2502'], ['2509'], ['2614'], ['2654'], ['2671'], ['2673']
                    ]
                }, collapsed: true
            }]
        }, {
            region: 'center', title: 'Response', iconCls: '', plugin: 'layout', plugincontent: [{
                region: 'north', title: '', height: 150, id: 'proc_pack_e35'
            }, {
                region: 'center', title: 'Calculation Sequence', iconCls: 'logic-small', plugin: 'datagrid', id: 'proc_e435', plugincontent: {
                    onLoadSuccess: function (data) {
                        // console.log(data.response);
                        if (data.response && data.response.message) msg("Message:", data.response.message);
                        if (data.response && data.response.exception) msg("Exception:", data.response.exception);
                        if (data.header) {
                            $("#proc_pack_e35").datagrid({
                                data: data.header
                                , columns: [showColumns]
                            });
                        }
                        var rows = data.rows3;
                        $('#Chk_9582').datagrid('loadData', data.rows3);

                    }
                    , dataSet: {
                        payload: { service: 'corridor_disc', version: '0.0.1' }
                    }
                }
            }]
        }]
    });
}



function Log_of_changes() {
    web_part_page({
        id: 'pr'
        , title: 'Log_of_changes'
        , plugin: 'datagrid'
        , plugincontent: {
            title: ''
            , sortName: 'details_id', sortOrder: 'desc'
            , dataSet: {
                view: 'dbo.v_audit_details'
                //, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
            }
        }
    });
}


function pshub_scheduled_jobs() {
    web_part_page({
        id: 'pr'
        , title: 'PSHub_scheduled_jobs'
        , plugin: 'datagrid'
        , plugincontent: {
            title: ''
            , sortName: 'id', sortOrder: 'desc'
            , dataSet: {
                view: 'SELUWS2252.PSHub.dbo.scheduled_jobs'
                //, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
            }
        }
    });
}
function PSHub_db() {
    web_part_page({
        window: false
        , modal: false
        , id: 'PSHub_db5'
        , title: 'PSHub_db'
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', plugin: 'datalist', title: 'Tables', width: 150
            , plugincontent: {
                groupField: 'group', checkbox: false
                , dataSet: {
                    view: 'SELUWS2252.PSHub.INFORMATION_SCHEMA.TABLES'
                    , groupField: 'TABLE_SCHEMA'
                    , textField: 'TABLE_NAME'
                }
                , onSelect: function (index, data) {
                    if ($('#tt1').tabs('exists', data.text)) { $('#tt1').tabs('select', data.text); }
                    else {
                        var $tabContent = $('<div/>', { id: "tab1_" + data.text, fit: true });
                        $('#tt1').tabs('add', $.extend({}, { id: 'tab1_' + data.text, title: data.text, closable: true, content: $tabContent }));
                        isNew = true;
                        var iPage = {
                            plugin: 'datagrid', plugincontent: {
                                dataSet: { view: 'SELUWS2252.PSHub.' + data.group + '.' + data.text + '' }
                            }
                        };
                        web_part_plugin(iPage, $tabContent);
                    }
                    // web_part_plugin({ plugin: 'datagrid', plugincontent: { dataSet: { view: 'SELUWS2252.PSHub.gim.GIM_GOLDEN_TI' } } }, cont);
                    // dg.web_part_page({id:'dfsd',window:false});
                    // var options = extend_datagrid({plugincontent: { dataSet: {}}});
                    // var options = dg.datagrid('options');
                    // options.queryParams.view = 'dbo.v_audit_details';
                    // options.queryParams.first = true;
                    // options.filterRules = {};

                    // console.log(options);
                    // dg.datagrid(options);
                }
            }
        }
            , {
            region: 'center'
            , id: 'tt1'
            , title: 'Table-content'
            , plugin: 'tabs'
            , plugincontent: {
                tabHeight: 15
                , tabPosition: 'bottom'
                , data: []
            }

        }

        ]
    });
}

function DB_admin() {
    web_part_page({
        window: false
        , modal: false
        , id: 'DB_admin'
        , title: 'DB_admin'
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', plugin: 'datalist', title: 'Tables', width: 150
            , plugincontent: {
                groupField: 'group', checkbox: false
                , dataSet: {
                    view: 'INFORMATION_SCHEMA.TABLES'
                    , groupField: 'TABLE_SCHEMA'
                    , textField: 'TABLE_NAME'
                }
                , onSelect: function (index, data) {
                    if ($('#tt1').tabs('exists', data.text)) { $('#tt1').tabs('select', data.text); }
                    else {
                        var $tabContent = $('<div/>', { id: "tab1_" + data.text, fit: true });
                        $('#tt1').tabs('add', $.extend({}, { id: 'tab1_' + data.text, title: data.text, closable: true, content: $tabContent }));
                        isNew = true;
                        var iPage = {
                            plugin: 'datagrid', plugincontent: {
                                dataSet: { view: '' + data.group + '.' + data.text + '' }
                            }
                        };
                        web_part_plugin(iPage, $tabContent);
                    }
                }
            }
        }
            , {
            region: 'center'
            , id: 'tt1'
            , title: 'Table-content'
            , plugin: 'tabs'
            , plugincontent: {
                tabHeight: 15
                , tabPosition: 'bottom'
                , data: []
            }

        }

        ]
    });
}

function scheduled_jobs() {
    web_part_page({
        id: 'pr'
        , title: 'server.scheduled_jobs'
        , plugin: 'datagrid'
        , plugincontent: {
            title: ''
            , sortName: 'id', sortOrder: 'desc'
            , dataSet: {
                view: 'server.scheduled_jobs'
                //, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
            }
        }
    });
}

function PPL_revision() {
    web_part_page({
        id: 'pr'
        , title: 'PPL_revision'
        , plugin: 'layout', plugincontent: [{
            id: 'PPLrev24', region: 'center', width: '50%', title: 'Open revissions', iconCls: 'bar-chart-small', plugin: 'datagrid'
            , plugincontent: {
                title: ''
                , dataSet: {
                    view: 'service_ppl.version', noEdit: true
                    , preFilter: [{ field: "state", op: "greater", value: 2 }]
                    , showColumns: [{ field: "version", title: "Version" }, { field: "type", title: "Type" }, { field: "created_by", title: "Created By" }, { field: "created_on", title: "Created On" }, { field: "target_commit", title: "Target Commit" }, { field: "target_valid_from", title: "Target Valid-from" }, { field: "comment", title: "Comment" }, { field: "state", title: "State" }]
                }
                , onLoad: {}
                , onLoadSuccess: function (data) {
                    var isReady = $(this).datagrid('options').isReady;
                    if (isReady) {
                        if (data.total === 0) { // No
                            $zBody.data()["app"]["PPL_revision"] = ["PPL_create_partial", "PPL_create_full"];
                        } else if (data.rows[0].typeI === 1) { // Full
                            $zBody.data()["app"]["PPL_revision"] = [];
                        } else if (data.rows[0].typeI === 2) { // partial
                            $zBody.data()["app"]["PPL_revision"] = ["PPL_create_partial"];
                        }
                        setMenuActive("PPL_revision");
                    }


                } // $("#" + value).linkbutton('enable');
                , onSelect: function (index, row) {
                    $("#PPL_update").linkbutton("enable");
                    $("#PPL_commit").linkbutton("enable");
                    $("#PPL_edit").linkbutton("enable");
                    $("#PPL_delete").linkbutton("enable");
                    $("#PPL_cancel").linkbutton("enable");
                    $("#PPL_confirm").linkbutton("enable");
                    $("#PPL_create_partial").linkbutton("disable");
                    // $('#dg_prod_branch_list').datagrid("selectRow", 0);
                    // $('#dg_prod_branch_list').datagrid("selectRecord", row.version);
                }
            }
        }, {
            id: 'progusr', region: 'east', width: '50%', title: 'Progress', plugin: 'datagrid', plugincontent: {
                dataSet: {
                    view: 'service_ppl.v_progress_user'
                    , noEdit: true
                    // showColumns: [{ field: 'version', title: 'version', width: 70 }, { field: 'person', title: 'person', width: 140 }, { field: 'up_code', title: 'code', width: 70 }, { field: 'count', title: 'count', width: 50 }, { field: 'state', title: 'state', width: 50 }, { field: 'up_lev', title: 'up_lev', width: 60 }, { field: 'source', title: 'source', width: 60 }, { field: 'ltm_qty', title: 'ltm_qty', width: 70 }, { field: 'ltm_or', title: 'ltm_or', width: 60 }], noEdit: true
                }
                , multiSort: true
                , sortName: 'version,Done', sortOrder: 'asc,desc'
            }
        }]

    });
}

function confirm(opt) {
    var zData = $("#PPLrev24").datagrid("getSelected");
    web_part_page({
        dialog: true, title: opt.text, iconCls: opt.iconCls
        , width: 1000
        , height: 500
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', width: '30%', title: 'PPL-setter', plugin: 'datagrid', plugincontent: {
                dataSet: {
                    view: 'service_reference.person'
                    , showColumns: [{ field: 'name', width: 150 }, { field: 'organizational_unit', title: 'Org', width: 70 }]
                    , noEdit: true
                }
            }
        }, {
            region: 'center', title: 'Product scope', plugin: 'tree', plugincontent: {
                cascadeCheck: false
                , dataSet: {
                    treeView: { schema: 'service_reference', table: 'product', column: 'Code', parent: 'Parent', text: 'Name' }
                    , xpreView: 'service_reference.product.Code', type: 'cf'
                }
            }
        }, {
            region: 'east', title: '', plugin: 'propertygrid', width: '35%', plugincontent: {
                showGroup: true
                , data: {
                    rows: [{ group: "Not Editable:", name: "Version", field: "version", value: zData.version }
                        , { group: "Not Editable:", name: "Created On", field: "created_on", value: zData.created_on.substring(0, 10) }
                        , { group: "Not Editable:", name: "Created By", field: "created_by", value: zData.created_by }
                        , { group: "Not Editable:", name: "Target Commit Date", field: "target_commit_date", value: zData.target_commit.substring(0, 10) }
                        , { group: "Not Editable:", name: "Target Valid-from Date", field: "target_valid_from", value: zData.target_valid_from.substring(0, 10) }
                        , { group: "Not Editable:", name: "Valid-from Date", field: "valid_from_date", value: zData.target_valid_from.substring(0, 10) }
                        , { group: "Not Editable:", name: "Comment", field: "comment", value: zData.comment }]
                }
            }
        }]
        , buttons: [{
            text: 'OK', id: 'dlg_partial_ok', iconCls: 'icon-ok', width: 90, handler: function () {
                var payload = {};
                var scope = [];
                $.each($(this).closest('.panel-htop').find('.tree').tree('getChecked'), function (i, o) {
                    scope.push(o.id);
                });
                payload.scope = JSON.stringify(scope);
                var branch_details = {};
                $.each($(this).closest('.panel-htop').find('.datagrid-f').datagrid('getRows'), function (i, o) {
                    branch_details[o.field] = o.value;
                });
                payload.branch_details = JSON.stringify(branch_details);

                if (scope.length === 0) {
                    msg('Missing selections', 'Please select one or more products to be confirmed');
                } else {
                    var panel = $(this).closest('.panel-htop').find('.panel-body');

                    ok_button_click("../data/PPL_pannel.aspx?type=exec_sp_confirm", payload, function (returnStr) {
                        if (returnStr.sucess) {
                            panel.panel('close');
                            $("#PPLrev24").datagrid("reload");
                            $("#progusr").datagrid("reload");
                        } else {
                            // 
                        }

                    });
                }
            }
        }, {
            text: 'Cancel', iconCls: 'delete-small', width: 90, handler: function () { $(this).closest('.panel-htop').find('.panel-body').panel('close'); }
        }]
    });
}

function update(opt) {
    web_part_page({ dialog: true, title: opt.text, iconCls: opt.iconCls });
}
function cancel(opt) {
    setMenuActive("PPL_revision");
    $("#PPLrev24").datagrid("unselectAll");
}

function create_full(opt) {
    web_part_page({
        dialog: true, title: opt.text, iconCls: opt.iconCls, height: 350, plugin: 'layout'
        , plugincontent: [{
            region: 'center', title: 'Details', width: '40%', plugin: 'propertygrid', plugincontent: {
                showGroup: true
                , data: {
                    rows: [
                        { group: "Non Editable:", field: "created_by", name: "Created By", value: $zBody.data("username") }
                        , { group: "Editable:", field: "target_commit_date", name: "Target Commit Date", value: '', editor: { type: "datebox", options: { required: true } } }
                        , { group: "Editable:", field: "target_valid_from", name: "Target Valid-from Date", value: '', editor: { type: "datebox", options: { required: true } } }
                        , { group: "Editable:", field: "comment", name: "Comment", value: "", editor: { type: "validatebox", options: { required: false } } }]
                }
            }
        }]
        , buttons: [{
            text: 'OK', id: 'dlg_partial_ok', iconCls: 'icon-ok', width: 90, handler: function () {
                var payload = {};
                var branch_details = {};
                $.each($(this).closest('.panel-htop').find('.datagrid-f').datagrid('getRows'), function (i, o) {
                    branch_details[o.field] = o.value;
                });
                payload.branch_details = JSON.stringify(branch_details);
                var panel = $(this).closest('.panel-htop').find('.panel-body');
                ok_button_click("../data/PPL_pannel.aspx?type=exec_sp_create_full", payload, function (returnStr) {
                    if (returnStr.sucess) {
                        panel.panel('close');
                        $("#PPLrev24").datagrid("reload");
                        $("#progusr").datagrid("reload");
                    } else {
                        // 
                    }
                });
            }
        }, {
            text: 'Cancel', iconCls: 'delete-small', width: 90, handler: function () { $(this).closest('.panel-htop').find('.panel-body').panel('close'); }
        }]
    });
}
function create_partial(opt) {
    web_part_page({
        dialog: true, title: opt.text, iconCls: opt.iconCls
        , width: 800
        , height: 400
        , buttons: [{
            text: 'OK', id: 'dlg_partial_ok', iconCls: 'icon-ok', width: 90, handler: function () {
                var payload = {};
                var scope = [];
                $.each($(this).closest('.panel-htop').find('.tree').tree('getChecked'), function (i, o) {
                    scope.push(o.id);
                });
                payload.scope = JSON.stringify(scope);
                var branch_details = {};
                $.each($(this).closest('.panel-htop').find('.datagrid-f').datagrid('getRows'), function (i, o) {
                    branch_details[o.field] = o.value;
                });
                payload.branch_details = JSON.stringify(branch_details);

                if (scope.length === 0) {
                    msg('Missing selections', 'Please select one or more products to be part of the partial review');
                } else {
                    var panel = $(this).closest('.panel-htop').find('.panel-body');

                    ok_button_click("../data/PPL_pannel.aspx?type=exec_sp_create_partial", payload, function (returnStr) {
                        if (returnStr.sucess) {
                            panel.panel('close');
                            $("#PPLrev24").datagrid("reload");
                            $("#progusr").datagrid("reload");
                        } else {
                            // 
                        }

                    });
                }
            }
        }, {
            text: 'Cancel', iconCls: 'delete-small', width: 90, handler: function () { $(this).closest('.panel-htop').find('.panel-body').panel('close'); }
        }]
        , plugin: 'layout'
        , plugincontent: [{
            region: 'center', title: 'Product scope', plugin: 'tree', plugincontent: {
                cascadeCheck: false
                , dataSet: {
                    treeView: { schema: 'service_reference', table: 'product', column: 'Code', parent: 'Parent', text: 'Name' }
                }
            }
        }, {
            region: 'east', title: 'Details', width: '40%', plugin: 'propertygrid', plugincontent: {
                showGroup: true
                , data: {
                    rows: [
                        { group: "Non Editable:", field: "created_by", name: "Created By", value: $zBody.data("username") }
                        , { group: "Editable:", field: "target_commit_date", name: "Target Commit Date", value: '', editor: { type: "datebox", options: { required: true } } }
                        , { group: "Editable:", field: "target_valid_from", name: "Target Valid-from Date", value: '', editor: { type: "datebox", options: { required: true } } }
                        , { group: "Editable:", field: "comment", name: "Comment", value: "", editor: { type: "validatebox", options: { required: false } } }]
                }
            }
        }]
    });
}

function commit(opt) {
    var zData = $("#PPLrev24").datagrid("getSelected");
    web_part_page({
        dialog: true, title: opt.text, iconCls: opt.iconCls, height: 400
        , plugin: 'layout', plugincontent: [{
            region: 'center', title: '', plugin: 'propertygrid', plugincontent: {
                showGroup: true
                , data: {
                    rows: [{ group: "Not Editable:", name: "Version", field: "version", value: zData.version }
                        , { group: "Not Editable:", name: "Created On", field: "created_on", value: zData.created_on.substring(0, 10) }
                        , { group: "Not Editable:", name: "Created By", field: "created_by", value: zData.created_by }
                        , { group: "Not Editable:", name: "Target Commit Date", field: "target_commit_date", value: zData.target_commit.substring(0, 10) }
                        , { group: "Not Editable:", name: "Target Valid-from Date", field: "target_valid_from", value: zData.target_valid_from.substring(0, 10) }
                        , { group: "Editable:", name: "Valid-from Date", field: "valid_from_date", value: zData.target_valid_from.substring(0, 10), editor: "datebox" }
                        , { group: "Editable:", name: "Comment", field: "comment", value: zData.comment, editor: "text" }]
                }
            }
        }]
        , buttons: [{
            text: 'OK', id: 'dlg_partial_ok', iconCls: 'icon-ok', width: 90, handler: function () {
                var branch_details = {};
                $.each($(this).closest('.panel-htop').find('.datagrid-f').datagrid('getRows'), function (i, o) {
                    branch_details[o.field] = o.value;
                });
                var payload = { branch_details: JSON.stringify(branch_details) };
                var panel = $(this).closest('.panel-htop').find('.panel-body');
                ok_button_click("../data/PPL_pannel.aspx?type=exec_sp_commit_branch", payload, function (returnStr) {
                    if (returnStr.sucess) {

                        panel.panel('close');
                        $("#PPLrev24").datagrid("reload");
                        $("#progusr").datagrid("reload");

                    }
                });
            }
        }, {
            text: 'Cancel', iconCls: 'delete-small', width: 90, handler: function () { $(this).closest('.panel-htop').find('.panel-body').panel('close'); }
        }]
    });
}

function List_price_requests() {
    web_part_page({
        // id: 'lpr1'
        info: { header: 'Price List view', body: '', devops: 41730 }
        , title: 'List_price_requests'
        , plugin: 'datagrid'
        , plugincontent: {
            title: '', sortName: 'id', sortOrder: 'desc', id: 'lpr1dg', pageSize: 10
            , dataSet: {
                view: 'service_ppl.request_log'
                // , preFilter: [{ "field": "guideline",op": "equal", "value": "US_BFB" }]
            }
            // , onLoadSuccess: function (data) { alert('xxx'); $(this).datagrid('sort', 'itemid'); return data;}
        }
    });
}

function test() {
    var data = {
        "total": 4, "rows": [
            { "name": "Name", "value": "Bill Smith", "group": "ID Settings", "editor": "text" },
            { "name": "Address", "value": "", "group": "ID Settings", "editor": "text" },
            { "name": "SSN", "value": "123-456-7890", "group": "ID Settings", "editor": "text" },
            {
                "name": "Email", "value": "bill@gmail.com", "group": "Marketing Settings", "editor": {
                    "type": "validatebox",
                    "options": {
                        "validType": "email"
                    }
                }
            }
        ]
    };
    page_builder({
        id: 'test1'
        , title: 'list_price_servic'
        , type: 'app_tabs'
        , typearray: [
            { id: 'zz1', title: 'dg1', type: 'app_datagrid', typecontent: { dataSet: { sql: "select * from INFORMATION_SCHEMA.TABLES" } } }
            , { id: 'zz2', title: 'dg2', type: 'app_datagrid', typecontent: { dataSet: { view: "service.log" } } }
            , { id: 'zz3', title: 'accord', type: 'app_accordion', typearray: [{ title: '1', content: 'xxxx' }, { title: '2', type: 'app_propertygrid', typecontent: {} }, { title: '3', type: 'app_datagrid', typecontent: { dataSet: { sql: "select * from INFORMATION_SCHEMA.COLUMNS" } } }] }
            , { id: 'zz4', title: 'panel', type: 'app_panel', typecontent: { title: 'xxxx', type: 'app_propertygrid', typecontent: { xdata: {} } } }
            , { id: 'zz5', title: 'd-list', type: 'app_datalist', typecontent: { title: 'ccc', data: [{ text: 'xx', state: 'open' }, { text: 'yy' }] } }
            , { id: 'zz6', title: 'tab', type: 'app_tabs', typecontent: { tabPosition: 'left' }, typearray: [{ type: 'app_tabs', typearray: [{ type: 'app_tabs', typearray: [{}, {}] }, {}] }, {}] }
            , { id: 'zz7', title: 'tree', type: 'app_tree', typecontent: { data: [{ text: 'zx', state: 'closed', children: [{ text: 'xx' }, { text: 'xz' }] }, { text: 'xv' }] } }
            , { id: 'zz8', title: 'treegrid', type: 'app_panel', typecontent: { title: 'xxxx', type: 'app_treegrid', typecontent: "" } }
            , { id: 'zz9', title: 'sidemenu', type: 'app_sidemenu', typecontent: "" }
            , { id: 'zz10', title: 'chart', type: 'app_chartjs', typecontent: { dataSet: { sql: "select 10 a,20 b union select 15,25 union select 20,22;" } } }
            , { id: 'zz11', title: 'lay', type: 'app_layout', typearray: [{ region: 'center', title: 'center' }, { region: 'west', type: 'app_propertygrid' }, { region: 'north', type: 'app_propertygrid' }] }
            , { id: 'zz22', title: 'dg3', type: 'app_datagrid' }
            , { id: 'zz13', title: 'gauge', type: 'app_gauge', typecontent: { dataSet: { sql: "select 10 value, 'a' title union select 20,'b'" } } }
        ]
    });
}

function test2() {
    var data = {
        "total": 4, "rows": [
            { "name": "Name", "value": "Bill Smith", "group": "ID Settings", "editor": "text" },
            { "name": "Address", "value": "", "group": "ID Settings", "editor": "text" },
            { "name": "SSN", "value": "123-456-7890", "group": "ID Settings", "editor": "text" },
            {
                "name": "Email", "value": "bill@gmail.com", "group": "Marketing Settings", "editor": {
                    "type": "validatebox",
                    "options": {
                        "validType": "email"
                    }
                }
            }
        ]
    };
    page_builder2({
        type: 'page'
        , id: 'test1'
        , title: 'list_price_servic'
        , content: {
            type: 'tabs'
            , array: [
                { id: 'zz1', title: 'dg1', content: { type: 'datagrid', id: 'dg2zz1', dataSet: { sql: "select * from INFORMATION_SCHEMA.TABLES" } } }
                , { id: 'zz2', title: 'dg2', content: { type: 'datagrid', id: 'dg2zz2', dataSet: { view: "service.log" } } }
                , { id: 'zz3', title: 'accord', type: 'accordion', array: [{ id: 'zz3acco1', title: 'content:xxxx', content: 'xxxx' }, { id: 'xxcc', title: 'href:system', href: 'system/Default.aspx', content: 'cccc' }, { id: 'zz3acco2', title: '2', content: { id: 'xxyy', type: 'propertygrid' } }, { id: 'zz3acco4', title: '3', content: { id: 'zz3acco4dg', type: 'datagrid', dataSet: { sql: "select * from INFORMATION_SCHEMA.COLUMNS" } } }] }
                , { id: 'zz4', title: 'panel', type: 'panel', content: { title: 'xxxx', type: 'propertygrid', content: { xdata: {} } } }
                , { id: 'zz5', title: 'd-list', type: 'datalist', content: { title: 'ccc', data: [{ text: 'xx', state: 'open' }, { text: 'yy' }] } }
                , { id: 'zz6', title: 'tab', content: { type: 'tabs', tabPosition: 'left', array: [{ type: 'tabs', typearray: [{ type: 'tabs', typearray: [{}, {}] }, {}] }, {}] } }
                , { id: 'zz7', title: 'tree', type: 'tree', content: { data: [{ text: 'zx', state: 'closed', children: [{ text: 'xx' }, { text: 'xz' }] }, { text: 'xv' }] } }
                , { id: 'zz8', title: 'treegrid', type: 'panel', content: { title: 'xxxx', type: 'treegrid', content: "" } }
                , { id: 'zz9', title: 'sidemenu', type: 'sidemenu', content: "" }
                , { id: 'zz10', title: 'chart', type: 'chartjs', content: { dataSet: { sql: "select 10 a,20 b union select 15,25 union select 20,22;" } } }
                , { id: 'zz11', title: 'lay', type: 'layout', typearray: [{ region: 'center', title: 'center' }, { region: 'west', type: 'propertygrid' }, { region: 'north', type: 'propertygrid' }] }
                , { id: 'zz22', title: 'dg3', type: 'datagrid' }
                , { id: 'zz13', title: 'gauge', type: 'gauge', content: { dataSet: { sql: "select 10 value, 'a' title union select 20,'b'" } } }
            ]
        }
    });
}

function list_price_service_pop() {
    var test_items = 'xxxx,01A1008701,01A1055401';
    var bfb_items = '3287133205,3287099352,3287099353,3287099358,3287099359,3287099360,3287099361,3287099363,3287103910,3287103911,3287103912,3287103913,3287103914,3287103915,3287133774,3287133775,3287133776,3287133777,3287133778,3287133779,3287133780,3287133204,3287130117,3287084893,3287084894,3287084895,3287084896,3287084897,3287084898,3287126488,3287126487,3287083717,3287083718,3287083719,3287083720,3287083721,3287083723,3287083725,3287083726,3287083727,3287155302,3287155306,3287156485,3287155309,3287155310,3287155311,3287155312,3287155313,3287155314,3287084411,3287084412,3287084414,3287084415,3287084565,3287084567,3287084569,3287084571,3287084573,3287084574,3287084579,3287084581,3287084583,3287084584,3287084585,3287061352,3287061353,3287061354,3287112615,3287112616,3287112617,3287112619,3287112620,3287128187,3287128188,3287128189,3287128196,3287128190,3287128191,3287120469,3287119753,3287119755,3287099218,3287099219,3287119754,3287144642,3287144643,3287144644,3287144645';
    var gphe_items = '3238729701,3238729801,3238729901,3238731002,3238731201,3238731101,3238731001,3238731301,3238731003,3238731302,3238731303,3238731304,3238731305,3238731401,3238731402,3238731501,32389003,32389001,32389002';
    var ret = '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=USD&industry=16&geo_political_area=US&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + bfb_items + '&" target="_blank">regional_industry_listprice_US_BFB</a><br>';
    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=AUD&industry=16&geo_political_area=AU&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + bfb_items + '&" target="_blank">regional_industry_listprice_AU_BFB</a><br>';
    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=NZD&industry=16&geo_political_area=NZ&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + bfb_items + '&" target="_blank">regional_industry_listprice_NZ_BFB</a><hr>';

    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=USD&geo_political_area=US&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + bfb_items + '&" target="_blank">regional_listprice_US_BFB</a><br>';
    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=AUD&geo_political_area=AU&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + bfb_items + '&" target="_blank">regional_listprice_AU_BFB</a><br>';
    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=NZD&geo_political_area=NZ&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + bfb_items + '&" target="_blank">regional_listprice_NZ_BFB</a><hr>';


    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=NZD&industry=15f2f1c2-82d2-4f1e-bf6b-4793a6741460&geo_political_area=NZ&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + bfb_items + '&" target="_blank">regional_industry_listprice_NZ_BFB using 38 digit industry id</a><hr>';

    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=USD&industry=16&geo_political_area=US&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + gphe_items + '&" target="_blank">regional_industry_listprice_US_GPHE</a><br>';
    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=AUD&industry=16&geo_political_area=AU&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + gphe_items + '&" target="_blank">regional_industry_listprice_AU_GPHE</a><br>';
    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=NZD&industry=16&geo_political_area=NZ&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + gphe_items + '&" target="_blank">regional_industry_listprice_NZ_GPHE</a><hr>';

    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=USD&geo_political_area=US&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + gphe_items + '&" target="_blank">regional_listprice_US_GPHE</a><br>';
    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=AUD&geo_political_area=AU&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + gphe_items + '&" target="_blank">regional_listprice_AU_GPHE</a><br>';
    ret = ret + '<a href="http://' + zApi + '/api/pim_list_price.aspx?response_type=html&to_currency=NZD&geo_political_area=NZ&token=3FC8642D-1A70-4A60-A928-DE24980A2DC1&item=' + gphe_items + '&" target="_blank">regional_listprice_NZ_GPHE</a><br>';

    web_part_page({
        id: 'pslps1'
        , window: true
        , content: ret
        , title: 'list_price_servic'
    });
}

function PPL_setters_pop() {
    web_part_page({
        id: 'PPL_setters_pop'
        , title: 'PPL setters and products', iconCls: 'icon-user-small'
        , window: true
        , modal: false
        , width: 1000
        , height: 500
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', title: '', width: 200
            , plugin: 'datagrid'
            , plugincontent: {
                title: ''
                , dataSet: {
                    sql: "SELECT * FROM service_reference.person"
                    , showColumns: [{ field: 'name', width: 100 }, { field: 'organizational_unit', title: 'org', width: 40 },]
                    , noEdit: true
                }
                , sortName: 'name', sortOrder: 'asc'
                , onSelect: function (index, row) {
                    var dg = $($(this).closest('.window').find('.datagrid-f')[1]);
                    var opt = dg.datagrid('options');
                    opt.queryParams.preFilter = '[{ "field": "person", "op": "equal", "value": "' + row.name + '" }]';
                    dg.datagrid('reload');

                }
            }
        }, {
            region: 'center', title: '',
            plugin: 'datagrid'
            , plugincontent: {
                title: ''
                , sortName: 'product', sortOrder: 'asc'
                , dataSet: {
                    view: 'service_ppl.profile'
                    , showColumns: [{ field: 'product', width: 60 }, { field: 'organizational_unit', title: 'org', width: 40 }, { field: 'source', title: 'src', width: 40 }, { field: 'person', title: 'person', width: 70 },]
                }
                , onSelect: function (index, row) {
                    var tree = $(this).closest('.window').find('.tree');
                    var options = tree.tree('options');
                    options.animate = false;
                    var node = tree.tree('find', row.product);
                    tree.tree('expandTo', node.target).tree('scrollTo', node.target).tree('select', node.target);
                    options.animate = true;
                }
            }
        }, {
            xid: 'qwer', region: 'east', plugin: 'tree', title: 'PPL-setters products', width: '45%'
            , plugincontent: {
                xid: 'qwert'
                , cascadeCheck: true
                , dataSet: {
                    treeView: { schema: 'service_reference', table: 'product', column: 'Code', parent: 'Parent', text: 'Name' }
                    , preView: 'service_ppl.profile.product'
                    , preSelections: { schema: 'service_ppl', table: 'profile', column: 'product' }
                }
                , onSelect: function (node) {
                }
                , onBeforeCheck: function (node, checked) {
                    var dg = $(this).closest('.window').find('.datagrid-f');
                    var tree = $(this);[1]
                    using('messager', function () {
                        if (checked) {
                            $.messager.confirm('Confirm', 'Are you sure you want to add ' + node.id + '?', function (r) {
                                if (r) {
                                    $.post('../data/tree_provider.aspx?requesttype=update', $.extend(tree.tree('options').queryParams, { cid: node.id, checked: checked }));
                                    tree.tree('update', { target: node.target, checked: checked });
                                    dg.datagrid('reload');
                                }
                            });
                        } else {
                            $.messager.confirm('Confirm', 'Are you sure you want to remove ' + node.id + ' as fully rolled-out?', function (r) {
                                if (r) {
                                    $.post('../data/tree_provider.aspx?requesttype=update', $.extend(tree.tree('options').queryParams, { cid: node.id, checked: checked }));
                                    tree.tree('update', { target: node.target, checked: checked });
                                    dg.datagrid('reload');
                                }
                            });
                        }

                    });
                    return false;
                }
            }
            , tools: [{
                iconCls: 'pagination-load', handler: function () {
                    var tree = $(this).closest('.panel').find('.tree');
                    tree.tree('reload');
                }
            }]
        }]
    });
}

function PPL_setters2_pop() {
    web_part_page({
        id: 'psp2'
        , dialog: true
        , width: 400
        , plugin: 'datagrid'
        , plugincontent: {
            title: 'PPL_setters2_pop', iconCls: 'icon-user-small'
            , dataSet: {
                view: 'service_guidelines.market_segment_discount'
                , preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
            }
        }
    });
}

function List_pricing() {
    web_part_page({
        //id: 'lpri'
        title: 'List pricing'
        , plugin: 'layout'
        , plugincontent: [{
            region: 'west', width: 200, title: 'Guidelines', iconCls: 'user_market-small', plugin: 'datagrid', plugincontent: {
                dataSet: {
                    view: 'service_guidelines.guideline'
                    , showColumns: [{ field: 'guideline', width: 80 }]
                }
                , sortName: 'guideline', sortOrder: 'asc'
                , onSelect: function (i, r) {
                    var dg = $('#Market_segment_discounts343');
                    var options = dg.datagrid('options');
                    options.queryParams.preFilter = '[{"field":"guideline","op":"equal","value":"' + r.guideline + '"}]'
                    dg.datagrid('reload');
                }

            }
        }, {
            region: 'center', plugin: 'datagrid'
            , title: 'Market-segment discounts', iconCls: 'list_price-small', id: 'Market_segment_discounts343'
            , plugincontent: {
                title: ''
                // , id: 'lprixx'
                , dataSet: {
                    noEdit: false
                    , view: 'service_guidelines.market_segment_discount'
                    , showColumns: [
                        { field: "id" }
                        , { field: "client", title: "client", width: 60 }
                        , { field: "guideline", title: "Guideline" }
                        , { field: "product", title: "Product", width: 130 }
                        , { field: "geopol", title: "Geopol", width: 130 }
                        , { field: "industry", title: "Industry", width: 130 }
                        , { field: "base_discount", title: "BaseDisc", width: 70 }
                        , { field: "max_discount", title: "MaxDisc", width: 70 }
                        , { field: "disabled", title: "disabled", width: 60 }
                    ]
                }
            }
        }]
    });
}

function PPL_fx() {
    web_part_page({
        id: 'PPL_fx'
        , title: 'PPL_fx'
        , plugin: 'layout'
        , plugincontent: [
            {
                id: 'PPL_tabs_fxly', region: 'center', title: 'Trend from 2008', iconCls: 'currency-small' // currency-large
                , plugin: 'tabs'
                , plugincontent: {
                    tabHeight: 25, data: [], tools: [{
                        id: 'downloads'
                        , iconCls: 'icon-paste'
                        , size: 'small'
                        , handler: function () {
                            //
                        }
                    }]
                }
            }
            // , { region: 'east', app_datagrid: { dataSet: { view: 'curr.currency' } } }
            , {
                region: 'west', width: 290, title: 'PPL-currency', iconCls: 'bar-chart-small'
                , plugin: 'datagrid'
                , id: 'pc3'
                , plugincontent: {
                    sortName: 'Diff', sortOrder: 'desc'
                    , title: ''
                    , viewSet: { rowEdit: ['e', 'i', 'd'], menu: [{ text: 'Add PPL-exchange rate', iconCls: 'currency-small', function_name: 'Add_PPL_exchange_rate' }] }
                    , dataSet: {
                        view: 'curr.v_getLatest', noEdit: true
                        , showColumns: [{ field: "to_curr", title: "To", width: 50 }, { field: "PPL", width: 50 }, { field: "External", title: "Ext", width: 70 }, { field: "Diff" }]
                        , preFilter: [{ field: "to_curr", "op": "in", "value": "AUD,USD,NZD,CAD" }]
                    }
                    , onSelect: function (index, row) {
                        $("#add_fx").linkbutton("enable");
                        var $tabs = $("#PPL_tabs_fxly");
                        if ($('#PPL_tabs_fxly').tabs('exists', row.to_curr)) { $('#PPL_tabs_fxly').tabs('select', row.to_curr); } else {
                            $tabs.tabs('add', {
                                id: row.to_curr, title: row.to_curr, doSize: true, href: '../data/chart_js.aspx?name=il3&view=curr.v_currency_rate&rate=' + row.to_curr
                                , onBeforeOpen: function (index, row) { } // $('#tpc0').tabs('options')[multiple]=true;
                            });
                        }
                    }
                }
            }

            // from_curr to_curr value type from_date
        ]
    });
}

function Add_PPL_exchange_rate(dg, obj) {
    var row = dg.datagrid('getSelected');
    var general = {
        labelWidth: 100
        , buttons: [{ name: 'Save', type: 'submit' }, { name: 'Cancel', type: 'cancel' }]
        , postAction: ["$('#pc3').datagrid('reload')"]
    };
    var controls = [
        { name: 'client', label: 'Client:', type: 'textbox', value: '100', editable: false, align: 'right' }
        , { name: 'currency_set', label: 'Currency-set:', type: 'textbox', editable: false, required: true, labelWidth: 100, value: row.from_curr + '-' + row.to_curr }
        , { name: 'value', label: 'PPL-fx rate:', type: 'numberbox', precision: 8, required: true, value: row.PPL }
        , { name: 'from_date', label: 'From-date:', type: 'datebox', required: true, iconAlign: 'left' }
        , { name: 'created_by', label: 'Created by:', type: 'textbox', required: true, value: $zBody.data("username"), editable: false }
    ];
    var $cont = $("<form/>", { id: "ff", method: "post", style: 'padding: 20px 20px;' });
    $.each(controls, function (i, o) {
        var options = $.extend({ style: 'width:200px;', class: "easyui-" + o.type, labelWidth: 80 }, o);
        $cont.append($("<div/>", { style: "margin-bottom:10px" }).append($('<input/>', options)));
    });

    var $btn = $("<div/>", { id: "ff", method: "post", style: 'text-align:center; padding: 5px' });
    $btn.append($('<span/>').linkbutton({
        text: 'Save', width: 80, onClick: function () {
            using(['form', 'messager'], function () {
                $.messager.progress();
                $('#ff').form('submit', {
                    url: 'lab/form_submit.aspx'
                    , queryParams: { payload: JSON.stringify({ form: $('#ff').serializeArray(), view: 'curr.currency_rate_ppl', type: 'add' }) }
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
                            $("#pc3").datagrid("reload");
                            $("#" + row.to_curr).panel("refresh");

                        } else {
                            msg("Error when saved", "Error:<br>" + data.errorMsg);
                        }

                    }
                    , onLoadError: function () { alert('error'); }
                });
            });
        }
    }));
    $btn.append($('<span/>').text(" "));
    $btn.append($('<span/>').linkbutton({ text: 'Cancel', width: 80, onClick: function () { $('#ff').closest('.window-body').panel('close'); } }));

    web_part_page({
        id: 'Add_PPL_exchange_rate343'
        , title: 'Add PPL-exchange rate'
        , destroy: true
        , window: true
        , height: 260
        , width: 300
        , modal: false
        , content: $cont.append($btn)
    });
}

function add_fx() {
    Add_PPL_exchange_rate($("#pc3"), {});
}

function List_PPL_fx_pop() {
    web_part_page({
        id: 'pera1'
        , title: 'PPL-exchange rate'
        , window: true
        , modal: false
        , width: 700
        , plugin: 'datagrid'
        , plugincontent: {
            title: ''
            , sortName: 'from_date', sortOrder: 'desc'
            , dataSet: {
                view: 'curr.v_currency_rate'
                , preFilter: [{ "field": "type", "op": "equal", "value": "PPL" }]
            }
        }
    });
}

function resizeCanvas(row) {
    var canvas = document.getElementById("canvas_" + row.to_curr);//.getContext("2d");
    if (canvas) {
        ctx = canvas.getContext("2d");
        window.myLine = new Chart(ctx, {
            type: 'line',
            data: {
                labels: iLabels,
                datasets: datasets
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                title: { display: false, text: 'Chart.js Line Chart' },
                tooltips: { mode: 'index', intersect: false },
                hover: { mode: 'nearest', intersect: false },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Value'
                        }
                    }]
                }
            }
        });
    }
}
var showColumns_GIM = [
    { field: 'GLOBAL_TIPAITID', title: 'Item number' }
    , { field: 'TICATLG', title: 'Product' }
    , { field: 'TICUSUNO', title: 'MainSupp' }
    , { field: 'TIITNAME', title: 'Item Name    ' }
    , { field: 'TIITDESC', title: 'Description' }
    , { field: 'TISTATUS', title: 'Stat' }
    , { field: 'TIITGCDE', title: 'Class' }
    , { field: 'TIPRGCDE', title: 'Type' }
    // , { field: 'TIITYCDE', title: 'Type2' }
    , { field: 'TIPRICE', title: 'PPL    ' }
    , { field: 'TICURR', title: 'Curr' }
    //, { field: 'TIPURPRI', title: 'TransferPrice' }
    //, { field: 'TIPURCURR', title: 'TP Curr' }
    //, { field: 'TIAD1NUM', title: 'TIAD1NUM' }
    , { field: 'createdON', title: 'createdON' }
];