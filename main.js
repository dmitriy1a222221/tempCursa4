var canvas = document.querySelector("#myCanvas");
var context = canvas.getContext('2d');

//------------------------------------- определяем координаты курсора, для передвижения нашей точки доступа
var canvasPos = getPosition(canvas);
var mouseX = 100;
var mouseY = 100;

function getPosition(el) {
    var xPosition = 0;
    var yPosition = 0;

    while (el) {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
    }
    return {
        x: xPosition,
        y: yPosition
    };
}
function setMousePosition(e) {
    mouseX = e.clientX - canvasPos.x;
    mouseY = e.clientY - canvasPos.y;
}

canvas.onmousedown = () => canvas.addEventListener("mousemove", setMousePosition, false);
canvas.onmouseup = () => canvas.removeEventListener("mousemove", setMousePosition, false);

// Стенки должны лежать в таком виде, в котором их можно посчитать, картинка не подойдёт.
// Можете попробовать читать её попиксельно, но вопрос не об этом, так что.

const walls_1 = [
    //x, y, w, h
    [0, 0, 600, 1],
    [0, 0, 1, 500],
    [0 , 499, 600, 1],
    [599 , 0, 1, 500],
    [295, 0, 1, 195],
    [405, 0, 1, 245],
    [405, 125, 60, 1],
    [508, 125, 95, 1],
    [0, 240, 256, 1],
    [180, 315, 1, 185],
    [180, 315, 75, 1],
    [295, 315, 45, 1],
    [295, 315, 1, 75],
    [295, 390, 110, 1],
    [405, 290, 1, 210],
    [455, 415, 195, 1],
];

const walls_2 = [
    //x, y, w, h
     [0, 0, 600, 1],
    [0, 0, 1, 500],
    [0 , 499, 600, 1],
   [599 , 0, 1, 500],
    [150, 0, 1, 20],
    [0, 80, 150, 1],
    [150 , 60, 1, 40],
    [150 , 130, 1, 30],
    [0 , 160, 300, 1],
    [350 , 160, 60, 1],
    [410 , 0, 1, 60],
    [410 , 100, 1, 500],
    [250 , 160, 1, 400],
    [0, 260, 190, 1],
    [230, 260, 20, 1],
    [180, 210, 1, 50],
    [180, 160, 1, 15],
    [180, 160, 1, 15],
];

const walls_3 = [
    //x, y, w, h
    [0, 0, 600, 1],
    [0, 0, 1, 500],
    [0 , 499, 600, 1],
    [599 , 0, 1, 500],
    [400, 0, 1, 250],
    [0, 250, 330, 1],
    [290, 250, 1, 120],
    [290, 410, 1, 120],
    [370, 250, 60, 1],
    [470, 250, 200, 1],
    [450, 350, 1, 160],
    [450, 350, 40, 1],
    [540, 350, 60, 1],
];
var walls = [];
var objSel = document.getElementById('selectElement');
function sel() {
   //alert( objSel.options[objSel.selectedIndex].value);
    if (objSel.options[0].selected){
        walls.splice(0, walls.length, ...walls_1)
    } else if (objSel.options[1].selected) {
        walls.splice(0, walls.length, ...walls_2)
    } else if (objSel.options[2].selected) {
        walls.splice(0, walls.length, ...walls_3)
    }
}


const colors = [
    '#696969',
    '#ff0000',
    '#ff0000',
    '#ff3300',
    '#ff6600',
    '#ff9900',
    '#ffcc00',
    '#ffff00',
    '#ccff00',
    '#99ff00',
    '#66ff33',
    '#33ff66',
    '#00ffcc',
    '#00ffff',
];

// const between = (a, b, c) => (a >= b && a <= c);
const EPS = 1e-9;
const det = (a, b, c, d) => a * d - b * c;

const between = (a, b, c) => Math.min(a,b) <= c + EPS && c <= Math.max(a,b) + EPS;
const intersect_1 = (a, b, c, d) => Math.max(a,c) <= Math.min(b,d);

// pt a, pt b, pt c, pt d
function intersection(x11, y11, x12, y12, x21, y21, x22, y22){
    // Упорядочим координаты
    if(x21 > x22) [x21, x22] = [x22, x21];
    if(y21 > x22) [y21, y22] = [y22, y21];

    // Это я стырил
    const A1 = y11-y12;
    const B1 = x12-x11;
    const C1 = -A1*x11 - B1*y11;

    const A2 = y21-y22;
    const B2 = x22-x21;
    const C2 = -A2*x21 - B2*y21;

    var zn = det (A1, B1, A2, B2);
    if (zn !== 0) {
        const x = -det(C1, B1, C2, B2) / zn;
        const y = -det(A1, C1, A2, C2) / zn;
        return between (x11, x12, x) && between (y11, y12, y)
            && between (x21, x22, x) && between (y21, y22, y);
    }else
        return det (A1, C1, A2, C2) === 0 && det (B1, C1, B2, C2) === 0
            && intersect_1 (x11, x12, x21, x22) && intersect_1 (y11, y12, y21, y22);
}

function intersection_dubl_1(x11, y11, x12, y12, x21, y21, x22, y22){
    // Упорядочим координаты
    if(x21 > x22) [x21, x22] = [x22, x21];
    if(y21 > x22) [y21, y22] = [y22, y21];

    // Это я стырил
    const A1 = y11-y12;
    const B1 = x12-x11;
    const C1 = -A1*x11 - B1*y11;

    const A2 = y21-y22;
    const B2 = x22-x21;
    const C2 = -A2*x21 - B2*y21;

    var zn = det (A1, B1, A2, B2);
    if (zn !== 0) {
        const x = -det(C1, B1, C2, B2) / zn;
        const y = -det(A1, C1, A2, C2) / zn;
        return between (x11, x12, x) && between (y11, y12, y)
            && between (x21, x22, x) && between (y21, y22, y);
    }else
        return det (A1, C1, A2, C2) === 0 && det (B1, C1, B2, C2) === 0
            && intersect_1 (x11, x12, x21, x22) && intersect_1 (y11, y12, y21, y22);
}
//-------------------------------------------------------
function drawWalls() {
    // Рисуем стенки:
    context.fillStyle = 'rgba(255, 255, 255, 255)';
    walls.forEach(wall => context.fillRect(...wall));
}

//-------------------------------------------------------
function update() { // рисую план, и точку доступа
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    // Рисуем точку:

    context.beginPath();
    context.fillStyle = 'green';
    context.arc(mouseX, mouseY, 8, 0, 2 * Math.PI, true);
    context.fill();
    context.closePath();

    // А теперь самое интересное.
    const dA = .01;
    for(let i = 1; i <= 14; i++){
        for(let alpha = 0; alpha < Math.PI*2; alpha += dA){
            radX = mouseX + 10*i*Math.cos(alpha);
            radY = mouseY + 10*i*Math.sin(alpha);

            // Считаем, сколько между нами и точкой стенок
            const wallcount = walls.filter(wall => intersection(
                wall[0], wall[1], wall[0]+wall[2], wall[1]+wall[3],
                mouseX, mouseY, radX, radY
            )).length;

            // Если сигнал еще не пропал совсем - рисуем.
            if(colors[i + wallcount*4]){
                context.beginPath();
                context.strokeStyle = colors[i - 1 + wallcount*4];
                context.arc(mouseX, mouseY, i*10, alpha, alpha + dA);
                context.stroke();
                context.closePath();
            }
        }
    }

    requestAnimationFrame(update);
}


function update_1() { // рисую план, и точку доступа
   // context.clearRect(0, 0, canvas.width, canvas.height);
    //drawWalls();
    // Рисуем точку:
    var corMousX = 200;
    var corMousY = 200;

    context.beginPath();
    context.fillStyle = 'red';
    context.arc(corMousX, corMousY, 8, 0, 2 * Math.PI, true);
    context.fill();
    context.closePath();

    // А теперь самое интересное.
    const dA = .05;
    for(let i = 1; i <= 14; i++){
        for(let alpha = 0; alpha < Math.PI*2; alpha += dA){
            radX = corMousX + 10*i*Math.cos(alpha);
            radY = corMousY + 10*i*Math.sin(alpha);

            // Считаем, сколько между нами и точкой стенок
            const wallcount = walls.filter(wall => intersection_dubl_1(
                wall[0], wall[1], wall[0]+wall[2], wall[1]+wall[3],
                corMousX, corMousY, radX, radY
            )).length;

            // Если сигнал еще не пропал совсем - рисуем.
            if(colors[i + wallcount*4]){
                context.beginPath();
                context.strokeStyle = colors[i - 1 + wallcount*4];
                context.arc(corMousX, corMousY, i*10, alpha, alpha + dA);
                context.stroke();
                context.closePath();
            }
        }
    }

    requestAnimationFrame(update_1);
}

function update_2() { // рисую план, и точку доступа
    // context.clearRect(0, 0, canvas.width, canvas.height);
    //drawWalls();
    // Рисуем точку:
    var corMousX = 500;
    var corMousY = 400;

    context.beginPath();
    context.fillStyle = 'red';
    context.arc(corMousX, corMousY, 8, 0, 2 * Math.PI, true);
    context.fill();
    context.closePath();

    // А теперь самое интересное.

    const dA = .05;
    for(let i = 1; i <= 14; i++){
        for(let alpha = 0; alpha < Math.PI*2; alpha += dA){
            radX = corMousX + 10*i*Math.cos(alpha);
            radY = corMousY + 10*i*Math.sin(alpha);

            // Считаем, сколько между нами и точкой стенок
            const wallcount = walls.filter(wall => intersection_dubl_1(
                wall[0], wall[1], wall[0]+wall[2], wall[1]+wall[3],
                corMousX, corMousY, radX, radY
            )).length;

            // Если сигнал еще не пропал совсем - рисуем.
            if(colors[i + wallcount*4]){
                context.beginPath();
                context.strokeStyle = colors[i - 1 + wallcount*4];
                context.arc(corMousX, corMousY, i*10, alpha, alpha + dA);
                context.stroke();
                context.closePath();
            }
        }
    }

    requestAnimationFrame(update_2);
}
