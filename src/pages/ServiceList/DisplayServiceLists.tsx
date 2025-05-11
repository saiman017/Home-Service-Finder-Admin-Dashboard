import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchServiceLists, deleteServiceList, ServiceList } from "../../store/slice/serviceList";
import { fetchServiceCategories } from "../../store/slice/serviceCategory";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReusableTable from "../../components/tables/ReusableTable";
import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ReusableModal from "../../components/model/ReusableModel";
import ServiceListForm from "./ServiceListForm";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

interface Row {
  key: string;
  category: string;
  serviceName: string;
}

export default function DisplayServiceLists() {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector((s: RootState) => s.serviceList.services);
  const categories = useSelector((s: RootState) => s.serviceCategory.categories);

  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceList | null>(null);

  useEffect(() => {
    dispatch(fetchServiceCategories());
    dispatch(fetchServiceLists());
  }, [dispatch]);

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row: Row) => {
    const svc = services.find((s) => s.id === row.key);
    if (!svc) return;
    setIsEditMode(true);
    setSelectedService(svc);
    setIsModalOpen(true);
  };

  const handleDelete = (row: Row) => {
    dispatch(deleteServiceList(row.key))
      .unwrap()
      .then(() => {
        notifySuccess("Service deleted successfully");
        dispatch(fetchServiceLists());
      })
      .catch(() => notifyError("Failed to delete service"));
  };

  const closeModal = () => setIsModalOpen(false);
  const afterSubmit = () => dispatch(fetchServiceLists());

  // Build and sort table rows by category ascending
  const data: Row[] = services
    .map((svc) => {
      const cat = categories.find((c) => c.id === svc.serviceCategoryId);
      return {
        key: svc.id,
        category: cat ? cat.name : "—",
        serviceName: svc.name,
      };
    })
    .sort((a, b) => a.category.localeCompare(b.category));

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Row) => (
        <Space size="middle">
          <div className="border border-blue-300 p-2 rounded cursor-pointer" onClick={() => handleEdit(record)}>
            <EditOutlined style={{ color: "#1890ff" }} />
          </div>
          <Popconfirm title="Are you sure you want to delete this service?" onConfirm={() => handleDelete(record)}>
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
      <PageBreadcrumb pageTitle="Service List Management" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Services</h2>
        <Button type="primary" icon={<AddIcon />} onClick={handleAdd} className="bg-blue-500 text-white">
          Add Service
        </Button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <ReusableTable searchText={searchText} setSearchText={setSearchText} columns={columns} data={data} pageSize={10} />
      </div>

      <ReusableModal isOpen={isModalOpen} onClose={closeModal} name={isEditMode ? "Edit Service" : "Add Service"} width={600}>
        <ServiceListForm
          isEditMode={isEditMode}
          serviceId={selectedService?.id}
          initialData={
            selectedService
              ? {
                  id: selectedService.id,
                  name: selectedService.name,
                  serviceCategoryId: selectedService.serviceCategoryId,
                }
              : null
          }
          onClose={closeModal}
          afterSubmit={afterSubmit}
        />
      </ReusableModal>
    </>
  );
}
