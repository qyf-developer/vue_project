<template>
    <div class="home">
      <div class="canvas-container" ref="canvasDom"></div>
  
      <div class="home-content">
        <div class="home-content-title">
          <h2>汽车展示与选配</h2>
        </div>
        <h4>选择车身颜色</h4>
        <div class="select">
          <div
            class="select-item"
            v-for="(item, index) in colors"
            :key="index"
            @click="selectColor(index)"
          >
            <div
              class="select-item-color"
              :style="{ backgroundColor: item }"
            ></div>
          </div>
        </div>
  
        <h4>选择贴膜材质</h4>
        <div class="select">
          <div
            class="select-item"
            v-for="(item, index) in materials"
            :key="index"
            @click="selectMaterial(index)"
          >
            <button class="select-item-text">{{ item.name }}</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>

  

  import * as THREE from "three";
  import { onMounted, ref } from "vue";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
  
  
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
    

  renderer.setSize(window.innerWidth, window.innerHeight-70);
  
  const render = () => {
    renderer.render(scene, camera);
    controls && controls.update();
    
    requestAnimationFrame(render);
  
  };
  
  let carBody;
  // 创建材质
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });
  
  
  let colors = ["black", "blue", "red", "gray", "orange", "purple"];
  
  let selectColor = (index) => {
    bodyMaterial.color.set(colors[index]);
  };
  
  let materials = [
    { name: "磨砂", value: 1 },
    { name: "冰晶", value: 0 },
  ];
  let selectMaterial = (index) => {
    bodyMaterial.clearcoatRoughness = materials[index].value;
    hoodMaterial.clearcoatRoughness = materials[index].value;
  };
  onMounted(() => {
    // 把渲染器插入到dom中
    // console.log(canvasDom.value);
    canvasDom.value.appendChild(renderer.domElement);
    // 初始化渲染器，渲染背景
    renderer.setClearColor("#000");
    scene.background = new THREE.Color("#ccc");
    scene.environment = new THREE.Color("#ccc");
    render();
  
    // 添加网格地面
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
  
    // 添加控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
  
    // 添加gltf汽车模型
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/gltf/");
    loader.setDRACOLoader(dracoLoader);
    loader.load("./model/scene.glb", gltf => {
      const bmw = gltf.scene;
       bmw.traverse((child) => {
        if(child.isMesh){
          //console.log(child.name);
        }
        if(child.isMesh && (child.name==("Object_28")||child.name==("Object_34")||child.name==("Object_40")||child.name==("Object_4")||child.name==("Object_13")||child.name==("Object_45"))){
          // Object_4 Object_13 Object_45
          //Object_28车灯边框 Object_30品牌 Object_32车尾线条 Object_38车尾天线
          //Object_40侧面镜 Object_47车轮边 Object_48 Object_49车轮内
          //console.log(child)
          carBody = child;
          carBody.material = bodyMaterial;
        }
       })
      scene.add(bmw);
    });
  
    // 添加灯光
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(0, 0, 10);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(0, 0, -10);
    scene.add(light2);
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(10, 0, 0);
    scene.add(light3);
    const light4 = new THREE.DirectionalLight(0xffffff, 1);
    light4.position.set(-10, 0, 0);
    scene.add(light4);
    const light5 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, 10, 0);
    scene.add(light5);
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
    light6.position.set(5, 10, 0);
    scene.add(light6);
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
    light7.position.set(0, 10, 5);
    scene.add(light7);
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
    light8.position.set(0, 10, -5);
    scene.add(light8);
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
    light9.position.set(-5, 10, 0);
    scene.add(light9);
  });
  
  window.onresize = function(){
      renderer.setSize(window.innerWidth,window.innerHeight);
      //camera.scale= window.innerWidth/Window.innerHeight;
      camera.updateProjectionMatrix();
  
  
  }
  
  </script>
  
  

  <style scoped>
  
  .home-content {
    position: fixed;
    top: 80px;
    left: 20px;
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  }
  
  .home-content h2,.home-content h4{
    margin-top: 0.5em;
  }
  
  .select-item-color {
    padding: 1.1em;
    border: 1px solid #ccc;
    margin: 0.4em;
    display: inline-block;
    cursor: pointer;
    border-radius: 2em;
  }
  .select {
    display: flex;
    margin-top: 0.5em;
  }
  
  
  .select-item-text{
    border-radius: 0.2em;
    padding: 0.5em 1em;
    margin-right: 0.5em;
    margin-top: 0.2em;
    line-height: 1em;
    border: 0;
    text-align: center;
    font-weight: bold;
    color: #fff;
    text-shadow:1px 1px 1px #333;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  

  </style>
  