<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="primary" :icon="Plus" @click="dialogFormVisible = true"
          >新增</el-button
        >
        <el-dialog
          v-model="dialogFormVisible"
          title="添加用户"
          width="30%"
          @close="onDialogClose"
        >
          <el-form
            :model="form"
            class="fromCenter"
            :rules="fromRules"
            ref="myaddFrom"
          >
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>

            <el-form-item label="年龄:" prop="age">
              <el-input v-model="form.age" placeholder="请输入年龄" />
            </el-form-item>

            <el-form-item label="头衔:" prop="position">
              <el-input v-model="form.position" placeholder="请输入头衔" />
            </el-form-item>

            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="onAddNewUser">确定</el-button>
          </el-form>
        </el-dialog>
      </div>

      <!-- 表格 -->
      <el-table :data="userlist" style="width: 100%">
        <el-table-column label="序号" width="180">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- 用户信息 -->
        <el-table-column label="Name" width="180">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template #default="scope">
            {{ scope.row.age }}
          </template>
        </el-table-column>
        <el-table-column label="头衔">
          <template #default="scope">
            {{ scope.row.position }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            {{ dataFromat(scope.row.addtime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="onUserDeta(scope.row.id)"
              >详情</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="onRemove(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <!-- <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination> -->
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MyTable",
  data() {
    return {
      userlist: [],

      // 控制用户信息采集框
      dialogFormVisible: false,

      // 用户采集信息对象
      form: {
        name: "",
        age: "",
        position: "",
      },

      // 表单验证规则对象
      fromRules: {
        name: [
          { required: true, message: "姓名是必填项", trigger: "blur" },
          { min: 3, max: 5, message: "长度必须是3到5", trigger: "blur" },
        ],
        age: [
          { required: true, message: "年龄是必填项", trigger: "blur" },
          // { validator: checkAge, trigger: 'blur' }
        ],
        position: [
          { required: true, message: "头衔是必填项", trigger: "blur" },
          { min: 1, max: 15, message: "长度必须是1到15", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getUserList();
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/api/users");
      if (res.status !== 0) return alert("请求数据失败");
      // console.log(res);
      this.userlist = res.data;
    },

    // 格式化时间
    dataFromat(dtStr) {
      const dt = new Date(dtStr);

      const y = this.padZero(dt.getFullYear());
      const m = this.padZero(dt.getMonth() + 1);
      const d = this.padZero(dt.getDate());

      const hh = this.padZero(dt.getHours());
      const mm = this.padZero(dt.getMinutes());
      const ss = this.padZero(dt.getSeconds());

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    },
    // 补零函数
    padZero(n) {
      return n > 9 ? n : "0" + n;
    },
    // 添加用户
    onAddNewUser() {
      this.$refs.myaddFrom.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.post("/api/users", this.form);

        if (res.status !== 0) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.dialogFormVisible = false;
        // 重新发起请求获取数据
        this.getUserList();
      });
    },

    // 删除用户
    async onRemove(id) {
      const configResult = await this.$confirm("是否要删除该数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (configResult !== "confirm") return this.$message.info("取消了删除");

      const { data: res } = await this.$http.delete("api/users/" + id);
      if (res.status !== 0) return this.$message.error("删除失败");

      this.$message.success("删除成功");

      this.getUserList();
    },

    // 跳转到详情页面
    onUserDeta(id) {
      this.$router.push({ path: "table/" + id });
    },
  },
};

// const tableData = ref<TableItem[]>([]);
// const pageTotal = ref(0);
// 获取表格数据
// const getData = () => {
// 	fetchData().then(res => {
// 		tableData.value = res.data.list;
// 		pageTotal.value = res.data.pageTotal || 50;
// 	});
// };
// getData();

// 查询操作
// const handleSearch = () => {
// 	query.pageIndex = 1;
// 	getData();
// };
// 分页导航
// const handlePageChange = (val: number) => {
// 	query.pageIndex = val;
// 	getData();
// };

// 删除操作
// const handleDelete = (index: number) => {
// 	// 二次确认删除
// 	ElMessageBox.confirm('确定要删除吗？', '提示', {
// 		type: 'warning'
// 	})
// 		.then(() => {
// 			ElMessage.success('删除成功');
// 			tableData.value.splice(index, 1);
// 		})
// 		.catch(() => {});
// };

// 表格编辑时弹窗和保存
// const editVisible = ref(false);
// let form = reactive({
// 	name: '',
// 	address: ''
// });
// let idx: number = -1;
// const handleEdit = (index: number, row: any) => {
// 	idx = index;
// 	form.name = row.name;
// 	form.address = row.address;
// 	editVisible.value = true;
// };
// const saveEdit = () => {
// 	editVisible.value = false;
// 	ElMessage.success(`修改第 ${idx + 1} 行成功`);
// 	tableData.value[idx].name = form.name;
// 	tableData.value[idx].address = form.address;
// };
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #f56c6c;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
.fromCenter {
  text-align: center;
}
</style>
