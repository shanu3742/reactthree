import React, { useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ParticlePracticeOne = () => {
    const canvasRef = useRef()
    const dimension = {
        width:window.innerWidth,
        height:window.innerHeight,
        acceptRatio:window.innerWidth/window.innerHeight
    }


    const drawParticle =React.useCallback( () => {
        let canvasElement= canvasRef.current
        /**
         * create scene
         */
        const scene = new THREE.Scene()
  
  
        /**
         * create camera 
         */
        const camera = new THREE.PerspectiveCamera(45,dimension.acceptRatio,1,1000)
        camera.position.set(0,0,2);

        /**
         * create axis
         */

        const axisHelper = new THREE.AxesHelper();
        scene.add(axisHelper)
        /**
         * create a box
         */
        // const boxGeometry = new THREE.BoxBufferGeometry(1,1,1);
        // const boxMaterial = new THREE.MeshBasicMaterial({color:'red'});
        // const box = new THREE.Mesh(boxGeometry,boxMaterial);
        // scene.add(box)


        const pointGeometries = new THREE.BufferGeometry();
        /**
         * create position array
         */
        let pointCount = 1000
        const positonArray = new  Float32Array(pointCount*3);
        const positionColor = new Float32Array(pointCount*3)

        for(let i = 0 ; i<pointCount*3; i++){

            positonArray[i] = (Math.random()-0.5)*10;
            positionColor[i] = Math.random();

        }
        
        /**
         * load texture 
         */

        const textureLoader = new THREE.TextureLoader();
      let textureImage=  textureLoader.load('2.png')
        const pointMaterial = new THREE.PointsMaterial({size:0.2,sizeAttenuation:true});
        pointMaterial.transparent= true;
        pointMaterial.alphaMap= textureImage
        pointMaterial.depthWrite= false;
        pointMaterial.blending= THREE.AdditiveBlending
        const points = new THREE.Points(pointGeometries,pointMaterial);
        /**
         * update material color 
         */
        pointGeometries.setAttribute('position', new THREE.BufferAttribute(positonArray,3))
        /**
         * it's only applaciable 
         * if vertex color is true  
         */
        pointMaterial.vertexColors=true
        pointGeometries.setAttribute('color', new THREE.BufferAttribute(positionColor,3))
        scene.add(points)

        /**
         * add rendrer
         */
        const rendrer = new THREE.WebGLRenderer({
            canvas:canvasElement
        })
        const controls = new OrbitControls( camera,rendrer.domElement );
        controls.enableDamping=true
        controls.update();
        rendrer.render(scene,camera)

        rendrer.setSize(dimension.width,dimension.height)
    /**
      * windows resize 
    */

        window.addEventListener('resize',() => {
            rendrer.setSize(window.innerWidth,window.innerHeight)
            camera.aspect= window.innerWidth/window.innerHeight
            camera.updateProjectionMatrix();
        })


        //add animation 
        const clock = new THREE.Clock();


        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            points.position.x=Math.sin(elapsedTime)
               /**
             * update particle
             */
               for(let i = 0;i<pointCount;i++){
                let i3 = i*3;
                let x= pointGeometries.attributes.position.array[i3+0]
                pointGeometries.attributes.position.array[i3+1]=Math.sin(elapsedTime+x)
            }
            pointGeometries.attributes.position.needsUpdate=true
            requestAnimationFrame(tick)
         

            controls.update();
            rendrer.render(scene,camera)

        }
        tick()


        

      },[dimension.acceptRatio,dimension.height,dimension.width])
    React.useEffect(() => {
        drawParticle()
        return () => window.removeEventListener('resize',window)
    }, [drawParticle])
    return (
        <canvas ref={canvasRef} width={dimension.width} height={dimension.height}>
          
        </canvas>
    )
}

export default ParticlePracticeOne
