function renderTasks(tasks) {
    let container = document.getElementById("tasks-q")
    container.innerHTML = ""
    for (task of tasks) {
        let p = `
            <p class = "${Boolean(task.high_p) === true ? 'text-red-500' : 'text-black'}">${task.timer}</p> 
        `;
        container.innerHTML += p;
    }
}

function renderQueue(container, task) {
    let p = `
            <p class = "${tasks.high_p ? 'text-red-500' : ''}">${task.timer}</p> 
        `;
    container.innerHTML += p;
}


function remove(element, timer, queue) {
    let i = 0;
    while (i < timer) {
        i++;
    }

    setTimeout(function () {
        element.remove();
        queue.splice(0, 1);
    }, timer);
}

function getSum(tasks) {
    let sum = 0;
    for (task of tasks) {
        sum += task.timer;
    }
    return sum;
}

document.addEventListener("DOMContentLoaded", function () {
    tasks = []
    high_q = []
    r_2 = []
    r_3 = []
    r_4 = []

    high_p_container = document.getElementById("high-list")
    q2_container = document.getElementById("q-2-list")
    q3_container = document.getElementById("q-3-list")
    q4_container = document.getElementById("q-4-list")

    function getRandomInt(max) {
        return Math.floor(Math.random() * max) + 50;
    }

    document.getElementById("add").addEventListener("click", function () {
        let chance = Math.random();
        let task = {
            timer: getRandomInt(150),
            high_p: chance < .1 ? true : false
        }
        tasks.push(task)
        renderTasks(tasks)
    })

    document.getElementById("admit").addEventListener("click", function () {
        if (tasks.length > 0) {
            const task = tasks[0];
            if (task.high_p) {
                high_q.push(task);
                renderQueue(high_p_container, task);
            } else {
                let sum2 = getSum(r_2);
                let sum3 = getSum(r_3)
                let sum4 = getSum(r_4);

                let sums = [sum2, sum3, sum4];
                var min = Math.min.apply(Math, sums);
                let minIndex = sums.indexOf(min);

                switch (minIndex) {
                    case 0:
                        r_2.push(task)
                        renderQueue(q2_container, task);
                        break;
                    case 1:
                        r_3.push(task)
                        renderQueue(q3_container, task);
                        break;
                    case 2:
                        r_4.push(task)
                        renderQueue(q4_container, task);
                        break;
                }
            }
            tasks.splice(0, 1);
            renderTasks(tasks)
        }
    })

    const interval = 20;

    setInterval(function () {
        let div = document.getElementById("high")
        if (high_q.length > 0) {
            div.style.width = high_q[0].timer + 'px';
            if(high_q[0].timer >= 1){
                high_q[0].timer--;
            }
            if(high_q[0].timer == 0){
                let p = high_p_container.querySelectorAll('p')[0]
                p.remove();
                high_q.splice(0, 1);
            }
        }
    }, interval);

    setInterval(function () {
        let div = document.getElementById("q-2")
        if (r_2.length > 0) {
            div.style.width = r_2[0].timer + 'px';
            if(r_2[0].timer >= 1){
                r_2[0].timer--;
            }
            if(r_2[0].timer == 0){
                let p = q2_container.querySelectorAll('p')[0]
                p.remove();
                r_2.splice(0, 1);
            }
        }
    }, interval);

    setInterval(function () {
        let div = document.getElementById("q-4")
        if (r_4.length > 0) {
            div.style.width = r_4[0].timer + 'px';
            if(r_4[0].timer >= 1){
                r_4[0].timer--;
            }
            if(r_4[0].timer == 0){
                let p = q4_container.querySelectorAll('p')[0]
                p.remove();
                r_4.splice(0, 1);
            }
        }
    }, interval);

    setInterval(function () {
        let div = document.getElementById("q-3")
        if (r_3.length > 0) {
            div.style.width = r_3[0].timer + 'px';
            if(r_3[0].timer >= 1){
                r_3[0].timer--;
            }
            if(r_3[0].timer == 0){
                let p = q3_container.querySelectorAll('p')[0]
                p.remove();
                r_3.splice(0, 1);
            }
        }
    }, interval);
})