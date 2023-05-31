import React, { useRef, useState } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three'


const GalaxyGenerator = () => {
    const [dimension ,setDimension ] = useState({
        width:window.innerWidth,
        height:window.innerHeight
    })
    const canvasRef = useRef();

   
    

    const drawGalaxy =React.useCallback( () => {
        const canvas = canvasRef.current;
        /**
         * create scene 
         */
        const scene =  new THREE.Scene();

        /**
         * add camera 
         */

        const camera = new THREE.PerspectiveCamera(45,dimension.width/dimension.height,1,1000)
        camera.position.set(0,0,5)
        /**
         * create rendrer
         */
        /**
         * create box
         */
        // const boxGeometries = new THREE.BoxBufferGeometry(1,1,1);
        // const boxMaterial = new THREE.MeshBasicMaterial({color:'red'})
        // const box = new THREE.Mesh(boxGeometries,boxMaterial)
        // scene.add(box)
        const particleGeometries = new THREE.BufferGeometry();
        const particlesMaterial = new THREE.PointsMaterial({size:0.01,sizeAttenuation:true,vertexColors:true});
        const  textureLoader = new THREE.TextureLoader()
        let image= textureLoader.load('1.png')
        const particle =new THREE.Points(particleGeometries,particlesMaterial);
      
        particlesMaterial.transparent=true;
        particlesMaterial.alphaMap=image;
        particlesMaterial.depthWrite=false;
        particlesMaterial.blending=  THREE.AdditiveBlending;
        const particleCount = 100000;
        let particlePosition = new Float32Array(particleCount*3);
        let randomness = 0.2;
        let randomnessPower = 4;
        let spin=3
        const color = new Float32Array(particleCount*3)
        const insideColor = new THREE.Color('rgb(252, 101, 101)')
        const outsideColor = new THREE.Color('rgb(115, 187, 255)')
        for(let i =0;i<particleCount;i++){

            let randomX=Math.pow(Math.random(), randomnessPower)* (Math.random()<0.5?1:-1);
            let randomY= Math.pow(Math.random(), randomnessPower)*(Math.random()<0.5?1:-1)//(Math.random()-0.5)*randomness
            let randomZ=Math.pow(Math.random(), randomnessPower)*(Math.random()<0.5?1:-1)//(Math.random()-0.5)*randomness
            let radius =3*Math.random();
            let spinAngle = radius*spin
            let branchAngle =((i%3)/3)*Math.PI*2;
            let i3= i*3;
            particlePosition[i3+0] = Math.cos(branchAngle+spinAngle)*radius+randomX;
            particlePosition[i3+1] = 0+randomY;
            particlePosition[i3+2]= Math.sin(branchAngle+spinAngle)*radius+randomZ;
            let mixColor = insideColor.clone()
        mixColor.lerp(outsideColor,radius/3)
            color[i3+0]= mixColor.r
            color[i3+1]=mixColor.g
            color[i3+2]=mixColor.b
            // particlePosition[i] = (Math.random()-0.5)*6
        }
       particleGeometries.setAttribute('position', new THREE.BufferAttribute(particlePosition,3))
       particleGeometries.setAttribute('color', new THREE.BufferAttribute(color,3))
         
        scene.add(particle)


        const rendrer = new THREE.WebGLRenderer({canvas:canvas});
        rendrer.setSize(dimension.width,dimension.height);
        const control = new OrbitControls(camera,rendrer.domElement);
        control.enableDamping=true
        control.update()
        rendrer.render(scene,camera);

 

        const tick = () => {
            
               /**
             * all point  along x-axis
             */
            //    for(let i =0;i<particleCount;i++){
            //     let branchAngle =((i%3)/3)*Math.PI*2
            //     let i3= i*3;
            //     particleGeometries.attributes.position.array[i3+0] = Math.cos(branchAngle)*radius
            //     particleGeometries.attributes.position.array[i3+1]=0;
            //     particleGeometries.attributes.position.array[i3+2]= Math.sin(branchAngle)*radius

            // }
            // particleGeometries.attributes.position.needsUpdate=true

            requestAnimationFrame(tick);
         
            control.update()
            rendrer.render(scene,camera)
        }
        tick()



    },[dimension.height,dimension.width])
    React.useEffect(() => {

        window.addEventListener('resize',() => {
            setDimension({
                width:window.innerWidth,
                height:window.innerHeight
            })
            // rendrer.setSize(dimension.width,dimension.height)
            // camera.aspect= dimension.width/dimension.height;
            // camera.updateProjectionMatrix();
            // rendrer.render(scene,camera)
        })
         drawGalaxy()
    },[drawGalaxy])
    return (
       <div>
<div>

</div>
        <canvas ref= {canvasRef} width={dimension.width} height={dimension.height}>
           
           </canvas>
       </div>
    )
}

export default GalaxyGenerator
