<template>
  <div class="page-body">
    <div class="d-flex flex-column" id="relatoriosFrames">
      <div class="d-flex m-3 gap-3">
        <iframe
          class=""
          src="http://localhost:3000/d-solo/cdnhue8wjha0wb1/ivo-dashboard?orgId=1&refresh=1m&from=1718115410091&to=1718137010091&panelId=1"
          width="1000"
          height="300"
          frameborder="0"
        ></iframe>
        <iframe
          src="http://localhost:3000/d-solo/cdnhue8wjha0wb1/ivo-dashboard?orgId=1&refresh=1m&from=1718115548759&to=1718137148759&panelId=7"
          width="500"
          height="200"
          frameborder="0"
        ></iframe>
      </div>
      <div class="d-flex m-3 gap-3">
        <iframe
          src="http://localhost:3000/d-solo/cdnhue8wjha0wb1/ivo-dashboard?orgId=1&refresh=1m&from=1718115461733&to=1718137061733&panelId=10"
          width="1000"
          height="300"
          frameborder="0"
        ></iframe>
        <iframe
          src="http://localhost:3000/d-solo/cdnhue8wjha0wb1/ivo-dashboard?orgId=1&refresh=1m&from=1718115608818&to=1718137208819&panelId=9"
          width="500"
          height="200"
          frameborder="0"
        ></iframe>
      </div>
      <div class="d-flex m-3 gap-3">
        <iframe src="http://localhost:3000/d-solo/cdnhue8wjha0wb1/ivo-dashboard?orgId=1&refresh=1m&from=1718115690860&to=1718137290860&panelId=2" width="500" height="200" frameborder="0"></iframe>
        <iframe src="http://localhost:3000/d-solo/cdnhue8wjha0wb1/ivo-dashboard?orgId=1&refresh=1m&from=1718115698668&to=1718137298668&panelId=8" width="500" height="200" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RelatoriosView",
};
</script>

<style scoped>
.relatoriosFrames {
  height: 10000px;
}
</style>
