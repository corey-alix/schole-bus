var express = require('express'),
fs = require('fs'),
app = express(),
port = process.env.PORT || 3000;

let styles = {
    path: "C:/Program Files (x86)/GeoServer 2.11.0/data_dir/workspaces/cite/styles"
};


 app.route('/style').get((req, res) => {
    let styleName = req.query.style;
    //let css = fs.readFileSync(`${styles.path}/${styleName}.css`);
    res.json({
        filter: "dimension(geom)=2",
        css: "stroke: #000000; stroke-width: 0.5; fill: #0033cc;"
    });
 });

 app.route('/import').get((req, res) => {
    res.json({"you": "did-it"});
 });

 app.use(express.static('./'));

app.listen(port);

app.use((req, res) => {
    res.send({url: `${req.originalUrl} not found`})
});

console.log('todo list RESTful API server started on: ' + port);
