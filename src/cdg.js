function dg_setbar(target) {
	msg("dg_setbar");
	// console.log($(target).closest('.datagrid-header-row'));
	$(target).closest('tbody').append('<tr/>');
}

function extend_propertygrid(content) {

}
function extend_tree(iPage) {
	var queryParams = {};
	$.each(iPage.plugincontent.dataSet, function (i, o) {
		if ($.type(o) === "string") queryParams[i] = JSON.stringify(o).substring(1, o.length + 1); else queryParams[i] = JSON.stringify(o);
	});
	queryParams['username'] = $zBody.data('username');
	var parameters = {
		url: '../data/tree_provider.aspx'
		, __meta: iPage
		, iconCls: 'menu-small'
		, queryParams: queryParams
		, animate: true
		, multiselect: true
		, checkbox: true
		, loadFilter: function (data) { return data.body; }
		, onLoadError: function (arg) { msg("Tree error during load", arg); }
	};
	var functions = {};
	return $.extend(parameters, functions);
}

function extend_datagrid(iPage) {
	var queryParams = {};
	$.each(iPage.plugincontent.dataSet, function (i, o) {
		if ($.type(o) === "string") queryParams[i] = JSON.stringify(o).substring(1, o.length + 1); else queryParams[i] = JSON.stringify(o);
	});
	queryParams['username'] = $zBody.data('username');
	queryParams['first'] = true;
	var parameters = {
		url: '../data/grid_provider.aspx'
		, emptyMsg:'no records'
		, __meta: iPage
		, iconCls: 'menu-small'
		, pagination: true
		, clientPaging: false
		, queryParams: queryParams
		, pageList: [5, 10, 50, 100, 200, 400, 800]
		, pageSize: 50
		, remoteFilter: true
		, singleSelect: true
		, filterPosition: 'bottom'
	};
	var functions = {
		onOpen: function () { }
		, onDblClickRow: function (index, row) { dg_edit(this); }
		, onLoadError: function () { msg('Loading-error', 'Error when loading datagrid ' + $(this).datagrid('options').id + ', plugincontent: ' + JSON.stringify(iPage)); }
		, onBeforeLoad: function () {
			var options = $(this).datagrid('options');
			zCog = $(this).closest('.datagrid-view').find('.cog-small,.cogwfilterY-small,.cogwfilterO-small');
			if (options.filterRules && options.filterRules.length > 0) {
				zCog.removeClass().addClass('cogwfilterO-small');
			} else if (options.queryParams.preFilter) {
				zCog.removeClass().addClass('cogwfilterY-small');
			} else {
				if (!zCog.hasClass('cog-small')) zCog.removeClass().addClass('cog-small');
			}

		}
		, onBeforeEdit: function (index, row) {
			var options = $(this).datagrid('options');
			$.each(options.columns[0], function (i, o) {
				if (o.editor) {
					if (o.editor.type === 'combotree') {
						o.editor.options.queryParams = { Code: row[o.field], isCode: true };
					}
				}
			});
			row['__meta'] = { old: JSON.parse(JSON.stringify(row)) };
			row["__editing"] = true;
			$(this).datagrid('refreshRow', index);
		}
		, onBeginEdit: function (index, row) {
			var ed = $(this).datagrid('getEditors', index);
			$.each(ed, function (i, o) {
				if (row[o.field] === null) o.target[0].value = 'NULL';
			});
		}
		, onAfterEdit: function (index, row, changes) {
			// !!!!!!!!!!!!!!!! flytta till dg_save
			var zId = $(this).datagrid('options').id;
			var old = row.__meta.old;
			delete row["__meta"];
			var payload = { action: row.__action, dataSet: iPage.plugincontent.dataSet, viewSet: iPage.plugincontent.viewSet, old: old, row: row };
			$.post("../data/grid_cud.aspx", { payload: JSON.stringify(payload) }, function (data) {
				jdata = JSON.parse(data);
				if (jdata.result.success) {
					if (jdata.result.records_affected === -1) {
						msg("Successfull (onAfterEdit)", "No rows " + jdata.action + "ed.");
						$("#" + zId).datagrid('beginEdit', index);  // !!!!!!!!!!!!!!!! bör göras tidigare, skall ej uppträda
					} else {
						msg("Successfull (onAfterEdit)", "Successfully " + jdata.action + "ed " + jdata.result.records_affected + " rows ");
						$("#" + zId).datagrid('updateRow', { index: index, row: jdata.result.return[0] });
						row["__editing"] = false;
						$("#" + zId).datagrid('refreshRow', index);
					}
				} else {
					msg("After-Edit error", "Error in datagrid " + jdata.result.errorMsg);
					$("#" + zId).datagrid('beginEdit', index); // !!!!!!!!!!!!!!!! bör göras tidigare
					return;
				}
			}).fail(function () {
				alert("page error");
				$("#" + zId).datagrid('beginEdit', index);  // !!!!!!!!!!!!!!!! bör göras tidigare, skall ej uppträda
			});
		}
		, onCancelEdit: function (index, row) {
			if (row.__action === "insert" || row.__action === "copy") {
				dg.datagrid('deleteRow', index);
			} else { // is not inserted 
				row["__editing"] = false;
				$(this).datagrid('unselectAll').datagrid('refreshRow', index);
			}
		}
		, loadFilter: function (data) {
			var options = $(this).datagrid('options');
			options.isReady = false;
			if (!this.columns && data.rows) {
				this.columns = [data.columns];
				// console.log(data, this.columns);
				options.__meta = {};
				options.__meta.pgcolumns = JSON.parse(JSON.stringify(data.columns));
				options.__meta.pgcolumns2 = {};
				options.__meta.iPage = iPage;
				$.each(options.__meta.pgcolumns, function (i, o) {
					options.__meta.pgcolumns2[o.field] = o;
				});
				var url = options.url;
				data.id = options.id;
				data.showColumns = iPage.plugincontent.dataSet.showColumns;
				options.columns = dg_prettify_columns(data, iPage);
				options.frozenColumns = [[{ field: 'men', width: 35, title: '<button id="cog_small" class="cog-small" onclick="dg_clickHeaderMenu(this)" style="width:18px;height:18px;border:0;cursor: pointer;"></button>', align: 'center', formatter: function (value, row, index) {return '<button class="menu-small" onclick="dg_clickRowMenu(this)" style="width:6px;height:20px;border:0;cursor: pointer;"></button> ';}}]];
				options.url = null;
				$(this).datagrid();
				options.isReady = true;
				setTimeout(function () {
					options.url = url;
					options.queryParams.first = false;
				}, 0);
			} else if (data.rows) {
				options.isReady = true;
			}
			options.__meta.data = data;
			return data;
		}
	};
	return $.extend(parameters, functions);
}

function dg_sortify_columns(iColumns) {
	// var columns = [];
	$.each(iColumns[0], function (i, o) {
		o['sortable'] = true;
	});
	return [iColumns];
}


function dg_prettify_columns(data, iPage) {
	var noEdit = iPage.plugincontent.dataSet.noEdit;
	var columns = [];
	if (data.showColumns) {
		$.each(data.showColumns, function (i, o) {
			if (!o.field && $.type(o) === "object") return;
			var pos = data.columns.map(function (e) { return e.field; }).indexOf(o.field || o);
			if (o.title && !o.width) { o.width = o.title.length*7+20; }
			columns.push($.extend(data.columns[pos], o, { hidden: pos === -1 }));
		});
	} else {
		columns = data.columns;
	}

	var ret = [];
	if (!noEdit) {
		ret.push({
			field: 'edt', width: 35, title: '  ', align: 'center'
			, formatter: function (value, row, index) {
				if (row.__editing) {
					return '<button class="stop_edit-small" onclick="dg_cancel(this)" style="width:20px;height:20px;border:0"></button> ';
				} else {
					return '<button class="pencil-small" onclick="dg_edit(this)" style="width:20px;height:20px;border:0;cursor: pointer;"></button> ';
				}
			}
		});
	}
	/*
	ret.push({
		field: 'men', width: 35, title: '<button id="cog_small" class="cog-small" onclick="dg_clickHeaderMenu(this)" style="width:18px;height:18px;border:0;cursor: pointer;"></button>', align: 'center'
		, formatter: function (value, row, index) {
			return '<button class="menu-small" onclick="dg_clickRowMenu(this)" style="width:6px;height:20px;border:0;cursor: pointer;"></button> ';
		}
	});
	*/

	$.each(columns, function (i, o) {
		toPush = o;
		toPush['sortable'] = true;
		// ??
		if (o.editor === 'checkbox') {
			o.align = 'center';
			o.editor = 'text';
		}
		toPush['editor'] = { type: o.editor, options: { required: o.required, precision: o.scale, max: o.max } };
		if (o.FKs && !o.hidden) {
			var type;
			if (o.FKs.split('.')[2] === 'Code') { type = 'combotree'; }
			else { type = 'combogrid'; }
			switch (type) {
				case 'combogrid':
					toPush.editor = {
						type: 'combogrid', options: {
							panelWidth: 450
							, pagination: true
							, pageList: [5, 10, 50, 200, 500, 2000, 5000]
							, pageSize: 50
							, url: '../data/grid_provider_lov.aspx?type=combogrid&view=' + o.FKs
							, mode: "remote"
							, remoteFilter: true
							, clientPaging: false
							, idField: o.FKs.split('.')[2]
							, textField: o.FKs.split('.')[2]
							, columns: [[{ field: o.FKs.split('.')[2], title: o.FKs.split('.')[2], width: 200 }]]
							, toolbar: [{ iconCls: 'menu-small' }, { text: "<div id='abc'>abc</div>" }]
							, onShowPanel: function () {
								panel = $(this).combogrid('panel');
								//$(this).combogrid("grid").datagrid("load", "lab/datagrid_vanilla_service2.aspx?view=");
							}
							, loadFilter: function (data) {
								if (!this.columns && data.columns) {
									this.columns = data.columns;
									var options = $(this).datagrid('options');
									var url = options.url;
									data.id = options.id;
									$.each(data.columns[0], function (i, o) { o['sortable'] = true; });
									$(this).datagrid({ columns: data.columns, url: null }); // .datagrid('enableFilter')
									setTimeout(function () {
										options.url = url;
										options.queryParams.first = false;
									}, 0);
								}

								return data;
							}
							// Not working: onShowPanel, onClickIcon, onClick, onLoad
							// Working: onOpen, onBeforeLoad, onBeforeValidate
						}
					};
					break;
				case 'combotree':
					toPush.editor = {
						type: 'combotree', options: {
							checkbox: true
							//, valueField: 'value' // is default: value
							//, textField: 'text'   // is default: text
							// , idField: "id"
							, required: true
							, url: '../data/grid_provider_lov.aspx?type=combotree&view=' + o.FKs
							, panelWidth: 450
							, animate: true
							, loadFilter: function (data, parent) { return data.body; }
							, onBeforeLoad: function (node, param) {
								$(this).tree("options").checkbox = true;
							}
							, onLoadSuccess: function (a, b, c) {
								var row = $(this).parent().parent().parent().find('.datagrid-f').datagrid('getSelected');
								var node = $(this).tree('find', row[o.field.split('_')[2]] || row[o.field]);
								if (node) { $(this).tree('expandTo', node.target); }
							}
							, onShowPanel: function () {
								var row = $(this).closest('.datagrid-view').find('.datagrid-f').datagrid('getSelected');
								var zTree = $(this).combotree("tree");
								var node = zTree.tree('find', row[o.field.split('_')[2]] || row[o.field]);
								if (node) { zTree.tree('scrollTo', node.target); }
							}
							// Not working: , onClickIcon, onClick, onLoad, onOpen
							// Working: onShowPanel, onBeforeLoad, onBeforeValidate
						}
					};
					break;
			}
		}

		if (o.isID || o.computed || o.defaulted) toPush['editor'] = '';
		toPush['formatter'] = function (value, row, index) {
			if (value === null) {
				return '<span style="background-color:rgba(255,255,0,0.2);">NULL</span>';
			} else {
				return value;
			}
		};

		ret.push(toPush);
	});
	if (!noEdit) {
		ret.push({
			field: 'del', title: '', width: 35, align: 'center'
			, formatter: function (value, row, index) {
				/*To-do  går det att skicka j-objekt???*/
				var tr = $(this).closest('tr.datagrid-row');
				var is_edit = tr.closest('.datagrid-row-editing').length;
				if (row.__editing) {
					return '<button class="disk-small" onclick="dg_save(this)" style="width:25px;height:25px;border:0"></button> ';
				} else {
					return '<button class="trash-small" onclick="dg_delete(this)" style="width:25px;height:25px;border:0"></button> ';
				}
			}
		});
	}
	return [ret];
}


function dg_clickHeaderMenu(target) {
	var ret = get_dg_index(target); var dg = ret[0];
	var dg_options = dg.datagrid('options');
	// console.log(dg_options);
	var noEdit = dg_options.__meta.iPage.plugincontent.dataSet.noEdit;
	var menu = $("<div/>", { class: "easyui-menu" }).menu();
	if (dg_options.queryParams.preFilter) { menu.menu('appendItem', { text: 'Clear preFilter', iconCls: 'clearPreFilter-small', handler: function () { dg_options.queryParams.preFilter = ''; dg.datagrid('reload'); } }); }
	else if (dg_options.dataSet.preFilter) { menu.menu('appendItem', { text: 'Add preFilter', iconCls: 'addPreFilter-small', handler: function () { dg_options.queryParams.preFilter = JSON.stringify(dg_options.dataSet.preFilter) ; dg.datagrid('reload'); } }); }
	if (dg.datagrid('isFilterEnabled')) {
		menu.menu('appendItem', { text: 'Hide filter-bar', iconCls: 'clear-filter-small', handler: function () { dg.datagrid('removeFilterRule').datagrid('disableFilter').datagrid('reload'); } });
	} else {
		menu.menu('appendItem', { text: 'Show filter-bar', iconCls: 'filter-small', handler: function () { dg.datagrid('enableFilter'); menu.menu('hide'); } });
		menu.menu('appendItem', { text: 'Grouped filter', iconCls: 'filter_group-small', handler: function () { dg.datagrid('enableFilter'); } });
	} // isFilterEnabled
	menu.menu('appendItem', {
		text: 'Pop-up', iconCls: 'pop-up', handler: function () {
			var opt = dg.datagrid('options').__meta.iPage;
			web_part_page({ window: true, title:'Pop-up', content: JSON.stringify(opt) });
		}
	});
	menu.menu('appendItem', { text: 'Download', iconCls: 'icon-excel-small', handler: function () { dg_ExcelDownload(dg); } });
	menu.menu('appendItem', { text: 'Download_w', iconCls: 'icon-excel_pop-small', handler: function () { web_part_page({ window: true, iconCls: 'icon-excel-small', content: 'Not ready yet...', plugin: 'layout', plugincontent: {} }); } });
	if (!noEdit) {
		menu.menu('appendItem', { text: 'Edit in list', iconCls: 'icon-edit-multiple', handler: function () { edit_in_list(dg) } }); // ### to generalize
		menu.menu('appendItem', { text: 'Insert', iconCls: 'icon-add', handler: function () { dg_insert(dg); } });
		menu.menu('appendItem', { text: 'Insert', iconCls: 'icon-add_pop', handler: function () { web_part_page({ window: true, title: 'Edit', content: 'Not ready yet...' }); pg_pop(dg); } });
	}
	menu.menu('appendItem', { text: 'Help', iconCls: 'help-small', handler: function () { web_part_page({ window: true, iconCls: 'help-small', title: 'Help', href: 'helpfiles/datagrid.html' }); } });
	menu.menu('appendItem', { separator: true });
	menu.menu('appendItem', { text: 'Exit', iconCls: 'exit', handler: function () { } });
	menu.menu('appendItem', { separator: true });
	menu.menu('appendItem', { text: 'In preview below', disabled: true });
	
	menu.menu('show', { left: 25 + $(target).offset().left, top: -(0) - 10 + $(target).offset().top, align: 'right' });
}

function dg_clickRowMenu(target) {
	var ret = get_dg_index(target); var dg = ret[0]; var index = ret[0];
	var dg_options = dg.datagrid('options');
	var noEdit = dg_options.__meta.iPage.plugincontent.dataSet.noEdit;
	var tr = $(target).closest('tr.datagrid-row');
	var is_edit = tr.closest('.datagrid-row-editing').length;
	var menu = $("<div/>", { class: "easyui-menu" }).menu();

	if (!noEdit) {
		if (is_edit === 0) {
			menu.menu('appendItem', { text: 'Insert', iconCls: 'icon-add', handler: function () { dg_insert(target); } });
			menu.menu('appendItem', { text: 'Copy', iconCls: 'copy-small', handler: function () { dg_copy(target); } });

			menu.menu('appendItem', { text: 'Edit', iconCls: 'pen', handler: function () { dg_edit(target); } });
			menu.menu('appendItem', { text: 'Edit', iconCls: 'icon-edit-popup', handler: function () { pg_pop(dg); } });
			menu.menu('appendItem', { text: 'Delete', iconCls: 'trash-small', handler: function () { dg_delete(target); } });
		} else {
			menu.menu('appendItem', { text: 'Save', iconCls: 'disk-small', handler: function () { dg_save(target); } });
			menu.menu('appendItem', { text: 'Cancel', iconCls: 'stop_edit-small', handler: function () { dg_cancel(target); } });
		}
	}
	if (dg_options.queryParams.view) menu.menu('appendItem', { text: 'Changes', iconCls: 'exchanges-small', handler: function () { dg_changes(dg); } });
	menu.menu('appendItem', { separator: true });
	menu.menu('appendItem', { text: 'Exit', iconCls: 'exit', handler: function () { dg.datagrid('unselectAll'); dg_cancel(target) } });
	if (dg_options.viewSet && dg_options.viewSet.menu) {
		menu.menu('appendItem', { separator: true });
		$.each(dg_options.viewSet.menu, function (i, o) {
			menu.menu('appendItem', { text: '' + o.text + '', iconCls: o.iconCls, handler: function () { eval(o.function_name + "(dg,o)"); } });
		});
	}
	menu.menu('show', { left: 25 + $(target).offset().left, top: -(0) - 10 + $(target).offset().top, align: 'right' });
}

function get_dg_index(target) {
	var dg = $(target).closest('.datagrid-view').find('.datagrid-f');
	var tr = $(target).closest('tr.datagrid-row');
	var index = parseInt(tr.attr('datagrid-row-index'));
	return [dg, index];
	// var index = dg.datagrid('getRowIndex', dg.datagrid('getSelected'));
	// var tr = $(target).closest('tr.datagrid-row'); var is_edit = tr.closest('.datagrid-row-editing').length; index = parseInt(tr.attr('datagrid-row-index'));
}

function dg_insert(target) {
	var ret = get_dg_index(target); dg = ret[0]; index = ret[1];
	if (isNaN(index)) index = -1;
	dg.datagrid('insertRow', { index: index + 1, row: { "__action": "insert" } })
		.datagrid('beginEdit', index + 1)
		.datagrid('selectRow', index + 1);
}

function dg_copy(target) {
	var ret = get_dg_index(target); dg = ret[0]; index = ret[1];
	var row = dg.datagrid('getRows')[index];
	var copy_row = {};
	$.each(row, function (i, o) {
		copy_row[i] = o;
		if (dg.datagrid('options').__meta.pgcolumns2[i]) {
			if (dg.datagrid('options').__meta.pgcolumns2[i].isID) copy_row[i] = ''; // dont give id column a value
		}
	});
	copy_row["__action"] = "copy";
	dg.datagrid('insertRow', { index: index + 1, row: copy_row })
		.datagrid('beginEdit', index + 1)
		.datagrid('selectRow', index + 1);
}

function dg_save(target) {
	var ret = get_dg_index(target); dg = ret[0]; index = ret[1];
	dg.datagrid('selectRow', index).datagrid('endEdit', index);
}

function dg_cancel(target) {
	var ret = get_dg_index(target); dg = ret[0]; index = ret[1];
	dg.datagrid('cancelEdit', index);
}


function dg_edit(target) {
	var dg; var index;
	if ($(target).hasClass("datagrid-f")) { // onDblClickRow
		dg = $(target); index = dg.datagrid("getRowIndex", dg.datagrid("getSelected"));
	} else { // button clicked
		var ret = get_dg_index(target); dg = ret[0]; index = ret[1];
	}
	var row = dg.datagrid('getRows')[index];
	row["__action"] = "update";
	dg.datagrid('selectRow', index);
	dg.datagrid('beginEdit', index);
}

function dg_changes(dg) {
	var view = dg.datagrid('options').queryParams.view;
	web_part_page({
		window: true, title: 'Changes', width: 900, plugin: 'layout', plugincontent: [{
			region: 'center', title: '', plugin: 'datagrid', plugincontent: {
				dataSet: {
					view: 'dbo.v_audit_details', preFilter: [{ field: "schema", op: "equal", value: view.split('.')[0] }, { field: "table", op: "equal", value: view.split('.')[1] }, { field: "key", op: "equal", value: dg.datagrid('getSelected').id }]
					, showColumns: ['action', 'time', 'user', 'column', 'from', 'to'], noEdit: true
				}
				, fitColumns: true
				, sortName: 'time'//, sortOrder: 'desc'
				// , autoSizeColumn: true
			}
		}]
	});
}

function dg_rowExtraMenu(dg, name) {
	[name](dg)
}


function pg_pop(dg) {
	var options = dg.datagrid('options');
	var type = 'insert';
	var selected_row = dg.datagrid('getSelected');
	if (selected_row) type = 'edit';
	var index = dg.datagrid("getRowIndex", selected_row);
	var pg_rows = [];
	$.each(options.__meta.pgcolumns, function (i, o) {
		var ColumnOption = dg.datagrid('getColumnOption', o.field);
		var editor;
		if (o.FKs && !o.hidden) {
			var type;
			if (o.FKs.split('.')[2] === 'Code') { type = 'combotree'; }
			else { type = 'combogrid'; }
			if (o.FKs && type === 'combotree') {
				var code = ""; if (selected_row) code = selected_row[o.field];
				editor = ColumnOption.editor;
				editor.options.url = "../data/grid_provider_lov.aspx?type=combotree&view=" + o.FKs;
				editor.options.queryParams = { Code: selected_row[o.field] };
				editor.options.onBeforeLoad = function () {
					$(this).tree("options").checkbox = true;
				};
			}
		}
		var value;
		if (selected_row) value = selected_row[o.field];
		pg_rows.push({ name: o.field, value: value, editor: editor });
	});
	web_part_page({
		id: '___123'
		, title: 'Edit row:'
		, dialog: true
		, width: 400
		, height: 450
		, plugin: 'layout'
		, plugincontent: [{ region: 'center', title: '', plugin: 'propertygrid', plugincontent: { data: pg_rows } }

		]
	});
}

function dg_delete(target) {
	using('messager', function () {
		$.messager.confirm('Confirm', 'Are you sure you want to delete record?', function (r) {
			if (r) {
				var ret = get_dg_index(target); dg = ret[0]; index = ret[1];

				var row = dg.datagrid('getRows')[index];
				row["__action"] = "edit";
				var options = dg.datagrid('options');

				var payload = { action: "delete", dataSet: options.dataSet, old: row, row: row };
				$.post("../data/grid_cud.aspx", { payload: JSON.stringify(payload) }, function (data) {
					if (data) {
						var jdata = JSON.parse(data);
						if (jdata.result.success) {
							msg('Successfully', "Successfully deleted " + jdata.result.records_affected + " rows ");
							dg.datagrid('deleteRow', index);
						} else {
							msg("Post error", "Error in datagrid " + dg.datagrid('options').id + " when posting:" + jdata.result.errorMsg);
						}
					} else {
						msg('Error-msg', 'Missing return data');
					}
				}).fail(function () {
					alert("page error");
				});
			}
		});
	});
}

function dg_ExcelDownload(dg) {
	zOptions = dg.datagrid('options');
	var oConn = {};
	oConn.view = zOptions.dataSet.view;
	using('messager', function () { $.messager.progress(); });
	var filter = [];
	$.each(dg.datagrid("options").columns[0], function (i, o) {
		var FilterRule = dg.datagrid('getFilterRule', o.field);
		if (FilterRule && FilterRule.value.length > 0) filter.push(FilterRule);
	});
	oConn.filterRules = filter;
	$.post("../data/excel.aspx", { payload: JSON.stringify(oConn) }, function () {
		// $('#dialog').dialog({ href: '../data/getFiles.aspx', closed: false, title: 'Excel download', iconCls: 'icon-excel-small' });
		doPoll(1);
	})
		.fail(function () {
			msg('Error', "There was an error, pls check logs.");
		})
		.always(function () {
			using('messager', function () { $.messager.progress("close"); });
		});
}