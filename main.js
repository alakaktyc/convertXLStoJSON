function getXlsx(cb) {
    const oReq = new XMLHttpRequest();
    oReq.open("GET", 'location.xlsx', true);
    oReq.responseType = "arraybuffer";
    oReq.addEventListener('load', () =>{
        let arraybuffer = oReq.response;
        /* convert data to binary string */
        let data = new Uint8Array(arraybuffer);
        let arr = [];
        for(let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        let bstr = arr.join("");
        /* Call XLSX */
        let workbook = XLSX.read(bstr, {type:"binary"});
        /* DO SOMETHING WITH workbook HERE */
        let first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        let worksheet = workbook.Sheets[first_sheet_name];
        let locationArr = XLSX.utils.sheet_to_json(worksheet,{raw:true});

        cb(locationArr);
    });
    oReq.addEventListener('error', () => {
        console.log('error');
    });

    oReq.send();
}
getXlsx(locationArr => {

    /*for (let locations of locationArr){
        console.log(locations.location)
    }*/

    document.querySelector("#autoComplete").addEventListener("autoComplete", function (event) {
        console.log(event.detail);
    });

    const autoCompletejs = new autoComplete({
        data: {
            src: async function () {
                // Loading placeholder text
                document.querySelector("#autoComplete").setAttribute("placeholder", "Loading...");
                const data = locationArr;
                console.log(data);
                // Returns Fetched data
                return data;
            },
            key: ["location"],
        },
        sort: function (a, b) {
            if (a.match < b.match) {
                return -1;
            }
            if (a.match > b.match) {
                return 1;
            }
            return 0;
        },
        placeHolder: "Населённый пункт",
        selector: "#autoComplete",
        debounce: 0,
        searchEngine: "strict",
        highlight: true,
        maxResults: 5,
        resultsList: {
            render: true,
            container: function (source) {
                source.setAttribute("id", "autoComplete_list");
            },
            element: "ul",
            destination: document.querySelector("#autoComplete"),
            position: "afterend",
        },
        resultItem: {
            content: function (data, source) {
                source.innerHTML = data.match;
            },
            element: "li",
        },
        noResults: function () {
            const result = document.createElement("li");
            result.setAttribute("class", "no_result");
            result.setAttribute("tabindex", "1");
            result.innerHTML = "Ничего не найдено";
            document.querySelector("#autoComplete_list").appendChild(result);
        },
        onSelection: function (feedback) {
            document.querySelector("#autoComplete").blur();
            const selection = feedback.selection.value.location;
            document.querySelector("#autoComplete").value = selection;

            // Concole log autoComplete data feedback
            console.log(feedback);
        },
    });

});