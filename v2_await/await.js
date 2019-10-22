"use strict";
( async () => {

    const root = "root.txt";
    const path = "https://fe.it-academy.by/Examples/words_tree/";
    

    let createRequest = async fileName => {
        try {
            let response = await fetch(path.concat(fileName));
            if (response.ok) {
                let result = await response.text();
				return result;                
            } else {
                let error = new Error(response.statusText);
                throw error;
            }
        } catch (err) {
            console.log("Request error: " + err);
            return null;
        }    
    }

    
    let saveText = txt => answerA.push(txt);

    
    let saveFromFiles = async (names) => {

        for (let i=0; i<names.length; i++) { 
            let txt = await getFileData(names[i]);
            if (txt) // после ошибки AJAX-вызова приходит null,
            // который по условию задания игнорируется
                saveText(txt);
        }
    };
    
     
    let getFileData = async fileName => {
        // обрабатывает результат AJAX-запроса
        
        let result = await createRequest(fileName);      
        try {
            let newFiles = JSON.parse(result);
            await saveFromFiles(newFiles);
        } catch(err) {
            console.log("JSON parsing error");
            // значит в result находится текст
            // результаты (пустые) запроса, завершившегося ошибкой, игнорируем
            if (result && typeof result === "string")
                saveText(result);
        }   
    };


    let answerA = []; // массив для записи содержимого из файлов

    await getFileData(root);

    let answerS = answer.join(" "); // получаем строку из массива слов

    console.log(answerS);
    alert(answerS); // для тех, кто "не под капотом"


} )();