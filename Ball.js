class Ball {
  constructor(x, y, dx, dy, radius, color, species, speed, sight, fertileSize, growthSpeed, reproCost, offspringSize, growthRate, growthSize,maxTimeWithoutFood, oldAgeLimit) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.species = species;
    this.speed = speed;
    this.sight = sight;
    this.fertileSize = fertileSize;
    this.growthSpeed = growthSpeed;
    this.reproCost = reproCost;
    this.offspringSize = offspringSize;
    this.waitSteps = 0;
    this.growthRate = growthRate;
    this.growthSize = growthSize;
    this.timeSinceLastMeal = 0;
    this.maxTimeWithoutFood = maxTimeWithoutFood;
    this.oldAgeLimit = oldAgeLimit;
  }

grow() {
  if (this.radius <= this.growthSize) {
    this.radius += this.growthRate * (1 - this.radius/this.growthSize);
  }
}


move(canvas, balls) {
  if (this.waitSteps > 0) {
    this.waitSteps--;
    return;
  }

    // Keep the ball inside the canvas
  if (canvas != undefined && (this.y - this.radius < 0 || this.y + this.radius > canvas.height || this.x - this.radius < 0 || this.x + this.radius > canvas.width)) {
    if (this.x - this.radius < 0) {
      this.dx = 1;
            this.y += this.dy * this.speed;
    }else{
            if (this.x + this.radius > canvas.width) {
            this.dx = -1;
            }
    }
    if (this.y - this.radius < 0) {
      this.dy = 1;
    }else{
            if (this.y + this.radius > canvas.height) {
      this.dy = -1;
    }
    }
      this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    return;
  }

  // Increment time since last meal
  this.timeSinceLastMeal++;

  // Kill ball if it has not eaten for longer than maxTimeWithoutFood and its radius is larger than x
  if (this.timeSinceLastMeal > this.maxTimeWithoutFood && this.radius >= this.oldAgeLimit) {
        balls.splice(balls.indexOf(this), 1);
                console.log(" dead ")
  }

  // Hunt smaller balls and flee from larger ones
  if (balls == undefined) {
    return;
  }
  for (let i = 0; i < balls.length; i++) {
    const otherBall = balls[i];
    const distance = Math.sqrt((this.x - otherBall.x) ** 2 + (this.y - otherBall.y) ** 2);
    if (this.species == otherBall.species) {
      continue;
    }
    if (distance < this.sight && otherBall !== this) {
      if (otherBall.radius < this.radius && otherBall.radius > this.offspringSize + 2) {
        this.chase(otherBall);
      } else if (otherBall.radius > this.radius) {
        this.flee(otherBall);
      }
    }
  }



  // Move the ball
  this.x += this.dx * this.speed;
 this.y += this.dy * this.speed;

// Reduce the ball's radius based on time since last meal
//const radiusReduction = this.timeSinceLastMeal / this.timeToDigest;
//this.radius = Math.max(this.minRadius, this.radius - radiusReduction);

// Reset time since last meal if the ball has eaten
if (this.justAte) {
this.timeSinceLastMeal = 0;
this.justAte = false;
}
}



  chase(target) {
    const angle = Math.atan2(target.y - this.y, target.x - this.x);
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  flee(target) {
    const angle = Math.atan2(target.y - this.y, target.x - this.x);
    this.dx = -Math.cos(angle) * this.speed;
    this.dy = -Math.sin(angle) * this.speed;
  }

draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // Draw line of sight circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.sight, 0, Math.PI * 2);
    ctx.strokeStyle = "#f0f0f0";
    ctx.stroke();
    ctx.closePath();

    // Draw name
    ctx.fillStyle = "#d3d3d3";
    ctx.font = "12px Arial";
    let lines = []
    let textRadius = "radius: "+Math.floor(this.radius);
    let textRepro =  "repro: " + Math.floor(this.fertileSize) ;
    let textSpeed =  "speed: " + Math.floor(this.speed*10) ;
    let textSight =  "sight: " + Math.floor(this.sight) ;
    let textspecies =  "species: " + this.species ;

    lines.push(textRadius);
    lines.push(textRepro);
    lines.push(textSpeed);
    lines.push(textSight);
    lines.push(textspecies);

    for (var i = 0; i<lines.length; i++)
         ctx.fillText(lines[i], this.x + this.radius + 10, this.y + (i*10));


// Draw Title
    ctx.fillStyle = "#616161";
    ctx.font = "36px Arial";
    let text1 = "GeoCell.AI";
    ctx.fillText(text1, 50,50);
// Draw subTitle
    ctx.fillStyle = "#9E9E9E";
    ctx.font = "24px Arial";
    let text2 = "Lars Langhorst";
    ctx.fillText(text2, 50,80);


    this.drawHealthBar();
    

   this.grow();
  }


 drawHealthBar() {
  const healthWidth = 20;
  const healthHeight = 3;
  const healthX = this.x - this.radius;
  const healthY = this.y + this.radius + 5;
  const healthRemaining = this.maxTimeWithoutFood - this.timeSinceLastMeal;
  var healthPercentage = healthRemaining / this.maxTimeWithoutFood;
  if (this.radius <= this.oldAgeLimit){
    healthPercentage = 1;
  }
  const green = "#00FF00";
  const red = "#FF0000";
  const yellow = "#FFFF00";
  const grey = "#d8d8d8";
  let barcolor = green;
  if (healthPercentage < 0.7){barcolor = yellow;}
  if (healthPercentage < 0.4){barcolor = red;}
  ctx.beginPath();
  ctx.rect(healthX, healthY, healthWidth, healthHeight);
  ctx.fillStyle = grey;
  ctx.fill();
  ctx.beginPath();
  ctx.rect(healthX, healthY, healthWidth * healthPercentage, healthHeight);
  ctx.fillStyle = barcolor;
  ctx.fill();
}
