import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchAllServiceProviders, deleteServiceProvider } from "../../store/slice/serviceProvider";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReusableTable from "../../components/tables/ReusableTable";
import { Button, Popconfirm, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import ReusableModal from "../../components/model/ReusableModel";
import ServiceProviderFormik from "./ServiceProviderForm"; // import your edit form
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

export default function DisplayServiceProvider() {
  const dispatch: AppDispatch = useDispatch();
  const { providers } = useSelector((state: RootState) => state.serviceProvider);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchAllServiceProviders());
  }, [dispatch]);

  const handleEdit = (record: any) => {
    setSelectedProviderId(record.id);
    setSelectedProvider(record);
    setIsModalOpen(true);
  };

  const handleDelete = (providerId: string) => {
    dispatch(deleteServiceProvider(providerId))
      .unwrap()
      .then(() => {
        notifySuccess("Provider deleted successfully");
        dispatch(fetchAllServiceProviders());
      })
      .catch(() => {
        notifyError("Failed to delete provider");
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const afterSubmit = () => {
    dispatch(fetchAllServiceProviders());
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "firstName",
      key: "fullName",
      render: (_: any, record: any) => (
        <span className="font-medium text-gray-800">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      render: (role: string | null) => role || "N/A",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Email Verified",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      render: (verified: boolean) => <Tag color={verified ? "green" : "red"}>{verified ? "true" : "false"}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <div className="border border-[#91d5ff] rounded-[4px] p-[8px] cursor-pointer hover:bg-blue-50" onClick={() => handleEdit(record)}>
            <EditOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
          </div>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <div className="border border-[#ffa39e] rounded-[4px] p-[8px] cursor-pointer hover:bg-red-50">
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
      <PageBreadcrumb pageTitle="Service Provider Management" />
      <div className="flex justify-between items-center mb-4"></div>

      <div className="space-y-6 p-4 bg-white shadow rounded-xl">
        <ReusableTable<any & { key: string }> searchText={searchText} setSearchText={setSearchText} columns={columns} data={providers.map((p) => ({ ...p, key: p.id }))} pageSize={10} />
      </div>

      <ReusableModal isOpen={isModalOpen} onClose={handleCloseModal} name="Edit Provider" width={1000}>
        <ServiceProviderFormik providerId={selectedProviderId!} onClose={handleCloseModal} afterSubmit={afterSubmit} initialData={selectedProvider} />
      </ReusableModal>
    </>
  );
}
