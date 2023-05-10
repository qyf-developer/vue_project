<template>
    <div ref="canvasDom">
        
    </div>
</template>

<script setup>

import * as THREE from 'three';
import { onMounted, ref } from "vue";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let controls;
let canvasDom = ref(null);
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 2, -6);
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
// 抗锯齿
    antialias: true,
});

renderer.shadowMap.enabled = true; 
renderer.setSize(window.innerWidth, window.innerHeight-70);

let jump = false;

document.addEventListener(
  'keydown',
  (e) => {
    var ev = e || window.event;
        if(ev.keyCode == 87 && cube.position.y<0.1){
            clock.start();
            jump = true;
        }
    },
    false
)

onMounted(() => {
    const canvasObj = canvasDom.value;
    // 把渲染器插入到dom中
    // console.log(canvasDom.value);
    canvasObj.appendChild(renderer.domElement);
    // 初始化渲染器，渲染背景
    renderer.setClearColor("#000");
    scene.background = new THREE.Color("#ccc");
    scene.environment = new THREE.Color("#ccc");
    render();
    
    canvasObj.addEventListener(
        'touchstart', 
        (e) => {
            
            if(cube.position.y<0.1){
                clock.start();
                jump = true;
            }
        }
    );
});

// 添加控制器
controls = new OrbitControls(camera, renderer.domElement);
controls.update();  
        
// 灯光
const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.8 );
scene.add( ambientLight );

const color = 0xffffff;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);

//light.target = cube;
light.position.set(10, 10, 10);
scene.add(light);

const d = 5;
light.castShadow = true;
light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;

light.shadow.camera.near = 1;
light.shadow.camera.far = 30;

light.shadow.mapSize.x = 1024;
light.shadow.mapSize.y = 1024;
// 设置接收阴影的投影面
const floorGeometry = new THREE.PlaneGeometry( 18, 18 );
const floorMaterial = new THREE.MeshLambertMaterial( { color: 0x4676b6 } );

const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = Math.PI * - 0.5;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add( floor );

// 立方体
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const material = new THREE.MeshPhongMaterial({
    side:THREE.TwoPassDoubleSide,
color: 0x6688aa
})
const cube = new THREE.Mesh(geometry, material);
cube.position.x = -1;
cube.position.z = -0.01;
cube.castShadow = true;
scene.add(cube);

const material2 = new THREE.MeshPhongMaterial({
    side:THREE.TwoPassDoubleSide,
color: 0x6688aa
})
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 1;
cube2.castShadow = true;
scene.add(cube2);

const offset = 0.2;
const speed = 2.5;
const height = 2;
let clock = new THREE.Clock();
// 渲染
const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    if (onIntersect()) {
        cube.material.color.set('yellow');
    } else {
        cube.material.color.set(0x6688aa);
    }
    const time = clock.getElapsedTime();
    if(jump == true){
        
        cube.position.y = Math.abs( Math.sin( offset + ( time * speed ) ) * height );
    }
    cube2.position.x -= 0.05;
    if(cube2.position.x<-6){
        cube2.position.x = 6
    }
    if(cube.position.y<0.1){
        clock.stop();
        jump = false;
        cube.position.y=0.01;
    }
    //console.log(cube.position.y)
}
requestAnimationFrame(render);

window.onresize = function(){
    renderer.setSize(window.innerWidth,window.innerHeight);
    //camera.scale= window.innerWidth/Window.innerHeight;
    camera.updateProjectionMatrix();


}


  function onIntersect() {
    // 声明一个变量用来表示是否碰撞
    let bool = false
    
    // .position 对象局部位置
    // .clone() 复制一个新的三维向量
    // 网格中心 世界坐标
    const centerCoord = cube.position.clone();
    // 获取网格中 几何对象的顶点对象
    const position = cube.geometry.attributes.position;

    
    // 顶点三维向量
    const vertices = [];
    // .count 矢量个数
    for (let i = 0; i < position.count/3; i++) {

        //console.log(position.getX(i)+" "+position.getY(i)+" "+position.getZ(i));
        // .getX() 获取给定索引的矢量的第一维元素
        vertices.push(new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i)));
    }
    for (let i = 0; i < vertices.length; i++) {
        // .matrixWorld 物体的世界坐标变换 -- 物体旋转、位移 的四维矩阵
        // .applyMatrix4() 将该向量乘以四阶矩阵
        // 获取世界坐标下 网格变换后的坐标
        let vertexWorldCoord = vertices[i].clone().applyMatrix4(cube.matrixWorld);
        
        // .sub(x) 从该向量减去x向量
        // 获得由中心指向顶点的向量
        var dir = vertexWorldCoord.clone().sub(centerCoord);
        // .normalize() 将该向量转换为单位向量
        // 发射光线 centerCoord 为投射的原点向量  dir 向射线提供方向的方向向量
        let raycaster = new THREE.Raycaster(centerCoord, dir.clone().normalize());
        // 放入要检测的 物体cube2，返回相交物体
        let intersects = raycaster.intersectObjects([cube2], true);

        if (intersects.length > 0) {
            //console.log(intersects[0].distance+" "+dir.length());
            // intersects[0].distance：射线起点与交叉点之间的距离(交叉点：射线和模型表面交叉点坐标)
            // dir.length()：几何体顶点和几何体中心构成向量的长度
            // intersects[0].distance小于dir.length() 表示物体相交
            if (intersects[0].distance < dir.length()) {
                
                bool = true;
            }
        }
    }
    return bool
}


</script>

<style>
    #c2d{
        width: 1000px;
        height: 500px;
    }
</style>