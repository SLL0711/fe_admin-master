<template>
    <div class="app-container">
        <el-row>
            <el-col>
                <el-form ref="form" :model="form" inline>
                    <el-form-item prop="search">
                        <el-input v-model="form.search" clearable style="width:300px" prefix-icon="el-icon-search"
                            placeholder="输入成品名称、编码搜索" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" icon="el-icon-search" size="medium" @click="search(form)">搜索</el-button>
                        <el-button type="warning" icon="el-icon-refresh-left" size="medium"
                            @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-button v-permission="['admin', 'product-prod-add']" type="primary" style="margin-bottom:20px"
                    icon="el-icon-plus" size="medium" @click="createProduct()">新增</el-button>
                <el-button v-permission="['admin', 'product-prod-mdel']" type="danger" icon="el-icon-delete"
                    :disabled="multipleSelection.length ? false : true" size="medium"
                    @click="deleteProducts(form)">删除</el-button>
                <el-table ref="multipleTable" :data="tableData" style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="name" label="成品名称" />
                    <el-table-column prop="code" label="编码" />
                    <el-table-column prop="price" label="成本价（元）" />
                    <el-table-column prop="sellprice" label="售价（元）" />
                    <!-- <el-table-column prop="price" label="价格" :formatter="formatter" /> -->
                    <!-- <el-table-column prop="sellprice" label="售价" :formatter="formatter" /> -->
                    <el-table-column prop="created_by" label="创建人" />
                    <el-table-column prop="modify_by" label="修改人" />
                    <el-table-column fixed="right" align="center" label="操作" width="230">
                        <template slot-scope="{row}">
                            <el-button v-permission="['admin', 'product-prod-update']" type="primary" icon="el-icon-edit"
                                size="mini" @click="updateProduct(row)" />
                            <el-button v-permission="['admin', 'product-prod-del']" type="danger" icon="el-icon-delete"
                                size="mini" @click="deleteProduct(row)" />
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <el-pagination :current-page="1" :page-sizes="[10, 20, 50, 100]" :page-size="10" :total="total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </el-col>
        </el-row>
        <cuForm :dialog-visible="cuDialogVisible" :cur-id="curId" @close="close" @search="search" />
    </div>
</template>

<script>
import cuForm from "./components/cuForm.vue";
import { getProducts, createProduct, deleteProduct, deleteProducts, updateProduct } from "@/api/product/product.js";
export default {
    components: {
        cuForm,
    },
    data() {
        return {
            tableData: [],
            total: 0,
            // 已选择的用户id数组
            multipleSelection: [],
            form: {
                page: 1,
                size: 10,
                search: '',
                // 按照更新时间倒序排列
                ordering: '-update_time'
            },
            // 以下为cuForm子组件数据
            cuDialogVisible: false,
            curId: null,
        };
    },
    methods: {
        //获取成品信息
        search() {
            getProducts(this.form).then(res => {
                this.tableData = res.data.results;
                this.total = res.data.count
            });
        },
        createProduct() {
            this.cuDialogVisible = true
        },
        deleteProducts(form) {
            console.log('批量删除', this.multipleSelection.length)
            this.$confirm(`此操作将删除选中的${this.multipleSelection.length}个成品, 是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteProducts(this.multipleSelection).then(res => {
                    this.$message({
                        message: '删除成品成功',
                        type: 'success'
                    });
                    this.search();
                })
            }).catch(() => {
                // 阻止UI console异常信息
            })
        },
        deleteProduct(row) {
            console.log('删除')
            this.$confirm(`确认删除成品：${row.name} ？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteProduct(row.id).then(res => {
                    this.$message({
                        message: `删除成品${row.name}成功`,
                        type: 'success'
                    })
                    this.search();
                })
            }).catch(() => { });
        },
        updateProduct(row) {
            this.curId = row.id;
            this.cuDialogVisible = true;
        },
        handleCurrentChange(val) {
            console.log('分页page变化');
            this.form.page = val;
            this.search();
        },
        // 分页
        handleSizeChange(val) {
            console.log('分页size变化');
            this.form.size = val;
            this.search();
        },
        // table选择功能的change事件
        handleSelectionChange() {
            //TODO 1、只显示非禁用状态数据
            const deleteIds = []
            this.$refs.multipleTable.selection.forEach(data => deleteIds.push(data.id))
            this.multipleSelection = deleteIds
        },
        resetForm() {
            this.$refs.form.resetFields()
            this.search()
        },
        // 创建/更新完毕后关闭dialog
        close() {
            this.cuDialogVisible = false
            this.curId = null
        },
        // formatter(row, column) {
        //     return `${row.price}元`;
        // },
    },
    created() {
        this.search();
    },
}
</script>

<style scoped></style>