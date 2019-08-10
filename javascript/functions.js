var net = 'https://stark-tor-54092.herokuapp.com/hotdogs';
var local = "http://localhost:3000/hotdogs"

// last row data which we clicked
var lastRowData = {};
var lastRowElement = null;
var lastRowCount = null;

// on Click Add Button, also Edit
$(function() {
  $("#btn_add").click(() => {
    if (!($.isNumeric($("#input_price").val()))) {
        alert("The price isn't numeric!");
        return;
    }
    if ($("#btn_add").val() == 'Add') {
      if ($("#input_name").val() == undefined ||
        $("#input_vegetable").val() == undefined ||
        $("#input_sauce").val() == undefined ||
        $("#input_price").val() == undefined) {
          alert("Enter fields!");
          return;
      }
      $.ajax({
        method: "POST",
        url: net,
        data: {
          "name": $("#input_name").val(),
          "vegetable": $("#input_vegetable").val(),
          "sauce": $("#input_sauce").val(),
          "price": $("#input_price").val()
        },
        success: function(value) {
          $("#customers").append('<tr><td>' + value.name + '</td><td>' + value.vegetable + '</td><td>' + value.sauce + '</td><td>' + value.price + '</td><td><button type="button" class="clickedEdit btn btn-warning">Edit</button></td><td><button type="button" class="clickedDelete btn btn-danger">Delete</button></td></tr>');

        },
        // vvv---- This is the new bit
        error: function(jqXHR, textStatus, errorThrown) {
          alert("Error, status = " + textStatus + ", " +
            "error thrown: " + errorThrown
          );
        }
      });
      clearEdit();
    } else if ($("#btn_add").val() == 'Edit'){

      if (lastRowData.name == $("#input_name").val() &&
        lastRowData.vegetable == $("#input_vegetable").val() &&
        lastRowData.sauce == $("#input_sauce").val() &&
        lastRowData.price == $("#input_price").val()) {
          alert("Nothing changed!")
          //clearEdit();
          return;
      }

      $.ajax({
        method: "POST",
        url: net + '/edit',
        data: {
          "name" : lastRowData.name,
          "vegetable" : lastRowData.vegetable,
          "sauce" : lastRowData.sauce,
          "price" : lastRowData.price,
          "new_name": $("#input_name").val(),
          "new_vegetable": $("#input_vegetable").val(),
          "new_sauce": $("#input_sauce").val(),
          "new_price": $("#input_price").val()
        },
        success: function(value) {
          lastRowElement.find("td:eq(0)").html(value.name); // get current row 1st TD value
          lastRowElement.find("td:eq(1)").html(value.vegetable); // get current row 2nd TD
          lastRowElement.find("td:eq(2)").html(value.sauce); // get current row 3rd TD
          lastRowElement.find("td:eq(3)").html(value.price);
        },
        // vvv---- This is the new bit
        error: function(jqXHR, textStatus, errorThrown) {
          alert("Error, status = " + textStatus + ", " +
            "error thrown: " + errorThrown
          );
        }
      });

      $("#btn_cancel").hide();
      clearEdit();
    }
  });
});


// on Delete clicked
$(function() {
  $("#customers").on('click', '.clickedDelete', function() {
    // get the current row

    if ($(this).closest("tr").index() == lastRowCount) {
      alert("Item is editing");
      return;
    }

    var elem = $(this)
    var currentRow = $(this).closest("tr");

    var name = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
    var vegetable = currentRow.find("td:eq(1)").text(); // get current row 2nd TD
    var sauce = currentRow.find("td:eq(2)").text(); // get current row 3rd TD
    var price = currentRow.find("td:eq(3)").text();

    $.ajax({
      method: "POST",
      url: net + '/delete',
      data: {
        "name": name,
        "vegetable": vegetable,
        "sauce": sauce,
        "price": price
      },
      success: function(value) {
        $(elem).closest('tr').remove();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        //wrong ui
        alert("Error, status = " + textStatus + ", " +
          "error thrown: " + errorThrown
        );
      }
    });
  });
});

//  on edit Clicked
$(function() {
  $("#customers").on('click', '.clickedEdit', function() {
    // get the current row

    lastRowCount  =  $(this).closest("tr").index();
    $("#btn_cancel").show();
    var elem = $(this)
    var currentRow = $(this).closest("tr");
    lastRowElement = currentRow;

    var name = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
    var vegetable = currentRow.find("td:eq(1)").text(); // get current row 2nd TD
    var sauce = currentRow.find("td:eq(2)").text(); // get current row 3rd TD
    var price = currentRow.find("td:eq(3)").text();

    lastRowData = {
      "name" : name,
      "vegetable" : vegetable,
      "sauce" : sauce,
      "price" : price
    }

    $("#input_name").val(name);
    $("#input_vegetable").val(vegetable);
    $("#input_sauce").val(sauce);
    $("#input_price").val(price);
    $("#btn_add").val('Edit');
  });
});

// on Cancel click
$(function() {
  $("#btn_cancel").on('click', () => {
      clearEdit();
      $("#btn_cancel").hide();
  })
});

// exit from editable form
function clearEdit() {
  $("#input_name").val("");
  $("#input_vegetable").val("");
  $("#input_sauce").val("");
  $("#input_price").val("");
  $("#btn_add").val('Add');
}
