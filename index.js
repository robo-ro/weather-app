
const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval, origval) => {
    let temperature = tempval.replace("{%tempval%}", Number((origval.main.temp-273).toFixed(2)));
    temperature = temperature.replace("{%tempmin%}", Number((origval.main.temp_min-273).toFixed(2)));
    temperature = temperature.replace("{%tempmax%}", Number((origval.main.temp_max-273).toFixed(2)));
    temperature = temperature.replace("{%location%}", origval.name);
    temperature = temperature.replace("{%country%}", origval.sys.country);
    temperature = temperature.replace("{%tempstatus%}", origval.weather.main);

    return temperature;
}




const server = http.createServer((req, res) => {
    if (req.url == "/") {

        requests("https://api.openweathermap.org/data/2.5/weather?q=Guwahati&appid=da0561d3069fd8e97b1b097429695a7b")
            .on('data', (chunk) => {

                const objdata = JSON.parse(chunk);
                const arrData = [objdata];

                // console.log(arrData[0].main.temp);

                const realTimeData = arrData
                .map((val) => replaceVal(homeFile, val))
                .join("");

                res.write(realTimeData);
                // console.log(realTimeData);

            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                // console.log('end');
            });

    }
});

server.listen(8000, "127.0.0.1");