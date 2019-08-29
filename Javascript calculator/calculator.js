$(document).ready(() => {
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

    function changeOperator() {
        let bufferOutput = [...$('.textview').val()];
        let bufferInput = [...$('.textviewInput').val()];

        console.log(bufferInput);
        bufferInput.pop();
        bufferOutput.pop();

        if (bufferInput[bufferInput.length - 1] == "/" || bufferInput[bufferInput.length - 1] == "x" ||
            bufferInput[bufferInput.length - 1] == "+" || bufferInput[bufferInput.length - 1] == "-") {
            bufferInput.pop();
            bufferOutput.pop();
        }

        $('.textview').val(bufferOutput.join(""));
        $('.textviewInput').val(bufferInput.join(""));
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

            for (let y = 0; y < operatorIndeces.length; y++) {
                if ($('.textview').val()[operatorIndeces[y]] == "-") {
                    array[y + 1] = "-" + array[y + 1];
                }
            }

            for (let u = 0; u < array.length; u++) {
                if (array[u] == "") {
                    array.splice(u, 1);
                }
            }

            console.log(array, operatorIndeces);

            let z = 0;
            while (z != operatorIndeces.length) {

                if (operatorIndeces.length > 1) {
                    for (let i = 0; i < operatorIndeces.length; i++) {
                        if ($('.textview').val()[operatorIndeces[i]] == "x" || $('.textview').val()[operatorIndeces[i]] == "/") {
                            switch ($('.textview').val()[operatorIndeces[i]]) {
                                case "x":
                                    array.splice(i + 2, 0, (Number(array[i]) * Number(array[i + 1])).toString());
                                    array.splice(i, 2);
                                    break;
                                case "/":
                                    array.splice(i + 2, 0, (Number(array[i]) / Number(array[i + 1])).toString());
                                    array.splice(i, 2);
                                    break;
                            }

                            operatorIndeces.splice(i, 1);
                        }
                    }
                }

                switch ($('.textview').val()[operatorIndeces[0]]) {
                    case "/":
                        array.splice(2, 0, Number(array[0]) / Number(array[1]));
                        array.splice(0, 2);
                        break;
                    case "x":
                        array.splice(2, 0, Number(array[0]) * Number(array[1]));
                        array.splice(0, 2);
                        break;
                    case "-":
                        if (operatorIndeces.length == 1 && array.length == 1) {
                            break;
                        }

                        array.splice(2, 0, Number(array[0]) + Number(array[1]));
                        array.splice(0, 2);
                        break;
                    case "+":
                        array.splice(2, 0, Number(array[0]) + Number(array[1]));
                        array.splice(0, 2);
                        break;
                }

                operatorIndeces.shift();
            }

            $('.textview').val("");
            insert(array[0]);
        }
    }

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
        if ($('.textview').val()[$('.textview').val().length - 1] == "+" || $('.textview').val()[$('.textview').val().length - 1] == "x" ||
            $('.textview').val()[$('.textview').val().length - 1] == "-") {
            changeOperator();
            insert("/");
        } else if ($('.textview').val()[$('.textview').val().length - 1] == "/") {
            return;
        } else {
            insert('/');
        }
    })

    $('input[value="x"]').click(() => {
        if ($('.textview').val()[$('.textview').val().length - 1] == "/" || $('.textview').val()[$('.textview').val().length - 1] == "+" ||
            $('.textview').val()[$('.textview').val().length - 1] == "-") {
            changeOperator();
            insert("x");
        } else if ($('.textview').val()[$('.textview').val().length - 1] == "x") {
            return;
        } else {
            insert('x');
        }
    })

    $('input[value="-"]').click(() => {
        if ($('.textview').val()[0] == 0) {
            clearAll();
        };

        insert("-");
    })

    $('input[value="+"]').click(() => {
        if ($('.textview').val()[$('.textview').val().length - 1] == "/" || $('.textview').val()[$('.textview').val().length - 1] == "x" ||
            $('.textview').val()[$('.textview').val().length - 1] == "-") {
            changeOperator();
            insert("+");
        } else if ($('.textview').val()[$('.textview').val().length - 1] == "+") {
            return;
        } else {
            insert('+');
        }
    })

    $('input[value="."]').click(() => {
        let buffer = [...$('.textview').val()]

        let predicate = (value) => {
            return (value == "+" || value == "-" || value == "x" || value == "/");
        }

        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] == ".") {
                if (typeof buffer.find(predicate) === "string") {
                    insert(".");
                } else {
                    return;
                }
            }
        }

        if ($('.textview').val()[$('.textview').val().length - 1] != ".") {
            insert(".");
        } else {
            return;
        }
    })

    $('input[value="="').click(() => {
        $('.textviewInput').val($('.textviewInput').val() + "=");
        resolve();
    })
})