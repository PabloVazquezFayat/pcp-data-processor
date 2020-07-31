// STAMPS
// [Array with Stamp dates];
// Object with {“PRODUCT_ID”: {“dates_index”: {“ship_code”: “stamp_value”}}};
// // BADGES
// [Array with Marketing Message Dates]
// Object with {“PRODUCT_ID”: {“dates_index”: {“ship_code”: “badges_value”}}};

window.addEventListener('DOMContentLoaded', ()=>{

    let loaderLabel = document.querySelector('#loader-label');
    let loaderIcon = document.querySelector('#loader-icon');

    const parseExcel = function(e){

        let file = e.target.files[0];
        let formatedData = {};

        if(!file){
            loaderLabel.style.display = 'block';
            loaderIcon.style.display = 'none';
            return;
        }

        let reader = new FileReader();
    
        reader.onload = (e)=> {

            let data = e.target.result;
            let workbook = XLSX.read(data, {type: 'binary'});

            for(let i = 0; i < workbook.SheetNames.length; i++){
                let rowDataObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[i]]);

                let valueData = rowDataObject.map((data)=>{
                    return `${data['Ship Code']} ${data['Sailing Date']} ${data['PRODUCT_ID']} ${data['Marketing Message ']} ${data['Stamp']}`
                });

                let indices = [];

                valueData.some((value, i)=>{
                    if(valueData.indexOf(value) !== -1){
                        indices.push(i);
                    }
                })

                indices.forEach((indx, i)=>{
                    console.log(`index: ${i}`, rowDataObject[indx]);
                })

                // console.log(isDuplicate);

                let mappedData = rowDataObject.map((obj)=>{

                    let dataObject = {};

                    if(Object.keys(obj).indexOf('Ship Code') !== -1){
                        dataObject['Ship Code'] = obj['Ship Code']
                    }
                    
                    if(Object.keys(obj).indexOf('Sailing Date') !== -1){
                        dataObject['Sailing Date'] = obj['Sailing Date']
                    }
                    
                    if(Object.keys(obj).indexOf('PRODUCT_ID') !== -1){
                        dataObject['PRODUCT_ID'] = obj["PRODUCT_ID"]
                    }
                    
                    if( Object.keys(obj).indexOf('Marketing Message') !== -1   || 
                        Object.keys(obj).indexOf('Marketing Message ') !== -1  ||
                        Object.keys(obj).indexOf(' Marketing Message ') !== -1 ||
                        Object.keys(obj).indexOf(' Marketing Message') !== -1
                    ){
                        dataObject['Marketing Message'] = obj['Marketing Message']
                    }
                    
                    if(Object.keys(obj).indexOf('Stamp') !== -1){
                        dataObject['Stamp'] = obj['Stamp']
                    }

                    return dataObject;
                });

                formatedData[workbook.SheetNames[i]] = mappedData;
            }

            // console.log(formatedData);

            document.querySelector('#json-code-block').innerText = '';
            // document.querySelector('#json-code-block').innerText = JSON.stringify(formatedData);

            loaderLabel.style.display = 'block';
            loaderIcon.style.display = 'none';

        };

        reader.readAsBinaryString(file);

    };

    let input = document.querySelector('#excel-file-input');

    input.addEventListener('change', (e)=>{
        loaderLabel.style.display = 'none';
        loaderIcon.style.display = 'block';
        parseExcel(e)
    }, false);
})