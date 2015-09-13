/*
Zepto(function($)){
	//Setup the root url for the RESTful service
	var rootURL = "http://localhost:8000/api";

	$(document).('ajaxBeforeSend', function(e, xhr, options){
		// This gets fired for every Ajax request performed on the page.
        // The xhr object and $.ajax() options are available for editing.
        // Return false to cancel this request.
	});
}
*/
var rootURL = "http://localhost:8000/api/";
var currentCar;

//Retrieve car list when application starts
findAll();

$('#btnDelete').hide();

//Call new car function when button is clicked
$('#btnAdd').on('click', function(){
	newCar();
	return false;
});

$('#btnSave').on('click',function(){
	if ($('#id').val() == '') {
		addCar();
	}else{
		updateCar();
	}
	return false;
});

$('#btnDelete').on('click', function(){
	deleteCar();
	return false;
});

function findAll(){
	$.ajax({
		type: 'GET',
		url: rootURL + 'cars',
		dataType: 'json',
		success: function(response){
			console.log('success: ', response);
			renderList(response);
		},
		error: function(xhr, type){
			console.log(xhr, type);
		}
	});
}

//Render list of all cars
function renderList(data){
	var str = '';
	$('#car-list li').remove();
	for (var i in data) {
		str += '<li><a href="#" data-identity="' + data[i]["id"] + '">' + data[i]["make"] + " " + data[i]["model"] + "</a></li>";
	}
	document.getElementById("car-list").innerHTML = str;

	// Retrieve car details when list item is clicked
	$('#car-list a').on('click', function() {
	    findById($(this).data('identity'));
	});
}

//Get a car by id
function findById(id){
	console.log('find by id: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + 'cars/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			console.log('findById success: ');
			console.log(data);
			currentCar = data;
			renderDetails(currentCar);
		},
		error: function (xhr, type) {
			console.log(xhr, type);
		}
	})
}

//add new car
function addCar(){
	console.log('addCar');
	$.ajax({
		type: 'POST',
		url: rootURL + 'car',
		dataType: 'json',
		//Serialize an object to a URL-encoded string representation for use in Ajax request query strings and post data.
		data: $.param(getForm()),
		success: function(data, xhr, type, textStatus){
			console.log(data, xhr, type, textStatus);
            alert('Car added successfully');
            $('#btnDelete').show();
            $('#id').val(data.id);
            findAll(); // reload list
		},
		error: function(xhr, type, textStatus, errorThrown) {
            console.log(xhr, type, errorThrown, textStatus);
        }
	});
}

//delete a car
function deleteCar(){
	console.log('deleteCar');
	$.ajax({
		type: 'DELETE',
		url: rootURL + 'car/' + $('#id').val(),
		success: function(data, xhr, type, textStatus) {
            console.log(data, xhr, type, textStatus);
            alert('Car successfully deleted');
            newCar(); // zero out the form
            findAll(); // reload list
        },
        error: function(xhr, type, textStatus, errorThrown) {
            console.log(xhr, type, errorThrown, textStatus);
        }
	});
}

//update a car
function updateCar(){
	console.log('updateCar');
	$.ajax({
		type: 'PUT',
		url: rootURL + 'car/' + $('#id').val(),
		dataType: 'json',
		data: $.param(getForm()),
		success: function(data, xhr, type, textStatus) {
            console.log(data, xhr, type, textStatus);
            alert('Car successfully updated');
            findAll(); // reload list
        },
        error: function(xhr, type, textStatus, errorThrown) {
            console.log(xhr, type, errorThrown, textStatus);
        }
	});
}

// Render detail view
function renderDetails(car) {
    if($.isEmptyObject(car)){
        $('#id').val('');
        $('#year').val('');
        $('#make').val('');
        $('#model').val('');
    }else{
        $('#id').val(car.id);
        $('#year').val(car.year);
        $('#make').val(car.make);
        $('#model').val(car.model);
    }
}

function getForm() {
	var car = {
        'year': $('#year').val(),
        'make': $('#make').val(),
        'model': $('#model').val()
    };
    return car;
}

//Hide delete button and clear the form
function newCar(){
 $('#btnDelete').hide();
 currentCar = {};
 renderDetails(currentCar);
}