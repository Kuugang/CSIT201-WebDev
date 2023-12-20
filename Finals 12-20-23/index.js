function renderTasks(tasks) {
    let container = document.getElementById("tasks-q")
    container.innerHTML = ""
    for (task of tasks) {
        let p = `
            <p class = "${Boolean(task.high_p) === true ? 'text-red-500 border-red-500' : ''} border border-black">${task.timer}</p> 
        `;
        container.innerHTML += p;
    }
}

function renderQueue(container, task) {
    let p = `
            <p class = "${tasks.high_p ? 'text-red-500' : ''} border border-black">${task.timer}</p> 
        `;
    container.innerHTML += p;
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
    high_q_1 = []
    q_2 = []
    q_3 = []
    q_4 = []

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
                high_q_1.push(task);
                renderQueue(high_p_container, task);
            } else {
                let sum2 = getSum(q_2);
                let sum3 = getSum(q_3)
                let sum4 = getSum(q_4);

                let sums = [sum2, sum3, sum4];
                var min = Math.min.apply(Math, sums);
                let minIndex = sums.indexOf(min);

                switch (minIndex) {
                    case 0:
                        q_2.push(task)
                        renderQueue(q2_container, task);
                        break;
                    case 1:
                        q_3.push(task)
                        renderQueue(q3_container, task);
                        break;
                    case 2:
                        q_4.push(task)
                        renderQueue(q4_container, task);
                        break;
                }
            }
            tasks.splice(0, 1);
            renderTasks(tasks)
        }
    })

    const interval = 20;

    const progressIds= ["high", "q-2", "q-3", "q-4"]
    const containers = [high_p_container, q2_container, q3_container, q4_container]
    const queues = [high_q_1, q_2, q_3, q_4];

    setInterval(function () {
        let progressBar;
        let queue;
        for(let i = 0; i < progressIds.length; i++){
            progressBar = document.getElementById(progressIds[i]);
            queue = queues[i] 
            if(queue.length > 0){
                progressBar.style.width = queue[0].timer + 'px';
                if(queue[0].timer >= 1)queue[0].timer--;
                if(queue[0].timer == 1){
                    let p = containers[i].querySelectorAll('p')[0]
                    p.remove();
                    queue.splice(0, 1);
                }
            }
        }
    }, interval);
})