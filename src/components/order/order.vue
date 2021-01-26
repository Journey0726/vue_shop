<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersInfo"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
          width="400px"
        ></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag
              v-if="scope.row.pay_status === '0'"
              type="danger"
              size="mini"
              >未付款</el-tag
            >
            <el-tag v-else type="success" size="mini">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{ scope.row.create_time | dateShow }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editPlace"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="localInfo(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editPlaceVisible"
      width="50%"
      @close="editPlaceClosed"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="bigAddress">
          <el-input v-model="editForm.bigAddress"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="editForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPlaceVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPlaceVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流信息 -->
    <el-dialog title="物流" :visible.sync="localPlaceVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(localInfo, index) in localList"
          :key="index"
          :timestamp="localInfo.time"
        >
          {{ localInfo.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/common/utils.js";
import { getOrdersInfo, getLocalInfo } from "@/network/order.js";
export default {
  name: "order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      orderList: [],
      total: 0,
      editPlaceVisible: false,
      editForm: {
        bigAddress: [],
        detailAddress: "",
      },
      editRules: {
        bigAddress: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        detailAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      localPlaceVisible: false,
      localList:[]
    };
  },
  filters: {
    dateShow(value) {
      let date = new Date(value * 1000);
      return formatDate(date, "yyyy-MM-dd  h:m:s");
    },
  },
  created() {
    this.getOrdersInfo();
  },
  methods: {
    getOrdersInfo() {
      getOrdersInfo(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("获取订单列表失败");
        this.orderList = res.data.goods;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersInfo();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersInfo();
    },
    editPlace() {
      this.editPlaceVisible = true;
    },
    editPlaceClosed() {
      this.$refs.editFormRef.resetFields();
    },
    localInfo(user) {
      getLocalInfo(user.user_id).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取物流信息失败");
        this.localList = res.data;
        console.log(res);
      });
      this.localPlaceVisible = true;
    },
  },
};
</script>

<style scoped>
</style>