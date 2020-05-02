
function ribbonMen() {
	var zMenu = { id: "rr2", tabs: [], tools: [{ iconCls: 'icon-paste'}] };
	var cTabs = $zBody.data('client').tabs;
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
					if (index===-1) return;
					groups.push(zTabMenus[i].groups[ii]);
				});
				zTabMenus[i].groups = groups;
				zMenu.tabs.push(zTabMenus[i]);
			}
		});
	}
	// console.log(zMenu);
	using(['splitbutton'], function () {
		using('ribbon/jquery.ribbon.js', function () {
			$('#ribbon_men').ribbon({ data: zMenu });
		});
	});
	/*
	$.each(zMenu.tabs, function (i, o) {
			$.each(o.groups, function (ii, oo) {
				$.each(oo.tools, function (iii, ooo) {
					$.each(ooo.tools, function (iiii, oooo) {
						$.each(oooo, function (iiiii, ooooo) {
							if (iiiii === 'onClick') {
								zMenu.tabs[i].groups[ii].tools[iii].tools[iiii].onClick = new Function(ooooo);
							}
						});
					});
				});
			});
		});
		using(['splitbutton'], function () {
			using('ribbon/jquery.ribbon.js', function () {
				$('#ribbon_men').ribbon({ data: zMenu });
			});
		});
		
	// });
	//*/
}