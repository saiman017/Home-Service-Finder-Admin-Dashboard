import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchAllRoles, deleteRole, selectAllRolesWithKey } from "../../store/slice/role";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReusableTable from "../../components/tables/ReusableTable";
import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ReusableModal from "../../components/model/ReusableModel";
import RoleForm from "./RoleForm";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

export default function DisplayRoles() {
  const dispatch: AppDispatch = useDispatch();
  const roles = useSelector((state: RootState) => selectAllRolesWithKey(state));
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    dispatch(fetchAllRoles());
  }, [dispatch]);

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setIsEditMode(true);
    setSelectedRole(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const res = dispatch(deleteRole(id))
      .unwrap()
      .then(() => {
        notifySuccess("Role deleted successfully");
        dispatch(fetchAllRoles());
      })
      .catch(() => notifyError("Failed to delete role"));
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const afterSubmit = () => dispatch(fetchAllRoles());

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <div className="border border-blue-300 p-2 rounded cursor-pointer" onClick={() => handleEdit(record)}>
            <EditOutlined style={{ color: "#1890ff" }} />
          </div>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <div className="border border-red-300 p-2 rounded cursor-pointer">
              <DeleteOutlined style={{ color: "#ff4d4f" }} />
            </div>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Role Management" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Roles</h2>
        <Button type="primary" icon={<AddIcon />} onClick={handleAdd} className="bg-blue-500 text-white">
          Add Role
        </Button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <ReusableTable searchText={searchText} setSearchText={setSearchText} columns={columns} data={roles} pageSize={10} />
      </div>

      <ReusableModal isOpen={isModalOpen} onClose={handleCloseModal} name={isEditMode ? "Edit Role" : "Add Role"} width={600}>
        <RoleForm roleId={selectedRole?.id} isEditMode={isEditMode} initialData={selectedRole} onClose={handleCloseModal} afterSubmit={afterSubmit} />
      </ReusableModal>
    </>
  );
}
