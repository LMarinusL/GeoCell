import { Ball } from './Ball.js'


let startScreen = document.querySelector(".start-screen");
let canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth ;
canvas.height = window.innerHeight ;
canvas.style.width = `${window.innerWidth * 0.999}px`;
canvas.style.height = `${window.innerHeight * 0.999}px`;
let ctx = canvas.getContext("2d");
let balls = [];



function checkEaten(balls) {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const ball1 = balls[i];
      const ball2 = balls[j];
      if (ball1.species === ball2.species) { // check if balls belong to the same species
        continue;
      }
      const distance = Math.sqrt((ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2);
      if (distance < ball1.radius + ball2.radius) {
        if (ball1.radius < ball2.radius) {
          balls.splice(i, 1);
          ball2.radius += (ball1.radius * (ball2.growthSpeed/10));
        } else {
          balls.splice(j, 1);
          ball1.radius += (ball2.radius * (ball1.growthSpeed/10));
        }
        i--;
        break;
      }
    }
  }
}


function checkReproduction(balls) {
  let babies = [];
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].radius > balls[i].fertileSize) {
      const newBabies = reproduce(balls[i]);
      balls.splice(i, 1); // Remove original ball from array
      babies.push(...newBabies);
    }
  }
  for (let i = 0; i < babies.length; i++) {
    babies[i].waitSteps = 10; // Set wait time for baby balls
    balls.push(babies[i]);
  }
}


function reproduce(ball) {
    let babyBalls = []
    const ball1 = new Ball(ball.x+10, ball.y, ball.dx, ball.dy, ball.radius - ball.reproCost, ball.color, ball.species, ball.speed, ball.sight, ball.fertileSize, ball.growthSpeed, ball.reproCost, ball.offspringSize, ball.growthRate, ball.growthSize, ball.maxTimeWithoutFood, ball.oldAgeLimit);
    
    // Clone ball2 and mutate its parameters
    const ball2 = generateOffspring(ball, 0.2, ball.x-10, ball.y-10, -ball.dx, -ball.dy);
    
    babyBalls.push(ball1, ball2);
    return babyBalls;
}

function generateOffspring(ball, mutationRate, x, y, dx, dy) {
  const mutationPercentage = 0.3; // Mutate by up to 10%
  let mutation = false;

  // Create a new ball at the same position as the parent
  const offspring = new Ball(x, y, dx, dx, ball.offspringSize, ball.color, ball.species, ball.speed, ball.sight, ball.fertileSize, ball.growthSpeed, ball.reproCost, ball.offspringSize, ball.growthRate, ball.growthSize, ball.maxTimeWithoutFood, ball.oldAgeLimit);

  // Mutate the speed with a certain probability
  if (Math.random() < mutationRate) {
    offspring.speed *= (1 + (Math.random() * 2 - 1) * mutationPercentage);
    mutation = true;
  }

  // Mutate the sight with a certain probability
  if (Math.random() < mutationRate) {
    offspring.sight *= (1 + (Math.random() * 2 - 1) * mutationPercentage);
    mutation = true;
  }

  // Mutate the growth speed with a certain probability
  if (Math.random() < mutationRate) {
    offspring.growthSpeed *= (1 + (Math.random() * 2 - 1) * mutationPercentage);
    mutation = true;
  }

  // Mutate the growth rate with a certain probability
  if (Math.random() < mutationRate) {
    offspring.growthRate *= (1 + (Math.random() * 2 - 1) * mutationPercentage);
    mutation = true;
  }

  // Mutate the repro cost with a certain probability
  if (Math.random() < mutationRate) {
    offspring.reproCost *= (1 + (Math.random() * 2 - 1) * mutationPercentage);
    mutation = true;
  }

  // Mutate the color by adding a random value to each channel
  if (mutation) {
    const newColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
    offspring.color = newColor;
    offspring.species = newColor;
  }

  return offspring;
}



function generateBalls(num) {
for (let i = 0; i < num; i++) {
let colorRand = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
let x = Math.random() * canvas.width;
let y = Math.random() * canvas.height;
let dx = Math.random() * 2 - 1;
let dy = Math.random() * 2 - 1;
let radius = Math.random() * 5 + 10;
let color = colorRand;
let species = colorRand;
let speed = Math.random() * 0.5 + 0.5;
let sight = Math.random() * 100 + 50;
let fertileSize = Math.random() * 5 + 15;
let growthSpeed = Math.random() * 4 + 1;
let offspringSize = Math.random() * 4 + 1;
let reproCost = offspringSize;
let growthRate = Math.random() * 0.003 + 0.003;
let growthSize = fertileSize + 1;
let maxTimeWithoutFood =  Math.random() * 700 + 2000;
let oldAgeLimit =  fertileSize - 0.5;
let ball = new Ball(x, y, dx, dy, radius, color, species, speed, sight, fertileSize, growthSpeed,reproCost, offspringSize, growthRate, growthSize, maxTimeWithoutFood, oldAgeLimit);
balls.push(ball);
}
}
generateBalls(20);

function update(balls) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  checkEaten(balls); // call the checkEaten function here
  checkReproduction(balls);


  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    ball.move(canvas, balls);
    ball.draw(ctx);
  }

  requestAnimationFrame(() => update(balls));
}

update(balls);

function startGame() {
  startScreen.style.display = "none";
  generateBalls(30);
  update(balls);
}


canvas.addEventListener("click", function() {
startScreen.style.display = "none";
});
startScreen.addEventListener("click", startGame);