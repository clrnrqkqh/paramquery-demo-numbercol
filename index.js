
$(function () {
   var data = [
            { rank: 1, company: 'Exxon Mobil', revenues: 339938.0, profits: 36130.0 },
            { rank: 2, company: 'Wal-Mart Stores', revenues: 315654.0, profits: 11231.0 },
            { rank: 3, company: 'Royal Dutch Shell', revenues: 306731.0, profits: 25311.0 },
            { rank: 4, company: 'BP', revenues: 267600.0, profits: 22341.0 },
            { rank: 5, company: 'General Motors', revenues: 192604.0, profits: -10567.0 },
            { rank: 6, company: 'BP', revenues: 189481.0, profits: 14099.0 },
            { rank: 7, company: 'Citigroup', revenues: 186106.3, profits: 3536.3 },
            { rank: 8, company: 'Toyota Motor', revenues: 185805.0, profits: 12119.6 },
            { rank: 9, company: 'Ford Motor', revenues: 177210.0, profits: 2024.0 },
            { rank: 10, company: 'Ford Motor', revenues: 166683.0, profits: 13529.0 },
            { rank: 11, company: 'General Electric', revenues: 157153.0, profits: 16353.0 },
            { rank: 12, company: 'Total', revenues: 152360.7, profits: 15250.0 },
            { rank: 13, company: 'Citigroup', revenues: 138235.3, profits: 8958.9 },
            { rank: 14, company: 'Citigroup', revenues: 131045.0, profits: 24589.0 },
            { rank: 15, company: 'AXA', revenues: 129839.2, profits: 5186.5 },
            { rank: 16, company: 'AXA', revenues: 121406.0, profits: 5442.4 },
            { rank: 17, company: 'Ford Motor', revenues: 118376.6, profits: 1391.7 },
            { rank: 18, company: 'Fortis', revenues: 112351.4, profits: 4896.3 },
            { rank: 19, company: 'Citigroup', revenues: 110764.6, profits: 7434.3 },
            { rank: 20, company: 'AXA', revenues: 108905.0, profits: 10477.0 }
        ];

        function autoMerge(grid, refresh) {
            var mc = [],
                CM = grid.option("colModel"),
                i = CM.length,
                data = grid.option("dataModel.data");

            while (i--) {
                var dataIndx = CM[i].dataIndx,
                    rc = 1,
                    j = data.length;

                while (j--) {
                    var cd = data[j][dataIndx],
                        cd_prev = data[j - 1] ? data[j - 1][dataIndx] : undefined;
                    if (cd_prev !== undefined && cd == cd_prev) {
                        rc++;
                    }
                    else if (rc > 1) {
                        mc.push({ r1: j, c1: i, rc: rc, cc: 1 });
                        rc = 1;
                    }
                }
            }
            grid.option("mergeCells", mc);
            if (refresh) {
                grid.refreshView();
            }
        };

        var obj = {
            width: "100%",
            height: 400,
            rowHt: 50,
            numberCell: { show: true , resizable:true, title:"No"},
            flex: { one: true },
            sort: function () {
                autoMerge(this);
            },
            menuIcon: true,
            columnTemplate : {hvalign:"center", halign:"center", valign:"center",align:"center"},
            title: "Cell merge (rowspan)",
            sortModel: { sorter: [{ dataIndx: 'company', dir: 'up' }], space: true },
            toolbar: {
                items: [{
                    type: 'select',
                    label: 'Format: ',                
                    attr: 'id="export_format"',
                    options: [{ xlsx: 'Excel', csv: 'Csv', htm: 'Html', json: 'Json'}]
                },
                {
                    type: 'button',
                    label: "Export",
                    icon: 'ui-icon-arrowthickstop-1-s',
                    listener: function () {
                        debugger;
                        let color = "#000000";
                        this.Selection().selectAll({all:true});
                        this.Selection().toggleStyle("border", ["1px solid " + color, ""])

                        var format = $("#export_format").val(),                            
                            blob = this.exportData({
                                //url: "/pro/demos/exportData",
                                format: format,        
                                render: true
                            });
                        if(typeof blob === "string"){                            
                            blob = new Blob([blob]);
                        }
                        saveAs(blob, "pqGrid."+ format );
                    }
                },                    
               
                {
                    type: 'button',
                    label: 'Auto Merge',
                    listener: function () {
                        autoMerge(this, true);
                    }
                },
                {
                    type: 'button',
                    label: 'Remove Merge',
                    listener: function () {
                        this.option("mergeCells", []);
                        this.refreshView();
                    }
                }]
            }
        };
        let _style ={'border-top': '1px solid #000000','border-right': '1px solid #000000',  'border-bottom': '1px solid #000000'};
      
        obj.colModel = [
            { title: "Rank", width: 100,  dataIndx: "rank", format:'#,###' , style:_style},
            { title: "Company", width: 200, dataType: "string", dataIndx: "company",  style:_style, prop: { valign: 'center' }  },
            { title: "Revenues ($ millions)", width: 150, dataType: "float", dataIndx: "revenues", style:_style, format: '$#,###.00'},
            { title: "Profits ($ millions)", width: 150, dataType: "float", dataIndx: "profits", style:_style,format: '$#,###.00'}
        ];
        obj.dataModel = {
            data: data
        };
       var grid = pq.grid("#grid_json", obj);   

})
