<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Pricing Service</title>

	<link href="../css/adjustments.css" rel="stylesheet" />
	<link href="../easyui/themes/material/easyui.css" id="theme_style" rel="stylesheet" type="text/css" >
    <link href="../easyui_extentions/ribbon/ribbon.css" rel="stylesheet" />
	<link href="../jexcel/jexcel.css" rel="stylesheet" />
	

	<link href="../easyui_custom/StyleSheet.css" rel="stylesheet" type="text/css" >
	<link href="../my.css" rel="stylesheet" />

	<script src="../jquery/jquery-3.4.1.min.js"></script>
	<script src="../easyui/easyloader.js"></script>

	<script src="../src/environment.js"></script>
	<script src="../src/capp.js"></script>
	<script src="../src/cdg.js"></script>
	<script src="../src/other.js"></script>

	<script src="../wal/src/menu.js"></script>
	<script src="../wal/src/ps_item.js"></script>

	



	<script type="text/javascript">
		$(function () {
			// if (window.navigator.userAgent.indexOf("WOW64") > 0) { alert("Please use another browser!"); }
			
			var env_iis = '<%=Common.My.getMachineName()%>';
			var env_db = '<%=Common.My.getDbServer()%>';
			// SELULT5241
            var env = {
                "SELULT5241": { env_type: "Dev", api: "SELULT5241" }
                , "SELULT4526": { env_type: "Dev", api: "SELULT4526" }
                , "SELUWS2135": { env_type: "Test", api: "SELUWS2251", iis: "test-pricingservice"  }
                , "SELUWS2255": { env_type: "Preprod", api: "SELUWS2256", iis: "pp-pricingservice"  }
                , "SELUWS2229": { env_type: "Production", api: "SELUWS2250", iis: "pricingservice"  }
            };
			var env_type = env[env_iis].env_type;

			zApi = env[env_iis].api;
			var $menu = $('<img/>', {
                src: '../easyui_custom/16/cog2.png', style: 'position:absolute;left:5px; top:2px;', click: function () {
					//console.log($(this).offset().left);
					using('menu', function () {

						var zMenu = $("<div/>", { class: "easyui-menu" }).menu();
                        var $menOpt = [{ sys: 'Dev', clr: '', iis: 'http://SELULT4526' }, { sys: 'Test', clr: 'y', iis: 'https://test-pricingservice.alfalaval.org' }, { sys: 'Preprod', clr: 'o', iis: 'https://pp-pricingservice.alfalaval.org' }, { sys: 'Production', clr: 'g', iis: 'https://pricingservice.alfalaval.org' }];
						$.each($menOpt, function (i, o) {
                            var w_loc = o.iis + '/dba2/wal';
                            zMenu.menu('appendItem', { text: o.sys, iconCls: 'database' + o.clr + '-small', disabled: env_type == o.sys, handler: function () { window.location = w_loc; } });
						});
						zMenu.menu('appendItem', { separator: true });
						zMenu.menu('appendItem', { text: "Exit" });
						zMenu.menu('appendItem', { separator: true });
						zMenu.menu('appendItem', { text: "WS: " + env_iis, disabled: true });
						zMenu.menu('appendItem', { text: "DB: " + env_db, disabled: true });
						zMenu.menu('appendItem', { text: "API: " + zApi, disabled: true });

						zMenu.menu('show', { left: 25, top: 10 }); // {left: 0 + $(this).offset().left, top: 0 +  $(this).offset().top} // givs err
					});

					// alert('to-fix');
				}
			});
			var $title = $.merge($menu, $('<div/>', { text: env_type, style: 'position:relative;left:25px; top:0px;color:gray' }));
			var username = '<%=Common.My.getSession("username")%>'
            var fPerm = <%=Common.My.getSession("fPerm")%>;
			var client = '<%=Common.My.getSession("client")%>'
			var g_theme = '<%=Common.My.getSession("theme")%>'
            var g_sys = '<%=Common.My.getSession("sys")%>'
            if (g_theme.length > 1) $('#theme_style').attr('href', '../easyui/themes/' + g_theme + '/easyui.css');

			$zBody = $('body');
            $zBody.data('fPerm', fPerm);
			$zBody.data('username', username);
			$zBody.data('client', client);
			$zBody.data('theme', g_theme);
            $zBody.data('sys', g_sys);
			$zBody.data('app', {});

			var $URmenu = $("<div/>");
            $URmenu.append($("<div/>", { text: "Sign out", iconCls: "icon-user-small", onClick: "logOut();" }));
            $URmenu.append($("<div/>", { text: "User settings", iconCls: "icon-user-small", onClick: "userSettings();" }));
			if (username === "magnus") {
                $URmenu.append($("<div/>", { separator: true }));
                $URmenu.append($("<div/>", { text: "Test User settings", iconCls: "icon-user-small", onClick: "testUserSettings();" }));
				$URmenu.append($("<div/>", { text: "Height and Width", iconCls: "", onClick: "msgLL('Width:' + window.innerWidth + ', Height:' + window.innerHeight );" }));
				$URmenu.append($("<div/>", { text: "Test msgLL", iconCls: "", onClick: "msgLL('xxxx');" }));
				$URmenu.append($("<div/>", { text: "Console Body-data", iconCls: "", onClick: "console.log($zBody.data());" }));
				$URmenu.append($("<div/>", { text: "System", iconCls: "", onClick: "show_system();" }));
                $URmenu.append($("<div/>", { text: "reload CAD", iconCls: "", onClick: "$('#CAD').panel('refresh');" }));
			}
			using('menubutton', function () {
				$zBody.append($("<div/>", { id: "UR", class: "panel-tool", style: "position:fixed;top:8px;right: 50px;z-index: 1000" }).append($("<div/>").menubutton({
					iconCls: "icon-user-small"
					, text: $zBody.data("username")
					, menu: $URmenu
				})));
				var $URdocmenu = $("<div/>", { id: 'URdocmenu' }); $URdocmenu.append($("<div/>", { text: "Document 1", iconCls: "file-small", onClick: "web_part_page({window:true,content:'List documents', title:'List documents'});" }));
				$zBody.append($("<div/>", { id: "URdoc", class: "panel-tool", style: "position:fixed;top:8px;right: 150px;z-index: 1000" }).append($("<div/>").menubutton({iconCls: "file-small", text: '2', menu: $URdocmenu})));
				var $URclient = $("<div/>", { id: 'URclient' }); $URclient.append($("<div/>", { text: "101", iconCls: "file-small", onClick: "web_part_page({window:true,content:'Change client to 101?', title:'Change Client'});" }));
                $zBody.append($("<div/>", { id: "URclient", class: "panel-tool", style: "position:fixed;top:8px;right: 210px;z-index: 1000" }).append($("<div/>").menubutton({ iconCls: "file-small", text: 'Client:' + client, menu: $URclient})));
			});
			using('layout', function () {
				$zBody.layout({ id: 'main' });
				$zBody.layout('add', {
					id: 'main_center'
					, region: 'center'
					, title: ''
					, content: $("<div/>", { id: "tt0" })
					, onBeforeOpen: function () {
						using('tabs', function () {
							$('#tt0').tabs({
								fit: true
								, showHeader: true
								, tabHeight: 15
                                , tools: [{
                                    id: 'downloads'
                                    , iconCls: 'icon-paste'
                                    , size: 'small'
                                    , handler: function () {
                                        //
                                    }
                                }]
								, tabPosition: 'bottom'
								, onSelect: function () { }
							}).tabs('add', {
								id: 'home'
								, showHeader: true
								, title: 'home'
								, closable: true
								//, content: $('<div/>', { id: 'home_main', fit: true }).layout().layout('add', { id: 'home_center', region: 'center', title: '' })
								//, xxcontent: '<div class="easyui-panel" style="position:relative;"><table class="easyui-propertygrid"></table><a href="javascript:;" class="easyui-linkbutton" style="width:100px;">Ok</a></div>'
								//, content: $('<div/>', { id: 'home_main', fit: true })
								, onBeforeOpen: function () { }
								, onOpen: function () { }
							});
						});
					}
				}).layout('add', {
					id: 'north_panel_body'
					, region: 'north'
					, split: false
					, hideCollapsedContent: false
					, title: $title
					, content: $("<div/>", { id: "ribbon_men" })
					, onBeforeOpen: function () {

					}
					, collapsedContent: ""
					, style: "overflow: visible;"
					, height: 137
					, tools: [{ iconCls: 'pagination-load ur-menu-ref', handler: function () { alert('main_north'); } }]
				}).layout('add', {
					id: 'south_panel_body'
					, region: 'south'
					, split: false
					, content: $('<div>', { id: 'msgLL' })
					, height: 25
					, split: true
				});
			});
			ribbonMen();
		});

		function ribbonMen() {
			var zMenu = { id: "rr2", tabs: [], tools: [{ iconCls: 'icon-paste' }] };
            var cTabs = $zBody.data('fPerm').tabs;
			/* Check if all tabs */
			if (cTabs === "*") {
				/* Add all tabs */
				$.each(zTabMenus, function (i) { zMenu.tabs.push(zTabMenus[i]); });
			} else {
				/* Loop tabs */
				$.each(cTabs, function (i, o) {
					/* Check if all groups */
					if (!zTabMenus[i]) return;
					if (o === "*") {
						/* Add tabs and all groups for this tab */
						zMenu.tabs.push(zTabMenus[i]);
					} else {
						/* Add this tab wo groups */
						var groups = [];
						$.each(zTabMenus[i].groups, function (ii, oo) {
							var index = Object.keys(o).indexOf(oo.id);
							if (index === -1) return;
							groups.push(zTabMenus[i].groups[ii]);
						});
						zTabMenus[i].groups = groups;
						zMenu.tabs.push(zTabMenus[i]);
					}
				});
			}
			// console.log(zMenu);
			using('ribbon', function () {
				$('#ribbon_men').ribbon({
					data: zMenu
					, onClick: function (name, target) {
						var opt = {};
						if ($(target).closest('.l-btn')[0]) { opt = $(target).linkbutton('options'); }
						else if ($(target).closest('.menu')[0]) { opt.text = name; opt.iconCls = 'menu-icon' }
						if (opt.disabled) return false;
						// console.log(opt);
						if (opt.toggle) {
							setMenuActive(name);
						}
						window[name](opt);
					}
				});
			});

		}

		function msgLL(iText) { $("#msgLL").html(iText + "<br>" + $('#msgLL').html()) }

		function logOut() {
			using("messager", function () {
				$.messager.confirm('Sign out', 'Sure?', function (r) {
					if (r) { do_logout("manual"); }
				});
			});
		}

		function do_logout(iReason) {
			$.post("../Logout.aspx").done(function (status) {
				var obj = JSON.parse(status);
				if (obj.success) {
					using("messager", function () {
						$.messager.show({ title: 'Signing out', timeout: 1500, msg: 'Welcome back ' + $zBody.data("username") + '.' });
					});
					setTimeout(function () { window.location.href = "../Login.aspx?reason=" + iReason; }, 3000);
				}
			});
		}

		var pollnr;
		function doPoll(inew) {
			return; // Turn off!
			if (inew) { pollnr = 0; }
			if (!pollnr) { pollnr = 0; }
			pollnr++
			var time = pollnr * 5000;
            $.post('../data/poll.aspx', function (data) {
				var jData = JSON.parse(data);
				// console.log(jData);
				if (jData.poll) {
					$.messager.show({ title: 'Poll content', timeout: 1500, msg: 'Poll content:' + jData.poll });
				}
				if (jData.is_alive) { setTimeout(doPoll, time); } else { do_logout("time_out"); }
			}).fail(function () {
				using("messager", function () {
					$.messager.show({ title: 'No server connection', timeout: 1500, msg: 'No server connection' });
				});
				setTimeout(doPoll, 10000 + time);
			});
		}
		doPoll();
	</script>

</head>
<body>

	
	<div id="dlg"></div>


</body>
</html>
