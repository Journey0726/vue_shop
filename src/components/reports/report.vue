<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">数据统计</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import { getChartData } from "@/network/report.js";
export default {
  name: "report",
  data() {
    return {
      //需要合并的选项
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  mounted() {
    this.paintChart();
  },
  methods: {
    paintChart() {
      var myChart = this.$echarts.init(document.getElementById("main"));
      getChartData().then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取图表数据失败");

        Object.assign(this.options, res.data);

        myChart.setOption(this.options);
      });
    },
  },
};
</script>

<style>
</style>