function Items_list() {
	showApp({
		id: 'il', title: 'Items_list',
		app_layout: [
			{
				region: 'center', title: 'Items list', app_datagrid: {
					title: ''
					, dataSet: {
						view: 'service_reference.sales_items'
						// , preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
						, showColumns: [{ field: "item_number", title: "Item" }, { field: "product_code", title: "Product" }, { field: "ppl", title: "PPL" }, { field: "currency", title: "Currency" }]
					}
				}
			}
			, {
				region: 'west', title: 'PPL-setters', width: 370, app_datagrid: {
					title: ''
					, dataSet: {
						view: 'service_ppl.profile'
						, preFilter: [{ "field": "role", "op": "equal", "value": "ppl_setter" }]
						, xshowColumns: { person: { title: "PPL-setter", width: 140 }, product: { title: "Product", width: 110 }, source: { title: "Src", width: 60 } }
						, showColumns: [{ field: "person", title: "PPL-setter", width: 140 }, { field: "product", title: "Product", width: 110 }, { field: "source", title: "Src", width: 60 }]
					}
				}
			}
			//, { region: 'east', app_datagrid: { dataSet: { view: 'customer.test' } } }
		]
	});
}

function PPL_revision() {
	showApp({
		id: 'pr', title: 'PPL_revision',
		app_layout: [
			{
				region: 'center', title: 'PPL-revision', app_datagrid: {
					title: ''
					, dataSet: {
						view: 'service_guidelines.market_segment_discount'
						, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
					}
				}
			}
		]
	});
}

function PPL_setters_pop() {
	showApp({
		id: 'psp', title: 'PPL_setters_pop',
		app_dialog: {
			width: 400,
			
				app_datagrid: {fit:true,
					title: 'market_segment_discount',
					dataSet: {
						view: 'service_guidelines.market_segment_discount'
						, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
					}
				}
			
			
		}
	});
}

function PPL_setters2_pop() {
	showApp({
		id: 'psp', title: 'PPL_setters_pop',
		app_dialog: {
			width: 400,
			app_datagrid: {
				fit: true,
				title: 'market_segment_discount',
				dataSet: {
					view: 'service_guidelines.market_segment_discount'
					, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
				}
			}


		}
	});
}

function x_PPL_setters_pop() {
	showApp({
		id: 'psp', title: 'PPL_setters_pop',
		app_dialog: {
			title: 'PPL-setters', width: 400, iconCls: "icon-user-small"
			, app_layout: [
				{
					region: 'center', title: "segment_discoun", x_app_datagrid: {
						title: 'market_segment_discount',
						dataSet: {
							view: 'service_guidelines.market_segment_discount'
							, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
						}
					}
				}, {
					region: 'west', title: "segment_west", x_app_datagrid: {
						title: 'market_segment_discount',
						dataSet: {
							view: 'service_guidelines.market_segment_discount'
							, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
						}
					}
				}
			]
		}
	});
}

function List_pricing() {
	showApp({
		id: 'lp', title: 'List_pricing',
		app_layout: [
			{
				region: 'center', title: 'List-price', app_datagrid: {
					title: '',
					dataSet: {
						view: 'service_guidelines.market_segment_discount'
						// , preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
						, showColumns: [{ field: "id" }, { field: "guideline", title: "Guideline" }, { field: "product", title: "Product", width: 150 }, { field: "geopol", title: "Geopol", width: 150 }, { field: "industry", title: "Industry", width: 150 }, { field: "qty_discount_model", title: "Quantity", width: 80 }, { field: "base_discount", title: "List-price", width: 80 }]
					}
				}
			}
		]
	});
}

function Customer_pricing() {
	showApp({
		id: 'cp', title: 'Customer_pricing',
		app_layout: [
			{
				region: 'center', title: 'Customer-price', app_datagrid: {
					title: ''
					, dataSet: {
						view: 'customer.test'
					}
				}
			}
		]
	});
}

function PPL_currency() {
	showApp({
		id: 'pc', title: 'PPL_currency',
		app_layout: [
			{
				region: 'center', title: 'Trend from 2008'
				, app_accordion: [{title:''}]
			}
			// , { region: 'east', app_datagrid: { dataSet: { view: 'curr.currency' } } }
			, {
				region: 'west', width: 290, title: 'PPL-currency'
				, app_datagrid: {
					sortName: 'Diff', sortOrder: 'desc',
					title: '',
					dataSet: {
						view: 'curr.v_getLatest'
						, showColumns: [{ field: "to_curr", title: "To", width: 50 }, { field: "PPL", width: 50 }, { field: "External", title: "Ext", width: 70 }, { field: "Diff"}]
						, preFilter: [{ field: "to_curr", "op": "in", "value": "AUD,USD,NZD" }]
					}
					, onSelect: function (index, row) {
						var panel = $('#tpc0').accordion('getPanel', row.to_curr);
						if (panel) {
							$('#tpc0').accordion('select', row.to_curr);
						} else {
							$('#tpc0').accordion('add', {
								id: row.to_curr, title: row.to_curr, doSize: true, href: '../data/chart_js.aspx?name=il3&view=curr.v_currency_rate&rate=' + row.to_curr
								, onExpand: function () {
									resizeCanvas(row);
								}
								, x_onExpand: function (q) {
									console.log(q);
									var pp = $('#tpc0').accordion('getSelected');
									pp.panel('refresh', '../data/chart_js.aspx?name=il3&view=curr.v_currency_rate&rate=' + row.to_curr);    // call 'refresh' method to load new content
								}
								, onBeforeOpen: function (index, row) { } // $('#tpc0').accordion('options')[multiple]=true;
							});
						}
					}
				}
			}

			// from_curr to_curr value type from_date
		]
	});

}



function Items_list1() {
	// alert('aaa');
	var content = {
		id: '0'
		, app_layout: [
			{
				region: 'center', app_datagrid: {
					dataSet: {
						view: 'service_guidelines.market_segment_discount'
						, preFilter: [{ "field": "guideline", "op": "equal", "value": "US_BFB" }]
					}
				}
			}
			//, { region: 'west', app_datagrid: { dataSet: { view: 'curr.currency' } } }
			//, { region: 'east', app_datagrid: { dataSet: { view: 'customer.test' } } }
		]
	};

	showApp(content);

}

function Items_list5() {
	var content = {
		id: '5',
		app_layout: [{ region: 'center' }, { region: 'east' }, { region: 'north' }]
	};
	showApp(content);
}

function accordion_test() {
	// alert('aaa');
	var content = {
		id: '0'
		, app_layout: [{
			xid: 'jan', region: 'center', x_content: 'jan-content', xtitle: 'center', app_datagrid: { dataSet: { view: 'curr.currency', preFilter: '' } }
		}
			, { xid: 'feb', region: 'west', x_content: 'feb-content', app_layout: [{ xid: 'feb-jan', region: 'center', x_content: 'center2', xtitle: 'center2', app_datagrid: {} }], xtitle: 'west' }
			, { xid: 'mar', region: 'east', x_content: 'mar-content', app_tabs: [{ title: 'tb', app_tabs: [{ title: 'pg', app_propertygrid: {} }, { title: 'dg', app_datagrid: {} }] }, { title: 'ac', app_accordion: [{ title: 'pg', app_propertygrid: {} }, { title: 'dg', app_datagrid: {} }, { title: 'dl', app_datalist: {} }, { title: 'tr', app_tree: {} }, { title: 'tr2', app_tree2: {} }, { title: 'tg', app_treegrid: {} }, { title: 'sm', app_sidemenu: {} }, { title: 'pa', app_panel: { x_content: 'bbbbbb', app_layout: [{ region: 'center' }, { region: 'west' }, { region: 'east' }, { region: 'north' }, { region: 'south' }] } }, { title: 'ly', app_layout: [{ region: 'center' }, { region: 'west' }, { region: 'east' }, { region: 'north' }, { region: 'south' }] }, {}] }, { title: 'pa', app_panel: {} }, { title: 'sm', app_sidemenu: {} }, { title: 'dl', app_datalist: {} }, { title: 'tr', app_tree: {} }, { title: 'tg', app_treegrid: {} }, {}, {}], xtitle: 'east' }
			, { xid: 'apr', region: 'north', x_content: 'apr-content', app_layout: [{ xid: 'apr-jan', region: 'center', x_content: 'north2', xtitle: 'north2', app_datagrid: {} }, { id: 'apr-jan', region: 'center', x_content: 'north2', xtitle: 'north2' }, { id: 'apr-mars', region: 'east', x_content: 'apr-mars', xtitle: 'north2', app_datagrid: {} }], xtitle: 'north' }
			, { xid: 'maj', region: 'south', x_content: 'maj-content', xtitle: 'south', app_datagrid: {} }]
	};

	showApp(content);

}

function service_request() {
	showApp({
		id: 'sr', title: 'service_request',
		app_layout: [
			{
				region: 'west', title: 'Service-request', app_panel: {
					title: ''
					, app_propertygrid: {
						title: ''
						// , columns: [[{ field: 'name', title: 'Name', width: 200, editor: { type: 'combobox' }  }, { field: 'value', title: 'Value', width: 200 }]]
						, data: [
							{ name: 'item', value: '3287133204,3287133205,3287099352,3287099353,3287099358,3287099359,3287099360,3287099361,3287099363,3287103910,3287103911', editor: { type: 'textbox' } }
							, { name: 'industry', value: '10f4d8a1-b52e-4155-80e2-59ce04a28af2,99b84f85-8d15-46d9-9efa-69d5b6831882', editor: { type: 'textbox' } }
							, { name: 'geo_political_area', value: 'US,CA', editor: { type: 'textbox' } }
							, { name: 'token', value: '3FC8642D-1A70-4A60-A928-DE24980A2DC1', editor: { type: 'textbox' } }
							, { name: 'to_currency', value: 'SEK', editor: 'text' }
							, { name: 'response_type', value: 'html', editor: { type: 'combobox', options: { required: true, data: [{ text: 'html', value: 'html' }, { text: 'json', value: 'json' }] } } }
						]
						, dataSet: {
							// view: 'customer.test'
						}
					}
				}
			}, {
				region: 'center', title: 'service_request', href: "http://" + zApi + '/api/pim_list_price.aspx?'
			}, {
				// region: 'east', title: 'service_request', app_window: {}
			}
		]
	});
}

function Items_list2() {
	var content = {
		id: '1'
		, app_tabs: [{
			x_title: 'jan'
			, app_tabs: [{
				x_title: 'jan-jan'
				, app_tabs: [{
					x_title: 'jan-jan-jan'
					, app_tabs: [{
						x_title: 'jan-jan-jan-jan'
						, app_datagrid: { x_title: 'propylengrid' }
					}, {
						x_title: 'jan-jan-jan-feb'
						, app_propertygrid: { x_title: 'datagrid' }
					}]
				}, { x_title: 'jan-jan-feb' }]
			}, {
				x_title: 'jan-feb'
				, app_datagrid: { x_title: 'datagrid' }
			}]
		}, {
			x_title: 'feb', x_content: 'feb'
			, app_layout: [{
				x_title: 'center', region: 'center'
				, app_layout: [{
					x_title: 'layouttitle', region: 'center'
					, app_layout: [{
						title: 'layouttitlexxcenter', region: 'center'
						, app_propertygrid: { x_title: 'wwwwww' }
					}, { x_title: 'layouttitlexxnorth', region: 'north' }, { x_title: 'layouttitlexxsouth', region: 'south' }, { x_title: 'layouttitlexxsouth', region: 'east' }, { x_title: 'layouttitlexxsouth', region: 'west' }]
				}, { x_title: 'layouttitle', region: 'east' }]
			}, {
				x_title: 'west', region: 'west'
				, app_datagrid: { x_title: 'datagrid' }
			}]
		}, { x_title: 'mars', content: 'mars' }]
	};
	showApp(content);
}

function Items_list3() {
	// alert('aaa');
	var content = {
		id: '3',
		app_layout: [{
			region: 'west', width: '50%', app_datagrid: {
				dataSet: {
					view: 'curr.currency'
				}
			}
		}, { region: 'center', app_layout: [{ region: 'west' }, { region: 'center' }, { region: 'east' }] }, { region: 'east', width: '20%', app_layout: [] }]
	};
	showApp(content);
}

function xxItems_list1() {
	openMain({
		id: 'items', type: 'web_parts', open_in: 'layout'
		, content: {
			west: {
				type: 'datagrid'
				, content: {
					id: 'dg_ppl_setters1'
					, queryParams: { view: 'service_ppl.profile' }
				}
				, layout: { x_title: 'PPL-setters1', width: '25%' }
			}
			, center: {
				type: 'datagrid'
				, layout: { x_title: 'Items-list1' }
				, content: {
					id: 'dg_items1'
					, queryParams: { view: 'service_reference.sales_items' }
					, preFilter: [{ "field": "role", "op": "equal", "value": "ppl_setter" }]
					, menu: { default: true, content: [{ text: 'Sales' }, { text: 'More_sales' }] }
				}
			}
		}
	});
}

function Items_list4() {
	// alert('aaa');
	var dag = {
		columns: [[{ field: 'field1', title: 'field1' }, { field: 'field2', title: 'field2' }]]
		, data: [{ field1: 'jan', field2: 'feb' }, { field1: 'mars', field2: 'apr' }]
	};
	var content = {
		id: '4',
		app_layout: [{
			region: 'center', app_datagrid: dag
		}, { region: 'east', href: 'lab/test.html' }
			, { region: 'west', href: 'lab/test2.html' }
			, { region: 'north', app_panel: { app_datagrid: dag } }]

	};

	showApp(content);
}



function Items_list6() {
	// alert('aaa');
	var content = {
		id: '6',
		app_datagrid: {}
	};

	showApp(content);
}

function xyItems_list1() {
	openMain({
		type: 'webParts'
		, content: {
			id: 'test1'
			, center: {
				type: 'webParts'
				, content: {
					center: {
						type: 'datagrid'
						, content: {
						}
					}
					, west: {
						type: 'datagrid'
						, content: {
						}
					}
				}
			}
		}
	});
}

function ps2_list2() {
	var obj = {
		id: 'items2', type: 'web_parts', open_in: 'layout'
		, content: {
			west: {
				type: 'datagrid'
				, content: {
					id: 'dg_ppl_setters2'
					, queryParams: { view: 'service_ppl.profile' }
				}
				, layout: { x_title: 'PPL-setters2', width: '25%' }
			}
			, center: {
				type: 'datagrid'
				, layout: { x_title: 'Items-list2' }
				, content: {
					id: 'dg_items2'
					, queryParams: { view: 'service_reference.sales_items' }
					, preFilter: [{ "field": "role", "op": "equal", "value": "ppl_setter" }]
					, menu: { default: true, content: [{ text: 'Sales' }, { text: 'More_sales' }] }
				}
			}
		}
	};
	openMain(obj);
}

function fnSales(id, index) {
	var item_number = $('#' + id).datagrid('getRows')[index].item_number;
	using('dialog', function () {
		openMain({
			id: 'Sales_pop', open_in: 'dialog', destroy: true, dialog: { x_title: 'Sales ' + item_number, width: 800, height: 600 }, type: 'web_parts', content: {
				center: {
					type: 'datagrid'
					, content: {
						// menu: { default: true, content: [{ text: 'Sales' }, { text: 'More_sales' }] }
						id: 'dg_sales_pat'
						, url: '../data/grid_provider.aspx?view=sales.pat'
						, columns: ['Item_No', 'Item_Name', 'Customer_No', 'Customer_Name', 'Order_Date', 'OR', 'Qty', 'Rec_Country']
						, preFilter: [{ "field": "Item_No", "op": "equal", "value": item_number }]
					}
					, layout: { x_title: 'sales_pat' }
				}
			}
		});
	});
}

function resizeCanvas(row) {
	// console.log($('#canvas_' + row.to_curr));
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
		// ctx.canvas.height = 300;
		// $(".isResizable").resizable();
		// $(canvas).resize({ height: 300});
		// ctx.canvas.height = 300;
		// console.log(ctx);
	}
	// if (ctx) ctx.canvas.width = 300;
	// ctx.canvas.height = 300;
}

