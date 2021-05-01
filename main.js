let c = document.getElementById("my-canvas");
let ctx = c.getContext("2d");
let background = document.createElement("img");
background.src = "/martial-arts/images/background.jpg";

let loadImage = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

let imagesPath = (frameNumber, animation) => {
  return "/martial-arts/images/" + animation + "/" + frameNumber + ".png";
};

let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  forward: [1, 2, 3, 4, 5, 6],
  backward: [1, 2, 3, 4, 5, 6],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

let loadImages = (callback) => {
  let images = {
    idle: [],
    kick: [],
    punch: [],
    backward: [],
    forward: [],
    block: [],
  };
  let imagesToLoad = 0;

  ["idle", "kick", "punch", "forward", "backward", "block"].forEach(
    (animation) => {
      let animationFrames = frames[animation];
      imagesToLoad = imagesToLoad + animationFrames.length;

      animationFrames.forEach((frameNumber) => {
        let path = imagesPath(frameNumber, animation);

        loadImage(path, (image) => {
          images[animation][frameNumber - 1] = image;
          imagesToLoad = imagesToLoad - 1;

          if (imagesToLoad === 0) callback(images);
        });
      });
    }
  );
};
let distance = 0;
let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, 1200, 580);
      ctx.drawImage(background, 0, -20, 1200, 580);
      if (animation === "forward") {
        if (distance >= 850) {
          ctx.drawImage(image, distance, 80, 500, 500);
          console.log(distance);
        } else {
          ctx.drawImage(image, distance + 10, 80, 500, 500);
          distance += 10;
        }
      } else if (animation === "backward") {
        if (distance <= 0) ctx.drawImage(image, 0, 80, 500, 500);
        else {
          ctx.drawImage(image, distance - 10, 80, 500, 500);
          distance -= 10;
        }
      } else ctx.drawImage(image, distance, 80, 500, 500);
    }, index * 100);
  });
  setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
  let queuedAnimation = [];
  let aux = () => {
    let selectedAnimation;
    if (queuedAnimation.length === 0) selectedAnimation = "idle";
    else selectedAnimation = queuedAnimation.shift();

    animate(ctx, images, selectedAnimation, aux);
  };
  aux();

  document.getElementById("kick").onclick = () => {
    queuedAnimation.push("kick");
  };
  document.getElementById("punch").onclick = () => {
    queuedAnimation.push("punch");
  };
  document.getElementById("forward").onclick = () => {
    queuedAnimation.push("forward");
  };
  document.getElementById("backward").onclick = () => {
    queuedAnimation.push("backward");
  };
  document.getElementById("block").onclick = () => {
    queuedAnimation.push("block");
  };
  document.addEventListener("keyup", (event) => {
    const key = event.key;
    const code = event.code;
    if (key === "ArrowLeft") {
      queuedAnimation.push("backward");
    } else if (key === "ArrowRight") queuedAnimation.push("forward");
    else if (key === "ArrowUp") queuedAnimation.push("kick");
    else if (key === "ArrowDown") queuedAnimation.push("punch");
    else if (code === "Space") queuedAnimation.push("block");
  });
});
