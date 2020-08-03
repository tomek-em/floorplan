// init page animations
const initPageAnimations = () => {
	const left = document.getElementById('three_left_col');
  const right = document.getElementById('three_right_col');

  left.style.animation = 'left_in 0.5s ease forwards';
  right.style.animation = 'right_in 0.5s ease forwards';

	const three_btn = document.getElementById('three_more_btn');
	three_btn.addEventListener('click', () => window.open('https://tomaszmejer.com/2019/#s-3d', '_blank'));
}

// change tiles buttons events
const addEventListeners = () => {
	window.onresize = resizeCanvas;
	document.getElementById('tiles_one').addEventListener('click', () => world.changeTiles('one'));
	document.getElementById('tiles_two').addEventListener('click', () => world.changeTiles('two'));
}

const resizeCanvas = () => {
	world.onWindowResize();
}

const loadMesh = () => {
		if(world.scene.children.length <= 1) world.loadGLTF();
}

const rotateMesh = () => {
	world.rotateObj('floor');
}

// render with default fps - NOT USED
const simpleRender = () => {
	requestAnimationFrame(render);
	world.animate();
	world.update();
}

const update = () => {
	const interval = 50;
	world.animate();
	world.render();
	setTimeout(() => {
		requestAnimationFrame(update);
	}, interval);
}


// create canvas
const setCanvas = (id) => {
  const canvas = document.createElement('div');
  canvas.id = 'canvas';
  canvas.classList.add('canvas');
  const canvas_cont = document.getElementById(id);
  canvas_cont.append(canvas);
  return canvas;
}

	// set 3d world
const initThreeWorld = (cont) => {
	const canvas = setCanvas(cont);
  world = new World(canvas);
	addEventListeners();
	update();

	const waiting_scr = document.getElementById('three_waiting_screen');

	// load floorplan on page loading
	if(world.scene.children.length <= 2) {
		world.loadGLTF()
		.then(() => {
			waiting_scr.classList.add('d_none');
			console.log('Floorplan loaded');
		})
		.catch((err) => {
			console.error('Can not load floorplan ', err);
		});
	}
}

const three_app = async (cont) => {
	initPageAnimations();
  initThreeWorld(cont);
}

// select Canvas Container Div here
const canvas_container = 'canvas_cont';

window.addEventListener('load', (e) => {
  three_app(canvas_container);
});
