<template>
    <el-row>
        <el-col style="margin-bottom: 1rem;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>特殊日管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col>
            <el-button type="primary" @click="createSpecialDay">添加特殊日</el-button>
            <el-table
                    :data="specialDays"
                    style="width: 100%;margin-top: 1rem;">
                <el-table-column
                        label="#"
                        width="40"
                        prop="idSpecialDays">
                </el-table-column>
                <el-table-column
                        label="展示图"
                        width="180"
                        prop="imgUrl">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.imgUrl"  :src="scope.row.imgUrl"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        label="名称"
                        width="180"
                        prop="specialDayName">
                </el-table-column>
                <el-table-column
                        label="开始时间"
                        width="180"
                        prop="startTime">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
            </el-pagination>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "SpecialDay",
        data() {
            return {
                specialDays: [],
                pagination:{
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                }
            }
        },
        methods: {
            onRouter(name, data) {
                this.$router.push({
                    name: name,
                    params: {
                        id: data
                    }
                })
            },
            handleEdit(index, specialDay) {
                let _ts = this;
                _ts.$router.push({
                    name: 'post-special-day',
                    params: {
                        id: specialDay
                    }
                })
            },
            handleSizeChange(val) {
                let _ts = this;
                _ts.getData(_ts.pagination.currentPage, val);
            },
            handleCurrentChange(val) {
                let _ts = this;
                _ts.getData(val, _ts.pagination.pageSize);
            },
            getData(page,pageSize) {
                let _ts = this;
                let data = {
                    page: page,
                    rows: pageSize
                };
                _ts.axios.get("/admin/special-days", {
                    params: data
                }).then(function (res) {
                    let specialDays = res.specialDays;
                    let pagination = res.pagination;
                    if (specialDays) {
                        _ts.$set(_ts,'specialDays', specialDays);
                        _ts.$set(_ts,'pagination', res.pagination);
                    }
                    _ts.pagination = pagination;
                });
            },
            createSpecialDay() {
                let _ts = this;
                _ts.$router.push({
                    name: 'admin-post-special-day'
                })
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-special-day");
            this.getData(this.pagination.currentPage, this.pagination.pageSize);
        }
    }
</script>

<style scoped>

</style>
