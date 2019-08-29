$(document).ready(() => {
    $('input[value="0"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        }
        insert(0);
    })

    $('input[value="1"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        }
        insert(1);
    })

    $('input[value="2"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        }
        insert(2);
    })

    $('input[value="3"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        }
        insert(3);
    })

    $('input[value="4"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        };
        insert(4);
    })

    $('input[value="5"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        };
        insert(5);
    })

    $('input[value="6"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        };
        insert(6);
    })

    $('input[value="7"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        };
        insert(7);
    })

    $('input[value="8"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        };
        insert(8);
    })

    $('input[value="9"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        };
        insert(9);
    })


    $('input[value="AC"]').click(() => {
        clear();
    })

    $('input[value="/"]').click(() => {
        if ($('.textview').val()[$('.textview').val().length - 1] != "x" && $('.textview').val()[$('.textview').val().length - 1] != "+" &&
            $('.textview').val()[$('.textview').val().length - 1] != "-") {
            insert("/");
        }
    })

    $('input[value="x"]').click(() => {
        if ($('.textview').val()[$('.textview').val().length - 1] != "/" && $('.textview').val()[$('.textview').val().length - 1] != "+" &&
            $('.textview').val()[$('.textview').val().length - 1] != "-") {
            insert("x");
        }
    })

    $('input[value="-"]').click(() => {
        if ($('.textview').val()[$('.textview').val().length - 1] != "/" && $('.textview').val()[$('.textview').val().length - 1] != "+" &&
            $('.textview').val()[$('.textview').val().length - 1] != "x") {
            insert("-");
        }
    })

    $('input[value="+"]').click(() => {
        if ($('.textview').val()[$('.textview').val().length - 1] != "/" && $('.textview').val()[$('.textview').val().length - 1] != "x" &&
            $('.textview').val()[$('.textview').val().length - 1] != "-") {
            insert("+");
        }
    })

    $('input[value="."]').click(() => {
        insert(".");
    })

    function insert(newValue) {
        $('.textview').val($('.textview').val() + newValue);
        $('.textviewInput').val($('.textviewInput').val() + newValue);
    }

    function clear() {
        clearAll();
        insert(0);
    }

    function clearAll() {
        $('.textview').val("");
        $('.textviewInput').val("");
    }

    function resolve() {
        if ($('.textview').val() != "") {
            let array = [];
            let operatorIndeces = [];

            for (let i = 0; i < $('.textview').val().length; i++) {
                if ($('.textview').val()[i] == "/" || $('.textview').val()[i] == 'x' || $('.textview').val()[i] == "-" || $('.textview').val()[i] == "+") {
                    operatorIndeces.push(i);
                }
            }

            let digit = 0;
            for (let j = 0; j < operatorIndeces.length; j++) {
                array.push($('.textview').val().slice(digit, operatorIndeces[j]));

                digit = operatorIndeces[j] + 1;
            }

            array.push($('.textview').val().slice(digit, $('.textview').val().length));

            let z = 0;
            while (z != operatorIndeces.length) {
                switch ($('.textview').val()[operatorIndeces[z]]) {
                    case "/":
                        array.splice(2, 0, Number(array[0]) / Number(array[1]));
                        array.shift();
                        array.shift();
                        break;
                    case "x":
                        array.splice(2, 0, Number(array[0]) * Number(array[1]));
                        array.shift();
                        array.shift();
                        break;
                    case "-":
                        array.splice(2, 0, Number(array[0]) - Number(array[1]));
                        array.shift();
                        array.shift();
                        break;
                    case "+":
                        array.splice(2, 0, Number(array[0]) + Number(array[1]));
                        array.shift();
                        array.shift();
                        break;
                }

                z++;
            }

            $('.textview').val("");
            insert(array[0]);
        }
    }

    $('input[value="="').click(() => {
        $('.textviewInput').val($('.textviewInput').val() + "=");
        resolve();
    })
})