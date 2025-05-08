import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchAllUsers, deleteUser, selectAllUsers } from "../../store/slice/user";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReusableTable from "../../components/tables/ReusableTable";
import { Button, Popconfirm, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ReusableModal from "../../components/model/ReusableModel";
import UserFormik from "./CustomerForm";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  profilePicture?: string;
  role: string;
  createdAt: string;
  modifiedAt: string;
  isEmailVerified: boolean;
}

export default function UserManagement() {
  const dispatch: AppDispatch = useDispatch();
  const users: User[] = useSelector((state: RootState) => selectAllUsers(state));
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleEdit = (record: User) => {
    setSelectedUserId(record.id);
    setSelectedUser(record);
    setIsNewUser(false);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => {
        notifySuccess("User deleted successfully");
        dispatch(fetchAllUsers());
      })
      .catch(() => {
        notifyError("Failed to delete user");
      });
  };

  const handleAddNew = () => {
    setIsNewUser(true);
    setSelectedUserId(undefined);
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const afterSubmit = () => {
    dispatch(fetchAllUsers());
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "firstName",
      key: "fullName",
      render: (_: any, record: User) => (
        <span className="font-medium text-gray-800">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: any, b: any) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email Verified",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      render: (verified: boolean) => <Tag color={verified ? "green" : "red"}>{verified ? "true" : "false"}</Tag>,
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => (
        <Space size="middle">
          <div className="border border-[#91d5ff] rounded-[4px] p-[8px] cursor-pointer inline-flex items-center justify-center hover:bg-blue-50" onClick={() => handleEdit(record)}>
            <EditOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
          </div>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <div className="border border-[#ffa39e] rounded-[4px] p-[8px] cursor-pointer inline-flex items-center justify-center hover:bg-red-50">
              <DeleteOutlined style={{ color: "#ff4d4f", fontSize: "16px" }} />
            </div>
          </Popconfirm>
        </Space>
      ),
      width: "20%",
    },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Customer Management" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer List</h2>
      </div>

      <div className="space-y-6 p-4 bg-white shadow rounded-xl">
        <ReusableTable<User & { key: string }>
          searchText={searchText}
          setSearchText={setSearchText}
          columns={columns}
          data={users.filter((user) => user.role === "customer").map((user) => ({ ...user, key: user.id }))}
          pageSize={10}
        />
      </div>

      <ReusableModal isOpen={isModalOpen} onClose={handleCloseModal} name={isNewUser ? "Add New Customer" : "Edit Customer"} width={1000}>
        <UserFormik userId={selectedUserId} isNewUser={isNewUser} onClose={handleCloseModal} afterSubmit={afterSubmit} initialData={selectedUser} />
      </ReusableModal>
    </>
  );
}
