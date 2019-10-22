"use strict";
(function(){
    var responseText;
    var urls = []; // список имен файлов для выполнения AJAX-запросов
    var startUrl = "root.txt";
    var path = "https://fe.it-academy.by/Examples/words_tree/";
    var text = ""; // искомый текст


    getFile(startUrl);

    
    function getFile(fileName){
        createRequest(fileName)
            .then(function(txt){
                responseText = txt;
                return JSON.parse(responseText);
            })
            .catch(function(err){
                // в ответе не json
                // записываем сохраненный ранее текст ответа
                updateText(responseText);
                return null;
            })
            .then(function(parsed){
                if (!parsed || !Array.isArray(parsed)) // в ответе нет JSON/ нет массива
                    return;
                addFileNames(parsed, fileName); // добавляем в список новые файлы после название файла, ответ на который получили
            })
            .catch(function(err){
                console.log("Ошибка добавления названий файлов в список опроса");
            })
            .then(function(any){
                var nextUrl = getNextUrl(fileName);
                getFile(nextUrl);
            })
            .catch(function(err){
                console.log("Все ссылки опрошены");
                showResult();
            })
        ;
    }


    function createRequest(fileName) {
        return new Promise(function(resolve){
            var url = path.concat(fileName); // получаем ссылку на файл
            fetch(url)
                .then(function(response){
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.text());
                    } else {
                        var error = new Error(response.statusText);
                        error.response = response;
                        throw error;
                    }
                })
                .catch(function(err){
                    console.log("Запроc по ссылке " + url + " закончился неудачей\nОшибка: " + err);
                    resolve(""); // игнорируем ошибку получения ресурса, возвращаем пустую строку для добавления к тексту
                })
                ;
        });
    }


    function showResult() {
        console.log("Получена фраза:\n" + text);
        // и дополнительно
        alert(text);
    }


    function updateText(phrase) {
        if (!phrase) // могла прийти пустая строки после ошибки во время fetch
            return
        text += phrase.concat(" "); // обеспечиваю паробелы между словами фразы
    }

    
    function addFileNames(newURLs, current) {
        if (urls.length === 0 && current)
            urls.push(current); // добавление имени стартового файла
        var cursor = urls.indexOf(current); // после какой позиции добавлять
        for (var i=0; i<newURLs.length; i++) {
            cursor++;
            urls.splice(cursor,0,newURLs[i]);
        }
    }


    function getNextUrl(current) {
        var cursor = urls.indexOf(current); // после какой позиции брать
        if (cursor + 1 === urls.length)
            throw new Error();
        else
            return urls[cursor+1];
    }

    
})();
     
