import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import {OrbitControls } from 'three/addons/controls/OrbitControls.js'

const RayCaster = () => {
    const [dimension,setDimension] = useState({
        width:window.innerWidth,
        height:window.innerHeight,
        acceptRatio:window.innerWidth/window.innerHeight
    })
    const canvasRef = useRef();
const renderGame =React.useCallback( () => {
    /**
     * target canvas
     */
    const canvas = canvasRef.current;
    /**
     * create scene  
     */
    const scene = new THREE.Scene();

    /**
     * create camera 
     */
    const camera = new THREE.PerspectiveCamera(45,dimension.acceptRatio,1,1000)
   

    /**
     * set camera position 
     */
    camera.position.set(0,0,10)

    /**
     * create a box 
     */

    const boxGeometries= new THREE.SphereBufferGeometry(0.3);
    const boxMaterials = new THREE.MeshBasicMaterial({color:'red'});

    const boxGeometries1= new THREE.SphereBufferGeometry(0.3);
    const boxMaterials1 = new THREE.MeshBasicMaterial({color:'red'});
    const box = new THREE.Mesh(boxGeometries1,boxMaterials1);
    const boxGeometries2= new THREE.SphereBufferGeometry(0.3);
    const boxMaterials2 = new THREE.MeshBasicMaterial({color:'red'});
    const box1 = new THREE.Mesh(boxGeometries2,boxMaterials2);
    /**
     * set the position of box1
     */
    box1.position.x=-2;
    // box1.material.color= new THREE.Color('yellow')
    const box2 = new THREE.Mesh(boxGeometries,boxMaterials);
    /**
     * set the position of box2
     */
    box2.position.x= 2;
    // box2.material.color= new THREE.Color('green')
    scene.add(box,box1,box2)

    /**
     * ray caster
     */
    const rayCaster = new THREE.Raycaster()
//     /**
//      * set origin and direction  of raycaster
//      */
//     const rayOrigin = new THREE.Vector3(-3,0,0);
//     const rayDirection = new THREE.Vector3(10,0,0);
//     /**
//      * always  normalize vector3
//      */

//     rayDirection.normalize()
   

//     /**
//      * set the ray direction
//      */
//    rayCaster.set(rayOrigin,rayDirection)

//     /**
//      * cast a ray in the dirction of single box
//      */
// //    let intersectObject = rayCaster.intersectObject(box);
// //    console.log(intersectObject)
// let intersectBox = rayCaster.intersectObjects([box,box1,box2])
// console.log(intersectBox)
    /**
     * create rendrer
     */
    const rendrer = new THREE.WebGLRenderer({
        canvas:canvas
    })
    rendrer.setSize(dimension.width,dimension.height);
    camera.aspect=dimension.acceptRatio
    camera.updateProjectionMatrix();
    let control = new OrbitControls(camera,rendrer.domElement);
    control.enableDamping=true
    control.update()


    // rendrer.setSize(dimension.width,dimension.height)
    /**
     * on screen  resize
     */
    rendrer.render(scene,camera)
    
const clock = new THREE.Clock()
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
      
      
        box1.position.y = Math.sin(elapsedTime+box1.position.x);
        box.position.y = Math.sin(elapsedTime+box.position.x);
        box2.position.y = Math.sin(elapsedTime+box2.position.x);
        const rayPosition = new THREE.Vector3(-3,0,0);
        const rayDirection = new THREE.Vector3(10,0,0)
        rayDirection.normalize();
        rayCaster.set(rayPosition,rayDirection);
        const testObject = [box,box1,box2]
        let intersectObjects= rayCaster.intersectObjects(testObject);
        // console.log(intersectObjects)
        for (let object of testObject){
            object.material.color.set('red')
        }
for(let intersectItem of intersectObjects){
    // console.log(intersectItem)
    // let object = intersectItem.object;
    intersectItem.object.material.color= new THREE.Color('blue')
}
        
        requestAnimationFrame(tick)
        control.update()
        rendrer.render(scene,camera)
    }
    tick()

},[dimension.acceptRatio,dimension.height,dimension.width])

    React.useEffect(() => {

        window.addEventListener('resize',() => {
            setDimension({
                width:window.innerWidth,
                height:window.innerHeight,
                acceptRatio:window.innerWidth/window.innerHeight
            })
            
        })
        
        renderGame()

        return () => window.removeEventListener('resize',window)

    },[renderGame])

    return (
        <canvas ref={canvasRef} width={dimension.width} height={dimension.height}>
          
        </canvas>
    )
}

export default RayCaster
