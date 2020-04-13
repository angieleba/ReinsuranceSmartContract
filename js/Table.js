function BuildTable(tableId, array, buttons) {
    var tableRows = [];
    for (var i = 0; i < array.length; i++) {     
        var row = GetRow( 
        [array[i].Id,       
        array[i].To,
        array[i].From,
        array[i].Clause,
        array[i].Ether,
        array[i].Status], buttons, array[i]);

        tableRows.push(row);
    }
    $('#' + tableId).html(tableRows);
}

function GetRow(columns, buttons, obj) {
    var row = "<tr>";
    columns.forEach(element => {
        row = row.concat(GetColumn(element));
    });

    if (buttons.length > 0 && !(obj.Status === 'Canceled' || obj.Status === 'Denied' || obj.Status === 'Accepted')) {
        buttons.forEach(element => {
            row = row.concat(GetButton(element, obj));
        });
    }

    row = row.concat("</tr>");
    return row;
}

function GetButton(button, obj) {
    var buttonStr = "<td><button type='button' ";
    var buttonStr = buttonStr.concat("class='" + button._className + "' ", 
    "onclick='" + button._function._name + "(");

    last = button._function._params.length;
    button._function._params.forEach(element => {
        last = last - 1;
        if (element.isProp) {
            buttonStr = buttonStr.concat(obj[element.param]);
        } else {
            buttonStr = buttonStr.concat(element.param);
        }
        if (last != 0) {
            buttonStr = buttonStr.concat(",");
        }

    });

    buttonStr = buttonStr.concat(");'>" + button._label + "</button></td>");
    return buttonStr;
}

function GetColumn(value) {
    return column = "<td>" + value + "</td>";
}



