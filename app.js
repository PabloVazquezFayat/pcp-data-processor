// all_columns_needed = [“Ship Code”,\
//     “Sailing Date”,\
//     “PRODUCT_ID”,\
//     “Marketing Message”,\
//     “Stamp”\
//     ]
// crf_columns_needed = [“Ship Code”,\
//     “Sailing Date”,\
//     “PRODUCT_ID”,\
//     “Marketing Message”\
//     ]
// stamp_columns_needed = [“Ship Code”,\
//       “Sailing Date”,\
//       “PRODUCT_ID”,\
//       “Stamp”\
//      ]

// STAMPS
// [Array with Stamp dates];
// Object with {“PRODUCT_ID”: {“dates_index”: {“ship_code”: “stamp_value”}}};
// // BADGES
// [Array with Marketing Message Dates]
// Object with {“PRODUCT_ID”: {“dates_index”: {“ship_code”: “badges_value”}}};

window.addEventListener('DOMContentLoaded', ()=>{

    const parseExcel = function(e) {

        let file = e.target.files[0];
        let json_data = [];

        if(!file){
            return;
        }

        let reader = new FileReader();
    
        reader.onload = (e)=> {

            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});

            for(let i = 0; i < workbook.SheetNames.length; i++){
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[i]]);
                var json_object = JSON.stringify(XL_row_object);
                json_data.push(json_object);
            }

            document.querySelector('#json-code-block').innerText = json_data.toString();

        };

        reader.readAsBinaryString(file);


    };

    let input = document.querySelector('#excel-file-input');
    let button = document.querySelector('#excel-file-process');

    input.addEventListener('change', parseExcel, false);

});