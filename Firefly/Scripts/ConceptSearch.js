
var StartData;
var DataResponse;

var it = 0;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function convertToX(x) {
    return (x + 10) * 25;
}

function convertToY(y) {
    return 500 - ((y + 10) * 25);
}

function parseData() {
    var data = StartData;
    data.a = parseFloat(data.a);
    data.c = parseFloat(data.c);
    data.b = parseFloat(data.b);
    data.p = parseFloat(data.p);
    data.t = parseFloat(data.t);
    data.g = parseFloat(data.g);

    data.a0 = parseFloat(data.a0);
    data.b0 = parseFloat(data.b0);
    data.yota = parseFloat(data.yota);

    return data;
}

$(document).ready(function () {

    function startGeneration() {
        var a = getRandomArbitrary(0, 3).toFixed(2),
            b = getRandomInt(1, 3) * 2,
            c = getRandomArbitrary(-3, 3).toFixed(2),
            p = getRandomArbitrary(0, 3).toFixed(2),
            t = getRandomInt(2, 5),
            g = getRandomArbitrary(-3, 3).toFixed(2);
        var Width = 10, Height = 10;
        var a0 = Math.random().toFixed(2), b0 = 1, yota = 1;
        var N = 40; S = 25;

        StartData = {
            'a': a,
            'b': b,
            'c': c,
            'p': p,
            't': t,
            'g': g,
            'Width': Width,
            'Height': Height,
            'a0': a0,
            'b0': b0,
            'yota': yota,
            'N': N,
            'S': S
        };

        $('.col-iteration .formula').text('N=' + N);
        $('.col-firefly .formula').text('S=' + S);
        $('.alpha-first .formula').html('α<sub>0</sub>=' + a0);
        $('.beta-first .formula').html('ß<sub>0</sub>=' + b0);
        $('.yota-first .formula').text('γ=' + yota);
        var TextFirst = (c == 0) ?
            (a + '*x<sub>1</sub><sup>' + b + '</sup>') :
            (a + '*(x<sub>1</sub>+' + c + ')' + '<sup>' + b + '</sup>');
        var TextTwo = (g == 0) ?
            (p + '*x<sub>2</sub><sup>' + t + '</sup>') :
            (p + '*(x<sub>2</sub>+' + g + ')' + '<sup>' + t + '</sup>');

        $('.formula-block strong.formula').html(
            'f(x) = ' + TextFirst + ' + ' + TextTwo);
    }

    function Draw(iteration) {

        $('.main-canvas').clearCanvas();

        $('.main-canvas').drawText({
            fillStyle: '#000',
            fontStyle: 'italic',
            fontSize: '10pt',
            fontFamily: 'Trebuchet MS, sans-serif',
            text: 'X1',
            x: convertToX(0) + 20,
            y: convertToY(10) + 35,
            align: 'right',
            maxWidth: 300,
            lineHeight: -2
        });

        $('.main-canvas').drawText({
            fillStyle: '#000',
            fontStyle: 'italic',
            fontSize: '10pt',
            fontFamily: 'Trebuchet MS, sans-serif',
            text: 'X2',
            x: convertToX(10) - 35,
            y: convertToY(0) + 0,
            align: 'right',
            maxWidth: 300,
            lineHeight: -2
        });

        $('.main-canvas').drawPath({
            strokeStyle: '#000',
            strokeWidth: 2,
            x: 10, y: 10,
            p1: {
                type: 'line',
                rounded: true,
                endArrow: true,
                arrowRadius: 25,
                arrowAngle: 90,
                x2: 250, y2: 0,
                x1: 250, y1: 480
            },
            p2: {
                type: 'line',
                rounded: true,
                endArrow: true,
                arrowRadius: 25,
                arrowAngle: 90,
                x1: 0, y1: 250,
                x2: 480, y2: 250
            }
        });

        for (var i = 0; i <= 40; i += 5) {
            var mass = GetLevel(i);
            var obj = {
                strokeStyle: '#000',
                strokeWidth: 1
            }
            for (var j = 0; j < mass.length; j++) {
                obj['x' + (j + 1)] = convertToX(mass[j].x);
                obj['y' + (j + 1)] = convertToY(mass[j].y);
            }

            obj['x' + (mass.length)] = obj['x' + 1];
            obj['y' + (mass.length)] = obj['y' + 1];

            $('.main-canvas').drawLine(obj);


        }

        $('.formuls p .formula').css('color', '#000');

        if (arguments.length == 1) {
            switch (iteration) {
                case 0: {
                    for (var i = 0; i < DataResponse.startGeneration.length; i++)
                        $('.main-canvas').drawEllipse({
                            fillStyle: '#c33',
                            x: convertToX(DataResponse.startGeneration[i].X1)+10,
                            y: convertToY(DataResponse.startGeneration[i].X2)+10,
                            width: 4, height: 4
                        });
                    $('.description p').html('1. Инициализируем начальную популяцию светлячков');
                } break;
                case 1: {
                    for (var i = 0; i < DataResponse.startGeneration.length; i++)
                        $('.main-canvas').drawEllipse({
                            fillStyle: '#c33',
                            x: convertToX(DataResponse.startGeneration[i].X1) + 10,
                            y: convertToY(DataResponse.startGeneration[i].X2) + 10,
                            width: 4, height: 4
                        });


                    for (var i = 0; i < DataResponse.startGeneration.length; i++)
                        if (DataResponse.FirstIndexRedirect[i].IndexLast != i)
                            $('.main-canvas').drawPath({
                                strokeStyle: '#9CBD3B',
                                strokeWidth: 1,
                                x: 0, y: 0,
                                p1: {
                                    type: 'line',
                                    rounded: true,
                                    endArrow: true,
                                    arrowRadius: 15,
                                    arrowAngle: 25,
                                    x1: convertToX(DataResponse.startGeneration[i].X1) + 10,
                                    y1: convertToY(DataResponse.startGeneration[i].X2) + 10,
                                    x2: convertToX(DataResponse.startGeneration
                                    [DataResponse.FirstIndexRedirect[i].IndexLast].X1) + 10,
                                    y2: convertToY(DataResponse.startGeneration
                                    [DataResponse.FirstIndexRedirect[i].IndexLast].X2) + 10
                                }
                            });

                    $('.description p').html('2. По формуле <strong class="formula"> ß<sub>i, j</sub> = (ß<sub>0</sub>*f(x)<sub>j</sub>)/(1 + γ*r<sub>i,j</sub><sup>2</sup>)</strong>'
                        + ' находим самую привлекательную пару для каждого светлячка.');

                    $('.formuls .formula-beta .formula').css('color', '#d43434');
                } break;
                case 2: {

                    for (var i = 0; i < DataResponse.listGeneration[1].length; i++)
                        $('.main-canvas').drawLine({
                            strokeStyle: '#FAA4A6',
                            strokeWidth: 0.8,
                            x1: convertToX(DataResponse.listGeneration[0][i].X1) + 10,
                            y1: convertToY(DataResponse.listGeneration[0][i].X2) + 10,
                            x2: convertToX(DataResponse.listGeneration[1][i].X1) + 10,
                            y2: convertToY(DataResponse.listGeneration[1][i].X2) + 10
                        });

                    for (var i = 0; i < DataResponse.listGeneration[1].length; i++)
                        $('.main-canvas').drawEllipse({
                            fillStyle: '#c33',
                            x: convertToX(DataResponse.listGeneration[1][i].X1) + 10,
                            y: convertToY(DataResponse.listGeneration[1][i].X2) + 10,
                            width: 4, height: 4
                        });

                    $('.description p').html('3. Если светлячок нашёл пару, он перемещается к своему избраннику.</br> ' +
                        'Если светлячок не нашёл избранника, который привлекательней его, то он перемещается случайным образом.</br>' +
                        'Пермещается светлячок по формуле ' +
                        '<strong class="formula">X<sub>i</sub> = X<sub>j</sub> + ß(r<sub>i,j</sub>)*(X<sub>i</sub> - X<sub>j</sub>)+α</strong>, ' +
                        'где <strong class="formula">ß(r<sub>i,j</sub>)=ß<sub>0</sub>*exp(-γ*r<sub>i,j</sub><sup>n</sup>)</strong>');

                    $('.formuls .formula-X .formula').css('color', '#d43434');

                } break;
                case 3: {

                    for (var i = 0; i < DataResponse.listGeneration[0].length; i++) {
                        var obj = {
                            strokeStyle: '#FAA4A6',
                            strokeWidth: 0.8
                        }
                        for (var j = 0; j < DataResponse.listGeneration.length; j++) {
                            obj['x' + (j + 1)] = convertToX(DataResponse.listGeneration[j][i].X1) + 10;
                            obj['y' + (j + 1)] = convertToY(DataResponse.listGeneration[j][i].X2) + 10;
                        }
                        $('.main-canvas').drawLine(obj);
                    }

                    for (var i = 0; i < DataResponse.listGeneration[DataResponse.listGeneration.length - 1].length; i++)
                        $('.main-canvas').drawEllipse({
                            fillStyle: '#c33',
                            x: convertToX(DataResponse.listGeneration[DataResponse.listGeneration.length - 1][i].X1) + 10,
                            y: convertToY(DataResponse.listGeneration[DataResponse.listGeneration.length - 1][i].X2) + 10,
                            width: 4, height: 4
                        });

                    $('.main-canvas').drawEllipse({
                        fillStyle: '#534FC4',
                        x: convertToX(DataResponse.Answer.X1) + 10,
                        y: convertToY(DataResponse.Answer.X2) + 10,
                        width: 4, height: 4
                    });

                    $('.main-canvas').drawText({
                        fillStyle: '#36c',
                        fontStyle: 'bold',
                        fontSize: '10pt',
                        fontFamily: 'Trebuchet MS, sans-serif',
                        text: parseFloat(DataResponse.Answer.Answer).toFixed(2).toString() +
                            '\n(' + parseFloat(DataResponse.Answer.X1).toFixed(2).toString() + ','
                            + parseFloat(DataResponse.Answer.X2).toFixed(2).toString()+')',
                        x: convertToX(DataResponse.Answer.X1) + 10,
                        y: convertToY(DataResponse.Answer.X2) - 20,
                        align: 'center',
                        maxWidth: 300,
                        lineHeight: -2
                    });

                    $('.description p').html('4.Если количество итераций равно количеству итераций в условии, то останавливаем процесс перемещения светлячков ' +
                        'и определяем найлучшего.');

                    $('.formuls .col-iteration .formula').css('color', '#d43434');

                } break;

            }

        }
    }

    function GetLevel(z) {

        var mass = [];

        var data = parseData();

        for (var i = -10; i <= 10; i += 0.01) {
            var buf = Math.pow((z - data.a * Math.pow(i + data.c, data.b) / data.p),
                (1 / data.t)) - data.g;
            if (!isNaN(buf)) {
                mass.push({ x: i, y: buf });
            }
        }

        for (var i = 10; i >= -10; i -= 0.01) {
            var buf = (-1) * Math.pow((z - data.a * Math.pow(i + data.c, data.b) / data.p),
                (1 / data.t)) - data.g;
            if (!isNaN(buf)) {
                mass.push({ x: i, y: buf });
            }
        }

        return mass;
    }


    function testButtons() {
        if (it >= 3)
            $('.button-next').prop('disabled', true);
        else
            $('.button-next').prop('disabled', false);

        if (it <= 0)
            $('.button-back').prop('disabled', true);
        else
            $('.button-back').prop('disabled', false);
    }

    $('.button-next').click(function () {
        it++;
        Draw(it);
        testButtons();
    });

    $('.button-back').click(function () {
        it--;
        Draw(it);
        testButtons();
    });

    $('.button-reload').click(function () {
        it = 0;
        startGeneration();
        Draw();
        var dataR = JSON.stringify(StartData);
        $('.zagl').css('display', 'block');
        $.post('/ConceptSearch/GetData', { startModel: dataR }
            , function (data) {
                console.log(data);
                DataResponse = JSON.parse(data);
                Draw(it);

                $('.zagl').css('display', 'none');
            });

        testButtons();
    });

    $('.button-reload').click();

});