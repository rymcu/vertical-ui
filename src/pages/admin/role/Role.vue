<template>
    <el-row>
        <el-col>
            <el-button type="primary" @click="showAddDialog">添加角色</el-button>
            <el-table
                    :data="roles"
                    style="width: 100%;margin-top: 1rem;">
                <el-table-column
                        label="#"
                        width="180"
                        prop="idRole">
                </el-table-column>
                <el-table-column
                        label="角色名"
                        width="180"
                        prop="name">
                </el-table-column>
                <el-table-column
                        label="权重"
                        width="180"
                        prop="weights">
                </el-table-column>
                <el-table-column
                        label="创建时间"
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
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
            <el-dialog :title="title" :visible.sync="dialogVisible">
                <el-form v-model="role" label-width="80px">
                    <el-form-item label="角色名">
                        <el-input v-model="role.name"></el-input>
                    </el-form-item>
                    <el-form-item label="拼音码">
                        <el-input v-model="role.inputCode"></el-input>
                    </el-form-item>
                    <el-form-item label="权重">
                        <el-input-number :min="1" v-model="role.weights"></el-input-number>
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
        name: "AdminRole",
        data() {
            return {
                roles: [],
                pagination:{
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                },
                order: 'desc',
                role: {},
                title: '',
                dialogVisible: false
            }
        },
        methods: {
            showAddDialog() {
                let _ts = this;
                _ts.$set(_ts,'dialogVisible', true);
                _ts.$set(_ts,'title', '添加角色信息');
                _ts.$set(_ts,'role', { weights: 10 });
            },
            handleEdit(index, role) {
                let _ts = this;
                _ts.$set(_ts,'dialogVisible', true);
                _ts.$set(_ts,'title', '编辑角色信息');
                _ts.$set(_ts,'role', role);
            },
            updateRole() {
                let _ts = this;
                let id = _ts.role.idRole;
                let title = id?'更新':'添加';
                _ts.axios[id?'put':'post']('/admin/role/post', _ts.role).then(function (res) {
                    if (res && res.message) {
                        _ts.$message.error(res.message);
                    } else {
                        _ts.$message({
                            type: 'success',
                            message: title + '成功!'
                        });
                        _ts.$set(_ts,'dialogVisible', false);
                        _ts.getData(_ts.pagination.currentPage, _ts.pagination.pageSize);
                    }
                })
            },
            toggleStatus(index, role) {
                let _ts = this;
                let title,status;
                if (role.status == 0) {
                    title = '禁用';
                    status = 1;
                } else {
                    title = '启用';
                    status = 0;
                }
                _ts.$confirm('确定'+ title +'角色 '+ role.name +'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _ts.axios.patch('/admin/role/update-status',{
                        idRole: role.idRole,
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
                _ts.axios.get("/admin/roles", {
                    params: data
                }).then(function (res) {
                    let roles = res.roles;
                    if(roles){
                        _ts.$set(_ts,'roles', roles);
                        _ts.$set(_ts,'pagination', res.pagination);
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
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-role");
            this.getData(this.pagination.currentPage, this.pagination.pageSize);
        }
    }
</script>

<style scoped>

</style>