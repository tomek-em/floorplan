class World {
  constructor(canvas) {
    // init scene
    this.canvas = canvas;
    this.canv_width = canvas.offsetWidth;
		this.canv_height = canvas.offsetHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, this.canv_width / this.canv_height, 0.1, 1000 );
    this.camera.position.set(-2.0, 5.5, 3.5);

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( 0xCBCBCB, 1 );
  	this.renderer.setSize( this.canv_width, this.canv_height );
  	this.canvas.appendChild( this.renderer.domElement );

    // Light
    const am_light = new THREE.AmbientLight( 0x505050, 1.0 );
    this.scene.add( am_light );

    // set controls
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.update();
    this.loadTextures();
  }



  loadTextures() {
    const loader = new THREE.TextureLoader();

    const texture1 = loader.load( './res/tiles/white.jpg', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set( 0.8, 2.4);
    } );

    const texture2 = loader.load( './res/tiles/brown.jpg', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set( 0.8, 2.4);
    } );

    this.tiles1 = new THREE.MeshPhongMaterial( {
         color: 0xffffff,
         specular:0x111111,
         shininess: 10,
         map: texture1,
      } );

    this.tiles2 = new THREE.MeshPhongMaterial( {
         color: 0xffffff,
         specular:0x111111,
         shininess: 10,
         map: texture2,
      } );

    this.metal = new THREE.MeshPhongMaterial({
      color: 0xbbbbbb,
      specular: 0x050505,
      metalness: 1,
      roughness: 0.6,
      shininess: 80
    });

    // floor panel tex
    var floor_panel_tex = loader.load( './res/tex/floor.png', function ( texture ) {
        floor_panel_tex.wrapS = texture.wrapT = THREE.RepeatWrapping;
        floor_panel_tex.offset.set( 0, 0 );
        floor_panel_tex.repeat.set( 0.8, 2.4);
    } );

    this.floor_panel_mat = new THREE.MeshPhongMaterial( {
         color: 0xffffff,
         specular:0x111111,
         shininess: 10,
         map: floor_panel_tex,
      } );

      // Window material
      this.alpha_mat = new THREE.MeshPhongMaterial({
        color:'#aaf',
        opacity: 0.4,
        transparent: true,
      });

      // Plexi material
      this.alpha_mat2 = new THREE.MeshPhongMaterial({
        color:'#888',
        opacity: 0.6,
        transparent: true,
      });
  }


loadGLTF() {
    const loader = new THREE.GLTFLoader();
    const path = './res/50m2-52.gltf';
    let cube;
    const self = this

    return new Promise( ( resolve, reject ) => {

      loader.load(path,
        function ( gltf ) {
        gltf.scene.traverse( function ( node ) {
          if ( node.isMesh ) {
            if( node.material.name == 'new_glass' ) node.material = self.alpha_mat;
            if( node.material.name == 'shower_door' ) node.material = self.alpha_mat2;
          }
        });
        self.floor = gltf.scene;
        self.floor.position.set(3, 0, -1.0);
        self.scene.add(self.floor);

        self.door = self.scene.children[1].children[4].children[0].children[0];
        self.wall_1 = self.scene.children[1].children[16].children[3].children[2];

        if(self.floor_panel) {
          self.floor_panel.material = self.floor_panel_mat;
          self.floor_panel.material.side = THREE.DoubleSide;
        }
        // console.log(self.scene.children[1].children[42]);

        resolve();
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'Error' );
            reject();
        }
      );  // end of loader
    });
  }


  changeTiles( type ) {
    if( this.wall_1 ) {
      if( type == 'one' ) {
        this.wall_1.material = this.tiles1;
        this.wall_1.material.side = THREE.DoubleSide;
      } else if( type == 'two' ) {
        this.wall_1.material = this.tiles2;
        this.wall_1.material.side = THREE.DoubleSide;
      }
    }
  }

  rotateObj(obj) {
    if(this.door) this.wall.rotation.y = 0;
  }


  onWindowResize() {
  	this.canvas.width  = canvas.offsetWidth;
  	this.canvas.height = canvas.offsetHeight;

    const { width, height } = this.canvas;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    // this.rotateObj(this.cube)
  }

  render() {
    this.controls.update();
    this.renderer.render( this.scene, this.camera );
  }

}
