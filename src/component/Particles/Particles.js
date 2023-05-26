import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const Particles = () => {
    const [canvasDimension,setCanvasDimension]= useState({
        width:window.innerWidth,
        height:window.innerHeight
    })
    const canvasRef= useRef()

    const drawCanvas =React.useCallback( () => {
        let canvasElement= canvasRef.current;
        /**
         * create scene
         */
        const scene = new THREE.Scene();

       /**
        * create camera 
        */
       const camera = new THREE.PerspectiveCamera(45,canvasDimension.width/canvasDimension.height,1,1000);
       camera.position.set(1,1,5)


       /**
        * create box
        */

    //    const boxGeometry = new THREE.BoxBufferGeometry(1,1,1);
    //    const boxMaterial = new THREE.MeshBasicMaterial({color:'red'})
    //    const box =new THREE.Mesh(boxGeometry,boxMaterial);
    //    scene.add(box)

    /**
     * load tecture
     */

    const imageLoader = new THREE.TextureLoader();
    let circleImage = imageLoader.load('2.png')

    console.log(circleImage)

const ParticleGeometries= new THREE.BufferGeometry();

let pointCount =1000;
let positionArray = new  Float32Array(pointCount*3);
let positionColor = new Float32Array(pointCount*3)
for(let i =0;i<pointCount*3;i++){
    positionArray[i] = (Math.random()-0.5)*10;
    positionColor[i] = Math.random();
}


ParticleGeometries.setAttribute('position',new THREE.Float32BufferAttribute(positionArray,3))
ParticleGeometries.setAttribute('color',new THREE.Float32BufferAttribute(positionColor,3))
const particleMaterial = new THREE.PointsMaterial({size:0.2,sizeAttenuation:true});
particleMaterial.vertexColors=true
// particleMaterial.color= new THREE.Color('red');
 particleMaterial.transparent=true;
 particleMaterial.alphaMap=circleImage;
//  particleMaterial.alphaTest=0.01;
//  particleMaterial.depthTest=false;
 particleMaterial.depthWrite=false;
 particleMaterial.blending=THREE.AdditiveBlending

const particle = new THREE.Points(ParticleGeometries,particleMaterial)

scene.add(particle)

        /**
         * create rendrer
         */
        const rendrer= new THREE.WebGLRenderer({
            canvas:canvasElement
        });
        /**
         * add orbit control 
         * and enable damping effect
         */
        const controls = new OrbitControls( camera,rendrer.domElement );
        controls.enableDamping=true
        controls.update();
        rendrer.render(scene,camera)

        /**
         * update  projection
         */
        rendrer.setSize(canvasDimension.width,canvasDimension.height)
        //update accept ratio of  camera
     
         camera.aspect = canvasDimension.width/canvasDimension.height;
         //if any properties  of camera get changed then updateProjectionMatrix() method has to call
         camera.updateProjectionMatrix();
         const clock = new THREE.Clock() 
        
       
        const tick = () => {
            let elapsedTime =  clock.getElapsedTime();
            particle.position.x=Math.sin(elapsedTime)
            for(let i =0;i<pointCount;i++){
                
           let i3 = i*3;
           let x= ParticleGeometries.attributes.position.array[i3+0]
             ParticleGeometries.attributes.position.array[i3+1]=Math.sin(elapsedTime+x)
            }
            ParticleGeometries.attributes.position.needsUpdate=true
           
           
            requestAnimationFrame(tick)
            controls.update();

            rendrer.render(scene,camera)
        }
        tick()
    
    
    },[canvasDimension.height,canvasDimension.width])
    React.useEffect(() => {
            drawCanvas();
            window.addEventListener('resize',() => {
                setCanvasDimension({width:window.innerWidth,height:window.innerHeight})
            })
            return () => window.removeEventListener('resize',window)
    },[drawCanvas])
 
    return (
        <canvas ref={canvasRef} width={canvasDimension.width} height={canvasDimension.height}>
            
        </canvas>
    )
}

export default Particles
