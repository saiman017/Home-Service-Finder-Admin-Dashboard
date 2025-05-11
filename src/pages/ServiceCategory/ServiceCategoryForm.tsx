import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addServiceCategory, updateServiceCategory, ServiceCategory, ApiResponse } from "../../store/slice/serviceCategory";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

interface Props {
  isEditMode: boolean;
  categoryId?: string;
  initialData?: Partial<ServiceCategory> | null;
  onClose: () => void;
  afterSubmit?: () => void;
}

interface FormValues {
  name: string;
  description: string;
}

export default function ServiceCategoryForm({ isEditMode, categoryId, initialData, onClose, afterSubmit }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialData?.categoryImage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData?.categoryImage) {
      const IMAGE_URL = import.meta.env.VITE_IMAGE_API_URL;
      const imageUrl = initialData.categoryImage.startsWith("http") ? initialData.categoryImage : `${IMAGE_URL}/${initialData.categoryImage}`;
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(undefined);
    }
    setFile(null);
  }, [initialData]);

  const initialValues: FormValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const beforeUpload = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(f);
    return false;
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    setFile(null);
    setPreviewUrl(initialData?.categoryImage);
    onClose();
  };

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    setLoading(true);
    let didSucceed = false;
    try {
      const payload: any = { name: values.name, description: values.description };
      if (file) payload.categoryImageFile = file;

      const response: ApiResponse<ServiceCategory> =
        isEditMode && categoryId ? await dispatch(updateServiceCategory({ id: categoryId, ...payload })).unwrap() : await dispatch(addServiceCategory(payload)).unwrap();

      if (response.success && response.data) {
        notifySuccess(isEditMode ? "Category updated successfully" : "Category added successfully");
        didSucceed = true;
      } else {
        const errMsg = typeof response.data === "string" ? response.data : response.message;
        throw new Error(errMsg);
      }
    } catch (err: any) {
      notifyError(err.message || err.toString() || "Failed to save service category");
    } finally {
      resetForm();
      setFile(null);
      setPreviewUrl(undefined);
      setLoading(false);
      onClose();
      if (didSucceed) afterSubmit?.();
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ resetForm }) => (
        <Form className="space-y-4">
          <div>
            <label>Name</label>
            <Field name="name" as={Input} placeholder="Name" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>
          <div>
            <label>Description</label>
            <Field name="description" as={Input.TextArea} rows={4} placeholder="Description" />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
          </div>
          <div>
            <label>Service Category Image</label>
            <Upload beforeUpload={beforeUpload} showUploadList={false} disabled={loading}>
              <Button icon={<UploadOutlined />} loading={loading}>
                {loading ? "Processing..." : "Select Image"}
              </Button>
            </Upload>
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    // Fallback if something goes wrong
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => handleCancel(resetForm)} disabled={loading}>
              Cancel
            </Button>
            <Button htmlType="submit" type="primary" loading={loading} disabled={loading}>
              {isEditMode ? "Update Category" : "Add Category"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
