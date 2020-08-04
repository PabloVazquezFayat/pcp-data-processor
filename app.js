function parseExcel(e, cb){

    let file = e.target.files[0];
    let formatedData = {};

    let reader = new FileReader();

    reader.onload = (e)=> {
        let data = e.target.result;
        let workbook = XLSX.read(data, {type: 'binary'});

        for(let i = 0; i < workbook.SheetNames.length; i++){
            let rowDataObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[i]]);
            formatedData[workbook.SheetNames[i]] = rowDataObject;
        }

        cb(formatedData);
    };

    reader.readAsBinaryString(file);

};

function showLoadingIcon(){
    document.querySelector('#loader-label').style.display = 'none';
    document.querySelector('#loader-icon').style.display = 'block';
}

function hideLoadingIcon(){
    document.querySelector('#loader-label').style.display = 'block';
    document.querySelector('#loader-icon').style.display = 'none';
}

function clearCodeContainer(){
    document.querySelector('#json-code-block').innerText = ''
}

function fillCodeContainer(data){
    document.querySelector('#json-code-block').innerText = JSON.stringify(data);
}

function consolidateSheetData(data){

    let consolidatedData = []

    for (const key in data) {
        data[key].forEach((record)=>{
            consolidatedData.push(record);
        })
    }

    return consolidatedData;
}

function remapData(data){
    return data.map((record, i)=>{
        return {
            marketingMessage: record[Object.keys(record)[5]],
            productID: record[Object.keys(record)[6]],
            sailingDate: record[Object.keys(record)[2]],
            shipCode: record[Object.keys(record)[1]],
            stamp: Object.keys(record).indexOf('Stamp') !== -1 ? record[Object.keys(record)[8]] : undefined,
        }
    })
}

function deleteDuplicateData(data){
    let testArray = []
    let filtered = [];

    for(let i = 0; i < data.length; i++){
        if(testArray.indexOf(`${data[i].productID}${data[i].sailingDate}${data[i].shipCode}`) === -1){
            filtered.push(data[i]);
        }
        testArray.push(`${data[i].productID}${data[i].sailingDate}${data[i].shipCode}`);
    }
    return filtered;
}

function main(e){

    showLoadingIcon();

    parseExcel(e, (data)=>{

        
        let consolidatedData = consolidateSheetData(data);
        let remappedData = remapData(consolidatedData);
        let reducedData = deleteDuplicateData(remappedData);

        console.log(remappedData);
        console.log(reducedData);

        clearCodeContainer();
        // fillCodeContainer(reducedData);

        hideLoadingIcon();

    });

}

window.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('#excel-file-input').addEventListener('change', (e)=>{
        main(e)
    }, false);
});