<template>
    <el-row>
        <el-col style="margin-bottom: 1rem;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col>
            <el-table
                    :data="users"
                    style="width: 100%">
                <el-table-column
                    label="#"
                    width="40"
                    prop="idUser">
                </el-table-column>
                <el-table-column
                    label="头像"
                    width="60"
                    prop="userAvatarURL">
                    <template slot-scope="scope">
                        <el-avatar v-if="scope.row.userAvatarURL" size="medium" :src="scope.row.userAvatarURL"></el-avatar>
                        <el-avatar v-else size="medium" src="https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column
                        label="昵称"
                        width="180"
                        prop="nickname">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="onRouter('user', scope.row.nickname)" :underline="false">{{ scope.row.nickname }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="账号"
                    width="180"
                    prop="account">
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
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleRole(scope.$index, scope.row)">授权</el-button>
                        <el-button v-if="scope.row.status == 1" size="mini" type="primary" @click="toggleStatus(scope.$index, scope.row)">启用</el-button>
                        <el-button v-else size="mini" type="danger" @click="toggleStatus(scope.$index, scope.row)">禁用</el-button>
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
        <el-col>
            <el-dialog :visible.sync="dialogVisible">
                <el-form>
                    <el-form-item>
                        <el-radio-group v-model="idRole">
                            <el-radio v-for="role in roles" :key="role.idRole" border :label="role.idRole">{{ role.name }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateRole">确 定</el-button>
                </div>
            </el-dialog>
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
                roles: [],
                pagination:{
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                },
                order: 'desc',
                idRole: 0,
                idUser: 0,
                dialogVisible: false
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
            handleRole(index, user) {
                let _ts = this;
                _ts.$set(_ts,'idUser', user.idUser);
                _ts.axios.get('admin/user/' + user.idUser + '/role')
                .then(function (res) {
                    _ts.$set(_ts,'dialogVisible', true);
                    _ts.$set(_ts,'idRole', res[0].idRole);
                });
            },
            toggleStatus(index, user) {
                let _ts = this;
                let title,status;
                if (user.status == 0) {
                    title = '禁用';
                    status = 1;
                } else {
                    title = '启用';
                    status = 0;
                }
                _ts.$confirm('确定'+ title +'用户'+ user.nickname +'('+user.account+')?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _ts.axios.patch('/admin/user/update-status',{
                        idUser: user.idUser,
                        status: status
                    }).then(function (res) {
                        if (res && res.message) {
                            _ts.$message.error(res.message);
                        } else {
                            _ts.$message({
                                type: 'success',
                                message: title + '成功!'
                            });
                            _ts.getData(_ts.pagination.currentPage, _ts.pagination.pageSize);
                        }
                    });
                }).catch(() => {
                    _ts.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
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
                    if (users) {
                        _ts.$set(_ts,'users', users);
                        _ts.$set(_ts,'pagination', res.pagination);
                    }
                    _ts.pagination = pagination;
                });

                _ts.axios.get("/admin/roles").then(function (res) {
                    let roles = res.roles;
                    if (roles) {
                        _ts.$set(_ts,'roles', roles);
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
            updateRole() {
                let _ts = this;
                let data = {
                    idUser: _ts.idUser,
                    idRole: _ts.idRole
                };
                _ts.axios.patch('/admin/user/update-role', data).then(function (res) {
                    if (res && res.message) {
                        _ts.$message.error(res.message);
                    } else {
                        _ts.$message({
                            message:'授权成功',
                            type: 'success'
                        });
                        _ts.$set(_ts,'dialogVisible', false);
                        _ts.$set(_ts,'idUser', 0);
                        _ts.$set(_ts,'idRole', 0);
                    }
                })
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-user");
            this.getData(this.pagination.currentPage, this.pagination.pageSize);
        }
    }
</script>

<style scoped>

</style>