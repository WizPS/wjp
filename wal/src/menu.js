var zTabMenus = {
    ps: {
        id: "PS1"
        , disabled: false
        , title: "Pricing Service"
        , groups: [{
            id: "Item"
            , title: "Item"
            , dir: "h"
            , tools: [{
                id: "12"
                , type: "toolbar"
                , dir: "h"
                , tools: [{
                    id: "Items_list1231"
                    , type: "splitbutton"
                    , name: "Items_list"
                    , text: "Items"
                    , disabled: false
                    , iconCls: "items-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                    , menuItems: [
                        { text: "Service: list_price", name: 'service_list_price', iconCls: "items-small" }
                        , { text: "Service: corridor_disc", name: 'service_corridor_disc', iconCls: 'list_price-small' }
                        , { text: "Touchpoint Price-list", name: 'touchpoint_pricelist', iconCls: "partial-branch-small" }
                        , { text: "Ask Item Master", name: 'ask_gim', iconCls: "student-small" }
                    ]
                }]
            }]
        }, {
            id: "PPL"
            , title: "PPL"
            , dir: "h"
            , tools: [{
                id: "12"
                , type: "toolbar"
                , dir: "h"
                , tools: [{
                    id: "PPL_revision1231"
                    , type: "splitbutton"
                    , name: "PPL_revision"
                    , text: "PPL-revision"
                    , disabled: false
                    , iconCls: "ppl_mgmt-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                    , menuItems: [{ text: "PPL-setters", name: 'PPL_setters_pop', iconCls: "icon-user-small", selected: true }, { text: "PPL-setters again", name: "PPL_setters2_pop", iconCls: "icon-user-small" }]
                }]
            }, {
                id: "12"
                , type: "toolbar"
                , dir: "v"
                , tools: [{
                    // Tools L4 default
                    id: 'PPL_create_full'
                    , name: 'create_full'
                    , text: 'Create Full'
                    , iconCls: 'full-branch-small'
                    , disabled: true
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: 'f1'
                }, {
                    // Tools L4 default
                    id: 'PPL_create_partial'
                    , name: 'create_partial'
                    , text: 'Create Partial'
                    , disabled: true
                    , iconCls: 'partial-branch-small'
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: 'f1'
                }, {
                    // Tools L4 default
                    id: 'PPL_update'
                    , name: 'update'
                    , text: 'Update'
                    //, tooltip: 'Update'
                    , disabled: true
                    , iconCls: 'commit-small'
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: 'f1'
                }]
            }, {
                // Toolbars L3 (Invisible)
                id: '4'
                , type: 'toolbar'
                , dir: 'v'
                , tools: [{
                    // Tools L4 default
                    id: 'PPL_confirm'
                    , name: 'confirm'
                    , text: 'Confirm'
                    , disabled: true
                    , iconCls: 'partial-branch-small'
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: 'f1'
                }, {
                    // Tools L4 default
                    id: 'PPL_commit'
                    , name: 'commit'
                    , text: 'Commit'
                    , disabled: true
                    , iconCls: 'commit-small'
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: 'f1'
                }, {
                    // Tools L4 default
                    id: 'PPL_cancel'
                    , name: 'cancel'
                    , text: 'Deselect'
                    , disabled: true
                    , iconCls: 'cancel-small'
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: 'f1'
                }]
            }]
        }, {
            id: "Market"
            , title: "Market"
            , dir: "h"
            , tools: [{
                id: "12"
                , type: "toolbar"
                , dir: "h"
                , tools: [{
                    id: "List_pricing1231"
                    , type: "splitbutton"
                    , name: "List_pricing"
                    , text: "List-pricing"
                    , disabled: false
                    , iconCls: "list_price-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                    , menuItems: [{
                        text: "Fully rolled-out", name: "Fully_rolled_out", iconCls: "icon-user-small"
                    }]

                }, {
                        id: "quantity_discounts_276"
                        , type: "splitbutton"
                        , name: "quantity_discounts"
                        , text: "Quantity"
                        , disabled: false
                        , iconCls: "list_qty-large"
                        , iconAlign: "top"
                        , size: "large"
                        , toggle: true
                        , group: "p1"
                        , menuItems: [{
                            text: "Quantity steps", name: "quantity_steps", iconCls: "stair_steps-small"
                        }]

                    }]
            }, {
                id: "12"
                , type: "toolbar"
                , dir: "v"
                , tools: []
            }]
        }, {
            id: "Customer"
            , title: ""
            , dir: "h"
            , tools: [{
                id: "12"
                , type: "toolbar"
                , dir: "h"
                , tools: [{
                    id: "Customer_pricing1231"
                    , name: "Customer_pricing"
                    , text: "Customer-pricing"
                    , disabled: true
                    , iconCls: "tag-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                }]
            }]
        }, {
            id: "PPL_fx"
            , title: "PPL-fx rates"
            , dir: "h"
            , tools: [{
                id: "12"
                , type: "toolbar"
                , dir: "h"
                , tools: [{
                    id: "PPL_fx2"
                    , type: "splitbutton"
                    , text: "PPL-fx"
                    , name: 'PPL_fx'
                    , disabled: false
                    , iconCls: "currency-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                    , menuItems: [{ text: "List PPL-fx rates", name: 'List_PPL_fx_pop', iconCls: "currency-small" }]
                }]
            }, {
                id: "12"
                , type: "toolbar"
                , dir: "v"
                , tools: [{
                    // Tools L4 default
                    id: 'add_fx'
                    , name: 'add_fx'
                    , text: 'Add'
                    , iconCls: 'add-small'
                    , disabled: true
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: 'f1'
                }]
            }]
        }, {
            id: "service"
            , title: ""
            , dir: "h"
            , tools: [{
                id: "12"
                , type: "toolbar"
                , dir: "v"
                , tools: [{
                    text: ''
                    , type: "splitbutton"
                    , iconCls: 'diagram-blk'
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: "px"
                    , menuItems: [{ text: "Product", iconCls: "diagram-blk", name: 'Items_list3_pop' }, { text: "Geography", iconCls: "diagram-blk", name: 'Items_list3_pop' }, { text: "Industry", iconCls: "diagram-blk", name: 'Items_list3_pop' }]
                }]
            }]
        }]
    }
    , ps2: {
        id: "PS2"
        , disabled: false
        , title: "Tests"
        , groups: [{
            id: "Item2"
            , title: "Item2"
            , dir: "h"
            , tools: [{
                id: "23"
                , type: "toolbar"
                , dir: "h"
                , tools: [{
                    id: "list_price_service_pop1231"
                    , name: "list_price_service_pop"
                    , text: "List-price smoke tests"
                    , disabled: false
                    , iconCls: "double-arrow-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                }]
            }]
        }, {
            id: "service"
            , title: "Smoke"
            , dir: "h"
            , tools: [{
                id: "12"
                , type: "toolbar"
                , dir: "v"
                , tools: [{
                    text: ""
                    , name: 'service_request'
                    , type: "splitbutton"
                    , disabled: false
                    , iconCls: "double-arrow-small"
                    , iconAlign: "left"
                    , size: "small"
                    , toggle: false
                    , group: "px"
                    , menuItems: [{ text: "Smoke-test", iconCls: "double-arrow-small", handler: function () { Smoke_test(); } }, { text: "gen_table_test", iconCls: "diagram-blk", handler: function () { gen_table_test(); } }, { text: "Visualizations", iconCls: "diagram-blk", handler: function () { test(); } }, { text: "Visualizations2", iconCls: "diagram-blk", handler: function () { test2(); } }, { text: "temp_test1", iconCls: "diagram-blk", handler: function () { temp_test1(); } }, { text: "temp_test1w", iconCls: "diagram-blk", handler: function () { temp_test1w(); } }, { text: "temp_test2", iconCls: "diagram-blk", handler: function () { temp_test2(); } }, { text: "temp_test2w", iconCls: "diagram-blk", handler: function () { temp_test2w(); } }, { text: "temp_test3", iconCls: "diagram-blk", handler: function () { temp_test3(); } }, { text: "temp_test3w", iconCls: "diagram-blk", handler: function () { temp_test3w(); } }, { text: "gauge_js_test", iconCls: "diagram-blk", handler: function () { gauge_js_test(); } }]
                }]
            }]
        }, {
            id: "2service"
            , title: "Dev1"
            , dir: "v"
            , tools: [{
                id: "ltst1"
                , name: "Test_1"
                , text: "Test_1"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }, {
                id: "ltst2"
                , name: "Test_2"
                , text: "Test_2"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }, {
                id: "ltst2"
                , name: "Test_3"
                , text: "Test_3"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }]
        }, {
            id: "2service"
            , title: "Dev2"
            , dir: "v"
            , tools: [{
                id: "ltst1"
                , name: "Test_4"
                , text: "Test_4"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }, {
                id: "ltst2"
                , name: "Test_5"
                , text: "Test_5"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }, {
                id: "ltst2"
                , name: "Test_6"
                , text: "Test_6"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }]
        }, {
            id: "2service"
            , title: "Dev3"
            , dir: "v"
            , tools: [{
                id: "ltst1"
                , name: "Test_7"
                , text: "Test_7"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }, {
                id: "ltst2"
                , name: "Test_8"
                , text: "Test_8"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }, {
                id: "ltst2"
                , name: "Test_9"
                , text: "Test_9"
                , disabled: false
                , iconCls: "double-arrow-small"
                , iconAlign: 'left'
                , size: "small"
                , toggle: true
                , group: "p1"
            }]
            }, {
                id: "4service"
                , title: "Dev4"
                , dir: "v"
                , tools: [{
                    id: "ltst1"
                    , name: "Test_10"
                    , text: "Test_10"
                    , disabled: false
                    , iconCls: "double-arrow-small"
                    , iconAlign: 'left'
                    , size: "small"
                    , toggle: true
                    , group: "p1"
                }, {
                    id: "ltst1"
                    , name: "Test_11"
                    , text: "Test_11"
                    , disabled: false
                    , iconCls: "double-arrow-small"
                    , iconAlign: 'left'
                    , size: "small"
                    , toggle: true
                    , group: "p1"
                }, {
                    id: "ltst12"
                    , name: "Test_12"
                    , text: "Test_12"
                    , disabled: false
                    , iconCls: "double-arrow-small"
                    , iconAlign: 'left'
                    , size: "small"
                    , toggle: true
                    , group: "p1"
                }]
            }, {
                id: "5service"
                , title: "Dev5"
                , dir: "v"
                , tools: [{
                    id: "ltst1"
                    , name: "DataLoaderTest"
                    , text: "DataLoaderTest"
                    , disabled: false
                    , iconCls: "double-arrow-small"
                    , iconAlign: 'left'
                    , size: "small"
                    , toggle: true
                    , group: "p1"
                }]
            }]
    }
    , psA: {
        id: "PS0"
        , disabled: false
        , title: "Admin"
        , groups: [{
            id: "usage"
            , title: "Usage"
            , dir: "h"
            , tools: [{
                id: "23"
                , type: "toolbar"
                , dir: "h"
                , tools: [{
                    id: "scheduled_jobs"
                    , name: 'scheduled_jobs'
                    , text: "Scheduled jobs"
                    , disabled: false
                    , iconCls: "time-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                }, {
                    id: "Log_of_changes"
                    , name: 'Log_of_changes'
                    , text: "Change-log"
                    , disabled: false
                    , iconCls: "changes-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                }, {
                    id: "List_price_requests"
                    , name: "List_price_requests"
                    , text: "LP-requests"
                    , disabled: false
                    , iconCls: "double-arrow-large"
                    , iconAlign: 'top'
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                },]
            }]
        }, {
            id: "monitoring"
            , title: "Monitoring"
            , dir: "h"
            , tools: [{
                id: "32"
                , type: "toolbar"
                , dir: "v"
                , tools: [{
                    id: "monitor_identity"
                    , name: 'monitor_identity'
                    , text: "ID's"
                    , disabled: false
                    , iconCls: "gauge-small"
                    , iconAlign: "left"
                    , size: "small"
                    , toggle: true
                    , group: "p1"
                }, {
                    id: "monitor_integration"
                    , name: 'monitor_integration'
                    , text: "Integration"
                    , disabled: false
                    , iconCls: "gauge-small"
                    , iconAlign: "left"
                    , size: "small"
                    , toggle: true
                    , group: "p1"
                }]
            }, {
                id: "32"
                , type: "toolbar"
                , dir: "v"
                , tools: [{
                    id: "List_price_requests_performance"
                    , name: 'List_price_requests_performance'
                    , text: "Performance"
                    , disabled: false
                    , iconCls: "line-chart-small"
                    , iconAlign: "left"
                    , size: "small"
                    , toggle: true
                    , group: "p1"
                }, {
                        id: "ppl_hist_updates"
                        , name: 'ppl_hist_updates'
                        , text: "PPL-hist"
                        , disabled: false
                        , iconCls: "line-chart-small"
                        , iconAlign: "left"
                        , size: "small"
                        , toggle: true
                        , group: "p1"
                    }, {
                        id: "ppl_hist_updates"
                        , name: 'server_disk_capasity'
                        , text: "Server disk"
                        , disabled: false
                        , iconCls: "line-chart-small"
                        , iconAlign: "left"
                        , size: "small"
                        , toggle: true
                        , group: "p1"
                    }]
            }]
            }, {
                // , { text: "List-price requests", iconCls: "double-arrow-small", handler: function () { List_price_requests(); } }
                id: "PSHub"
                , title: "PSHub"
                , dir: "h"
                , tools: [{
                    id: "x32"
                    , type: "toolbar"
                    , dir: "v"
                    , tools: [{
                        id: "pshub_scheduled_jobs"
                        , name: 'pshub_scheduled_jobs'
                        , text: "Scheduled jobs"
                        , disabled: false
                        , iconCls: "time-small"
                        , iconAlign: "left"
                        , size: "small"
                        , toggle: true
                        , group: "p1"
                    }, {
                        id: "PSHub_db"
                        , name: "PSHub_db"
                        , text: "PSHub DB"
                        , disabled: false
                        , iconCls: "database2-small"
                        , iconAlign: "left"
                        , size: "small"
                        , toggle: true
                        , group: "p1"
                    }]
                }]
            }, {
                // , { text: "List-price requests", iconCls: "double-arrow-small", handler: function () { List_price_requests(); } }
                id: "DBA"
                , title: "DBA"
                , dir: "h"
                , tools: [{
                    id: "x322"
                    , type: "toolbar"
                    , dir: "h"
                    , tools: [{
                        id: "DB_admin"
                        , name: "DB_admin"
                        , text: "DB_admin"
                        , disabled: false
                        , iconCls: "database2-small"
                        , iconAlign: "top"
                        , size: "large"
                        , toggle: true
                        , group: "p1"
                    }]
                }]
            }]
    }
    , psEx: {
        id: "PS1"
        , disabled: false
        , title: "Tab"
        , groups: [{
            id: "PPL"
            , title: "group"
            , dir: "h"
            , tools: [{
                id: "12"
                , type: "toolbar"
                , dir: "h"
                , tools: [{
                    id: "PPL_revision1231"
                    , type: "splitbutton"
                    , name: "PPL_revision"
                    , text: "PPL-revision"
                    , disabled: false
                    , iconCls: "ppl_mgmt-large"
                    , iconAlign: "top"
                    , size: "large"
                    , toggle: true
                    , group: "p1"
                    , menuItems: [{ text: "PPL-setters", name: 'PPL_setters_pop', iconCls: "icon-user-small", selected: true }, { text: "PPL-setters again", name: "PPL_setters2_pop", iconCls: "icon-user-small" }]
                }]
            }, {
                id: "12"
                , type: "toolbar"
                , dir: "v"
                , tools: [{
                    // Tools L4 default
                    id: 'PPL_create_full'
                    , name: 'create_full'
                    , text: 'Create Full'
                    , iconCls: 'full-branch-small'
                    , disabled: true
                    , iconAlign: 'left'
                    , size: 'small'
                    , toggle: false
                    , group: 'f1'
                }]
            }]
        }]
    }
};