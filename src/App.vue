<template>
  <div id="app">
    <el-container>
      <el-header>
          <el-row>
            <el-tag type="primary"><router-link to="/chooseCar">跑车挑选</router-link></el-tag>
            
            <el-tag type="primary"><router-link to="/raycaster">碰撞检测</router-link></el-tag>
            
          </el-row>
          
        </el-header>
      <el-container>

        <el-main> 
          <router-view></router-view>
          
        </el-main>
      </el-container>
    </el-container>
    
    
   
  </div>
</template>



<script>
export default {
  name: 'App'
}
</script>

<style>
  body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, /* structural elements 结构元素 */
  dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
  pre, /* text ormatting elements 文本格式元素 */
  fieldset, lengend, button, input, textarea, /* form elements 表单元素 */
  th, td { /* table elements 表格元素 */
  
      margin: 0;
      padding: 0;
  
  }

  .el-container .el-main{
    padding: 0;
  }

  .el-container .el-tag{
    margin-top: 1em;
    margin-right: 1em;
  }
  .el-row .el-tag a{
    text-decoration: none
  }
</style>
