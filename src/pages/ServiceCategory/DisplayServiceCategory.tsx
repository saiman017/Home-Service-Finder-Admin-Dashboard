import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchServiceCategories, deleteServiceCategory } from "../../store/slice/serviceCategory";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReusableTable from "../../components/tables/ReusableTable";
import { Button, Popconfirm, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ReusableModal from "../../components/model/ReusableModel";
import ServiceCategoryForm from "./ServiceCategoryForm";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

const IMAGE_URL = import.meta.env.VITE_IMAGE_API_URL;

export default function DisplayServiceCategories() {
  const dispatch: AppDispatch = useDispatch();

  const categories = useSelector((state: RootState) => (state.serviceCategory.categories || []).map((cat) => ({ ...cat, key: cat.id })));

  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchServiceCategories());
  }, [dispatch]);

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setIsEditMode(true);
    setSelectedCategory(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteServiceCategory(id))
      .unwrap()
      .then(() => {
        notifySuccess("Category deleted successfully");
        dispatch(fetchServiceCategories());
      })
      .catch(() => notifyError("Failed to delete category"));
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const afterSubmit = () => dispatch(fetchServiceCategories());

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Image",
      dataIndex: "categoryImage",
      key: "categoryImage",
      render: (image: string) =>
        image ? (
          <img
            // Drop the extra slash and use localhost
            src={`${IMAGE_URL}/${image}`}
            alt="category"
            className="w-10 h-10 object-cover rounded"
            onError={(e) => {
              // fallback if something goes wrong
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        ) : (
          <Tag color="red">No Image</Tag>
        ),
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
      <PageBreadcrumb pageTitle="Service Category Management" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Categories</h2>
        <Button type="primary" icon={<AddIcon />} onClick={handleAdd} className="bg-blue-500 text-white">
          Add Category
        </Button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <ReusableTable searchText={searchText} setSearchText={setSearchText} columns={columns} data={categories} pageSize={10} />
      </div>

      <ReusableModal isOpen={isModalOpen} onClose={handleCloseModal} name={isEditMode ? "Edit Category" : "Add Category"} width={600}>
        <ServiceCategoryForm categoryId={selectedCategory?.id} isEditMode={isEditMode} initialData={selectedCategory} onClose={handleCloseModal} afterSubmit={afterSubmit} />
      </ReusableModal>
    </>
  );
}
