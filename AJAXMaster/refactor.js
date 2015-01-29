var app = app || {};

app.firebase = "https://popping-torch-4400.firebaseio.com/";

app.carArray = [];

app.Car = function (make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
}
app.getCallback = function (request) {
    for (var prop in request) {
        request[prop].key = prop;
        app.carArray.push(request[prop]);
    }
    app.displayArray();
}
app.addCar = function () {
    var make = $('#InputMake').val();
    var model = $('#InputModel').val();
    var color = $('#InputColor').val();

    var car = new app.Car(make, model, color);
    app.postAJAX("POST", app.urlMaker(), true, app.postCallback, car);

    $('#InputMake').val('');
    $('#InputModel').val('');
    $('#InputColor').val('');
}
app.postCallback = function (response, data) {
    data.key = response.name;
    app.carArray.push(data);
    app.updatePage(data);
}
app.beginEdit = function (index) {
    var car = app.carArray[index];

    $('#InputMake').val(car.make);
    $('#InputModel').val(car.model);
    $('#InputColor').val(car.color);

    $('#button').html('<button class="btn btn-primary" onclick="app.saveEdit(' + index + ')">Save</button><button class="btn btn-info" onclick="app.cancelEdit()">Cancel</button>');
}

app.cancelEdit = function () {
    $('#InputMake').val('');
    $('#InputModel').val('');
    $('#InputColor').val('');
    $('#button').html('<button class="btn btn-primary" onclick="app.addCar()">Click Me!</button>');
}
app.saveEdit = function (index) {
    var make = $('#InputMake').val();
    var model = $('#InputModel').val();
    var color = $('#InputColor').val();

    var car = new app.Car(make, model, color);
    var oldCar = app.carArray[index];
    app.putAJAX(car, oldCar, app.putCallback)
    $('#InputMake').val('');
    $('#InputModel').val('');
    $('#InputColor').val('');
}
app.putCallback = function (data, oldObj) {
    for (var i = 0; i < app.carArray.length; i++) {
        if (app.carArray[i].key === oldObj.key) {
            app.carArray[i].make = data.make;
            app.carArray[i].model = data.model;
            app.carArray[i].color = data.color;
            break;
        }
    }
    app.cancelEdit();
    app.displayArray();
}
app.deleteCar = function (index) {
    var key = app.carArray[index].key;
    app.deleteAJAX(key, app.deleteCallback);
}
app.deleteCallback = function (key) {
    for (var i = 0; i < app.carArray.length; i++) {
        if (app.carArray[i].key === key) {
            app.carArray.splice(i, 1);
            break;
        }
    }
    app.displayArray();
}
app.displayArray = function () {
    var elem = $('#results'), car;
    elem.html('');
    for (var i = 0; i < app.carArray.length; i++) {
        car = app.carArray[i];
        elem.append('<div class="well"><h2>' + car.make + '</h2><h4>' + car.model + '</h4><h4>' + car.color + '</h4><button class="btn btn-danger" onclick="app.deleteCar(' + i + ')">Delete</button><button class="btn btn-warning" onclick="app.beginEdit(' + i + ')">Edit</button></div>');
    }
}
app.updatePage = function (car) {
    car = car || app.carArray[app.carArray.length - 1];
    i = app.carArray.length - 1;
    $('#results').append('<div class="well"><h2>' + car.make + '</h2><h4>' + car.model + '</h4><h4>' + car.color + '</h4><button class="btn btn-danger" onclick="app.deleteCar(' + i + ')">Delete</button><button class="btn btn-warning" onclick="app.beginEdit(' + i + ')">Edit</button></div>');
}

app.MasterAJAX = function (verb, url, asunc, callback, data) {
    var request = new SMLHttpRequest();
    request.open(verb, url, async);
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            var response = JSON.parse(this.response);
            if (callback) {
                callback(response, data);
            }
        }
        else { 
            console.log("there is an error");
        }
    }
    if (data && typeof data === "object") {
        request.send(JSON.stringify(data));
    }
    else {
        request.send();
    }
}
app.urlMaker = function (key) {
    var str = app.firebase;
    if (key) str += key;
    str += '/.json';
    return str;
}
app.MasterAJAX("GET", app.urlMaker(), true, app.getCallback);