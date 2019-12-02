<template>
    <el-row>
        <el-col>
            <el-table
                    :data="users"
                    style="width: 100%">
                <el-table-column
                    label="#"
                    width="180"
                    prop="idUser">
                </el-table-column>
                <el-table-column
                    label="#"
                    width="180"
                    prop="userAvatarURL">
                </el-table-column>
                <el-table-column
                    label="账号"
                    width="180"
                    prop="account">
                </el-table-column>
                <el-table-column
                    label="昵称"
                    width="180"
                    prop="nickname">
                </el-table-column>
                <el-table-column
                    label="注册时间"
                    width="180"
                    prop="createdTime">
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="180"
                    prop="status">
                    <template slot-scope="scope">
                        <el-tag type="primary" disable-transitions>
                            {{scope.row.status === '0' ? '正常' : '禁用'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <!--<template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>-->
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
    /* eslint-disable no-console */

    export default {
        name: "AdminUser",
        data() {
            return {
                users: [],
                pagination:{
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                },
                order: 'desc'
            }
        },
        methods: {
            handleEdit(index, user) {
                console.log(index, user);
            },
            handleDelete(index, user) {
                console.log(index, user);
            },
            getData(page,pageSize) {
                let _ts = this;
                let data = {
                    page: page,
                    rows: pageSize
                };
                _ts.axios.get("/admin/users", {
                    params: data
                }).then(function (res) {
                    let users = res.users;
                    let pagination = res.pagination;
                    if(users){
                        _ts.users = [];
                    }
                    for (let i in users){
                        _ts.users.push(users[i]);
                    }
                    _ts.pagination = pagination;
                })
            },
            handleSizeChange(val) {
                let _ts = this;
                _ts.getData(_ts.pagination.currentPage, val);
            },
            handleCurrentChange(val) {
                let _ts = this;
                _ts.getData(val, _ts.pagination.pageSize);
            }
        },
        mounted() {
            this.$store.commit("setActiveAdminMenu", "admin-user");
            this.getData(this.pagination.currentPage, this.pagination.pageSize);
        }
    }
</script>

<style scoped>

</style>