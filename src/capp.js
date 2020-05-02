// see client_spa.xlsx

function web_part_page(iPage) {
    var isNew = false;
    var wp_opt = getSTDoptions(iPage);
    if (iPage.window) {
        if ($('#win_' + wp_opt.thisID).length > 0 && iPage.destroy) { $('#win_' + wp_opt.thisID).remove(); }
        if ($('#win_' + wp_opt.thisID).length > 0) { $('#win_' + wp_opt.thisID).window('open'); }
        else {
            if (wp_opt.thisID.substring(0, 1) == "_") {
                msg('Warning, set ID for propper function', iPage.title || iPage);
            }
            $('body').append($('<div/>', { id: 'win_' + wp_opt.thisID }));
            delete iPage.id;
            var $window = $.extend({}, { title: wp_opt.title, width: 500, height: 300, fit: false, modal: true, content: wp_opt.$content, href: wp_opt.href }, iPage);
            if ($window.height > this.innerHeight) { $window.height = this.innerHeight - 10; }
            if ($window.width > this.innerWidth) { $window.width = this.innerWidth - 10; }
            // console.log($window);
            using('window', function () {
                $('#win_' + wp_opt.thisID).window($window);
            });
            isNew = true;
        }

    } else if (iPage.dialog) {
        if ($('#dlg_' + wp_opt.thisID).length > 0) { $('#dlg_' + wp_opt.thisID).dialog('open'); }
        else {
            using(['dialog', 'window', 'panel', 'linkbutton', 'resizable'], function () {
                $('body').append($('<div/>', { id: 'dlg_' + wp_opt.thisID }));
                delete iPage.id;
                var $dialog = $.extend({}, {
                    title: wp_opt.title, resizable: true, collapsible: true, maximizable: true, width: 500, height: 300, modal: true, iconCls: "icon-save"
                    , toolbar: [{ text: 'Add', iconCls: 'icon-add' }, { text: 'Edit', iconCls: 'icon-edit' }]
                    , buttons: [
                        {
                            text: 'OK', id: 'app_dialog_ok', iconCls: 'icon-ok', width: 90, handler: function () {
                                var pg = $(this).closest('.panel-htop').find('.datagrid-f');
                                using('propertygrid', function () {
                                });

                            }
                        }
                        , {
                            text: 'Cancel', iconCls: 'delete-small', width: 90, handler: function () {
                                $(this).closest('.panel-htop').find('.panel-body').first().dialog('close');
                            }
                        }
                    ], fit: false, content: wp_opt.$content, href: wp_opt.href
                }, iPage);
                if ($dialog.height > this.innerHeight) { $dialog.height = this.innerHeight - 10; } if ($dialog.width > this.innerWidth) { $dialog.width = this.innerWidth - 10; }
                $('#dlg_' + wp_opt.thisID).dialog($dialog);
            });
            isNew = true;
        }
    } else {
        if ($('#tt0').tabs('exists', wp_opt.title)) { $('#tt0').tabs('select', wp_opt.title); }
        else {
            $('#tt0').tabs('add', $.extend({}, { id: 'tab_' + wp_opt.thisID, title: wp_opt.title, closable: true, content: wp_opt.$content, href: wp_opt.href }));
            isNew = true;
        }
    }
    if (isNew && wp_opt.type > 2) {
        web_part_plugin(iPage, wp_opt.$content);
    }
}


function web_part_plugin(iPage, $parent) {
	/* The two web_part types are 
	 *		1)page, 
	 *		2)window. 
	 *	Both contains a tree of web_part_plugins defined in the master_object with default, dependant and enrich content.
	 * A web-part contains one of 
	 *		href:'[string]'
	 *		content:'[string]' 
	 *		plugin:'[string]'.
	 *		
	 * Where plugin is followed by plugincontent:{object}/[array].
	 *		- if plugincontent is omitted, default is applied via master_object.
	 *		- enriched for optimal standard use-cases.
	 *		- design-time definition overwrites enriched, overwrites defaults.
	 *		- array have one or more content holders as tabs or layouts.
	 *		- object have no or one content holder. E.g. no for data and propertygrid, one for panel.
	 *		- gets a DOM id defined by 
	 *			(shall be data:)[arrays] (tabs/layout/accordion) and Panel has place-holders with DOM id. If omitted, use generic (prev+[arr]index)
	 *			{object} (datagrid,datalist,linkbutton,propertygrid,sidemenu,tree,treegrid,panel) By object id. If omitted, use generic (prev+hash)
	 *			If other id is needed, use HC prefix to the id
	 * 
	 * page, window and web_part_plugin checks plugin against master_object for type.
	 *		plugin objects: propertygrid, datagrid, datalist, tree, treegrid, sidemenu, panel, layout, tabs, accordion, gauge, chartjs
	 *		plugin types are: -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
	 *		(plugin object types: 1:static, 2=panel, 3=array, 4=special)
	 *		
	 * for href and content string to directly populate content.
	 *		if type is object or array, it checks for 
	 *		if from page or windows, this web-parts href and content properties shall be used
	 *		else the target web-part shall be used
	 *	
	 *	Note: content is forwarded for string but not for object - where it is converted to json object
	 */

    if (!iPage) return;

    var wp_opt = getSTDoptions(iPage);
    // console.log(wp_opt);
    if (wp_opt.type === 0) {
        msg('Missing plugin ', wp_opt.$content + ', plugincontent: ' + JSON.stringify(iPage));
    } else if (wp_opt.type <= 3) {
        using(wp_opt.obj_using, function () {
            // datagrid,datalist,linkbutton,propertygrid,sidemenu,tree,treegrid,panel
            var options;
            switch (wp_opt.plugin) {
                case "datagrid":
                    using('datagrid', function () {
                        options = $.extend(wp_opt.default_plugincontent, iPage.plugincontent);
                        $.extend(options, extend_datagrid(iPage));
                        $parent[wp_opt.plugin]($.extend({}, options, iPage.plugincontent));
                    });
                    break;
                case "tree":
                    using(['tree', 'searchbox'], function () {
                        options = $.extend(wp_opt.default_plugincontent, iPage.plugincontent);
                        $.extend(options, extend_tree(iPage));
                        $parent.tree(options).panel({
                            title: "<div id='search" + wp_opt.thisID + "' style=''></div>"
                            , tools: [{
                                iconCls: 'search-small', handler: function () {
                                    // console.log($(this).closest('.panel-body').panel('options'));
                                    $('#search' + wp_opt.thisID).searchbox({
                                        width: 80, height: 15
                                        , searcher: function (value) {
                                            var tree = $(this).closest('.panel ').find('.tree');
                                            var options = tree.tree('options');
                                            // console.log(options);
                                            if (value === "") { options.queryParams.preFilter = ""; }
                                            else {
                                                options.queryParams.preFilter = JSON.stringify([{ "field": "Name", "op": "contains", "value": value }, { "field": "Code", "op": "contains", "value": value, "isOR": true }]);
                                                var treeView = JSON.parse(options.queryParams.treeView);
                                                treeView.type = "e";
                                                options.queryParams.treeView = JSON.stringify(treeView);
                                            }
                                            tree.tree('reload');
                                            // var node = tree.tree('find', value);
                                            // var node = tree.tree('find', { text: value });
                                            // tree.tree('select', node.target).tree('expandTo', node.target).tree('scrollTo', node.target);
                                            msg('Search', value);
                                            // console.log($(this).searchbox('options'));
                                        }
                                        , prompt: 'Search'
                                    });
                                }
                            }, { iconCls: 'reload-small', handler: function () { $(this).closest('.panel ').find('.tree').tree('reload'); } }, { iconCls: 'hier-small', handler: function () { $(this).closest('.panel ').find('.tree').tree('expandAll'); } }, { iconCls: 'hier-small', handler: function () { $(this).closest('.panel ').find('.tree').tree('collapseAll'); } }, { iconCls: 'cog-small', handler: function () { tree_clickHeaderMenu(this); } }]
                        });
                    });
                    break;
                case "datalist":
                    using(['datalist', 'datagrid'], function () {
                        var extend = { lines: true, queryParams: {} };
                        if (iPage.plugincontent.dataSet) {
                            extend.url = "../data/list_provider.aspx";
                            $.each(iPage.plugincontent.dataSet, function (i, o) { extend.queryParams[i] = o; });
                        }
                        options = $.extend(wp_opt.default_plugincontent, iPage.plugincontent);
                        $.extend(options, extend);
                        $parent.datalist($.extend({}, options, iPage.plugincontent));
                    });
                    break;
                case "validatebox":
                case "textbox":
                case "passwordbox":
                case "maskedbox":
                case "combo":
                case "combobox":
                case "combotree":
                case "combogrid":
                case "combotreegrid":
                case "tagbox":
                case "numberbox":
                case "datebox":
                case "datetimebox":
                case "datetimespinner":
                case "calendar":
                case "spinner":
                case "numberspinner":
                case "timespinner":
                case "timepicker":
                case "slider":
                case "filebox":
                case "checkbox":
                case "radiobutton":

                case "linkbutton":
                case "propertygrid":
                case "sidemenu":
                case "treegrid":
                    options = $.extend(wp_opt.default_plugincontent, iPage.plugincontent);
                    $parent[wp_opt.plugin]($.extend({}, options));
                    break;
            }
        });
    } else if (wp_opt.type === 4) {
        switch (wp_opt.plugin) {
            case "form":
                using(['form', 'validatebox', 'textbox'], function () {
                    var $content = $("<form/>", { class: "easyui-form", id: "ffxx", method: "post", style: "margin:10px 0px 10px 10px" });
                    $parent.wrap($content);
                    // web_part_plugin({}, $content);
                });
                break;
            case "panel":
                using(['panel', 'dialog', 'window', 'linkbutton'], function () {
                    var thisID = wp_opt.thisID;
                    var $content = $('<div/>', { id: thisID, fit: true });
                    $parent.panel($.extend({ id: 'pan' + thisID, title: thisID, content: $content }, iPage.plugincontent));
                    web_part_plugin(iPage.plugincontent, $content);
                    /*
                                if (eOpt.type >= 3) web_part_plugin(o, $eContent);
                                */
                    // var options = $.extend(wp_opt.default_plugincontent, iPage.plugincontent);
                    // $parent.panel($.extend({}, options));
                    //web_part_plugin(iPage.plugincontent, wp_opt.$content);
                });
                break;
        }
    } else if (wp_opt.type === 5) { // array as tabs/layout/accordion
        switch (wp_opt.plugin) {
            case "layout":
                using('layout', function () {
                    $parent.layout();
                    $.each(iPage.plugincontent, function (i, o) {
                        //console.log(o);
                        var eOpt = getSTDoptions(o);
                        var eThisID = o.id || wp_opt.thisID + i;
                        var $eContent = $('<div/>', { id: eThisID, fit: true });
                        delete o.id;
                        $parent.layout('add', $.extend(wp_opt.default_parts, { id: 'h' + eThisID, title: eThisID, content: $eContent }, o)); // eOpt.default_parts,
                        if (eOpt.type >= 3) web_part_plugin(o, $eContent);
                    });
                });
                break;
            case "tabs":
                using('tabs', function () {
                    $parent.tabs(iPage.plugincontent);
                    $.each(iPage.plugincontent.data, function (i, o) {
                        var eOpt = getSTDoptions(o);
                        var eThisID = o.id || wp_opt.thisID + i;
                        var title = o.title || o.id || wp_opt.thisID + i;
                        var $eContent = $('<div/>', { id: eThisID, fit: true });
                        $parent.tabs('add', $.extend({ id: 'h' + i, title: title, content: $eContent }, o)); // eOpt.default_parts,
                        if (eOpt.type >= 3) web_part_plugin(o, $eContent);
                    });
                    $parent.tabs();
                });
                break;
            case "accordion":
                using(wp_opt.obj_using, function () {
                    $parent[wp_opt.plugin]();
                    $.each(iPage.plugincontent || wp_opt.default_plugincontent, function (i, o) {
                        var eOpt = getSTDoptions(o);
                        var eThisID = o.id || wp_opt.thisID + i;
                        var $eContent = $('<div/>', { id: eThisID, fit: true });
                        delete o.id;
                        $parent[wp_opt.plugin]('add', $.extend(wp_opt.default_parts, { id: 'h' + eThisID, title: eThisID, content: $eContent }, o)); // eOpt.default_parts,
                        if (eOpt.type >= 3) web_part_plugin(o, $eContent);
                    });
                    $parent[wp_opt.plugin]();
                });
                break;
        }

    } else if (wp_opt.type === 6) {
        switch (wp_opt.plugin) {
            case 'chartjs':
                //console.log($parent.attr("id"), iPage);
                using('chartjs', function () {
                    $parent.wrap($('<canvas/>', { id: 'js_' + $parent.attr("id") }));
                    var ctx = $('#js_' + $parent.attr("id"));
                    var config = chart_default();
                    // config.options.legend.labels.fontColor = 'red';
                    window.myChart = new Chart(ctx, config);
                    if (iPage.data) {
                        config.data.labels = iPage.data.labels;
                        config.data.datasets = iPage.data.datasets;
                        window.myChart.update();
                    } else {
                        var chartjs_payload; if (iPage.plugincontent) { chartjs_payload = iPage.plugincontent; } else { chartjs_payload = { "sql": "select 10 value, 'a' title union select 20,'b'" }; }
                        $.post("../data/chart_js_srv_get.aspx", { payload: JSON.stringify(chartjs_payload) }, function (data) {
                            var zData = JSON.parse(data);
                            config.data.labels = zData.labels;
                            config.data.datasets = zData.datasets;
                            window.myChart.update();
                        }).fail(function () { alert("error"); });
                    }
                });

                break;
            case 'gauge':
                using('gauge', function () {
                    var gauge_payload; if (iPage.plugincontent) { gauge_payload = iPage.plugincontent.dataSet; } else { gauge_payload = { "sql": "select 10 value, 'a' title union select 20,'b'" }; }
                    $.post("../data/gauge.aspx", { payload: JSON.stringify(gauge_payload) }, function (data) {
                        var gauge_Data = JSON.parse(data);
                        $.each(gauge_Data, function (i, o) {
                            $parent.append($('<canvas />', { id: wp_opt.thisID + i }));
                            var gauge_mand = { renderTo: wp_opt.thisID + i, value: 0 };
                            // “linear”, “quad”, “quint”, “cycle”, “bounce”, “elastic” and their opposites: “dequad”, “dequint”, “decycle”, “debounce”, “delastic”.
                            var zopt = { width: 150, height: 150, units: "%", title: i, animatedValue: true, animationDuration: 2500, animationRule: "bounce" };
                            var gauge_PS = new RadialGauge($.extend(zopt, o, gauge_mand));
                            gauge_PS.draw();
                            gauge_PS.value = o.value;
                        });
                    }).fail(function () { alert("error"); });
                });
                break;
            case 'linkbuttons':
                // $parent.wrap('<div/>', { style: "padding:5px 0;" });
                $parent.wrap($('<span/>', { style: 'padding:5px 0px; float: right' }));
                $.each(iPage.plugincontent || wp_opt.default_plugincontent, function (i, o) {
                    $parent.append($('<span/>').linkbutton($.extend({ id: 'btn' + wp_opt.thisID + i }, o)));
                    $parent.append($('<span/>', { style: 'padding:0px 3px;' }));
                });
                break;
            case 'jexcel':
                var options = $.extend(wp_opt.default_plugincontent, iPage.plugincontent);
                using(['jexcel', 'jsuites'], function () {
                    $parent.jexcel(options);
                });
                break;
        }
    }
}

function tree_clickHeaderMenu(target) {
    var menu = $("<div/>", { class: "easyui-menu" }).menu();
    menu.menu('appendItem', { text: 'Something', iconCls: 'filter-small', handler: function () { msg('Something', 'Something') } });
    menu.menu('appendItem', { separator: true });
    menu.menu('appendItem', { text: 'Exit', iconCls: 'exit', handler: function () { } });
    menu.menu('show', { left: 25 + $(target).offset().left, top: -(0) - 10 + $(target).offset().top, align: 'right' });
}

function getType(iPage) {
    // type -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    var type = 0;
    if (!iPage) { return type; }
    else if ($.type(iPage.content) === "string") { type = 1; }
    else if (iPage.href) { type = 2; }
    else if (master_object()[iPage.plugin]) { type = master_object()[iPage.plugin].type; }
    else if (iPage.plugincontent === 'undefined') { type = -1; }
    return type;
}

function getSTDoptions(iPage) {
    var zRet = {};
    var childtype;
    var default_parts;
    var thisID = iPage.id || hashID(JSON.stringify(iPage));
    var title = iPage.title || thisID;
    var type = getType(iPage);
    var plugin = iPage.plugin;
    var $content; var href;
    var default_plugincontent; var obj_dependant; var obj_enrich; var obj_using;
    if (type === 0) { $content = " title: " + title + ", plugin: " + iPage.plugin + ", #type: " + type, ", thisID: ", thisID; } else if (type <= 2) { $content = iPage.content; href = iPage.href; }
    else {
        if (type === 3 || type === 4) { childtype = getType(iPage.plugincontent); }
        else if (type === 5) { default_parts = master_object()[iPage.plugin].default_parts; }
        default_plugincontent = master_object()[iPage.plugin].default;
        obj_dependant = master_object()[iPage.plugin].dependant;
        obj_enrich = master_object()[iPage.plugin].enrich;
        obj_using = master_object()[iPage.plugin].using;
        if (!iPage.plugincontent) { $content = 'missing plugincontent'; }
        else { $content = $('<div/>', { id: thisID, fit: true }); }
    }
    zRet.thisID = thisID;
    zRet.title = title;
    zRet.type = type;
    zRet.plugin = plugin;
    zRet.$content = $content;
    zRet.href = href;
    zRet.default_plugincontent = default_plugincontent;
    zRet.obj_dependant = obj_dependant;
    zRet.obj_enrich = obj_enrich;
    zRet.obj_using = obj_using;
    zRet.childtype = childtype;
    zRet.default_parts = default_parts;
    return zRet;
}

function master_object() {
    // type -1=n/a, 0=missing, 1=content(string) , 2=href, 3=object(static) , 4=panel, 5=array, 6=special
    var tree_data = [{ text: 'aaa', state: 'closed', children: [{ text: 'Item11' }, { text: 'Item12' }] }, { text: 'Item2' }];
    var treegrid_data = [{ id: 1, name: 'ccc', size: "", date: "02/19/2010", children: [{ id: 2, name: "Program Files", size: "120 MB", date: "03/20/2010", children: [{ id: 21, name: "Java", size: "", date: "01/13/2010", "state": "closed", children: [{ id: 211, name: "java.exe", size: "142 KB", date: "01/13/2010" }, { id: 212, name: "jawt.dll", size: "5 KB", date: "01/13/2010" }] }, { id: 22, name: "MySQL", size: "", date: "01/13/2010", "state": "closed", children: [{ id: 221, name: "my.ini", size: "10 KB", date: "02/26/2009" }, { id: 222, name: "my-huge.ini", size: "5 KB", date: "02/26/2009" }, { id: 223, name: "my-large.ini", size: "5 KB", date: "02/26/2009" }] }] }, { id: 3, name: "eclipse", size: "", date: "01/20/2010", children: [{ id: 31, name: "eclipse.exe", size: "56 KB", date: "05/19/2009" }, { id: 32, name: "eclipse.ini", size: "1 KB", date: "04/20/2010" }, { id: 33, name: "notice.html", size: "7 KB", date: "03/17/2005" }] }] }];
    var sidemenu_data = [{ text: 'Item1', iconCls: 'icon-sum', state: 'open', children: [{ text: 'Option1' }, { text: 'Option2' }, { text: 'Option3', children: [{ text: 'Option31' }, { text: 'Option32' }] }] }, { text: 'Item2', iconCls: 'icon-more', children: [{ text: 'Option4' }, { text: 'Option5' }, { text: 'Option6' }] }];
    var default_multi_array = [{ title: 'content', content: 'the content' }, { title: 'href', href: 'system' }, { title: 'datagrid', plugin: 'datagrid' }, { title: 'datalist', plugin: 'datalist' }, { title: 'propertygrid', plugin: 'propertygrid' }, { title: 'sidemenu', plugin: 'sidemenu' }, { title: 'tree', plugin: 'tree' }, { title: 'treegrid', plugin: 'treegrid' }, { title: 'layout', plugin: 'layout' }, { title: 'gauge', plugin: 'gauge' }, { title: 'chartjs', plugin: 'chartjs' }];
    var tools = [{ iconCls: 'pagination-load', handler: function () { msg('ok?'); } }];
    var default_layout_array = [{ region: 'center', plugin: 'treegrid' }, { region: 'west', plugin: 'sidemenu' }, { region: 'east', plugin: 'datagrid' }, { region: 'north', plugin: 'propertygrid' }, { region: 'south', href: 'system' }];
    var default_layout_part = { split: true, width: '32%', height: '20%', tools: tools, hideCollapsedContent: false };
    var default_widgets = {
        content: { type: 1 }
        , href: { type: 2 }

        , validatebox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['validatebox'] }
        , textbox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['textbox'] }
        , passwordbox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['passwordbox'] }
        , maskedbox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['maskedbox'] }
        , combo: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['combo'] }
        , combobox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['combobox'] }
        , combotree: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['combotree'] }
        , combogrid: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['combogrid'] }
        , combotreegrid: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['combotreegrid'] }
        , tagbox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['tagbox'] }
        , numberbox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['numberbox'] }
        , datebox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['datebox'] }
        , datetimebox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['datetimebox'] }
        , datetimespinner: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['datetimespinner'] }
        , calendar: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['calendar'] }
        , spinner: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['spinner'] }
        , numberspinner: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['numberspinner'] }
        , timespinner: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['timespinner'] }
        , timepicker: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['timepicker'] }
        , slider: { type: 3, default: {}, using: ['slider'] }
        , filebox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['filebox'] }
        , checkbox: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['checkbox'] }
        , radiobutton: { type: 3, default: { name: 'name', label: 'label', required: true }, using: ['radiobutton'] }

        , datagrid: { type: 3, default: { border: true, columns: [[{ field: 'field1', title: 'dg' }, { field: 'field2', title: 'loading...' }]], data: [{ field1: 'loading', field2: 'data...' }] }, using: ['datagrid', 'datagridfilter', 'validatebox', 'combobox', 'numberbox', 'datebox', 'datetimebox', 'combogrid', 'combotree'] }
        , datalist: { type: 3, default: { border: false, data: [{ text: 'Item1', state: 'open' }, { text: 'Item2' }], checkbox: true, lines: true }, using: ['datalist'] }
        , linkbutton: { type: 3, default: { iconCls: 'icon-add' }, using: ['linkbutton'] }
        , propertygrid: { type: 3, default: { data: { "rows": [{ "name": "Test Column", "value": "test-data", "editor": "combobox" }, { "name": "Test Column2", "value": "test-data2", "editor": "combobox" }] } }, using: ['propertygrid', 'validatebox', 'combobox', 'datagrid', 'datagridfilter', 'numberbox', 'datebox', 'datetimebox', 'combogrid', 'combotree'] }
        , sidemenu: { type: 3, default: { border: true, data: sidemenu_data }, using: ['sidemenu'] }
        , tree: { type: 3, default: { animate: true, checkbox: true, xdata: tree_data }, using: ['tree'] }
        , treegrid: { type: 3, default: { border: false, animate: true, data: treegrid_data, idField: 'id', treeField: 'name', columns: [[{ field: 'id', title: 'id', width: 30 }, { field: 'name', title: 'name', width: '220' }, { field: 'size', title: 'size', width: '100' }, { field: 'date', title: 'date', width: '150' }]] }, using: ['treegrid'] }
        , panel: { type: 4, using: ['panel'] }
        , form: { type: 4, using: ['form'] }
        , accordion: { type: 5, using: ['accordion'], default: default_multi_array }
        , layout: { type: 5, using: ['layout'], default: default_layout_array, default_parts: default_layout_part }
        , tabs: { type: 5, using: ['tabs'], default: default_multi_array }
        , gauge: { type: 6, default: { border: true, data: sidemenu_data } }
        , chartjs: { type: 6 }
        , linkbuttons: { type: 6, default: { iconCls: 'icon-add' }, using: ['linkbutton'] }
        , jexcel: { type: 6, default: { minDimensions: [2, 4], tableOverflow: true, columns: [{ title: 'col1', width: '100', type: 'text' }, { title: 'col2', width: '40', type: 'numeric' }] } }
    };
    return default_widgets;
}

var zID = 0;
function hashID(str) {
	/*
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = ~~(((hash << 5) - hash) + str.charCodeAt(i));
	}
	var ret = "_" + hash.toString().substring(1, 8);
	*/
    zID++;
    return "_" + zID;
}


function msg(title, msg) {
    using('messager', function () {
        $.messager.show({ title: title, msg: msg });
    });
    var rightNow = new Date();
    var res = rightNow.toISOString().slice(0, 19).replace("T", " ");
    msgLL(res + " " + title + ": " + msg);
}

function msgOK(title, msg) {
    using('messager', function () {
        $.messager.alert({ title: title, msg: msg });
    });
    var rightNow = new Date();
    var res = rightNow.toISOString().slice(0, 19).replace("T", " ");
    msgLL(res + " " + title + ": " + msg);
}
function msgProg() {
    using('messager', function () {
        $.messager.progress()
    });
}
function msgProgClose() {
    using('messager', function () {
        $.messager.progress('close')
    });
}

function page_builder(content) {
    msg("Old component used", JSON.stringify(content).substring(0, 200));
    var thisID = content.id || makeid(3);
    /******** check for app_page, app_window, app_dialog ********/
    switch (content.type) {
        case 'app_window':
            if (!content.title) content.title = content.id;
            if ($('#win' + content.id).length === 0) {
                $('body').append($('<div/>', { id: 'win' + content.id }));
                $content = $('<div/>', { id: content.id });
                using('window', function () {
                    $('#win' + content.id).window($.extend({}, { width: 400, height: 300, fit: false, modal: true, title: content.title, content: $content }, content.typecontent));
                });
                chkContent(content.typecontent, $content);
            } else {
                $('#win' + content.id).window('open');
            }
            break;
        case 'app_dialog':
            if (!content.title) content.title = content.id;
            $('#dlg' + content.id).remove();
            if ($('#dlg' + content.id).length === 0) {
                $('body').append($('<div/>', { id: 'dlg' + content.id }));
                $content = $('<div/>', { id: content.id });
                using(['dialog', 'window', 'linkbutton', 'resizable'], function () {
                    $('#dlg' + content.id).dialog($.extend({}, {
                        title: 'dlg' + content.id
                        , resizable: true, collapsible: true, maximizable: true, width: 300, height: 300, modal: true, iconCls: "icon-save", toolbar: [{ text: 'Add', iconCls: 'icon-add ' }, { text: 'Edit', iconCls: 'icon-edit' }]
                        , buttons: [
                            { text: 'OK', id: 'app_dialog_ok', iconCls: 'icon-ok', width: 90, handler: function () { ; } }
                            , { text: 'Cancel', iconCls: 'icon-cancel', width: 90, handler: function () { $('#dlg' + content.id).dialog('close'); } }
                        ]
                        , content: $content
                    }, content.typecontent));
                });
                chkContent(content.typecontent, $content);
            } else {
                $('#dlg' + content.id).dialog('open');
            }
            break;
        default:
            var $content; zID = 0;
            var title = content.title || thisID;
            if ($('#tt0').tabs('exists', title)) { $('#tt0').tabs('select', title); }
            else {
                $content = $('<div/>', { id: thisID, fit: true });
                $('#tt0').tabs('add', $.extend({ title: title, content: $content, closable: true }, content));
                chkContent(content, $content);
            }
            break;
    }
}

function chkContent(content, $parent) { // check for app_datagrid,app_propertygrid,
    var thisID = content.id || makeid(3);
    var plugin = ""; if (content.type) { plugin = content.type.substring(4); }
    switch (content.type) {
        case 'app_layout': // ARRAY
            using(plugin, function () {
                $parent[plugin]($.extend({ id: thisID, border: false }, content.typearray));
                $.each(content.typearray, function (index, o) {
                    var eThisID = thisID;
                    if (o.id) { eThisID = o.id + index; } else { eThisID = thisID + index; }
                    if (o.typecontent) { eThisID = o.typecontent.id || eThisID; }
                    var $content = $('<div/>', { id: eThisID, fit: true });
                    $parent[plugin]('add', $.extend({
                        split: true, width: '32%', height: '20%', content: $content, tools: [{
                            iconCls: 'pagination-load', handler: function () {
                                // console.log(o); alert(plugin + ' : ' + thisID + ' \n' + o.type.substring(4) + ' : ' + eThisID); $('#' + eThisID)[o.type.substring(4)]('load');
                            }
                        }]
                    }, o));
                    chkContent(o, $content);
                });
            });
            break;
        case 'app_tabs': // ARRAY
            using(plugin, function () {
                $parent[plugin]($.extend({ id: thisID, border: false }, content.typecontent));
                $.each(content.typearray, function (index, o) {
                    var eThisID = thisID;
                    if (o.id) { eThisID = o.id + index; } else { eThisID = thisID + index; }
                    if (o.typecontent) { eThisID = o.typecontent.id || eThisID; }
                    var selected = false; if (index === 0) { selected = true; }
                    var $content = $('<div/>', { id: eThisID, fit: true });
                    $parent[plugin]('add', $.extend({ id: 'tb' + eThisID, title: 'tb' + eThisID, content: $content, selected: selected }, o));
                    chkContent(o, $content);
                });
            });
            break;
        case 'app_accordion': // ARRAY
            using([plugin], function () {
                $parent[plugin]($.extend({ id: thisID, border: true }, content.typecontent));
                if (!($.type(content.typearray) === "array" && content.typearray.length > 0)) { content.typearray = [{ title: 'missing' }]; }
                $.each(content.typearray, function (index, o) {
                    var eThisID = thisID;
                    if (o.id) { eThisID = o.id + index; } else { eThisID = thisID + index; }
                    if (o.typecontent) { eThisID = o.typecontent.id || eThisID; }
                    var $content = $('<div/>', { id: eThisID, fit: true });
                    $parent[plugin]('add', $.extend({ id: 'ac' + eThisID, title: 'ac' + eThisID, content: $content }, o));
                    chkContent(o, $content);
                });
            });
            break;
        case 'app_panel':
            var $content = $('<div/>', { id: thisID, fit: true });
            using([plugin], function () {
                $parent.panel($.extend({
                    id: thisID, title: thisID, border: true, iconCls: 'commit-small', content: $content, collapsible: true, minimizable: true, maximizable: true, closable: true, tools: [{ iconCls: 'pagination-load', handler: function () { } }], footer: $('<div/>', { id: parent + '_footer', text: parent + '_footer', content: 'xxaaaa' })
                }, content.typecontent));
            });
            chkContent(content.typecontent, $content);
            break;
        case 'app_propertygrid':
            using(['propertygrid', 'validatebox', 'combobox', 'datagrid', 'datagridfilter', 'numberbox', 'datebox', 'datetimebox', 'combogrid', 'combotree'], function () {
                $parent[plugin]($.extend({ data: { "rows": [{ "name": "Test Column", "value": "test-data", "editor": "combobox" }] } }, content.typecontent));
            });
            break;
        case 'app_datagrid':
            using(['datagrid', 'datagridfilter', 'validatebox', 'combobox', 'numberbox', 'datebox', 'datetimebox', 'combogrid', 'combotree'], function () {
                $parent[plugin]($.extend(
                    { title: 'dg', border: true, columns: [[{ field: 'field1', title: 'dg' }, { field: 'field2', title: 'loading...' }]], data: [{ field1: 'loading', field2: 'data...' }] }
                    , extend_datagrid(content.typecontent)
                    , content.typecontent
                ));
            });
            break;
        case 'app_datalist':
            using([plugin], function () {
                var data = [{ text: 'Item1', state: 'open' }, { text: 'Item2' }];
                $parent[plugin]($.extend({ title: thisID, border: false, data: data, checkbox: true, lines: true }, content.typecontent));
            });
            break;
        case 'app_tree':
            using([plugin], function () {
                var data = [{ text: content.id, state: 'closed', children: [{ text: 'Item11' }, { text: 'Item12' }] }, { text: 'Item2' }];
                $parent[plugin]($.extend({ animate: true, checkbox: true, data: data }, content.typecontent));
            });
            break;
        case 'app_treegrid':
            using([plugin], function () {
                var data = [{ id: 1, name: content.id, size: "", date: "02/19/2010", children: [{ id: 2, name: "Program Files", size: "120 MB", date: "03/20/2010", children: [{ id: 21, name: "Java", size: "", date: "01/13/2010", "state": "closed", children: [{ id: 211, name: "java.exe", size: "142 KB", date: "01/13/2010" }, { id: 212, name: "jawt.dll", size: "5 KB", date: "01/13/2010" }] }, { id: 22, name: "MySQL", size: "", date: "01/13/2010", "state": "closed", children: [{ id: 221, name: "my.ini", size: "10 KB", date: "02/26/2009" }, { id: 222, name: "my-huge.ini", size: "5 KB", date: "02/26/2009" }, { id: 223, name: "my-large.ini", size: "5 KB", date: "02/26/2009" }] }] }, { id: 3, name: "eclipse", size: "", date: "01/20/2010", children: [{ id: 31, name: "eclipse.exe", size: "56 KB", date: "05/19/2009" }, { id: 32, name: "eclipse.ini", size: "1 KB", date: "04/20/2010" }, { id: 33, name: "notice.html", size: "7 KB", date: "03/17/2005" }] }] }];
                $parent[plugin]($.extend({ title: content.id, border: false, animate: true, data: data, idField: 'id', treeField: 'name', columns: [[{ field: 'id', title: 'id', width: 30 }, { field: 'name', title: 'name', width: '220' }, { field: 'size', title: 'size', width: '100' }, { field: 'date', title: 'date', width: '150' }]] }, content.typecontent));
            });
            break;
        case 'app_sidemenu':
            using([plugin], function () {
                var data = [{ text: 'Item1', iconCls: 'icon-sum', state: 'open', children: [{ text: 'Option1' }, { text: 'Option2' }, { text: 'Option3', children: [{ text: 'Option31' }, { text: 'Option32' }] }] }, { text: 'Item2', iconCls: 'icon-more', children: [{ text: 'Option4' }, { text: 'Option5' }, { text: 'Option6' }] }];
                $parent[plugin]($.extend({ id: thisID, title: thisID, border: true, data: data }, content.typecontent));
            });
            break;
        case 'app_chartjs':
            using('chartjs', function () {
                $parent.wrap($('<canvas/>', { id: '_' + thisID }));
                var ctx = $('#_' + thisID);
                var config = $.extend(chart_default());
                window.myChart = new Chart(ctx, config);
                $.post("../data/chart_js_srv_get.aspx", { payload: JSON.stringify(content.typecontent) }, function (data) {
                    var zData = JSON.parse(data);
                    config.data.labels = zData.labels;
                    config.data.datasets = zData.datasets;
                    window.myChart.update();
                }).fail(function () { alert("error"); });
            });
            break;
        case 'app_gauge':
            using('gauge', function () {
                $.post("../data/gauge.aspx", { payload: JSON.stringify(content.typecontent.dataSet) }, function (data) {
                    var zData = JSON.parse(data);
                    $.each(zData, function (i, o) {
                        $parent.append($('<canvas />', { id: '_' + thisID + i }));
                        var mand = { renderTo: '_' + thisID + i, value: 0 };
                        // “linear”, “quad”, “quint”, “cycle”, “bounce”, “elastic” and their opposites: “dequad”, “dequint”, “decycle”, “debounce”, “delastic”.
                        var opt = { width: 150, height: 150, units: "%", title: i, animatedValue: true, animationDuration: 2500, animationRule: "bounce" };
                        var gaugePS = new RadialGauge($.extend(opt, o, mand));
                        gaugePS.draw();
                        gaugePS.value = o.value;
                    });
                }).fail(function () { alert("error"); });

            });
            break;
        default:
            if (plugin !== "") { msg('Missing plugin', "Plugin '" + plugin + "' not defined."); }
            break;
    }
    // zID++;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function chart_default() {
    var result = {
        type: 'line',
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
    };

    return result;
}



